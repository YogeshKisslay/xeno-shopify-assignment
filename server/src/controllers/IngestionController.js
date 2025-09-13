const prisma = require('../config/db');
const { getCustomers, getProducts, getOrders } = require('../services/shopifyService');

const startInitialIngestion = async (req, res) => {
  console.log('Starting initial data ingestion for a new user...');
  const storeUrl = process.env.SHOPIFY_STORE_URL;
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  try {
    let store = await prisma.store.findUnique({ where: { storeUrl } });
    if (!store) {
        store = await prisma.store.create({
            data: {
                storeUrl,
                accessToken, // Note: In a real app, you'd encrypt this!
                shopifyId: "temp-id-" + Date.now(), // Placeholder
            },
        });
        console.log('Created a new store record in the database.');
    }

    if (store.hasIngestedInitialData) {
      console.log('Data already ingested. Skipping.');
      return res.status(200).json({ message: 'Initial data has already been ingested.' });
    }

    console.log('Fetching all historical data from Shopify...');
    const [shopifyCustomers, shopifyProducts, shopifyOrders] = await Promise.all([
      getCustomers(storeUrl, accessToken),
      getProducts(storeUrl, accessToken),
      getOrders(storeUrl, accessToken)
    ]);
    console.log(`Fetched: ${shopifyCustomers.length} customers, ${shopifyProducts.length} products, ${shopifyOrders.length} orders.`);

    // Ingest Customers
    for (const customer of shopifyCustomers) {
        const customerData = {
            shopifyId: `gid://shopify/Customer/${customer.id}`,
            email: customer.email,
            firstName: customer.first_name,
            lastName: customer.last_name,
            totalSpent: parseFloat(customer.total_spent),
            ordersCount: customer.orders_count,
            storeId: store.id,
        };
        await prisma.customer.upsert({
            where: { shopifyId: customerData.shopifyId },
            update: customerData,
            create: customerData,
        });
    }
    console.log('Customers saved.');

    // Ingest Products
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
    console.log('Products saved.');

    // Ingest Orders
    for (const order of shopifyOrders) {
        if (!order.customer) continue;
        const customerShopifyId = `gid://shopify/Customer/${order.customer.id}`;
        const customer = await prisma.customer.findUnique({ where: { shopifyId: customerShopifyId } });
        if (!customer) continue;

        const orderData = {
            shopifyId: `gid://shopify/Order/${order.id}`,
            totalPrice: parseFloat(order.total_price),
            fulfillmentStatus: order.fulfillment_status || 'unfulfilled',
            processedAt: new Date(order.processed_at),
            storeId: store.id,
            customerId: customer.id,
        };
        await prisma.order.upsert({
            where: { shopifyId: orderData.shopifyId },
            update: orderData,
            create: orderData,
        });
    }
    console.log('Orders saved.');

    // Mark the ingestion as complete
    await prisma.store.update({
      where: { id: store.id },
      data: { hasIngestedInitialData: true },
    });
    console.log('Initial ingestion complete. Flag set to true.');
    
    res.status(200).json({ message: 'Initial data ingestion completed successfully!' });

  } catch (error) {
    console.error('--- INITIAL INGESTION ERROR ---', error);
    res.status(500).json({ message: 'Error during initial data ingestion.', error: error.message });
  }
};

module.exports = {
  startInitialIngestion,
};
