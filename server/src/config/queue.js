
const { Queue } = require('bullmq');
// This is a robust function to parse a Redis URL string.
const parseRedisUrl = (redisUrl) => {
  if (!redisUrl) {
    // Fallback for local development if REDIS_URL is not set
    return { host: 'localhost', port: 6379 };
  }
  try {
    const url = new URL(redisUrl);
    const connectionOptions = {
      host: url.hostname,
      port: Number(url.port),
      password: url.password,
    };


    // If the protocol is 'rediss:', it means we need a secure TLS connection.
    // Railway and Upstash both require this for public connections.
    if (url.protocol === 'rediss:') {
      connectionOptions.tls = {};
    }

    return connectionOptions;
  } catch (e) {
    console.error("Invalid REDIS_URL, falling back to localhost");
    return { host: 'localhost', port: 6379 };
  }
};

const connection = parseRedisUrl(process.env.REDIS_URL);
// We now pass the correctly formatted connection object.
const orderQueue = new Queue('order-processing', { connection });
const customerQueue = new Queue('customer-processing', { connection });
const orderCancellationQueue = new Queue('order-cancellation-processing', { connection });
const orderUpdateQueue = new Queue('order-update-processing', { connection });

module.exports = {
  orderQueue,
  customerQueue,
  orderCancellationQueue,
  orderUpdateQueue,
};