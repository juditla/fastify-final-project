export const deleteTattooImageOpts = {
  schema: {
    tags: ['tattooimages'],
    params: {
      id: { type: 'number' },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          picture: { type: 'string' },
          id: { type: 'number' },
        },
      },
    },
  },
};

export const postTattooImageOpts = {
  schema: {
    tags: ['tattooimages'],
  },
  body: {
    required: ['base64Image', 'id'],
    properties: {
      base64Image: { type: 'string' },
      id: { type: 'number' },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        picture: { type: 'string' },
        artistId: { type: 'number' },
        style: { type: 'string' },
      },
    },
  },
};
