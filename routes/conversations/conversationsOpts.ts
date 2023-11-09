export const Conversation = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    ownerId: { type: 'number' },
    participantId: { type: 'number' },
    createDate: { type: 'date' },
  },
};

// Options for getting all conversations
export const getConversationsOpts = {
  schema: {
    tags: ['conversations'],
    response: {
      200: {
        type: 'array',
        conversation: Conversation,
      },
    },
  },
};

export const postConversationOpts = {
  schema: {
    tags: ['conversations'],
    body: {
      type: 'object',
      required: ['userId', 'artistId', 'token'],
      properties: {
        userId: { type: 'number' },
        artistId: { type: 'number' },
        token: { type: 'string' },
      },
    },
  },
};

export const deleteConversationOpts = {
  schema: {
    tags: ['conversations'],
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
