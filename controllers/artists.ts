import { Prisma, PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { artists } from '../data.js';
import { ParamsIdRequest } from '../types.js';

const prisma = new PrismaClient();

type Artist = {
  // id: number;
  style: string;
  studioId?: number;
  userId: number;
  name: string;
  description: string;
  token: string;
};

type ArtistNoId = Omit<Artist, 'id'>;

type AddArtistRequest = FastifyRequest<{
  Body: Artist;
}>;

type UpdateArtistRequest = FastifyRequest<{
  Params: { id: string };
  Body: Artist;
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

export const getArtist = async (req: ParamsIdRequest, reply: FastifyReply) => {
  const id = Number(req.params.id);
  const artist = await prisma.artist.findUnique({
    where: {
      id,
    },
  });
  reply.send(artist);
};

export const addArtist = async (req: AddArtistRequest, reply: FastifyReply) => {
  const { name, style, description, token } = req.body;
  // check if session is valid
  const now = new Date();
  const validSessionFromDatabase = await prisma.session.findUnique({
    where: {
      token,
      expiryTimestamp: {
        gt: now,
      },
    },
  });
  if (!validSessionFromDatabase) {
    reply.code(400).send({ message: 'Invalid session' });
  } else {
    // if valid session then create artist, get the userid from the valid session
    try {
      const newArtist = await prisma.artist.create({
        data: {
          name,
          style,
          userId: validSessionFromDatabase.userId,
          description,
          // studioId: 0,
        },
      });
      reply.code(201).send(newArtist);
      if (!newArtist) {
        reply.code(406).send({ message: 'error creating new artist' });
      }
    } catch (error) {
      console.log(error);
      reply.code(500).send({ message: 'error' });
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
    reply.code(200).send({ message: `Studio ${artist.name} has been deleted` });
  } else {
    reply.code(400).send({
      message: `An error occured while deleting the studio. The studio could not be found, please try again`,
    });
  }
};

export const updateArtist = async (
  req: UpdateArtistRequest,
  reply: FastifyReply,
) => {
  // here still necessary to define how changing an artists will look like
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
