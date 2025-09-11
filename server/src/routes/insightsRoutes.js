
const express = require('express');
const router = express.Router();
const { getKpis, getTopCustomers,getOrdersOverTime } = require('../controllers/insightsController');
const { authMiddleware } = require('../middleware/authMiddleware');


router.use(authMiddleware);

router.get('/kpis', getKpis);
router.get('/top-customers', getTopCustomers);
router.get('/orders-over-time', getOrdersOverTime); 
module.exports = router;