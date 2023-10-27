import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';

const prisma = new PrismaClient();

type AddUserRequest = FastifyRequest<{
  Body: {
    // id: number;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    roleId?: number;
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

// where do I need all users?
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

// rethink this function, do I need it? call prisma.user.findUnique in login already & bei addUser to check for existing user email
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
    reply.code(400).send({ message: 'User could not be found' });
  }
  console.log(userFromDatabase);
  reply.send(userFromDatabase);
};

export const addUser = async (req: AddUserRequest, reply: FastifyReply) => {
  const { email, firstName, lastName, password, roleId } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  // check if username already in use
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      reply
        .code(500)
        .send({ message: 'User with this email address already exists' });
    }
  } catch (error) {
    console.log('error', error);
  }
  // create new user in database
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        roleId,
      },
    });

    if (!newUser) {
      reply.code(406).send({ message: 'error creating new user' });
    }

    // create token
    const token = crypto.randomBytes(100).toString('base64');

    // Create session in database
    const session = await prisma.session.create({
      data: {
        userId: newUser.id,
        token,
      },
    });

    if (!session) {
      return reply
        .code(401)
        .send({ message: 'Error creating the new session' });
    }

    reply.code(201).send(newUser);
  } catch (error) {
    console.log('error', error);
  }
};

// works till here, code below not yet in use

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
