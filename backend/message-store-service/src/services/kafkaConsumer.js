const { Kafka } = require('kafkajs');
const { Message } = require('../models/message');

const kafka = new Kafka({
  clientId: 'message-store-service',
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'message-store-group' });

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: true });

  console.log(`✅ Kafka consumer connected and subscribed to ${process.env.KAFKA_TOPIC}`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const msgValue = message.value.toString();
        const payload = JSON.parse(msgValue);
        console.log(`📥 Received message:`, payload);

        await Message.create({
          room: payload.room,
          sender: payload.sender,
          message: payload.message,
          // timestamp: payload.timestamp,
        });

        console.log(`✅ Message stored in DB`);
      } catch (err) {
        console.error('❌ Error processing Kafka message:', err);
      }
    },
  });
};

module.exports = { startConsumer };
