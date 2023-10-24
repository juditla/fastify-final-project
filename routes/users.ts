import { FastifyError, FastifyInstance, FastifySchema } from 'fastify';
import {
  addUser,
  deleteUserByEmail,
  getUserByEmail,
  getUsers,
  updateUser,
} from '../controllers/users.js';

// User schema
const UserWithPassword = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    password: { type: 'string' },
  },
};

// User without password schema
const UserWithoutPassword = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
  },
};

const getUsersOpts = {
  schema: {
    tags: ['users'],
    response: {
      200: {
        type: 'array',
        studios: UserWithoutPassword,
      },
    },
  },
  handler: getUsers,
};

const getUserOpts = {
  schema: {
    tags: ['users'],
    response: {
      200: UserWithPassword,
    },
  },
  handler: getUserByEmail,
};

const postUserOpts = {
  schema: {
    tags: ['users'],
    body: {
      required: ['email', 'firstName', 'lastName', 'password'],
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        password: { type: 'string' },
      },
    },
    response: {
      201: UserWithoutPassword,
    },
  },
  handler: addUser,
};

const deleteUserOpts = {
  schema: {
    tags: ['users'],
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  handler: deleteUserByEmail,
};

const updateUserOpts = {
  schema: {
    tags: ['users'],
    response: {
      200: UserWithoutPassword,
    },
  },
  handler: updateUser,
};

export function userRoutes(
  fastify: FastifyInstance,
  options: FastifySchema,
  done: (err?: FastifyError) => void, // in types.ts im root dir alle tyoes die ich öfter brauche definieren und exportieren
) {
  // Get all studios
  fastify.get('/users', getUsersOpts);

  // Get single user by id
  fastify.get('/users/:id', getUserOpts);

  // Create user
  fastify.post('/users', postUserOpts);

  // Delete user
  fastify.delete('/users/:id', deleteUserOpts);

  // Update user
  fastify.put('/users/:id', updateUserOpts);

  done();
}
