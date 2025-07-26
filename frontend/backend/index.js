// File: backend/index.js
const express = require('express');
const cors = require('cors');
const exchangeTokenRoute = require('./exchangeToken');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Root Route for testing
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

// OAuth token exchange route
app.use('/api/exchange-token', exchangeTokenRoute);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
