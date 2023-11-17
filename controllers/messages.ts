import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const prisma = new PrismaClient();

type Message = {
  id: number;
  senderId: number;
  coinversationtId: number;
  createDate: Date;
  text: string;
};

type GetMessageByConversationRequest = FastifyRequest<{
  Params: {
    conversationid: string;
  };
}>;

type AddMessageRequest = FastifyRequest<{
  Body: {
    senderId: number;
    conversationId: number;
    text: string;
  };
}>;

export const getMessagesByConversationId = async (
  req: GetMessageByConversationRequest,
  reply: FastifyReply,
) => {
  const conversationId = Number(req.params.conversationid);
  const messagesfromDatabase = await prisma.message.findMany({
    where: {
      conversationId,
    },
    include: {
      sender: true,
    },
  });
  await reply.send(messagesfromDatabase);
};

const messageSchema = z.object({
  senderId: z.number(),
  conversationId: z.number(),
  text: z.string().min(1),
});

export const addMessage = async (
  req: AddMessageRequest,
  reply: FastifyReply,
) => {
  const { senderId, conversationId, text } = req.body;

  // validate input
  const validatedNewMessage = messageSchema.safeParse({
    senderId,
    conversationId,
    text,
  });
  if (!validatedNewMessage.success) {
    await reply.code(400).send({ message: 'input validation failed' });
  } else {
    try {
      const newMessage = await prisma.message.create({
        data: {
          senderId,
          conversationId,
          text,
        },
      });
      const returnMessage = await prisma.message.findUnique({
        where: {
          id: newMessage.id,
        },
        include: {
          sender: true,
        },
      });
      await reply.code(201).send(returnMessage);
      if (!newMessage) {
        await reply.code(406).send({ message: 'error creating new message' });
      }
    } catch (error) {
      console.log(error);
      await reply.code(500).send({ message: 'error' });
    }
  }
};
