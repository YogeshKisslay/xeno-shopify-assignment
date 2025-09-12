
console.log("--- RAILWAY ENVIRONMENT VARIABLES (WORKER) ---");
console.log(process.env);
console.log("----------------------------------------------");
require('dotenv').config(); 

const { Worker } = require('bullmq');
const prisma = require('./config/db');

console.log('Worker process started...');

// The exact same simple connection logic as in queue.js.
const connection = process.env.REDIS_URL;

// --- All your job processor functions (processOrderJob, etc.) remain exactly the same ---
const processOrderJob = async (job) => {
  console.log(`Processing ORDER job ${job.id}...`);
  const { storeUrl, orderData } = job.data;
  try {
    const store = await prisma.store.findUnique({ where: { storeUrl } });
    if (!store) throw new Error(`Store not found: ${storeUrl}`);

    const order = orderData;
    if (!order.customer) return console.log(`Order ${order.id} skipped: No customer.`);

    const customerShopifyId = `gid://shopify/Customer/${order.customer.id}`;
    const customer = await prisma.customer.findUnique({ where: { shopifyId: customerShopifyId } });
    if (!customer) return console.log(`Order ${order.id} skipped: Customer not found.`);

    await prisma.order.upsert({
      where: { shopifyId: `gid://shopify/Order/${order.id}` },
      create: {
        shopifyId: `gid://shopify/Order/${order.id}`,
        totalPrice: parseFloat(order.total_price),
        fulfillmentStatus: order.fulfillment_status || 'unfulfilled',
        processedAt: new Date(order.processed_at),
        storeId: store.id,
        customerId: customer.id,
      },
      update: {
        totalPrice: parseFloat(order.total_price),
        fulfillmentStatus: order.fulfillment_status || 'unfulfilled',
      },
    });
    console.log(`Successfully saved order ${order.id}.`);

    const customerOrders = await prisma.order.findMany({ where: { customerId: customer.id } });
    const totalSpent = customerOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    
    await prisma.customer.update({
        where: { id: customer.id },
        data: { ordersCount: customerOrders.length, totalSpent: totalSpent }
    });
    console.log(`Successfully updated stats for customer ${customer.id}.`);
  } catch (error) {
    console.error(`Failed to process order job ${job.id}:`, error.message);
    throw error;
  }
};

const processCustomerJob = async (job) => {
  console.log(`Processing CUSTOMER job ${job.id}...`);
  const { storeUrl, customerData } = job.data;
  try {
    const store = await prisma.store.findUnique({ where: { storeUrl } });
    if (!store) throw new Error(`Store not found for URL: ${storeUrl}`);

    const customer = customerData;
    const dbCustomerData = {
      shopifyId: `gid://shopify/Customer/${customer.id}`,
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name,
      totalSpent: parseFloat(customer.total_spent) || 0,
      ordersCount: customer.orders_count || 0,
      storeId: store.id,
    };

    await prisma.customer.upsert({
      where: { shopifyId: dbCustomerData.shopifyId },
      update: dbCustomerData,
      create: dbCustomerData,
    });
    console.log(`Successfully processed and saved customer ${customer.id}.`);
  } catch (error) {
    console.error(`Failed to process job ${job.id}:`, error.message);
    throw error;
  }
};

const processOrderCancellationJob = async (job) => {
  console.log(`Processing ORDER CANCELLATION job ${job.id}...`);
  const { storeUrl, orderData } = job.data;
  try {
    const orderShopifyId = `gid://shopify/Order/${orderData.id}`;
    const order = await prisma.order.findUnique({ where: { shopifyId: orderShopifyId } });
    if (!order) return console.log(`Cancelled order ${orderData.id} not found in our DB. Ignoring.`);
    
    await prisma.order.delete({ where: { id: order.id } });
    console.log(`Successfully deleted cancelled order ${orderData.id}.`);

    const customerOrders = await prisma.order.findMany({ where: { customerId: order.customerId } });
    const totalSpent = customerOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    
    await prisma.customer.update({
        where: { id: order.customerId },
        data: { ordersCount: customerOrders.length, totalSpent: totalSpent }
    });
    console.log(`Successfully updated stats for customer ${order.customerId} after cancellation.`);
  } catch (error) {
    console.error(`Failed to process cancellation job ${job.id}:`, error.message);
    throw error;
  }
};

const processOrderUpdateJob = async (job) => {
  console.log(`Processing ORDER UPDATE job ${job.id}...`);
  const { orderData } = job.data;
  const orderShopifyId = `gid://shopify/Order/${orderData.id}`;
  try {
    const orderInDb = await prisma.order.findUnique({ where: { shopifyId: orderShopifyId } });
    if (!orderInDb) return console.log(`Order ${orderData.id} for update not found in our DB.`);

    await prisma.order.update({
      where: { id: orderInDb.id },
      data: { fulfillmentStatus: orderData.fulfillment_status || orderInDb.fulfillmentStatus },
    });
    console.log(`Successfully updated fulfillment status for order ${orderData.id}.`);
  } catch (error) {
    console.error(`Failed to process order update job ${job.id}:`, error.message);
    throw error;
  }
};

// --- WORKER SETUP ---
const orderWorker = new Worker('order-processing', processOrderJob, { connection, concurrency: 5 });
const customerWorker = new Worker('customer-processing', processCustomerJob, { connection, concurrency: 5 });
const orderCancellationWorker = new Worker('order-cancellation-processing', processOrderCancellationJob, { connection, concurrency: 5 });
const orderUpdateWorker = new Worker('order-update-processing', processOrderUpdateJob, { connection, concurrency: 5 });

// --- EVENT LISTENERS ---
orderWorker.on('completed', (job) => console.log(`Order job ${job.id} has completed!`));
orderWorker.on('failed', (job, err) => console.log(`Order job ${job.id} has failed: ${err.message}`));
customerWorker.on('completed', (job) => console.log(`Customer job ${job.id} has completed!`));
customerWorker.on('failed', (job, err) => console.log(`Customer job ${job.id} has failed: ${err.message}`));
orderCancellationWorker.on('completed', (job) => console.log(`Cancellation job ${job.id} has completed!`));
orderCancellationWorker.on('failed', (job, err) => console.log(`Cancellation job ${job.id} has failed: ${err.message}`));
orderUpdateWorker.on('completed', (job) => console.log(`Update job ${job.id} has completed!`));
orderUpdateWorker.on('failed', (job, err) => console.log(`Update job ${job.id} has failed: ${err.message}`));

