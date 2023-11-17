import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UserWithPassword } from 'routes/users/usersOpts.js';
import { z } from 'zod';
import { ParamsIdRequest } from '../types.js';
import { validateSession } from './sessions.js';

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
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
  };
}>;

type ChangePasswordRequest = FastifyRequest<{
  Params: {
    id: number;
  };
  Body: {
    token: string;
    oldPassword: string;
    newPassword: string;
  };
}>;

// where do I need all users?
export const getUsers = async (req: FastifyRequest, reply: FastifyReply) => {
  const usersFromDatabase = await prisma.user.findMany({
    include: {},
  });

  // errorhandling!!
  await reply.send(usersFromDatabase);
};

// rethink this function, do I need it? call prisma.user.findUnique in login already & bei addUser to check for existing user email
export const getUserById = async (
  req: ParamsIdRequest,
  reply: FastifyReply,
) => {
  const id = Number(req.params.id);
  const userFromDatabase = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!userFromDatabase) {
    await reply.code(400).send({ message: 'User could not be found' });
  }
  console.log('userFromDatabase');
  await reply.send(userFromDatabase);
};

const newUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(60).max(60),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  roleId: z.number().min(1).max(3),
});

export const addUser = async (req: AddUserRequest, reply: FastifyReply) => {
  console.log('REQ', req.body);
  const { firstName, lastName, password, roleId } = req.body;
  const email = req.body.email.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, 12);
  console.log(hashedPassword);
  // input validation
  const validatedNewUser = newUserSchema.safeParse({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    roleId,
  });
  if (!validatedNewUser.success) {
    console.log('Input validation failed');
    console.log(validatedNewUser.error);
    await reply.code(400).send({ message: 'input validation failed' });
  } else {
    // check if username already in use
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (user) {
        await reply
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
        await reply.code(406).send({ message: 'error creating new user' });
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

      await reply.code(201).send(newUser);
    } catch (error) {
      console.log('error', error);
    }
  }
};

// works till here, code below not yet in use

export const deleteUserById = async (
  req: ParamsIdRequest,
  reply: FastifyReply,
) => {
  console.log('landing here in deleteUserById');
  const id = Number(req.params.id);
  const deletedUser = await prisma.user.delete({
    where: {
      id,
    },
  });
  // console.log(deletedUser);
  if (deletedUser) {
    await reply.code(200).send({
      message: `User with email ${deletedUser.email} has been deleted`,
    });
  } else {
    await reply.code(400).send({
      message: `An error occured while deleting the user. The user could not be found, please try again`,
    });
  }
};

const updateUserSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
});

export const updateUser = async (
  req: UpdateUserRequest,
  reply: FastifyReply,
) => {
  const { email, lastName, firstName } = req.body;

  const validatedUserToUpdate = updateUserSchema.safeParse({
    firstName,
    lastName,
    email,
  });
  if (!validatedUserToUpdate.success) {
    console.log('Input validation failed');
    await reply.code(400).send({ message: 'input validation failed' });
  } else {
    const updateUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        firstName,
        lastName,
      },
    });

    await reply.code(201).send(updateUser);
  }
};

const changePasswordSchema = z.object({
  token: z.string().min(100).max(150),
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

const newPasswordSchema = z.object({
  hashedNewPassword: z.string().min(60).max(60),
});

export const changePassword = async (
  req: ChangePasswordRequest,
  reply: FastifyReply,
) => {
  const { token, oldPassword, newPassword } = req.body;
  const userId = Number(req.params.id);

  // input validation
  const validatedToken = changePasswordSchema.safeParse({
    token,
    oldPassword,
    newPassword,
  });

  if (!validatedToken.success) {
    await reply.code(400).send({ message: 'Input validation failed' });
  }
  // token => valid session?
  const now = new Date();
  const validSessionFromDatabase = await prisma.session.findUnique({
    where: {
      token,
      expiryTimestamp: {
        gt: now.toISOString(),
      },
    },
  });

  // belongs valid session to this userId?
  if (!validSessionFromDatabase) {
    await reply.code(400).send({ message: 'Invalid session' });
  } else {
    const userFromToken = await prisma.user.findUnique({
      where: {
        id: validSessionFromDatabase.userId,
      },
      select: {
        firstName: true,
        roleId: true,
        id: true,
        password: true,
      },
    });
    if (userFromToken) {
      if (userFromToken.id !== userId) {
        await reply
          .code(400)
          .send({ message: 'Invalid request - userFromToken.id not userId' });
      }

      // check if passsword is correct
      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        userFromToken.password,
      );
      console.log('isOldpasswordValid', isOldPasswordValid);
      // if password is wrong
      if (!isOldPasswordValid) {
        await reply
          .code(403)
          .send({ message: 'Invalid request - is old password valid' }); // message this way to 'confuse' possible hacker
      } else {
        // create hash for new Password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        // validate
        const validatedNewPassword = newPasswordSchema.safeParse({
          hashedNewPassword,
        });

        if (!validatedNewPassword.success) {
          await reply.code(400).send({ message: 'Something went wrong!' });
        }
        // change password
        const changedUser = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: hashedNewPassword,
          },
        });
        await reply
          .code(200)
          .send({ message: 'Your password has been changed' });
      }
    } else {
      await reply.code(400).send({ message: 'Invalid request' });
    }
  }
};
