export const postSessionOpts = {
  schema: {
    tags: ['session'],
    body: {
      required: ['token'],
      properties: {
        token: { type: 'string' },
      },
    },
    // response: {
    //   200: {
    //     type: 'object',
    //     userFromToken: { firstName: 'string', roleId: 'number' },
    //   },
    // },
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
