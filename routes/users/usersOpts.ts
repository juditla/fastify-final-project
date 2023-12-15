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
    createDate: { type: 'string' },
    avatar: { type: 'string' },
  },
} as const;

// User without password schema
export const UserWithoutPassword = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    roleId: { type: 'number' },
    avatar: { type: 'string' },
    createDate: { type: 'string' },
  },
};

export const getUserOpts = {
  schema: {
    tags: ['users'],
    params: {
      id: { type: 'number' },
    },
    response: {
      200: UserWithPassword,
    },
  },
};

export const postUserOpts = {
  schema: {
    tags: ['users'],
    body: {
      required: ['email', 'firstName', 'lastName', 'password', 'roleId'],
      properties: {
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

export const updateUserOpts = {
  schema: {
    tags: ['users'],
    body: {
      required: ['email', 'firstName', 'lastName'],
      properties: {
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
      },
    },
    response: {
      200: UserWithoutPassword,
    },
  },
};

export const changePasswordOpts = {
  schema: {
    tags: ['users', 'password'],
    params: {
      id: { type: 'number' },
    },
    body: {
      required: ['token', 'oldPassword', 'newPassword'],
      properties: {
        token: { type: 'string' },
        oldPassword: { type: 'string' },
        newPassword: { type: 'string' },
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

export const postProfilePictureOpts = {
  schema: {
    tags: ['users', 'profile picture'],
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
          avatar: { type: 'string' },
        },
      },
    },
  },
};

export const updateProfilePictureOpts = {
  schema: {
    tags: ['users', 'profile picture'],
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
          avatar: { type: 'string' },
        },
      },
    },
  },
};
