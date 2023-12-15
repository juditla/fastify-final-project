export const postSessionOpts = {
  schema: {
    tags: ['session'],
    body: {
      required: ['token'],
      properties: {
        token: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          roleId: { type: 'number' },
          id: { type: 'number' },
        },
      },
    },
  },
};

export const deleteSessionOpts = {
  schema: {
    tags: ['session'],
    body: {
      required: ['token'],
      properties: {
        token: { type: 'string' },
      },
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
