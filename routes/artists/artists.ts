import { FastifyError, FastifyInstance, FastifySchema } from 'fastify';
import {
  addArtist,
  deleteArtist,
  getArtistByUserId,
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
  // Get all artists
  fastify.get('/artists', getArtistsOpts, getArtists);

  // Get single artist
  fastify.get('/artists/:userid', getArtistOpts, getArtistByUserId);

  // Add artist
  fastify.post('/artists', postArtistOpts, addArtist);

  // Delete artist
  fastify.delete('/artists/:id', deleteArtistOpts, deleteArtist);

  // Update artist
  fastify.put('/artists/:id', updateArtistOpts, updateArtist);

  done();
}
