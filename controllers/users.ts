import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';

const prisma = new PrismaClient();

type AddUserRequest = FastifyRequest<{
  Body: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };
}>;

type UpdateUserRequest = FastifyRequest<{
  Body: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };
}>;

type GetUserByEmail = FastifyRequest<{
  Body: { email: string; password: string };
}>;

type DeleteUserByEmail = FastifyRequest<{
  Body: { email: string };
}>;

export const getUsers = async (req: FastifyRequest, reply: FastifyReply) => {
  const usersFromDatabase = await prisma.user.findMany({
    include: {
      //   studio: true,
      //   tattooImages: true,
      // },
    },
  });

  // errorhandling!!
  reply.send(usersFromDatabase);
};

export const getUserByEmail = async (
  req: GetUserByEmail,
  reply: FastifyReply,
) => {
  const email = req.body.email;
  const userFromDatabase = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!userFromDatabase) {
    // errorhandling!!
  }
  console.log(userFromDatabase);
  reply.send(userFromDatabase);
};

export const addUser = async (req: AddUserRequest, reply: FastifyReply) => {
  const { email, firstName, lastName, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });
    console.log('newUser', newUser);
    reply.code(201).send(newUser);
  } catch (error) {
    console.log('error', error);
    reply
      .code(500)
      .send({ message: 'User with this email address already exists' });
    // oder vorher checken ob es den user schon gibt?
  }
};

export const deleteUserByEmail = async (
  req: DeleteUserByEmail,
  reply: FastifyReply,
) => {
  const email = req.body.email;
  const deletedUser = prisma.user.delete({ where: { email } });
};

export const updateUser = (req: UpdateUserRequest, reply: FastifyReply) => {
  const { email, lastName, firstName, password } = req.body;
  const updateUser = {
    email,
    firstName,
    lastName,
    password,
  };

  // code der das Studio dann wirklich in die database updated

  reply.code(201).send(updateUser);
};
