// // server/server.js

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');

// const authRoutes = require('./src/routes/authRoutes');
// const shopifyRoutes = require('./src/routes/shopifyRoutes');
// const insightsRoutes = require('./src/routes/insightsRoutes');
// const webhookRoutes = require('./src/routes/webhookRoutes');

// const app = express();

// const allowedOrigins = [
//   process.env.FRONTEND_URL, 
//   'http://localhost:5173'
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

// app.use(cors(corsOptions));
// app.use(express.json());

// const PORT = process.env.PORT || 5001;

// app.get('/', (req, res) => {
//   res.status(200).send('Server is healthy and running!');
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/shopify', shopifyRoutes);
// app.use('/api/insights', insightsRoutes);
// app.use('/api/webhooks', webhookRoutes);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// server/server.js

// --- FINAL DEBUGGING STEP ---
// This will print all available environment variables to the log
console.log("--- RAILWAY ENVIRONMENT VARIABLES (API SERVER) ---");
console.log(process.env);
console.log("-------------------------------------------------");

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { orderQueue, customerQueue, orderCancellationQueue, orderUpdateQueue } = require('./src/config/queue');
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});