const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Import our notifier
const { sendNotification, getNotificationsForUser } = require('./services/notifier');

// Load proto
const PROTO_PATH = path.resolve(__dirname, './proto/notification.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const notificationPackage = grpcObject.notification;

/**
 * Start gRPC server for NotificationService
 */
const startGrpcServer = () => {
  const server = new grpc.Server();

  server.addService(notificationPackage.NotificationService.service, {
    // Handle SendNotification RPC
    SendNotification: async (call, callback) => {
      const { userId, type, message, timestamp } = call.request;
      try {
        await sendNotification({ userId, type, message, timestamp });
        callback(null, { success: true, message: 'Notification sent successfully' });
      } catch (err) {
        console.error('❌ Error sending notification:', err);
        callback(null, { success: false, message: 'Failed to send notification' });
      }
    },

    // Handle GetNotifications RPC
    GetNotifications: async (call, callback) => {
      const { userId } = call.request;
      try {
        const notifications = await getNotificationsForUser(userId);
        callback(null, { notifications });
      } catch (err) {
        console.error('❌ Error fetching notifications:', err);
        callback(err);
      }
    },
  });

  // Start Server
  server.bindAsync(
    `0.0.0.0:${process.env.GRPC_PORT || 50052}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log(`🚀 gRPC Server running on port ${process.env.GRPC_PORT || 50052}`);
      server.start();
    }
  );
};

module.exports = { startGrpcServer };
