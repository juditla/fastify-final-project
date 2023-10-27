import { FastifyError, FastifyInstance, FastifySchema } from 'fastify';
import { validateSession } from '../controllers/sessions.js';

const postSessionOpts = {
  schema: {
    tags: ['session'],
    body: {
      required: ['token'],
      properties: {
        token: { type: 'string' },
      },
    },
  },
};
export function sessionRoutes(
  fastify: FastifyInstance,
  options: FastifySchema,
  done: (err?: FastifyError) => void, // in types.ts im root dir alle tyoes die ich öfter brauche definieren und exportieren
) {
  // Get valid session by token
  fastify.post('/sessions', postSessionOpts, validateSession);

  done();
}
