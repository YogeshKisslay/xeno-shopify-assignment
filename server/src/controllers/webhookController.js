

const { queues } = require('../config/queue');

const handleNewOrder = async (req, res) => {
  const orderData = req.body;
  const storeUrl = req.headers['x-shopify-shop-domain'];

  // --- NEW: Check if this is a test webhook payload ---
  if (orderData.customer && orderData.customer.email === 'bob@biller.com') {
    console.log('Test order webhook received. Ignoring.');
    // It's important to still send a 200 OK so Shopify knows we received it.
    return res.status(200).send('Test webhook received and ignored.');
  }

  if (!storeUrl) {
    return res.status(400).json({ message: 'Shopify domain header is missing.' });
  }

  try {
    // await orderQueue.add('new-order', { storeUrl, orderData });
    // res.status(200).send('Webhook received.');
    await queues.orderQueue.add('new-order', { storeUrl, orderData });
    res.status(200).send('Webhook received.');
  } catch (error) {
    console.error('Failed to add order to queue:', error);
    res.status(500).send('Error processing webhook.');
  }
};

const handleNewCustomer = async (req, res) => {
  const customerData = req.body;
  const storeUrl = req.headers['x-shopify-shop-domain'];
  
  // --- NEW: Check if this is a test webhook payload ---
  if (customerData.email === 'bob@biller.com') {
    console.log('Test customer webhook received. Ignoring.');
    return res.status(200).send('Test webhook received and ignored.');
  }

  if (!storeUrl) {
    return res.status(400).json({ message: 'Shopify domain header is missing.' });
  }

  try {
    // await customerQueue.add('new-customer', { storeUrl, customerData });
    // res.status(200).send('Webhook received.');
    await queues.customerQueue.add('new-customer', { storeUrl, customerData });
    res.status(200).send('Webhook received.');
  } catch (error) {
    console.error('Failed to add customer to queue:', error);
    res.status(500).send('Error processing webhook.');
  }
};

// --- NEW: Endpoint for when an order is cancelled/refunded ---
const handleOrderCancellation = async (req, res) => {
  const orderData = req.body;
  const storeUrl = req.headers['x-shopify-shop-domain'];

  if (!storeUrl) {
    return res.status(400).json({ message: 'Shopify domain header is missing.' });
  }

  // We can ignore test webhooks here too if needed
  if (orderData.email === 'bob@biller.com') {
      console.log('Test order cancellation webhook received. Ignoring.');
      return res.status(200).send('Test webhook ignored.');
  }

  try {
    // await orderCancellationQueue.add('order-cancelled', { storeUrl, orderData });
    // res.status(200).send('Webhook received.');
    await queues.orderCancellationQueue.add('order-cancelled', { storeUrl, orderData });
    res.status(200).send('Webhook received.');
  } catch (error) {
    console.error('Failed to add order cancellation to queue:', error);
    res.status(500).send('Error processing webhook.');
  }
};

// --- NEW: Endpoint for when an order is updated (e.g., fulfilled) ---
const handleOrderUpdate = async (req, res) => {
  const orderData = req.body;
  const storeUrl = req.headers['x-shopify-shop-domain'];

  if (!storeUrl) {
    return res.status(400).json({ message: 'Shopify domain header is missing.' });
  }
  
  // To ignore test webhooks
  if (orderData.email === 'bob@biller.com') {
      console.log('Test order update webhook received. Ignoring.');
      return res.status(200).send('Test webhook ignored.');
  }

  try {
    // await orderUpdateQueue.add('order-updated', { storeUrl, orderData });
    // res.status(200).send('Webhook received.');
    await queues.orderUpdateQueue.add('order-updated', { storeUrl, orderData });
    res.status(200).send('Webhook received.');
  } catch (error) {
    console.error('Failed to add order update to queue:', error);
    res.status(500).send('Error processing webhook.');
  }
};

module.exports = {
  handleNewOrder,
  handleNewCustomer,
  handleOrderCancellation,
  handleOrderUpdate
};