// src/services/shopifyService.js
const axios = require('axios');

// Function to test the Shopify API connection
const testConnection = async () => {
  try {
    const shopUrl = `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/shop.json`;
    const response = await axios.get(shopUrl, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error connecting to Shopify:', error.response ? error.response.data : error.message);
    throw new Error('Failed to connect to Shopify API');
  }
};

// Function to fetch customers from Shopify
const getCustomers = async (storeUrl, accessToken) => {
  try {
    const shopifyApiUrl = `https://${storeUrl}/admin/api/2024-04/customers.json`;
    const response = await axios.get(shopifyApiUrl, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
      },
    });
    return response.data.customers;
  } catch (error) {
    console.error('Error fetching customers from Shopify:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch customers from Shopify');
  }
};


// Function to fetch products from Shopify
const getProducts = async (storeUrl, accessToken) => {
  try {
    const shopifyApiUrl = `https://${storeUrl}/admin/api/2024-04/products.json`;
    const response = await axios.get(shopifyApiUrl, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
      },
    });
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products from Shopify:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch products from Shopify');
  }
};

const getOrders = async (storeUrl, accessToken) => {
  try {
    // We add status=any to fetch all orders, not just open ones
    const shopifyApiUrl = `https://${storeUrl}/admin/api/2024-04/orders.json?status=any`;
    const response = await axios.get(shopifyApiUrl, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
      },
    });
    return response.data.orders;
  } catch (error) {
    console.error('Error fetching orders from Shopify:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch orders from Shopify');
  }
};

module.exports = {
  testConnection,
  getCustomers, 
  getProducts,
  getOrders,
};