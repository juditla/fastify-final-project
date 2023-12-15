import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ParamsIdRequest } from '../types.js';

const prisma = new PrismaClient();

export type PostImageRequest = FastifyRequest<{
  Body: {
    base64Image: string;
    id: number;
  };
}>;

// DELETE IMAGE BY ID
export const deleteImageById = async (
  req: ParamsIdRequest,
  reply: FastifyReply,
) => {
  const id = Number(req.params.id);

  const deleteTatooImage = await prisma.tattooImages.delete({
    where: {
      id,
    },
    select: {
      picture: true,
      id: true,
    },
  });

  await reply.code(200).send(deleteTatooImage);
};

// ADD IMAGE TO ARTIST
export const postImageById = async (
  req: PostImageRequest,
  reply: FastifyReply,
) => {
  const base64Image = req.body.base64Image;
  const artistId = req.body.id;

  await cloudinary.uploader
    .upload(`data:image/png;base64,${base64Image}`)
    .then(async (result) => {
      // placeholder for name and style used!
      // at this point adding name, style and state of the booleans not yet implemented frontend side
      const uploadedImage = await prisma.tattooImages.create({
        data: {
          name: 'abc',
          picture: result.secure_url,
          artistId,
          style: 'abc',
          isWannado: false,
          isDone: false,
          isReserved: false,
          picturePublicId: result.public_id,
        },
        select: {
          id: true,
          picture: true,
          artistId: true,
          name: true,
          style: true,
        },
      });
      await reply.code(201).send(uploadedImage);
    });
};

export const getImagesByArtistId = async (
  req: ParamsIdRequest,
  reply: FastifyReply,
) => {
  const artistId = Number(req.params.id);

  const tattooImages = await prisma.tattooImages.findMany({
    where: {
      artistId,
    },
    select: {
      picture: true,
    },
  });

  await reply.code(201).send(tattooImages);
};
