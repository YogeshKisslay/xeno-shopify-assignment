
// const { Queue } = require('bullmq');

// const connection = {
//   host: 'localhost',
//   port: 6379,
// };

// // Queue for processing new orders
// const orderQueue = new Queue('order-processing', { connection });

// // Queue for processing new customers
// const customerQueue = new Queue('customer-processing', { connection });

// // ---Queue for processing cancelled orders ---
// const orderCancellationQueue = new Queue('order-cancellation-processing', { connection });

// // ---Queue for processing order updates (like fulfillment) ---
// const orderUpdateQueue = new Queue('order-update-processing', { connection });
// module.exports = {
//   orderQueue,
//   customerQueue, 
//   orderCancellationQueue,
//   orderUpdateQueue,
// };

// server/src/config/queue.js

// const { Queue } = require('bullmq');

// // --- FIX: Dynamically parse the REDIS_URL from environment variables ---
// const parseRedisUrl = () => {
//   if (process.env.REDIS_URL) {
//     const redisUrl = new URL(process.env.REDIS_URL);
//     return {
//       host: redisUrl.hostname,
//       port: redisUrl.port,
//       password: redisUrl.password,
//     };
//   }
//   // Fallback for local development if REDIS_URL is not set
//   return { host: 'localhost', port: 6379 };
// };

// const connection = parseRedisUrl();

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



// server/src/config/queue.js
// server/src/config/queue.js

const { Queue } = require('bullmq');

const parseRedisUrl = () => {
  if (process.env.REDIS_URL) {
    const redisUrl = new URL(process.env.REDIS_URL);
    return {
      host: redisUrl.hostname,
      port: redisUrl.port,
      password: redisUrl.password,
    };
  }
  // Fallback for local development
  return { host: 'localhost', port: 6379 };
};

const connection = parseRedisUrl();

const queues = {
  orderQueue: null,
  customerQueue: null,
  orderCancellationQueue: null,
  orderUpdateQueue: null,
};

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