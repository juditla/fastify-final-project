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
  reply.send(studiosFromDatabase);
};

export const getStudio = (req: ParamsIdRequest, reply: FastifyReply) => {
  const id = Number(req.params.id);
  const studio = studios.find((studio) => studio.id === id);
  console.log(studio);
  reply.send(studio);
};

export const addStudio = (req: AddStudioRequest, reply: FastifyReply) => {
  const { name, address, city, postalCode, ownerId, longitude, latitude } =
    req.body;
  const studio = {
    name,
    address,
    city,
    postalCode,
    ownerId,
  };
  if (longitude && latitude) {
    // find out why this is not working
    // studio.longitude = longitude;
    // studio.latitude = latitude;
  }

  // code der das Studio dann wirklich in die database speichert!

  reply.code(201).send(studio);
};
export const deleteStudio = (req: ParamsIdRequest, reply: FastifyReply) => {
  const id = Number(req.params.id);
  const studio = studios.find((studio) => studio.id === id);
  if (studio) {
    reply.send({ message: `Studio ${studio.name} has been deleted` });
  } else {
    reply.send({
      message: `An error occured while deleting the studio. The studio could not be found, please try again`,
    });
  }
};

export const updateStudio = (req: UpdateStudioRequest, reply: FastifyReply) => {
  const { id } = req.params;
  const { name, address, city, postalCode, ownerId, longitude, latitude } =
    req.body;

  const studio = {
    id,
    name,
    address,
    city,
    postalCode,
    ownerId,
  };
  if (longitude && latitude) {
    // find out why this is not working
    // studio.longitude = longitude;
    // studio.latitude = latitude;
  }

  // code der das Studio dann wirklich in die database updated

  reply.code(201).send(studio);
};
