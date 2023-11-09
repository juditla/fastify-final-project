export const Message = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    conversationId: { type: 'number' },
    senderId: { type: 'number' },
    createDate: { type: 'date' },
    content: { type: 'string' },
  },
};

// Options for getting all conversations
export const getMessagesOpts = {
  schema: {
    tags: ['messages'],
    response: {
      200: {
        type: 'array',
        conversation: Message,
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
        content: { type: 'string' },
      },
    },
  },
};
