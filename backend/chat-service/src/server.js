require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize } = require('./models/message');
const handleSocket = require('./socket/socketHandler');
const chatRoutes = require('./routes/chatRoutes');
const { connectProducer } = require('./services/kafkaProducer');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Middleware
app.use(express.json());
app.get('/', (req, res) => res.send('Chat service is running'));

// Existing imports ...

app.use('/api/chat', chatRoutes);

// Attach socket handler
handleSocket(io);

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    await connectProducer(); // Connect Kafka producer
    await sequelize.sync(); // Ensure database tables are created
    console.log('✅ Database connected');
    console.log(`🚀 Chat service running on http://localhost:${PORT}`);
  } catch (err) {
    console.error('❌ DB connection error:', err);
  }
});
