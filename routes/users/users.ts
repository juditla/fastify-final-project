import { FastifyError, FastifyInstance, FastifySchema } from 'fastify';
import {
  addProfilePicture,
  addUser,
  changePassword,
  deleteUserById,
  getUserById,
  updateProfilePicture,
  updateUserByEmail,
} from '../../controllers/users.js';
import {
  changePasswordOpts,
  deleteUserOpts,
  getUserOpts,
  postProfilePictureOpts,
  postUserOpts,
  updateProfilePictureOpts,
  updateUserOpts,
} from './usersOpts.js';

export function userRoutes(
  fastify: FastifyInstance,
  options: FastifySchema,
  done: (err?: FastifyError) => void,
) {
  // Get single user by email
  fastify.get('/users/:id', getUserOpts, getUserById);

  // Create user
  fastify.post('/users', postUserOpts, addUser);

  // Delete user
  fastify.delete('/users/:id', deleteUserOpts, deleteUserById);

  // Update user
  fastify.put('/users/:id', updateUserOpts, updateUserByEmail);

  // Change password
  fastify.put('/users/changepassword/:id', changePasswordOpts, changePassword);

  // Add profile picture
  fastify.post(
    '/users/profilepicture/:id',
    postProfilePictureOpts,
    addProfilePicture,
  );

  fastify.put(
    '/users/profilepicture',
    updateProfilePictureOpts,
    updateProfilePicture,
  );
  done();
}
