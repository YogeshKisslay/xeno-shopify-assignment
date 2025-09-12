// server/src/config/queue.js

const { Queue } = require('bullmq');

// This is correct. It will now correctly find process.env.REDIS_URL
// because server.js loads the variables first.
const connection = process.env.REDIS_URL;

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