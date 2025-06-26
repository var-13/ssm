// backend/exchangeToken.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

router.post('/', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post(
      'https://api.surveymonkey.com/oauth/token',
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error('OAuth exchange failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'OAuth exchange failed' });
  }
});

module.exports = router;
