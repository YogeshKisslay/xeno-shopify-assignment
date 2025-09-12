
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

// This object will hold our queues, but they will be null at first.
const queues = {
  orderQueue: null,
  customerQueue: null,
  orderCancellationQueue: null,
  orderUpdateQueue: null,
};

// This is an initialization function that we will call from our main server file.
const initializeQueues = () => {
  // This is the correct way to get the connection details on Railway
  const connection = {
    host: process.env.REDISHOST,
    port: process.env.REDISPORT,
    password: process.env.REDISPASSWORD,
  };

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