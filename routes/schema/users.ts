// User schema
export const UserWithPassword = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    password: { type: 'string' },
    roleId: { type: 'number' },
  },
} as const;

// User without password schema
export const UserWithoutPassword = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    roleId: { type: 'number' },
  },
};

export const getUsersOpts = {
  schema: {
    tags: ['users'],
    response: {
      200: {
        type: 'array',
        studios: UserWithoutPassword,
      },
    },
  },
} as const;

export const getUserOpts = {
  schema: {
    tags: ['users'],
    response: {
      200: UserWithPassword,
    },
  },
};

export const postUserOpts = {
  schema: {
    tags: ['users'],
    body: {
      required: ['email', 'firstName', 'lastName', 'password'],
      properties: {
        // id: { type: 'number' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        password: { type: 'string' },
        roleId: { type: 'number' },
      },
    },
    response: {
      201: UserWithoutPassword,
    },
  },
};

export const deleteUserOpts = {
  schema: {
    tags: ['users'],
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

export const updateUserOpts = {
  schema: {
    tags: ['users'],
    response: {
      200: UserWithoutPassword,
    },
  },
};
