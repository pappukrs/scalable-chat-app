// const { Message } = require('../models/message');

// exports.getChatHistory = async (req, res) => {
//   const { room } = req.params;

//   try {
//     const messages = await Message.findAll({
//       where: { room },
//       order: [['createdAt', 'ASC']],
//     });
//     res.json({ messages });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch chat history' });
//   }
// };




//src/controllers/chatController.js
const grpcClient = require('../grpcClient');
const notificationClient = require('../services/grpcNotificationClient'); // 👈 Add this


exports.getChatHistory = (req, res) => {
  const { room } = req.params;
  grpcClient.GetChatHistory({ room, limit: 50 }, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response);
  });
};






// Utility function to send notification via gRPC
const sendNotification = (userId, message) => {
  const payload = {
    userId, // Could be a room ID or single user ID depending on your design
    type: 'chat',
    message,
    timestamp: new Date().toISOString(),
  };

  notificationClient.SendNotification(payload, (err, response) => {
    if (err) {
      console.error('❌ Failed to send notification via gRPC:', err);
    } else if (response.success) {
      console.log('✅ Notification sent successfully');
    } else {
      console.warn('⚠️ Notification service responded with failure');
    }
  });
};

module.exports.sendNotification = sendNotification; // 👈 Export this to use in socket handler


