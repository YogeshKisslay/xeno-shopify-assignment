
const { Queue } = require('bullmq');

const connection = {
  host: 'localhost',
  port: 6379,
};

// Queue for processing new orders
const orderQueue = new Queue('order-processing', { connection });

// Queue for processing new customers
const customerQueue = new Queue('customer-processing', { connection });

// ---Queue for processing cancelled orders ---
const orderCancellationQueue = new Queue('order-cancellation-processing', { connection });

// ---Queue for processing order updates (like fulfillment) ---
const orderUpdateQueue = new Queue('order-update-processing', { connection });
module.exports = {
  orderQueue,
  customerQueue, 
  orderCancellationQueue,
  orderUpdateQueue,
};