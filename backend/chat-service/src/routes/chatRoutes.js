const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/rooms/:room/messages
router.get('/rooms/:room/messages',authMiddleware, chatController.getChatHistory);
router.get('/history/:room',authMiddleware, chatController.getChatHistory);

module.exports = router;
