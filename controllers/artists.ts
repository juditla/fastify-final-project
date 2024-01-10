import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { ParamsIdRequest } from '../types.js';

const prisma = new PrismaClient();

type Artist = {
  id: number;
  style: string;
  studioId?: number;
  userId: number;
  name: string;
  description: string;
  token: string;
};

type AddArtistRequest = FastifyRequest<{
  Body: Artist;
}>;

type UpdateArtistRequest = FastifyRequest<{
  Params: { id: string };
  Body: {
    name: string;
    description: string;
    style: string;
  };
}>;

type GetArtistByUserIdRequest = FastifyRequest<{
  Params: { userid: string };
}>;

type AddArtistRatingRequest = FastifyRequest<{
  Params: { id: string };
  Body: { rating: number; artistId: number; userId?: number };
}>;

export const getArtists = async (req: FastifyRequest, reply: FastifyReply) => {
  const artistsFromDatabase = await prisma.artist.findMany({
    include: {
      studio: true,
      tattooImages: true,
    },
  });

  const ratingsFromDatabase = await prisma.artistRating.groupBy({
    by: ['artistId'],
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  const artistFromDatabaseWithRating = artistsFromDatabase.map((artist) => {
    const ratingMatchingArtist = ratingsFromDatabase.find(
      (rating) => rating.artistId === artist.id,
    );
    console.log(ratingMatchingArtist);
    return {
      ...artist,
      ratingAverage: ratingMatchingArtist?._avg.rating || 0,
      ratingCount: ratingMatchingArtist?._count.rating || 0,
    };
  });

  await reply.send(artistFromDatabaseWithRating);
};

export const getArtistByUserId = async (
  req: GetArtistByUserIdRequest,
  reply: FastifyReply,
) => {
  const userId = Number(req.params.userid);
  try {
    const artist = await prisma.artist.findFirst({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        userId: true,
        studioId: true,
        description: true,
        style: true,
        tattooImages: true,
        user: {
          select: {
            avatar: true,
            firstName: true,
          },
        },
        studio: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    if (artist) {
      const artistRating = await prisma.artistRating.aggregate({
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
        where: {
          artistId: artist.id,
        },
      });

      const artistWithRating = {
        ...artist,
        ratingAverage: artistRating._avg.rating,
        ratingCount: artistRating._count.rating,
      };
      console.log(artistWithRating);
      await reply.code(200).send(artistWithRating);
    }
  } catch (error) {
    console.log(error);
  }
};

const artistSchema = z.object({
  name: z.string().min(3),
  style: z.string().min(3),
  description: z.string().min(10),
});

export const addArtist = async (req: AddArtistRequest, reply: FastifyReply) => {
  const { name, style, description, token, userId } = req.body;
  // check if session is valid
  const now = new Date();
  const validSessionFromDatabase = await prisma.session.findUnique({
    where: {
      token,
      userId,
      expiryTimestamp: {
        gt: now,
      },
    },
  });
  if (!validSessionFromDatabase) {
    await reply.code(400).send({ message: 'Invalid session' });
  } else {
    // if valid session then validate input then create artist, get the userid from the valid session
    const validatedNewArtist = artistSchema.safeParse({
      name,
      style,
      description,
    });
    if (!validatedNewArtist.success) {
      await reply.code(400).send({ message: 'input validation failed' });
    } else {
      try {
        const newArtist = await prisma.artist.create({
          data: {
            name,
            style,
            userId,
            description,
          },
        });

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            roleId: 1,
          },
        });
        if (!newArtist) {
          await reply.code(406).send({ message: 'error creating new artist' });
        } else {
          await reply.code(201).send(newArtist);
        }
      } catch (error) {
        await reply.code(500).send({ message: error });
      }
    }
  }
};

export const deleteArtist = async (
  req: ParamsIdRequest,
  reply: FastifyReply,
) => {
  const id = Number(req.params.id);
  const artist = await prisma.artist.delete({
    where: {
      id,
    },
  });
  if (artist) {
    // change roleId for corresponding user
    await prisma.user.update({
      where: {
        id: artist.userId,
      },
      data: {
        roleId: 2,
      },
    });
    await reply
      .code(200)
      .send({ message: `Artist ${artist.name} has been deleted` });
  } else {
    await reply.code(400).send({
      message: `An error occured while deleting the artit. The artist could not be found, please try again`,
    });
  }
};

export const updateArtist = async (
  req: UpdateArtistRequest,
  reply: FastifyReply,
) => {
  const id = Number(req.params.id);
  const { name, style, description } = req.body;

  const validatedArtistToUpdate = artistSchema.safeParse({
    name,
    style,
    description,
  });
  if (!validatedArtistToUpdate.success) {
    await reply.code(400).send({ message: 'Input validation failed' });
  } else {
    try {
      const updatedArtist = await prisma.artist.update({
        where: {
          id,
        },
        data: {
          name,
          style,
          description,
        },
        select: {
          name: true,
          style: true,
          description: true,
        },
      });

      await reply.code(201).send(updatedArtist);
    } catch (error) {
      await reply.code(400).send({ message: 'error updating artist' });
    }
  }
};

export const addArtistRating = async (
  req: AddArtistRatingRequest,
  reply: FastifyReply,
) => {
  const { rating, userId } = req.body;
  const artistId = Number(req.params.id);
  try {
    const newArtistRating = await prisma.artistRating.create({
      data: {
        artistId,
        rating,
        userId: userId ? userId : null,
      },
    });

    await reply.code(201).send({ message: 'artist was rated' });
  } catch (error) {
    await reply.code(400).send({ message: 'error rating the artist' });
  }
};
