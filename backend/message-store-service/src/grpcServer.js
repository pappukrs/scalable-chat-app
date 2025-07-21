// src/grpcServer.js
require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { initDb,Message } = require('./models/message');
const path = require('path');

// Load proto file
const PROTO_PATH = path.resolve(__dirname, './proto/chat.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const chatPackage = grpcObject.chat;

initDb()
  .then(() => { 
    console.log('✅ Database initialized');
  })
  .catch(err => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  });

// Implement GetChatHistory
const server = new grpc.Server();
server.addService(chatPackage.ChatService.service, {
  GetChatHistory: async (call, callback) => {
    const { room, limit } = call.request;
    try {
      const messages = await Message.findAll({
        where: { room },
        limit,
        order: [['createdAt', 'DESC']],
      });
      callback(null, {
        messages: messages.map(msg => ({
          sender: msg.sender,
          message: msg.message,
          timestamp: msg.createdAt.toISOString(),
        })),
      });
    } catch (err) {
      console.error(err);
      callback(err);
    }
  },
});

// Start server
server.bindAsync(
  `0.0.0.0:${process.env.GRPC_PORT || 50051}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`🚀 gRPC Server running on port ${process.env.GRPC_PORT || 50051}`);
    server.start();
  }
);
