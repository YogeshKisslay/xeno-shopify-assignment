
const express = require('express');
const router = express.Router();
const { handleNewOrder, handleNewCustomer, handleOrderCancellation,handleOrderUpdate} = require('../controllers/webhookController');

router.post('/order-created', handleNewOrder);
router.post('/customer-created', handleNewCustomer);
router.post('/order-cancelled', handleOrderCancellation);
router.post('/order-updated', handleOrderUpdate);
module.exports = router;