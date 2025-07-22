require('dotenv').config();
const { startConsumer } = require('./kafkaConsumer');
const { startGrpcServer } = require('./grpcServer');

const PORT = process.env.GRPC_PORT || 50052;

(async () => {
  try {
    console.log('🚀 Starting Notification Service...');
    await startConsumer(); // Start Kafka consumer
    await startGrpcServer(PORT); 
  } catch (err) {
    console.error('❌ Failed to start service:', err);
  }
})();
