require('dotenv').config();
const express = require('express');
const { createTopicIfNotExists, disconnectAdmin } = require('./services/kafkaAdmin');
const { startConsumer, shutdown } = require('./services/kafkaConsumer');
const { initDb } = require('./models/message');

const app = express();
app.use(express.json());

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const startServer = async () => {
  try {
    // Check DB connection
    await initDb();
    console.log('✅ Database connected');

    // Create topics
    await createTopicIfNotExists(process.env.KAFKA_TOPIC);
    await createTopicIfNotExists(process.env.KAFKA_DLQ_TOPIC);

    // Start Kafka consumer
    await startConsumer();

    // Disconnect admin after initialization
    await disconnectAdmin();

    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => {
      console.log(`🚀 Message Store Service running on http://localhost:${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('🛑 Shutting down...');
      await shutdown();
      process.exit(0);
    });
  } catch (err) {
    console.error('❌ Failed to start Message Store Service:', err);
    process.exit(1);
  }
};

startServer();
