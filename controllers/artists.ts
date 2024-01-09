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

export const getArtists = async (req: FastifyRequest, reply: FastifyReply) => {
  const artistsFromDatabase = await prisma.artist.findMany({
    include: {
      studio: true,
      tattooImages: true,
    },
  });
  await reply.send(artistsFromDatabase);
};

export const getArtistByUserId = async (
  req: GetArtistByUserIdRequest,
  reply: FastifyReply,
) => {
  const userId = Number(req.params.userid);
  const artist = await prisma.artist.findFirst({
    where: {
      userId,
    },
    select: {
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
  await reply.send(artist);
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
