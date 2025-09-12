
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
// This connection object is now smart and robust.
// It uses the Railway environment variables if they exist.
// If not, it falls back to 'localhost' for your local development.
const connection = {
  host: process.env.REDISHOST || 'localhost',
  port: process.env.REDISPORT || 6379,
  password: process.env.REDISPASSWORD || undefined,
};

const queues = {
  orderQueue: null,
  customerQueue: null,
  orderCancellationQueue: null,
  orderUpdateQueue: null,
};

// This function now uses the smart connection object.
const initializeQueues = () => {
  queues.orderQueue = new Queue('order-processing', { connection });
  queues.customerQueue = new Queue('customer-processing', { connection });
  queues.orderCancellationQueue = new Queue('order-cancellation-processing', { connection });
  queues.orderUpdateQueue = new Queue('order-update-processing', { connection });
  
  console.log('BullMQ queues initialized successfully.');
};

module.exports = {
  queues,
  initializeQueues,
};