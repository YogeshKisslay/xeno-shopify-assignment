const express = require('express');
const router = express.Router();
const { startInitialIngestion } = require('../controllers/ingestionController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/start', authMiddleware, startInitialIngestion);

module.exports = router;
