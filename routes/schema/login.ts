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
    // response: {
    //   201: {
    //     type: 'object',
    //     properties: {
    //       message: { type: 'string' },
    //       token: { type: 'string' },
    //     },
    //   },
    // },
  },
};
