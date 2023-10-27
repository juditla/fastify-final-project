import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';

const prisma = new PrismaClient();

type ValidateSession = FastifyRequest<{
  Body: {
    token: string;
  };
}>;

export const validateSession = async (
  req: ValidateSession,
  reply: FastifyReply,
) => {
  const token = req.body.token;
  const now = new Date();
  const validSessionFromDatabase = await prisma.session.findUnique({
    where: {
      token,
      expiryTimestamp: {
        gt: now.toISOString(),
      },
    },
  });
  console.log(validSessionFromDatabase);
  deleteInvalidSession();
  if (!validSessionFromDatabase) {
    reply.code(400).send({ message: 'Invalid session' });
  }
  reply.code(204).send();
};

export const deleteInvalidSession = async () => {
  const now = new Date();
  const invalidSessions = await prisma.session.deleteMany({
    where: {
      expiryTimestamp: {
        lt: now.toISOString(),
      },
    },
  });
};
