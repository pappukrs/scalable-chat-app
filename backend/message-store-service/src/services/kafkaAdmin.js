const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'message-store-service',
  brokers: [process.env.KAFKA_BROKER],
  retry: { retries: 5 }, // Retry logic for Kafka
});

const admin = kafka.admin();

const createTopicIfNotExists = async (topicName) => {
  await admin.connect();
  const existingTopics = await admin.listTopics();

  if (existingTopics.includes(topicName)) {
    console.log(`✅ Topic '${topicName}' already exists`);
  } else {
    console.log(`📦 Creating topic '${topicName}'...`);
    await admin.createTopics({
      topics: [{
        topic: topicName,
        numPartitions: 1,
        replicationFactor: 1,
      }],
    });
    console.log(`✅ Topic '${topicName}' created successfully`);
  }
};

const disconnectAdmin = async () => {
  try {
    await admin.disconnect();
    console.log('✅ Kafka admin disconnected cleanly');
  } catch (err) {
    console.error('❌ Failed to disconnect Kafka admin:', err);
  }
};

module.exports = { createTopicIfNotExists, disconnectAdmin, kafka };
