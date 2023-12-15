export const Message = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    conversationId: { type: 'number' },
    senderId: { type: 'number' },
    createDate: { type: 'string' },
    text: { type: 'string' },
    sender: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
      },
    },
  },
};

// Options for getting all conversations
export const getMessagesOpts = {
  schema: {
    tags: ['messages'],
    params: {
      id: { type: 'number' },
    },
    response: {
      200: {
        type: 'array',
        items: Message,
      },
    },
  },
};

export const postMessageOpts = {
  schema: {
    tags: ['messages'],
    body: {
      type: 'object',
      required: ['senderId', 'conversationId', 'text'],
      properties: {
        senderId: { type: 'number' },
        conversationId: { type: 'number' },
        text: { type: 'string' },
      },
    },
    response: {
      201: Message,
    },
  },
};
