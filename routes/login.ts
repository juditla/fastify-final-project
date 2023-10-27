import { FastifyError } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance.js';
import { FastifySchema } from 'fastify/types/schema.js';
import { loginHandler } from '../controllers/login.js';

const loginOpts = {
  schema: {
    tags: ['login'],
    body: {
      required: ['email', 'password'],
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
    // response: {
    //   201: {
    //     type: 'object',
    //     properties: {
    //       message: { type: 'string' },
    //       token: { type: 'string' },
    //     },
    //   },
    // },
  },
  handler: loginHandler,
};

export function loginRoutes(
  fastify: FastifyInstance,
  options: FastifySchema,
  done: (err?: FastifyError) => void, // in types.ts im root dir alle tyoes die ich öfter brauche definieren und exportieren
) {
  fastify.post('/login', loginOpts);

  done();
}
