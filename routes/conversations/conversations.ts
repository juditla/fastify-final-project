import { FastifyError, FastifyInstance, FastifySchema } from 'fastify';
import {
  addConversation,
  deleteConversation,
  getConversationsByUserId,
} from '../../controllers/conversations.js';
import {
  deleteConversationOpts,
  getConversationsOpts,
  postConversationOpts,
} from './conversationsOpts.js';

export function conversationsRoutes(
  fastify: FastifyInstance,
  options: FastifySchema,
  done: (err?: FastifyError) => void,
) {
  // schema defines how request body should look like, required fields, how standard response is defined, tags for swagger (ui)
  // Get all conversations from User
  fastify.get(
    '/conversations/:id',
    getConversationsOpts,
    getConversationsByUserId,
  );

  // Add artist
  fastify.post('/conversations', postConversationOpts, addConversation);

  // Delete conversation
  fastify.delete(
    '/conversations/:id',
    deleteConversationOpts,
    deleteConversation,
  );

  done();
}
