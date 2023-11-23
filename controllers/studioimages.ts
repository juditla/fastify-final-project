import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ParamsIdRequest } from '../types.js';

const prisma = new PrismaClient();

export const getStudioImages = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const studiosImagesFromDatabase = await prisma.studio.findMany();

  await reply.send(studiosImagesFromDatabase);
};

// TODO after update database --> change artistId to studioId
export const getStudioImagesByArtistId = async (
  req: ParamsIdRequest,
  reply: FastifyReply,
) => {
  const id = Number(req.params.id);

  const studioImages = await prisma.studioImages.findMany({
    where: {
      studioId: id,
    },
    select: {
      picture: true,
      id: true,
    },
  });

  await reply.code(201).send(studioImages);
};
