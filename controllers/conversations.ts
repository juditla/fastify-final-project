import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { ParamsIdRequest } from '../types.js';

const prisma = new PrismaClient();

type AddConversationRequest = FastifyRequest<{
  Body: {
    userId: number;
    artistId: number;
    token: string;
  };
}>;

export const getConversationsByUserId = async (
  req: ParamsIdRequest,
  reply: FastifyReply,
) => {
  const id = Number(req.params.id);
  const conversationsFromDatabase = await prisma.conversation.findMany({
    where: {
      OR: [
        {
          ownerId: id,
        },
        { participantId: id },
      ],
    },
    include: {
      owner: {
        select: {
          id: true,
          firstName: true,
          avatar: true,
        },
      },
      participant: {
        select: {
          id: true,
          firstName: true,
          avatar: true,
        },
      },
      message: {
        orderBy: {
          createDate: 'desc',
        },
        take: 1,
        select: {
          text: true,
          createDate: true,
        },
      },
    },
  });
  await reply.code(200).send(conversationsFromDatabase);
};

// ADD NEW MESSAGE
// input validation schema
const conversationSchema = z.object({
  ownerId: z.number(),
  participantId: z.number(),
});

export const addConversation = async (
  req: AddConversationRequest,
  reply: FastifyReply,
) => {
  const { userId, artistId, token } = req.body;

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
    await reply.code(400).send({ message: 'Invalid session' });
  } else {
    // get userId form artist
    const userIdFromArtist = await prisma.artist.findUnique({
      where: {
        id: artistId,
      },
    });
    if (userIdFromArtist) {
      // check if there already is a conversation between those two
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          OR: [
            {
              ownerId: userId,
              participantId: userIdFromArtist.userId,
            },
            {
              ownerId: userIdFromArtist.userId,
              participantId: userId,
            },
          ],
        },
        include: {
          owner: {
            select: {
              // @ts-ignore
              id: true,
              firstName: true,
            },
          },
          participant: {
            select: {
              // @ts-ignore
              id: true,
              firstName: true,
            },
          },
        },
      });
      if (existingConversation) {
        await reply.code(201).send(existingConversation);
      } else {
        // validate input
        const validatedNewConversation = conversationSchema.safeParse({
          ownerId: userId,
          participantId: userIdFromArtist.userId,
        });
        if (!validatedNewConversation.success) {
          await reply.code(400).send({ message: 'input validation failed' });
        } else {
          try {
            const newConversation = await prisma.conversation.create({
              data: {
                ownerId: userId,
                participantId: userIdFromArtist.userId,
              },
            });

            await reply.code(201).send(newConversation);
            if (!newConversation) {
              await reply
                .code(406)
                .send({ message: 'error creating new conversation' });
            }
          } catch (error) {
            await reply.code(500).send({ message: error });
          }
        }
      }
    } else {
      await reply
        .code(400)
        .send({ message: 'conversation partner could not be found' });
    }
  }
};

export const deleteConversation = async (
  req: ParamsIdRequest,
  reply: FastifyReply,
) => {
  const id = Number(req.params.id);
  const deletedConversation = await prisma.conversation.delete({
    where: {
      id,
    },
  });
  if (deletedConversation) {
    await reply
      .code(200)
      .send({ message: `Your conversation has been deleted` });
  } else {
    await reply.code(400).send({
      message: `An error occured while deleting the converastion. Please try again`,
    });
  }
};
