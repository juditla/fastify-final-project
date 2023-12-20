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

export const StudioWithImages = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    address: { type: 'string' },
    city: { type: 'string' },
    postalCode: { type: 'number' },
    ownerId: { type: 'number' },
    artist: { type: 'object' },
    picture: { type: 'string' },
    pictureId: { type: 'number' },
  },
};

// Options for get all studios
export const getStudiosOpts = {
  schema: {
    tags: ['studios'],
    response: {
      200: {
        type: 'array',
        studios: StudioWithImages,
      },
    },
  },
};

export const getStudioOpts = {
  schema: {
    tags: ['studios'],
  },
  params: {
    id: { type: 'number' },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        address: { type: 'string' },
        city: { type: 'string' },
        postalCode: { type: 'number' },
        ownerId: { type: 'number' },
        picture: { type: 'string' },
        pictureId: { type: 'number' },
        artist: {
          name: { type: 'string' },
          style: { type: 'string' },
          userId: { type: 'number' },
          user: {
            avatar: { type: 'string' },
          },
        },
      },
    },
  },
};

// not yet implemented - TO DO
export const postStudioOpts = {
  schema: {
    tags: ['studios'],
    body: {
      type: 'object',
      required: ['name', 'address', 'city', 'postalCode', 'ownerId'],
    },
  },
};

// not yet implemented - TO DO
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

// not yet implemented - TO DO
export const updateStudioOpts = {
  schema: {
    tags: ['studios'],
    response: {
      200: Studio,
    },
  },
};
