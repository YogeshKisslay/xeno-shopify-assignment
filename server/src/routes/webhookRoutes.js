// server/src/routes/webhookRoutes.js

const express = require('express');
const router = express.Router();
const { handleNewOrder, handleNewCustomer} = require('../controllers/webhookController');

// Note: Shopify webhook verification should be added here in a real app
router.post('/order-created', handleNewOrder);
router.post('/customer-created', handleNewCustomer); // Add the new route
module.exports = router;