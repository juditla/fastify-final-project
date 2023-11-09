import { FastifyError, FastifyInstance, FastifySchema } from 'fastify';
import {
  addUser,
  deleteUserById,
  getUserById,
  getUsers,
  updateUser,
} from '../../controllers/users.js';
import {
  deleteUserOpts,
  getUserOpts,
  postUserOpts,
  updateUserOpts,
} from './usersOpts.js';

export function userRoutes(
  fastify: FastifyInstance,
  options: FastifySchema,
  done: (err?: FastifyError) => void,
) {
  // Get all studios
  fastify.get('/users', getUserOpts, getUsers);

  // Get single user by email
  fastify.get('/users/:id', getUserOpts, getUserById);

  // Create user
  fastify.post('/users', postUserOpts, addUser);

  // Delete user
  fastify.delete('/users/:id', deleteUserOpts, deleteUserById);

  // Update user
  fastify.put('/users/:id', updateUserOpts, updateUser);

  done();
}
