import { FastifyError, FastifyInstance, FastifySchema } from 'fastify';
import {
  deleteSessionByToken,
  validateSession,
} from '../controllers/sessions.js';
import { deleteSessionOpts, postSessionOpts } from './schema/sessions.js';

export function sessionRoutes(
  fastify: FastifyInstance,
  options: FastifySchema,
  done: (err?: FastifyError) => void,
) {
  // Think about routes path for delete, should be /:token?

  // Get valid session by token
  fastify.post('/sessions', postSessionOpts, validateSession);

  // Delete invalid session
  fastify.delete('/sessions', deleteSessionOpts, deleteSessionByToken);

  done();
}
