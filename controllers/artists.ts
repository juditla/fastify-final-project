import { Prisma, PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { artists } from '../data.js';
import { ParamsIdRequest } from '../types.js';

const prisma = new PrismaClient();

type AddArtistRequest = FastifyRequest<{
  Body: {
    id: number;
    style: string;
    studioId: number;
    userId: number;
    name: string;
    description: string;
  };
}>;

type UpdateArtistRequest = FastifyRequest<{
  Params: { id: string };
  Body: {
    style: string;
    studioId: number;
    userId: number;
    name: string;
    description: string;
  };
}>;

export const getArtists = async (req: FastifyRequest, reply: FastifyReply) => {
  const artistsFromDatabase = await prisma.artist.findMany({
    include: {
      studio: true,
      tattooImages: true,
    },
  });
  reply.send(artistsFromDatabase);
};

export const getArtist = (req: ParamsIdRequest, reply: FastifyReply) => {
  const id = Number(req.params.id);
  const artist = artists.find((artist) => artist.id === id);
  console.log(artist);
  reply.send(artist);
};

export const addArtist = (req: AddArtistRequest, reply: FastifyReply) => {
  const { name, style, studioId, userId, description } = req.body;
  const artist = {
    name,
    style,
    studioId,
    userId,
    description,
  };

  // code der das Studio dann wirklich in die database speichert!

  reply.code(201).send(artist);
};
export const deleteArtist = (req: ParamsIdRequest, reply: FastifyReply) => {
  const id = Number(req.params.id);
  const artist = artists.find((artist) => artist.id === id);
  if (artist) {
    reply.code(200).send({ message: `Studio ${artist.name} has been deleted` });
  } else {
    reply.code(400).send({
      message: `An error occured while deleting the studio. The studio could not be found, please try again`,
    });
  }
};

export const updateArtist = (req: UpdateArtistRequest, reply: FastifyReply) => {
  const { id } = req.params;
  const { name, style, studioId, userId, description } = req.body;

  const artist = {
    id,
    name,
    style,
    studioId,
    userId,
    description,
  };

  // code der das Studio dann wirklich in die database updated

  reply.code(201).send(artist);
};
