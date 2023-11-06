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
    // id: { type: 'number' }, // brauch ich das hier???
    description: { type: 'string' },
    userId: { type: 'number' },
    studioId: { type: 'number' },
    style: { type: 'string' },
    tattooImages: { type: { TattooImage } },
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
    // response: {
    //   200: Artist,
    // },
  },
};

export const postArtistOpts = {
  schema: {
    tags: ['artists'],
    body: {
      type: 'object',
      required: ['name', 'style', 'token', 'description'],
      properties: {
        name: { type: 'string' },
        // id: { type: 'number' }, // brauch ich das hier???
        description: { type: 'string' },
        userId: { type: 'number' },
        studioId: { type: 'number' },
        style: { type: 'string' },
        token: { type: 'string' },
      },
    },
    // response: {
    //   201: Artist,
    // },
  },
};

export const deleteArtistOpts = {
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
};

export const updateArtistOpts = {
  schema: {
    tags: ['artists'],
    // response: {
    //   200: Artist,
    // },
  },
};
