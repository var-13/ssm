// File: src/components/Auth/OAuthCallback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const OAuthCallback = () => {
  const navigate = useNavigate();

  const exchangeToken = async (code) => {
    try {
      const res = await axios.post('http://localhost:5000/api/exchange-token', { code });
      const accessToken = res.data.access_token;
      localStorage.setItem('access_token', accessToken);
      navigate('/');
    } catch (err) {
      console.error('Token exchange failed:', err);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      exchangeToken(code);
    } else {
      console.error('Authorization code not found in URL');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Authenticating with SurveyMonkey...
      </Typography>
      <CircularProgress />
    </Container>
  );
};

export default OAuthCallback;
