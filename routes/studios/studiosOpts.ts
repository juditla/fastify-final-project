// Studio schema
export const Studio = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    address: { type: 'string' },
    city: { type: 'string' },
    postalCode: { type: 'number' },
    ownerId: { type: 'number' },
    artist: { type: 'object' },
  },
};

// Options for get all studios
export const getStudiosOpts = {
  schema: {
    tags: ['studios'],
    response: {
      200: {
        type: 'array',
        studios: Studio,
      },
    },
  },
};

export const getStudioOpts = {
  schema: {
    tags: ['studios'],
  },
};

export const postStudioOpts = {
  schema: {
    tags: ['studios'],
    body: {
      type: 'object',
      required: ['name', 'address', 'city', 'postalCode', 'ownerId'],
    },
  },
};

export const deleteStudioOpts = {
  schema: {
    tags: ['studios'],
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
};

export const updateStudioOpts = {
  schema: {
    tags: ['studios'],
    response: {
      200: Studio,
    },
  },
};
