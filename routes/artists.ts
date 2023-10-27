import { FastifyError, FastifyInstance, FastifySchema } from 'fastify';
import {
  addArtist,
  deleteArtist,
  getArtist,
  getArtists,
  updateArtist,
} from '../controllers/artists.js';

// Studio schema
const Artist = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    id: { type: 'number' }, // brauch ich das hier???
    descritption: { type: 'string' },
    userId: { type: 'number' },
    studioId: { type: 'number' },
    style: { type: 'string' },
  },
};

// Options for get all studios
const getArtistsOpts = {
  schema: {
    tags: ['artists'],
    response: {
      200: {
        type: 'array',
        studios: Artist,
      },
    },
  },
  handler: getArtists,
};

const getArtistOpts = {
  schema: {
    tags: ['artists'],
    response: {
      200: Artist,
    },
  },
  handler: getArtist,
};

const postArtistOpts = {
  schema: {
    tags: ['artists'],
    body: {
      type: 'object',
      required: ['name', 'style', 'token', 'description'],
      properties: {
        name: { type: 'string' },
        // id: { type: 'number' }, // brauch ich das hier???
        descritption: { type: 'string' },
        userId: { type: 'number' },
        studioId: { type: 'number' },
        style: { type: 'string' },
        token: { type: 'string' },
      },
    },
    response: {
      201: Artist,
    },
  },
  handler: addArtist,
};

const deleteArtistOpts = {
  schema: {
    tags: ['artists'],
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  handler: deleteArtist,
};

const updateArtistOpts = {
  schema: {
    tags: ['artists'],
    response: {
      200: Artist,
    },
  },
  handler: updateArtist,
};

export function artistRoutes(
  fastify: FastifyInstance,
  options: FastifySchema,
  done: (err?: FastifyError) => void, // in types.ts im root dir alle tyoes die ich öfter brauche definieren und exportieren
) {
  // Get all studios
  fastify.get('/artists', getArtistsOpts);

  // Get single studio
  fastify.get('/artists/:id', getArtistOpts);

  // Add studio
  fastify.post('/artists', postArtistOpts);

  // Delete studio
  fastify.delete('/artists/:id', deleteArtistOpts);

  // Update studio
  fastify.put('/artists/:id', updateArtistOpts);

  done();
}
