import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';

const prisma = new PrismaClient();

type LoginRequest = FastifyRequest<{
  Body: {
    email: string;
    password: string;
  };
}>;

export const loginHandler = async (req: LoginRequest, reply: FastifyReply) => {
  const { email, password } = req.body;

  const userWithPassword = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!userWithPassword) {
    return reply.code(404).send({ message: 'username or password not valid' });
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    userWithPassword.password,
  );

  if (!isPasswordValid) {
    reply.code(403).send({ message: 'username or password not valid' });
  }
};

const token = crypto.randomBytes(100).toString('base64');

//   // 5. Create the session record

// const session = await createSession(userWithPassword.id, token);

//   if (!session) {
//     return NextResponse.json(
//       { errors: [{ message: 'Error creating the new session' }] },
//       {
//         status: 401,
//       },
//     );
//   }
