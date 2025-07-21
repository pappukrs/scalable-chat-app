const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'chat-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();

const sendMessageToKafka = async (message) => {
  await producer.connect();
  await producer.send({
    topic: 'chat-messages',
    messages: [{ value: JSON.stringify(message) }],
  });
  console.log('📤 Message sent to Kafka:', message);
};

module.exports = { sendMessageToKafka };
