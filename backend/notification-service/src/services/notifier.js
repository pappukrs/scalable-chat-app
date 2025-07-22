const notificationsStore = {}; // In-memory store (replace with DB later)

// Simulate sending notification
const sendNotification = async ({ userId, type, message, timestamp }) => {
  console.log(`🔔 [gRPC] Notification for ${userId}: ${message}`);

  if (!notificationsStore[userId]) {
    notificationsStore[userId] = [];
  }

  notificationsStore[userId].push({ type, message, timestamp });
};

// Fetch notifications for user
const getNotificationsForUser = async (userId) => {
  return notificationsStore[userId] || [];
};

module.exports = { sendNotification, getNotificationsForUser };
