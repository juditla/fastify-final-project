export const postSessionOpts = {
  schema: {
    tags: ['session'],
    body: {
      required: ['token'],
      properties: {
        token: { type: 'string' },
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
  },
};
