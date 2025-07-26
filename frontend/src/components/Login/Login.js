// File: src/components/Login/Login.js
import React from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

const Login = () => {
  const clientId = process.env.REACT_APP_SURVEYMONKEY_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_SURVEYMONKEY_REDIRECT_URI;

  const handleLogin = () => {
    const authUrl = `https://api.surveymonkey.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    window.location.href = authUrl;
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 5,
          width: 400,
          borderRadius: 4,
          textAlign: 'center'
        }}
      >
        <img
          src="https://www.go-cart.com.au/wp-content/uploads/2017/12/surveymonkey-logo.png"
          alt="SurveyMonkey Logo"
          style={{ width: '160px', marginBottom: '20px' }}
        />

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Login to View Your SurveyMonkey Data
        </Typography>

        <Button
          variant="contained"
          startIcon={<LoginIcon />}
          onClick={handleLogin}
          sx={{
            mt: 3,
            backgroundColor: '#00bf6f',
            '&:hover': { backgroundColor: '#009e5d' },
            px: 4,
            py: 1.5,
            fontWeight: 'bold'
          }}
        >
          Login with SurveyMonkey
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
