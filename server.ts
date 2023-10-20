import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
// import { PrismaClient } from '@prisma/client';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { artistRoutes } from './routes/artists.js';
// import { main } from './prisma/seed.js';
import { studioRoutes } from './routes/studios.js';

// const prisma = new PrismaClient();
// main();

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifySwagger),
  {
    exposeRoute: true,
    routePrefix: '/docs',
    swagger: {
      info: { title: 'fastify-api' },
    },
  };

fastify.register(fastifySwaggerUi),
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

fastify.get('/', async () => {
  return { hello: 'world' };
});

fastify.register(studioRoutes);
fastify.register(artistRoutes);

/**
 * Run the server!
 */
const PORT = 4000;
const start = async () => {
  try {
    await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
