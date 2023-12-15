import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { ParamsIdRequest } from '../types.js';
import { PostImageRequest } from './tattooimages.js';

const prisma = new PrismaClient();

type AddUserRequest = FastifyRequest<{
  Body: {
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

// GET USER BY ID
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
    select: {
      id: true,
      email: true,
      firstName: true,
      roleId: true,
      avatar: true,
    },
  });
  if (!userFromDatabase) {
    await reply.code(404).send({ message: 'User could not be found' });
  }
  await reply.send(userFromDatabase);
};

// ADD USER
// input validation schema for new user
const newUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(60).max(60),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  roleId: z.number().min(1).max(3),
});

export const addUser = async (req: AddUserRequest, reply: FastifyReply) => {
  const { firstName, lastName, password, roleId } = req.body;
  const email = req.body.email.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, 12);

  // input validation
  const validatedNewUser = newUserSchema.safeParse({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    roleId,
  });
  if (!validatedNewUser.success) {
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
        await reply.code(400).send({ message: 'User could not be created' });
      }
    } catch (error) {
      await reply.code(400).send({ message: 'User could not be created' });
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
        select: {
          id: true,
          email: true,
          firstName: true,
          roleId: true,
          avatar: true,
        },
      });

      if (!newUser) {
        await reply.code(500).send({ message: 'Error creating new user' });
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
          .code(500)
          .send({ message: 'Error creating the new session' });
      }
      await reply.code(201).send(newUser);
    } catch (error) {
      await reply.code(500).send({ message: 'Error creating new user' });
    }
  }
};

// DELETE USER
export const deleteUserById = async (
  req: ParamsIdRequest,
  reply: FastifyReply,
) => {
  const id = Number(req.params.id);
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
    });
    if (!deletedUser) {
      await reply.code(404).send({
        message: `An error occured while deleting the user. The user could not be found, please try again`,
      });
    } else {
      await reply.code(200).send({
        message: `User with email ${deletedUser.email} has been deleted`,
      });
    }
  } catch (error) {
    await reply.code(500).send({
      message: `An error occured while deleting the user. The user could not be found, please try again`,
    });
  }
};

// UPDATE USER INFORMATION
// input schema to update user
const updateUserSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
});

export const updateUserByEmail = async (
  req: UpdateUserRequest,
  reply: FastifyReply,
) => {
  const { email, lastName, firstName } = req.body;
  // input validation
  const validatedUserToUpdate = updateUserSchema.safeParse({
    firstName,
    lastName,
    email,
  });
  if (!validatedUserToUpdate.success) {
    await reply.code(400).send({ message: 'input validation failed' });
  } else {
    // update user
    const updateUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        firstName,
        lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        roleId: true,
        avatar: true,
      },
    });

    await reply.code(200).send(updateUser);
  }
};

// CHANGE PASSWORD
// input validation schema
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
    await reply.code(401).send({ message: 'Invalid session' });
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
          .code(401)
          .send({ message: 'Invalid request - request from wrong user' });
      }

      // check if passsword is correct
      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        userFromToken.password,
      );

      // if password is wrong
      if (!isOldPasswordValid) {
        await reply.code(400).send({ message: 'Invalid request' }); // message this way to 'confuse' possible hacker
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
        await prisma.user.update({
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

// ADD PROFILE PICTURE
export const addProfilePicture = async (
  req: PostImageRequest,
  reply: FastifyReply,
) => {
  const base64Image = req.body.base64Image;
  const userId = req.body.id;

  await cloudinary.uploader
    .upload(`data:image/png;base64,${base64Image}`)
    .then(async (result) => {
      const userWithUploadedImage = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          avatar: result.secure_url,
          avatarPublicId: result.public_id,
        },
        select: {
          avatar: true,
        },
      });
      await reply.code(201).send({ avatar: userWithUploadedImage.avatar });
    });
};

// CHANGE PROFILE PICTURE
export const updateProfilePicture = async (
  req: PostImageRequest,
  reply: FastifyReply,
) => {
  const base64Image = req.body.base64Image;
  const userId = req.body.id;

  // upload new picture
  await cloudinary.uploader
    .upload(`data:image/png;base64,${base64Image}`)
    .then(async (result) => {
      // get existing picture public_id
      const oldPicture = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          avatarPublicId: true,
        },
      });
      // upload new picture
      const newPicture = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          avatar: result.secure_url,
          avatarPublicId: result.public_id,
        },
        select: {
          avatar: true,
        },
      });

      //  delete old picture
      if (oldPicture?.avatarPublicId) {
        await cloudinary.uploader.destroy(oldPicture.avatarPublicId);
      }
      await reply.code(201).send(newPicture);
    });
};
