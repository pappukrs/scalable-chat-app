require('dotenv').config();
const express = require('express');
const { initDb } = require('./models/message');
const { startConsumer } = require('./services/kafkaConsumer');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('✅ Message-store-service is running');
});

const startService = async () => {
  await initDb();
  await startConsumer();

  app.listen(PORT, () => {
    console.log(`🚀 Message-store-service running on http://localhost:${PORT}`);
  });
};

startService();
