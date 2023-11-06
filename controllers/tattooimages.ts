import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ParamsIdRequest } from '../types.js';

const prisma = new PrismaClient();

type PostImageRequest = FastifyRequest<{
  Body: {
    base64Image: string;
    id: number;
  };
}>;

export const deleteImageById = async (
  req: ParamsIdRequest,
  reply: FastifyReply,
) => {
  const id = Number(req.params.id);

  const deleteTatooImage = await prisma.tattooImages.delete({
    where: {
      id,
    },
  });

  await reply.code(201).send(deleteTatooImage);
};

export const postImageById = async (
  req: PostImageRequest,
  reply: FastifyReply,
) => {
  const base64Image = req.body.base64Image;
  const artistId = req.body.id;

  const image = await cloudinary.uploader
    .upload(`data:image/png;base64,${base64Image}`)
    .then(async (result) => {
      console.log(result);
      const uploadedImage = await prisma.tattooImages.create({
        data: {
          name: 'abc',
          picture: result.secure_url,
          artistId,
          style: 'abc',
          isWannado: false,
          isDone: false,
          isReserved: false,
        },
      });
      await reply.code(201).send(uploadedImage);
    });

  // console.log(uploadedImage);
  // upload to cloudinary
  // safe url in datqabase
  // return url?
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
