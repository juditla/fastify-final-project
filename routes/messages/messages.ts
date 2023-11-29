import { FastifyError, FastifyInstance, FastifySchema } from 'fastify';
import {
  addMessage,
  getMessagesByConversationId,
} from '../../controllers/messages.js';
import { getMessagesOpts, postMessageOpts } from './messagesOpts.js';

export function messagesRoutes(
  fastify: FastifyInstance,
  options: FastifySchema,
  done: (err?: FastifyError) => void,
) {
  // Get all Messages from conversation
  fastify.get(
    '/messages/:conversationid',
    getMessagesOpts,
    getMessagesByConversationId,
  );

  // Add Message
  fastify.post('/messages', postMessageOpts, addMessage);

  done();
}
