const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Resolve proto file path relative to this JS file
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

// Create gRPC client
const client = new chatPackage.ChatService(
  `${process.env.MESSAGE_STORE_HOST}:${process.env.GRPC_PORT || 50051}`,
  grpc.credentials.createInsecure()
);

module.exports = client;
