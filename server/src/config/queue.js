
// const { Queue } = require('bullmq');

// const parseRedisUrl = () => {
//   if (process.env.REDIS_URL) {
//     const redisUrl = new URL(process.env.REDIS_URL);
//     return {
//       host: redisUrl.hostname,
//       port: redisUrl.port,
//       password: redisUrl.password,
//     };
//   }
//   // Fallback for local development
//   return { host: 'localhost', port: 6379 };
// };

// const connection = parseRedisUrl();

// const queues = {
//   orderQueue: null,
//   customerQueue: null,
//   orderCancellationQueue: null,
//   orderUpdateQueue: null,
// };

// const initializeQueues = () => {
//   queues.orderQueue = new Queue('order-processing', { connection });
//   queues.customerQueue = new Queue('customer-processing', { connection });
//   queues.orderCancellationQueue = new Queue('order-cancellation-processing', { connection });
//   queues.orderUpdateQueue = new Queue('order-update-processing', { connection });
  
//   console.log('BullMQ queues initialized successfully.');
// };

// module.exports = {
//   queues,
//   initializeQueues,
// };

// server/server.js

// --- THE FINAL FIX ---
// Load environment variables FIRST, before any other code runs.
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { queues } = require('./src/config/queue'); // This can now safely use the env vars

const authRoutes = require('./src/routes/authRoutes');
const shopifyRoutes = require('./src/routes/shopifyRoutes');
const insightsRoutes = require('./src/routes/insightsRoutes');
const webhookRoutes = require('./src/routes/webhookRoutes');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL, 
  'http://localhost:5173'
];

const corsOptions = {
  origin: (origin, callback) => {
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

app.get('/', (req, res) => {
  res.status(200).send('Server is healthy and running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/shopify', shopifyRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/webhooks', webhookRoutes);

// We no longer need the lazy initialization. The library can handle it now.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});