import { FastifyRequest } from 'fastify';

export type ParamsIdRequest = FastifyRequest<{
  Params: { id: string };
}>;

export type Studio = {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: number;
  ownerId: number;
  longitude?: string;
  latitude?: string;
};

export type Artist = {
  id: number;
  style: string;
  studioId: number;
  userId: number
  name: string;
  description: string;
};

export type tattooImage = {
  id: number;
  name: string;
  picture: string;
  artistId: number;
  isWannado: boolean;
  isReserved: boolean;
  isDone: boolean;
  style: string;
};

export type studioImage = {
  id: number;
  name: string;
  picture: string;
  studioId: number;
};
