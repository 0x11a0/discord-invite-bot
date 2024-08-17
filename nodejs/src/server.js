const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const logger = require('./logger');
require('dotenv').config(); // Load environment variables from .env

const { createChannel } = require('./api');

const app = express();
app.use(express.json());

// Set up morgan for HTTP request logging
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Define a rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

// Apply the rate limiter to all requests
app.use(limiter);

// API routes
app.post('/api/create-channel', createChannel);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});