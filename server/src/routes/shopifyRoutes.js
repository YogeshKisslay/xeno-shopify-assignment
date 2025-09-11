
const express = require('express');
const router = express.Router();
const { testConnection } = require('../services/shopifyService');
const { ingestCustomers, ingestProducts,ingestOrders} = require('../controllers/IngestionController'); 
const { authMiddleware } = require('../middleware/authMiddleware');

// getting shofiy store data from testconncetion (just to test connection)
router.get('/test', authMiddleware,async (req, res) => {
  try {
    const shopData = await testConnection();
    res.json(shopData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/ingest/customers',authMiddleware, ingestCustomers);
router.post('/ingest/products',authMiddleware, ingestProducts);
router.post('/ingest/orders',authMiddleware, ingestOrders);
module.exports = router;