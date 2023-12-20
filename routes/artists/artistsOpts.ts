export const TattooImage = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    style: { type: 'string' },
    picture: { type: 'string' },
    artistId: { type: 'number' },
  },
};

export const Artist = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    id: { type: 'number' },
    userId: { type: 'number' },
    description: { type: 'string' },
    studioId: { type: 'number' },
    style: { type: 'string' },
    tattooImages: { type: 'array' },
    user: { avatar: { type: 'string' }, firstName: { type: 'string' } },
    studio: { name: { type: 'string' }, studioId: { type: 'number' } },
  },
};

// Options for get all studios
export const getArtistsOpts = {
  schema: {
    tags: ['artists'],
    response: {
      200: {
        type: 'array',
        studios: Artist,
      },
    },
  },
};

export const getArtistOpts = {
  schema: {
    tags: ['artists'],
    response: {
      200: Artist,
    },
  },
};

export const postArtistOpts = {
  schema: {
    tags: ['artists'],
    body: {
      type: 'object',
      required: ['name', 'style', 'token', 'description', 'userId'],
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        userId: { type: 'number' },
        studioId: { type: 'number' },
        style: { type: 'string' },
        token: { type: 'string' },
      },
    },
  },
};

export const deleteArtistOpts = {
  schema: {
    tags: ['artists'],
    params: {
      id: { type: 'number' },
    },
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

export const updateArtistOpts = {
  schema: {
    tags: ['artists'],
  },
  params: {
    id: { type: 'number' },
  },
  body: {
    type: 'object',
    required: ['name', 'style', 'description'],
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      style: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        style: { type: 'string' },
      },
    },
  },
};
