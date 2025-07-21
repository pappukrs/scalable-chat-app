const { Message } = require('../models/message');

exports.getChatHistory = async (req, res) => {
  const { room } = req.params;

  try {
    const messages = await Message.findAll({
      where: { room },
      order: [['createdAt', 'ASC']],
    });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};
