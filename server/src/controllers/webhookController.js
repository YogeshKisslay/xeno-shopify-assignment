

const { 
  orderQueue, 
  customerQueue, 
  orderCancellationQueue, 
  orderUpdateQueue 
} = require('../config/queue');

// This is a new helper function to check for the test header
const isTestWebhook = (req) => {
  return req.headers['x-shopify-test'] === 'true';
};

const handleNewOrder = async (req, res) => {
  if (isTestWebhook(req)) {
    console.log('Test "Order Creation" webhook received. Ignoring.');
    return res.status(200).send('Test webhook received and ignored.');
  }

  const orderData = req.body;
  const storeUrl = req.headers['x-shopify-shop-domain'];
  if (!storeUrl) return res.status(400).json({ message: 'Shopify domain header is missing.' });

  try {
    await orderQueue.add('new-order', { storeUrl, orderData });
    res.status(200).send('Webhook received.');
  } catch (error) {
    console.error('Failed to add order to queue:', error);
    res.status(500).send('Error processing webhook.');
  }
};

const handleNewCustomer = async (req, res) => {
  if (isTestWebhook(req)) {
    console.log('Test "Customer Creation" webhook received. Ignoring.');
    return res.status(200).send('Test webhook received and ignored.');
  }

  const customerData = req.body;
  const storeUrl = req.headers['x-shopify-shop-domain'];
  if (!storeUrl) return res.status(400).json({ message: 'Shopify domain header is missing.' });
  
  try {
    await customerQueue.add('new-customer', { storeUrl, customerData });
    res.status(200).send('Webhook received.');
  } catch (error) {
    console.error('Failed to add customer to queue:', error);
    res.status(500).send('Error processing webhook.');
  }
};

const handleOrderCancellation = async (req, res) => {
  if (isTestWebhook(req)) {
    console.log('Test "Order Cancellation" webhook received. Ignoring.');
    return res.status(200).send('Test webhook received and ignored.');
  }
  
  const orderData = req.body;
  const storeUrl = req.headers['x-shopify-shop-domain'];
  if (!storeUrl) return res.status(400).json({ message: 'Shopify domain header is missing.' });

  try {
    await orderCancellationQueue.add('order-cancelled', { storeUrl, orderData });
    res.status(200).send('Webhook received.');
  } catch (error) {
    console.error('Failed to add order cancellation to queue:', error);
    res.status(500).send('Error processing webhook.');
  }
};

const handleOrderUpdate = async (req, res) => {
  if (isTestWebhook(req)) {
    console.log('Test "Order Update" webhook received. Ignoring.');
    return res.status(200).send('Test webhook received and ignored.');
  }

  const orderData = req.body;
  const storeUrl = req.headers['x-shopify-shop-domain'];
  if (!storeUrl) return res.status(400).json({ message: 'Shopify domain header is missing.' });
  
  try {
    await orderUpdateQueue.add('order-updated', { storeUrl, orderData });
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
  handleOrderUpdate,
};