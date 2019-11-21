const express = require('express');
const chatRoutes = express.Router();
const ChatController = require('../app/api/controllers/chat');

chatRoutes.get('/', ChatController.getConversations);

// // Retrieve single conversation
chatRoutes.get('/:conversationId', ChatController.getConversation);

// // Send reply in conversation
chatRoutes.post('/:conversationId', ChatController.sendReply);

// Start new conversation
chatRoutes.post('/new/:recipient', ChatController.newConversation);
module.exports = chatRoutes;