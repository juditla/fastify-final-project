import { FastifyError, FastifyInstance, FastifySchema } from 'fastify';
import {
  addArtist,
  deleteArtist,
  getArtist,
  getArtists,
  updateArtist,
} from '../../controllers/artists.js';
import {
  deleteArtistOpts,
  getArtistOpts,
  getArtistsOpts,
  postArtistOpts,
  updateArtistOpts,
} from './artistsOpts.js';

export function artistRoutes(
  fastify: FastifyInstance,
  options: FastifySchema,
  done: (err?: FastifyError) => void,
) {
  // schema defines how request body should look like, required fields, how standard response is defined, tags for swagger (ui)
  // Get all artists
  fastify.get('/artists', getArtistsOpts, getArtists);

  // Get single artist
  fastify.get('/artists/:id', getArtistOpts, getArtist);

  // Add artist
  fastify.post('/artists', postArtistOpts, addArtist);

  // Delete artist
  fastify.delete('/artists/:id', deleteArtistOpts, deleteArtist);

  // Update artist
  fastify.put('/artists/:id', updateArtistOpts, updateArtist);

  done();
}
