import { FastifyError, FastifyInstance, FastifySchema } from 'fastify';
import {
  deleteImageById,
  postImageById,
} from '../../controllers/tattooimages.js';
import {
  deleteTattooImageOpts,
  postTattooImageOpts,
} from './tattooimagesOpts.js';

export function tattooImageRoutes(
  fastify: FastifyInstance,
  options: FastifySchema,
  done: (err?: FastifyError) => void,
) {
  // Delete image by id
  fastify.delete('/tattooimages/:id', deleteTattooImageOpts, deleteImageById);

  fastify.post('/tattooimages', postTattooImageOpts, postImageById);

  done();
}
