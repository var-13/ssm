// File: src/App.js
import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import SurveyDetails from './components/SurveyDetails/SurveyDetails';
import OAuthCallback from './components/Auth/OAuthCallback';
import NotFound from './components/NotFound/NotFound';

const App = () => {
  const [mode, setMode] = useState('light');

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === 'light' ? '#f9f9f9' : '#121212'
          }
        }
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard toggleMode={toggleMode} />} />
          <Route path="/login" element={<Login toggleMode={toggleMode} />} />
          <Route path="/survey/:id" element={<SurveyDetails toggleMode={toggleMode} />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          
          {/* 🔥 Catch-all 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
