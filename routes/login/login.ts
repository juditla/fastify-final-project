import { FastifyError } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance.js';
import { FastifySchema } from 'fastify/types/schema.js';
import { loginHandler } from '../../controllers/login.js';
import { loginOpts } from './loginOpts.js';

export function loginRoutes(
  fastify: FastifyInstance,
  options: FastifySchema,
  done: (err?: FastifyError) => void,
) {
  fastify.post('/login', loginOpts, loginHandler);

  done();
}
