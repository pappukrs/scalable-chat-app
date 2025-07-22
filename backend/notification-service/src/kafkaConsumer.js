
const { Kafka } = require('kafkajs');
const { sendNotification } = require('./services/notifier');

const kafka = new Kafka({
  clientId: 'notification-service-consumer',
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

const startConsumer = async () => {
  await consumer.connect();
  console.log(`✅ Kafka consumer connected to broker ${process.env.KAFKA_BROKER}`);

  // Subscribe to notifications topic
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: false });
  console.log(`🎯 Subscribed to topic: ${process.env.KAFKA_TOPIC}`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msgValue = message.value.toString();
      console.log(`📩 Received message: ${msgValue}`);

      try {
        const payload = JSON.parse(msgValue);
        // Example payload: { userId: '123', type: 'chat', message: 'You got a new message' }
        await sendNotification(payload);
      } catch (err) {
        console.error('❌ Failed to process notification:', err.message);
      }
    },
  });
};

module.exports = { startConsumer };
