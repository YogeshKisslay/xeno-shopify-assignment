
const express = require('express');
const cors = require('cors'); // Import cors
require('dotenv').config();

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const shopifyRoutes = require('./src/routes/shopifyRoutes');
const insightsRoutes = require('./src/routes/insightsRoutes');
const webhookRoutes = require('./src/routes/webhookRoutes');

const app = express();

// --- NEW: Professional CORS Configuration ---
// This tells our server to only accept requests from our live Vercel frontend.
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  'http://localhost:5173' // Also allow our local dev server
];

const corsOptions = {
  origin: (origin, callback) => {
    // The 'origin' is the URL of the site making the request (e.g., your Vercel URL)
    // We allow the request if the origin is in our list, or if there's no origin (like a Postman request)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions)); 
app.use(express.json());

const PORT = process.env.PORT || 5001;

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/shopify', shopifyRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/webhooks', webhookRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});