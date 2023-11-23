import { FastifyError, FastifyInstance, FastifySchema } from 'fastify';
import { getStudioImagesByArtistId } from '../../controllers/studioimages.js';
import { getStudioImageOpts } from './studioimagesOpts.js';

export function studioImageRoutes(
  fastify: FastifyInstance,
  options: FastifySchema,
  done: (err?: FastifyError) => void,
) {
  // Delete image by id
  fastify.get(
    '/studioimages/:id',
    getStudioImageOpts,
    getStudioImagesByArtistId,
  );

  done();
}
