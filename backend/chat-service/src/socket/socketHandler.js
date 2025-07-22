const jwt = require('jsonwebtoken');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const { sendMessageToKafka, sendNotificationToKafka } = require('../services/kafkaProducer');
const { sendNotification } = require('../controllers/chatController');

const handleSocket = (io) => {
  // Redis setup
  const pubClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  });
  const subClient = pubClient.duplicate();

  Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    console.log('✅ Redis adapter connected for Socket.IO');
  });

  // JWT Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('No token provided'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  // Socket events
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.phone}`);

    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`${socket.user.phone} joined room: ${room}`);
    });

    socket.on('sendMessage', async ({ room, message }, callback) => {
      console.log(`📩 Message from ${socket.user.phone}: ${message}`);

      try {
        // Send to Kafka
        await sendMessageToKafka({
          room,
          sender: socket.user.phone,
          message,
          timestamp: new Date().toISOString(),
        });

        await sendNotificationToKafka({
  userId: socket.user.phone,
  type: 'chat',
  message: `New message from ${socket.user.phone}`,
  timestamp: new Date().toISOString(),
});

        await sendNotification(socket.user.phone, `New message from ${socket.user.phone}: ${message}`);


        // Broadcast to others in room
        io.to(room).emit('newMessage', {
          sender: socket.user.phone,
          message,
        });

        // ACK to sender
        callback && callback({ status: 'ok', message: 'Delivered' });
      } catch (err) {
        console.error('❌ Error handling message:', err);
        callback && callback({ status: 'error', message: err.message });
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.phone}`);
    });
  });
};

module.exports = handleSocket;
