import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { studios } from '../data.js';
import { ParamsIdRequest } from '../types.js';

const prisma = new PrismaClient();

type AddStudioRequest = FastifyRequest<{
  Body: {
    id: number; // is this true?
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
  await reply.send(studiosFromDatabase);
};

export const getStudioById = async (
  req: ParamsIdRequest,
  reply: FastifyReply,
) => {
  const params = req.params;
  const id = Number(req.params.id);
  console.log('id', id);
  console.log('params', params);
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

// works until here!!!! everything below still needs to be worked on!!!!

export const addStudio = async (req: AddStudioRequest, reply: FastifyReply) => {
  const { name, address, city, postalCode, ownerId } = req.body;
  const studio = {
    name,
    address,
    city,
    postalCode,
    ownerId,
  };
  // if (longitude && latitude) {
  // find out why this is not working
  // studio.longitude = longitude;
  // studio.latitude = latitude;
  // }

  // code der das Studio dann wirklich in die database speichert!

  await reply.code(201).send(studio);
};
export const deleteStudio = async (
  req: ParamsIdRequest,
  reply: FastifyReply,
) => {
  const id = Number(req.params.id);
  const deletedStudio = 'abc'; // hier prisma code
  if (deletedStudio) {
    await reply.send({
      message: `Studio ${deletedStudio.name} has been deleted`,
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
  const { id } = req.params;
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

  await reply.code(201).send(studio);
};
