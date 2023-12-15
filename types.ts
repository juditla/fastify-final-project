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
  picture?: string;
  pictureId?: number;
};

export type Artist = {
  id: number;
  style: string;
  studioId: number;
  userId: number;
  name: string;
  description: string;
};

export type TattooImage = {
  id: number;
  name: string;
  picture: string;
  artistId: number;
  isWannado: boolean;
  isReserved: boolean;
  isDone: boolean;
  style: string;
};

export type StudioImage = {
  id: number;
  name: string;
  picture: string;
  studioId: number;
};

export type Message = {
  id: number;
  senderId: number;
  coinversationtId: number;
  createDate: Date;
  text: string;
};
