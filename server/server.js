// server/server.js

const express = require('express');
require('dotenv').config();

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const shopifyRoutes = require('./src/routes/shopifyRoutes');
const insightsRoutes = require('./src/routes/insightsRoutes'); // Import new routes
const webhookRoutes = require('./src/routes/webhookRoutes'); // Import webhook routes


const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5001;

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/shopify', shopifyRoutes);
app.use('/api/insights', insightsRoutes); // Use the new routes
app.use('/api/webhooks', webhookRoutes); // Use the webhook routes


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});