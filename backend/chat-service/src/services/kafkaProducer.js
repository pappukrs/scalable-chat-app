const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'chat-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();

// Connect the producer once
const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('✅ Kafka producer connected');
  } catch (err) {
    console.error('❌ Failed to connect Kafka producer:', err.message);
  }
};

const sendMessageToKafka = async (message) => {
  try {
    await producer.send({
      topic: 'chat-messages',
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log('📤 Message sent to Kafka:', message);
  } catch (err) {
    console.error('❌ Failed to send message to Kafka:', err.message);
  }
};

const sendNotificationToKafka = async (notification) => {
  try {
    await producer.send({
      topic: 'notifications',
      messages: [{ value: JSON.stringify(notification) }],
    });
    console.log('📤 Notification sent to Kafka:', notification);
  } catch (err) {
    console.error('❌ Failed to send notification to Kafka:', err.message);
  }
};

module.exports = {
  connectProducer,
  sendMessageToKafka,
  sendNotificationToKafka,
};
