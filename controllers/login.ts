import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const prisma = new PrismaClient();

type LoginRequest = FastifyRequest<{
  Body: {
    email: string;
    password: string;
  };
}>;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginHandler = async (req: LoginRequest, reply: FastifyReply) => {
  const password = req.body.password;
  const email = req.body.email.toLowerCase();
  // input validation
  const validatedLogin = loginSchema.safeParse({ email, password });
  if (!validatedLogin.success) {
    return reply.code(404).send('input validation failed');
  } else {
    // find user with this unique email
    const userWithPassword = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    // user does not exist
    if (!userWithPassword) {
      return reply
        .code(404)
        .send({ message: 'username or password not valid' }); // message this way to 'confuse' possible hacker
    }

    // compare password with stored hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      userWithPassword.password,
    );

    // password is wrong
    if (!isPasswordValid) {
      return reply
        .code(403)
        .send({ message: 'username or password not valid' }); // message this way to 'confuse' possible hacker
    }

    // create token
    const token = crypto.randomBytes(100).toString('base64');

    // create session in database and store token
    const session = await prisma.session.create({
      data: {
        userId: userWithPassword.id,
        token,
      },
    });

    if (!session) {
      await reply.code(401).send({ message: 'Error creating the new session' });
    }

    await reply.send({
      token: session.token,
      expiresAt: session.expiryTimestamp,
    });
  }
};
