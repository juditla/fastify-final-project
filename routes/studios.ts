import { FastifyError, FastifyInstance, FastifySchema } from 'fastify';
import {
  addStudio,
  deleteStudio,
  getStudio,
  getStudios,
  updateStudio,
} from '../controllers/studios.js';

// Studio schema
const Studio = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    address: { type: 'string' },
    city: { type: 'string' },
    postalCode: { type: 'number' },
    ownerId: { type: 'number' },
    longitude: { type: 'string' },
    latitude: { type: 'string' },
  },
};

// Options for get all studios
const getStudiosOpts = {
  schema: {
    response: {
      200: {
        type: 'array',
        studios: Studio,
      },
    },
  },
  handler: getStudios,
};

const getStudioOpts = {
  schema: {
    response: {
      200: Studio,
    },
  },
  handler: getStudio,
};

const postStudioOpts = {
  schema: {
    body: {
      type: 'object',
      required: ['name', 'address', 'city', 'postalCode', 'ownerId'],
      properties: {
        name: { type: 'string' },
        id: { type: 'number' }, // brauch ich das hier???
        address: { type: 'string' },
        city: { type: 'string' },
        postalCode: { type: 'number' },
        ownerId: { type: 'number' },
        longitude: { type: 'string' },
        latitude: { type: 'string' },
      },
    },
    response: {
      201: Studio,
    },
  },
  handler: addStudio,
};

const deleteStudioOpts = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  handler: deleteStudio,
};

const updateStudioOpts = {
  schema: {
    response: {
      200: Studio,
    },
  },
  handler: updateStudio,
};

export function studioRoutes(
  fastify: FastifyInstance,
  options: FastifySchema,
  done: (err?: FastifyError) => void, // in types.ts im root dir alle tyoes die ich öfter brauche definieren und exportieren
) {
  // Get all studios
  fastify.get('/studios', getStudiosOpts);

  // Get single studio
  fastify.get('/studios/:id', getStudioOpts);

  // Add studio
  fastify.post('/studios', postStudioOpts);

  // Delete studio
  fastify.delete('/studios/:id', deleteStudioOpts);

  // Update studio
  fastify.put('/studios/:id', updateStudioOpts);

  done();
}
