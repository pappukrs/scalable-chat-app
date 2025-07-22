const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load proto
const PROTO_PATH = path.resolve(__dirname, '../proto/notification.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const notificationPackage = grpcObject.notification;

// Create gRPC client
const client = new notificationPackage.NotificationService(
  `${process.env.NOTIFICATION_SERVICE_HOST || localhost}:${process.env.NOTIFICATION_GRPC_PORT || 50052}`,
  grpc.credentials.createInsecure()
);

module.exports = client;
