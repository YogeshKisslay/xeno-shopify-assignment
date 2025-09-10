// server/src/config/queue.js

const { Queue } = require('bullmq');

const connection = {
  host: 'localhost',
  port: 6379,
};

// Queue for processing new orders
const orderQueue = new Queue('order-processing', { connection });

// NEW: Queue for processing new customers
const customerQueue = new Queue('customer-processing', { connection });

module.exports = {
  orderQueue,
  customerQueue, // Export the new queue
};