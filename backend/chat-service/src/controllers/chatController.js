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

exports.getChatHistory = (req, res) => {
  const { room } = req.params;
  grpcClient.GetChatHistory({ room, limit: 50 }, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response);
  });
};

