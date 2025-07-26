// File: src/components/NotFound/NotFound.js
import React from 'react';
import { Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom color="error">
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Oops! The page you’re looking for doesn’t exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Go to Dashboard
      </Button>
    </Container>
  );
};

export default NotFound;
