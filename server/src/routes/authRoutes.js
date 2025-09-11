const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyEmail,getMe } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-email/:token', verifyEmail); 

router.get('/me', authMiddleware, getMe);
module.exports = router;
