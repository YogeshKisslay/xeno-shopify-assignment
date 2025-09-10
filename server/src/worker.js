// server/src/worker.js

require('dotenv').config();
const { Worker } = require('bullmq');
const prisma = require('./config/db');

console.log('Worker process started...');

const connection = {
  host: 'localhost',
  port: 6379,
};

const processOrderJob = async (job) => {
  console.log(`Processing order job ${job.id}...`);
  const { storeUrl, orderData } = job.data;

  try {
    const store = await prisma.store.findUnique({ where: { storeUrl } });
    if (!store) {
      throw new Error(`Store not found for URL: ${storeUrl}`);
    }

    const order = orderData; // The order data is passed directly in the job
    if (!order.customer) {
      console.log(`Order ${order.id} skipped: No customer data.`);
      return;
    }

    const customerShopifyId = `gid://shopify/Customer/${order.customer.id}`;
    const customer = await prisma.customer.findUnique({
      where: { shopifyId: customerShopifyId },
    });

    if (!customer) {
      console.log(`Order ${order.id} skipped: Customer ${customerShopifyId} not found in our DB.`);
      return;
    }

    const dbOrderData = {
      shopifyId: `gid://shopify/Order/${order.id}`,
      totalPrice: parseFloat(order.total_price),
      fulfillmentStatus: order.fulfillment_status || 'unfulfilled',
      processedAt: new Date(order.processed_at),
      storeId: store.id,
      customerId: customer.id,
    };

    await prisma.order.upsert({
      where: { shopifyId: dbOrderData.shopifyId },
      update: dbOrderData,
      create: dbOrderData,
    });

    console.log(`Successfully processed and saved order ${order.id}.`);
  } catch (error) {
    console.error(`Failed to process job ${job.id}:`, error.message);
    // It's important to throw the error so BullMQ knows the job failed and can retry it
    throw error;
  }
};

// --- JOB PROCESSOR 2: For Customers (UPDATED) ---
const processCustomerJob = async (job) => {
  console.log(`Processing CUSTOMER job ${job.id}...`);
  const { storeUrl, customerData } = job.data;

  try {
    const store = await prisma.store.findUnique({ where: { storeUrl } });
    if (!store) {
      throw new Error(`Store not found for URL: ${storeUrl}`);
    }

    const customer = customerData;
    const dbCustomerData = {
      shopifyId: `gid://shopify/Customer/${customer.id}`,
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name,
      // --- FIX: Provide a default value of 0 if the data is missing ---
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


// --- WORKER 1: Listens to the Order Queue ---
const orderWorker = new Worker('order-processing', processOrderJob, {
  connection,
  concurrency: 5,
});

// --- WORKER 2: Listens to the Customer Queue ---
const customerWorker = new Worker('customer-processing', processCustomerJob, {
    connection,
    concurrency: 5,
});

// --- Event Listeners for Logging ---
orderWorker.on('completed', (job) => {
  console.log(`Order job ${job.id} has completed!`);
});
orderWorker.on('failed', (job, err) => {
  console.log(`Order job ${job.id} has failed with ${err.message}`);
});

customerWorker.on('completed', (job) => {
    console.log(`Customer job ${job.id} has completed!`);
});
customerWorker.on('failed', (job, err) => {
    console.log(`Customer job ${job.id} has failed with ${err.message}`);
});
