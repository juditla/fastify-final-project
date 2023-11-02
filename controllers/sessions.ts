import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { number, z } from 'zod';

const prisma = new PrismaClient();

type ValidateSession = FastifyRequest<{
  Body: {
    token: string;
  };
}>;

type DeleteSession = FastifyRequest<{
  Body: {
    token: string;
  };
}>;

const tokenSchema = z.string().min(100).max(150);

export const validateSession = async (
  req: ValidateSession,
  reply: FastifyReply,
) => {
  // compare expiry date from session, only get from database if timestamp is greater than (gt) now
  const token = req.body.token;
  console.log(token);
  const validatedToken = tokenSchema.safeParse(token);
  if (!validatedToken.success) {
    console.log(validatedToken.error);
    reply.code(400).send({ message: 'input validation failed' });
  } else {
    const now = new Date();
    console.log(now.toISOString());
    const validSessionFromDatabase = await prisma.session.findUnique({
      where: {
        token,
        expiryTimestamp: {
          gt: now.toISOString(),
        },
      },
    });
    // calls function that deletes all sessions with expired expiry date
    deleteInvalidSession();

    // no valid session
    if (!validSessionFromDatabase) {
      reply.code(400).send({ message: 'Invalid session' });
    } else {
      const userFromToken = await prisma.user.findUnique({
        where: {
          id: validSessionFromDatabase.userId,
        },
        select: {
          firstName: true,
          roleId: true,
          id: true,
        },
      });
      reply.code(200).send(userFromToken);
    }
  }
};

// delete all expired sessions
export const deleteInvalidSession = async () => {
  const now = new Date();
  const expiredSessions = await prisma.session.deleteMany({
    where: {
      expiryTimestamp: {
        lt: now.toISOString(),
      },
    },
  });
};

// for logout, deletes session even though it would be still valid
export const deleteSessionByToken = async (
  req: DeleteSession,
  reply: FastifyReply,
) => {
  const token = req.body.token;
  const deleteSession = await prisma.session.delete({
    where: {
      token,
    },
  });
  reply.code(200).send({ message: 'Session deleted' });
};
