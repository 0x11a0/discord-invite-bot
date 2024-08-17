const express = require('express');
const rateLimit = require('express-rate-limit');
const { createChannel, verifyUser } = require('./api');

const app = express();
app.use(express.json());

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
app.post('/api/verify-user', verifyUser);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));