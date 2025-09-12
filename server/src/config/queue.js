// // server/src/config/queue.js

// const { Queue } = require('bullmq');

// // --- THE FINAL FIX ---
// // We pass the Redis URL string directly to the connection option.
// // BullMQ's underlying library (ioredis) is designed to handle a full URL string.
// // If the URL is not provided, it will default to localhost, which is perfect for our local setup.
// const connection = process.env.REDIS_URL;

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
// server/src/config/queue.js

const { Queue } = require('bullmq');

// This is a robust function to parse a Redis URL string.
const parseRedisUrl = (redisUrl) => {
  if (!redisUrl) {
    // Fallback for local development if REDIS_URL is not set
    return { host: 'localhost', port: 6379 };
  }
  try {
    const url = new URL(redisUrl);
    return {
      host: url.hostname,
      port: url.port,
      password: url.password,
      // Upstash requires a secure TLS connection
      tls: {}, 
    };
  } catch (e) {
    console.error("Invalid REDIS_URL, falling back to localhost");
    return { host: 'localhost', port: 6379 };
  }
};

const connection = parseRedisUrl(process.env.REDIS_URL);

// We now pass the correctly formatted connection object.
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