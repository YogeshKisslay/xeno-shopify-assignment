// src/controllers/ingestionController.js
const prisma = require('../config/db');
const { getCustomers, getProducts,getOrders } = require('../services/shopifyService');


const ingestCustomers = async (req, res) => {
  // For now, we will hardcode the store details. Later, this will be dynamic.
  const storeUrl = process.env.SHOPIFY_STORE_URL;
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  try {
    // Step 1: Find our store in the DB, or create it if it doesn't exist
    let store = await prisma.store.findUnique({ where: { storeUrl } });
    if (!store) {
      store = await prisma.store.create({
        data: {
          storeUrl,
          // In a real app, encrypt the access token!
          accessToken,
          // We'll add a placeholder for shopifyId for now
          shopifyId: "temp-id-" + Date.now(),
        },
      });
    }

    // Step 2: Fetch customers from Shopify
    const shopifyCustomers = await getCustomers(storeUrl, accessToken);

    // Step 3: Transform Shopify data to match our Prisma model
    const customerData = shopifyCustomers.map(customer => ({
      shopifyId: `gid://shopify/Customer/${customer.id}`, // Create a unique shopifyId
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name,
      totalSpent: parseFloat(customer.total_spent),
      ordersCount: customer.orders_count,
      storeId: store.id, // Link to our store
    }));

    // Step 4: Save the customers to our database
    // Use upsert to avoid creating duplicates if we run this again
    for (const data of customerData) {
      await prisma.customer.upsert({
        where: { shopifyId: data.shopifyId },
        update: data,
        create: data,
      });
    }

    res.status(200).json({
      message: 'Customer data ingested successfully!',
      count: customerData.length,
      data: customerData,
    });

  } catch (error) {
    res.status(500).json({ message: 'Error ingesting customer data', error: error.message });
  }
};


const ingestProducts = async (req, res) => {
  const storeUrl = process.env.SHOPIFY_STORE_URL;

  try {
    // Find our store in the database
    const store = await prisma.store.findUnique({ where: { storeUrl } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found. Please ingest customers first.' });
    }

    // Fetch products from Shopify
    const shopifyProducts = await getProducts(store.storeUrl, store.accessToken);

    // Transform and save to our database
    for (const product of shopifyProducts) {
      const productData = {
        shopifyId: `gid://shopify/Product/${product.id}`,
        title: product.title,
        vendor: product.vendor,
        storeId: store.id,
      };
      await prisma.product.upsert({
        where: { shopifyId: productData.shopifyId },
        update: productData,
        create: productData,
      });
    }

    res.status(200).json({
      message: 'Product data ingested successfully!',
      count: shopifyProducts.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error ingesting product data', error: error.message });
  }
};


const ingestOrders = async (req, res) => {
  const storeUrl = process.env.SHOPIFY_STORE_URL;

  try {
    const store = await prisma.store.findUnique({ where: { storeUrl } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    const shopifyOrders = await getOrders(store.storeUrl, store.accessToken);

    for (const order of shopifyOrders) {
      if (!order.customer) continue; // Skip orders with no customer

      // Find the corresponding customer in our database
      const customerShopifyId = `gid://shopify/Customer/${order.customer.id}`;
      const customer = await prisma.customer.findUnique({
        where: { shopifyId: customerShopifyId },
      });

      if (!customer) continue; // Skip if we haven't ingested the customer yet

      const orderData = {
        shopifyId: `gid://shopify/Order/${order.id}`,
        totalPrice: parseFloat(order.total_price),
        fulfillmentStatus: order.fulfillment_status || 'unfulfilled',
        processedAt: new Date(order.processed_at),
        storeId: store.id,
        customerId: customer.id, // Link to the customer in our DB
      };

      await prisma.order.upsert({
        where: { shopifyId: orderData.shopifyId },
        update: orderData,
        create: orderData,
      });
    }

    res.status(200).json({
      message: 'Order data ingested successfully!',
      count: shopifyOrders.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error ingesting order data', error: error.message });
  }
};

module.exports = {
  ingestCustomers,
  ingestProducts,
    ingestOrders,
};