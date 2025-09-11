
const express = require('express');
require('dotenv').config();

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const shopifyRoutes = require('./src/routes/shopifyRoutes');
const insightsRoutes = require('./src/routes/insightsRoutes');
const webhookRoutes = require('./src/routes/webhookRoutes');


const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5001;

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/shopify', shopifyRoutes);
app.use('/api/insights', insightsRoutes); 
app.use('/api/webhooks', webhookRoutes); 


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});