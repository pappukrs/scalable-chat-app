const { kafka } = require('./kafkaAdmin');
const { Message } = require('../models/message');
const { Partitioners } = require('kafkajs');

const consumer = kafka.consumer({ groupId: 'message-store-group' });
const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
});

const startConsumer = async () => {
  await consumer.connect();
  await producer.connect();

  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: true });
  console.log(`✅ Kafka consumer connected to topic: ${process.env.KAFKA_TOPIC}`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msgValue = message.value.toString();
      console.log(`📥 Received message: ${msgValue}`);

      try {
        const payload = JSON.parse(msgValue);

        let success = false;
        let retries = 3;

        while (!success && retries > 0) {
          try {
            await Message.create({
              room: payload.room,
              sender: payload.sender,
              message: payload.message,
              // timestamp: payload.timestamp,
            });
            console.log(`✅ Message stored in DB`);
            success = true;
          } catch (err) {
            retries--;
            console.error(`⚠️ DB write failed. Retries left: ${retries}`);
            if (retries === 0) throw err;
          }
        }
      } catch (err) {
        console.error('❌ Failed to process message. Sending to DLQ...');
        await producer.send({
          topic: process.env.KAFKA_DLQ_TOPIC,
          messages: [{ value: msgValue }],
        });
        console.log('📤 Message sent to Dead-Letter Queue');
      }
    },
  });
};

// Graceful shutdown
const shutdown = async () => {
  try {
    await consumer.disconnect();
    await producer.disconnect();
    console.log('✅ Kafka consumer/producer disconnected cleanly');
  } catch (err) {
    console.error('❌ Error disconnecting Kafka consumer/producer:', err);
  }
};

module.exports = { startConsumer, shutdown };
