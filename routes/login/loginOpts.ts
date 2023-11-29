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
  },
};
