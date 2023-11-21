import { FastifyError, FastifyInstance, FastifySchema } from 'fastify';
import {
  addStudio,
  deleteStudio,
  getStudioById,
  getStudios,
  updateStudio,
} from '../../controllers/studios.js';
import {
  deleteStudioOpts,
  getStudioOpts,
  getStudiosOpts,
  postStudioOpts,
  updateStudioOpts,
} from './studiosOpts.js';

export function studioRoutes(
  fastify: FastifyInstance,
  options: FastifySchema,
  done: (err?: FastifyError) => void, // in types.ts im root dir alle tyoes die ich öfter brauche definieren und exportieren
) {
  // Get all studios
  fastify.get('/studios', getStudiosOpts, getStudios);

  // Get single studio
  fastify.get('/studios/:id', getStudioOpts, getStudioById);

  // Add studio
  fastify.post('/studios', postStudioOpts, addStudio);

  // Delete studio
  fastify.delete('/studios/:id', deleteStudioOpts, deleteStudio);

  // Update studio
  fastify.put('/studios/:id', updateStudioOpts, updateStudio);

  done();
}
