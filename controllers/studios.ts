import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ParamsIdRequest } from '../types.js';

const prisma = new PrismaClient();

type AddStudioRequest = FastifyRequest<{
  Body: {
    name: string;
    address: string;
    city: string;
    postalCode: number;
    ownerId: number;
    longitude?: string;
    latitude?: string;
  };
}>;

type UpdateStudioRequest = FastifyRequest<{
  Params: { id: string };
  Body: {
    name: string;
    address: string;
    city: string;
    postalCode: number;
    ownerId: number;
    longitude?: string;
    latitude?: string;
  };
}>;

export const getStudios = async (req: FastifyRequest, reply: FastifyReply) => {
  const studiosFromDatabase = await prisma.studio.findMany();
  const studioImagesFromDatabase = await prisma.studioImages.findMany();

  // temporary unsafe solution, new migration needed to add picture + pictureId to studio table as in artists
  const studiosWithImages = studiosFromDatabase.map((studio) => {
    const studioImage = studioImagesFromDatabase.find(
      (image) => image.studioId === studio.id,
    );
    studio.picture = studioImage?.picture ? studioImage.picture : '';
    studio.pictureId = studioImage?.id ? studioImage.id : '';
    return studio;
  });
  await reply.send(studiosWithImages);
};

export const getStudioById = async (
  req: ParamsIdRequest,
  reply: FastifyReply,
) => {
  const id = Number(req.params.id);
  const studio = await prisma.studio.findUnique({
    where: {
      id,
    },
    include: {
      artist: {
        select: {
          name: true,
          style: true,
          userId: true,
          user: {
            select: {
              avatar: true,
            },
          },
        },
      },
    },
  });

  await reply.send(studio);
};

// works until here!!!! - everything below still needs to be worked on!!!!
export const addStudio = async (req: AddStudioRequest, reply: FastifyReply) => {
  const { name, address, city, postalCode, ownerId } = req.body;

  const newStudio = await prisma.studio.create({
    data: {
      name,
      address,
      city,
      postalCode,
      ownerId,
    },
  });
  if (!newStudio) {
    await reply.code(400).send({ message: 'Error creating new studio' });
  }

  await reply.code(201).send(newStudio);
};
export const deleteStudio = async (
  req: ParamsIdRequest,
  reply: FastifyReply,
) => {
  const id = Number(req.params.id);
  const deletedStudio = await prisma.studio.delete({
    where: {
      id,
    },
  });
  if (deletedStudio) {
    await reply.send({
      message: `Studio has been deleted`,
    });
  } else {
    await reply.send({
      message: `An error occured while deleting the studio. The studio could not be found, please try again`,
    });
  }
};

export const updateStudio = async (
  req: UpdateStudioRequest,
  reply: FastifyReply,
) => {
  const id = Number(req.params.id);
  const { name, address, city, postalCode, ownerId } = req.body;

  const studio = {
    id,
    name,
    address,
    city,
    postalCode,
    ownerId,
  };
  // code der das Studio dann wirklich in die database updated
  const updatedStudio = await prisma.studio.update({
    where: {
      id,
    },
    data: {
      id,
      name,
      address,
      city,
      postalCode,
      ownerId,
    },
  });
  if (updatedStudio) {
    await reply.code(201).send(studio);
  } else {
    await reply
      .code(400)
      .send({ message: 'There was an error updating the studio' });
  }
};
