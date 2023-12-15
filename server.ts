import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { v2 as cloudinary } from 'cloudinary';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyLogger from 'fastify-log';
import { artistRoutes } from './routes/artists/artists.js';
import { conversationsRoutes } from './routes/conversations/conversations.js';
import { loginRoutes } from './routes/login/login.js';
import { messagesRoutes } from './routes/messages/messages.js';
import { sessionRoutes } from './routes/sessions/sessions.js';
import { studioImageRoutes } from './routes/studioimages/studioimages.js';
import { studioRoutes } from './routes/studios/studios.js';
import { tattooImageRoutes } from './routes/tattooimages/tattooimages.js';
import { userRoutes } from './routes/users/users.js';

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,
});

await fastify.register(fastifySwagger),
  {
    exposeRoute: true,
    routePrefix: '/docs',
    swagger: {
      info: { title: 'fastify-api' },
    },
  };

await fastify.register(fastifySwaggerUi),
  {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (
        request: FastifyRequest,
        reply: FastifyReply,
        next: any,
      ) {
        next();
      },
      preHandler: function (
        request: FastifyRequest,
        reply: FastifyReply,
        next: any,
      ) {
        next();
      },
    },
    // staticCSP: true,
    // transformStaticCSP: (header) => header,
    // transformSpecification: (swaggerObject, request, reply) => {
    //   return swaggerObject;
    // },
    // transformSpecificationClone: true,
  };
await fastify.register(studioRoutes);
await fastify.register(artistRoutes);
await fastify.register(userRoutes);
await fastify.register(loginRoutes);
await fastify.register(sessionRoutes);
await fastify.register(tattooImageRoutes);
await fastify.register(conversationsRoutes);
await fastify.register(messagesRoutes);
await fastify.register(studioImageRoutes);

fastify.addHook('onRoute', (routeOptions) => {
  if (routeOptions.path === 'tattooimages') {
    routeOptions.bodyLimit = 10000000;
  }
});

/**
 * Run the server!
 */
const PORT = 4000;
const start = async () => {
  try {
    await fastify.listen({ host: 'localhost', port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
await start();
