
// const { Queue } = require('bullmq');

// const parseRedisUrl = () => {
//   if (process.env.REDIS_URL) {
//     const redisUrl = new URL(process.env.REDIS_URL);
//     return {
//       host: redisUrl.hostname,
//       port: redisUrl.port,
//       password: redisUrl.password,
//     };
//   }
//   // Fallback for local development
//   return { host: 'localhost', port: 6379 };
// };

// const connection = parseRedisUrl();

// const queues = {
//   orderQueue: null,
//   customerQueue: null,
//   orderCancellationQueue: null,
//   orderUpdateQueue: null,
// };

// const initializeQueues = () => {
//   queues.orderQueue = new Queue('order-processing', { connection });
//   queues.customerQueue = new Queue('customer-processing', { connection });
//   queues.orderCancellationQueue = new Queue('order-cancellation-processing', { connection });
//   queues.orderUpdateQueue = new Queue('order-update-processing', { connection });
  
//   console.log('BullMQ queues initialized successfully.');
// };

// module.exports = {
//   queues,
//   initializeQueues,
// };

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