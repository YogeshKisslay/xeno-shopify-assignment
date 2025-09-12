// server/src/config/queue.js

const { Queue } = require('bullmq');

// --- THE FINAL FIX ---
// We pass the Redis URL string directly to the connection option.
// BullMQ's underlying library (ioredis) is designed to handle a full URL string.
// If the URL is not provided, it will default to localhost, which is perfect for our local setup.
const connection = process.env.REDIS_URL;

// We no longer need lazy initialization. Let the library connect directly.
const orderQueue = new Queue('order-processing', { connection });
const customerQueue = new Queue('customer-processing', { connection });
const orderCancellationQueue = new Queue('order-cancellation-processing', { connection });
const orderUpdateQueue = new Queue('order-update-processing', { connection });

module.exports = {
  orderQueue,
  customerQueue,
  orderCancellationQueue,
  orderUpdateQueue,
};

// server/src/config/queue.js

// const { Queue } = require('bullmq');

// // --- THE FINAL FIX ---
// // This connection object is now smart and robust.
// // It uses the Railway-provided environment variables if they exist.
// // If not, it falls back to 'localhost' for your local development.
// const connection = {
//   host: process.env.REDISHOST || 'localhost',
//   port: process.env.REDISPORT || 6379,
//   password: process.env.REDISPASSWORD || undefined,
// };

// // We no longer need lazy initialization. Let the library connect directly.
// const orderQueue = new Queue('order-processing', { connection });
// const customerQueue = new Queue('customer-processing', { connection });
// const orderCancellationQueue = new Queue('order-cancellation-processing', { connection });
// const orderUpdateQueue = new Queue('order-update-processing', { connection });

// module.exports = {
//   orderQueue,
//   customerQueue,
//   orderCancellationQueue,
//   orderUpdateQueue,
// };