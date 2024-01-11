export const loginOpts = {
  schema: {
    tags: ['login'],
    body: {
      required: ['email', 'password'],
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          expiryTimestamp: { type: 'number' },
        },
      },
    },
  },
};
