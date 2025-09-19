import React, { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { Box, Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Snackbar, Alert, AppBar, Toolbar, IconButton, useTheme, useMediaQuery } from '@mui/material'
import { useAppContext } from './AppProvider';
import '@/styles/Subscription.css'; // Import the CSS file that contains the overlay styles
import { useRouter } from 'next/navigation';
import ArrowBack from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useAuth from './auth/useAuthHook';
import Credits from './components/Credits';

const Api = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  // Replace with actual data fetching or state management logic
  const [apiKey, setApiKey] = useState('YOUR_API_KEY');
  const [remainingTokens, setRemainingTokens] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const { backendUrl, accessToken, userCredits, creditsLoading } = useAppContext();
  // Add state for overlay and form
  const [showOverlay, setShowOverlay] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (isAuthenticated && user) {
      // Call the backend API to create or fetch the API key and tokens
      createOrFetchApiKey(user.email);
    }
  }, [isAuthenticated, user]);

  const createOrFetchApiKey = async (email) => {
    try {
      const response = await fetch('/api/create_api_key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setRemainingTokens(data.tokens);
        setApiKey(data.api_key)
      } else {
        console.error('Failed to create or fetch API key');
      }
    } catch (error) {
      console.error('Error creating or fetching API key:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      date: new Date().toLocaleString("en-SG", { timeZone: "Asia/Singapore" })
    };

    try {
      const response = await fetch('/api/submit-contact-form', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });

      const data = await response.json();
      if (data.success) {
        setSnackbarMessage("Form submitted successfully, thank you for contacting us, we will get back soon!");
        setSnackbarSeverity("success");
        setShowOverlay(false);
      } else {
        setSnackbarMessage("Something went wrong. Please try again.");
        setSnackbarSeverity("error");
      }
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Error submitting form. Please check your connection.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFF' }}>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          borderBottom: '1px solid rgba(0, 102, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ minHeight: '50px !important', justifyContent: 'space-between', paddingX: { xs: 2, sm: 4 } }}>
          <Box sx={{ width: { xs: 40, md: 60 }, display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => router.push('/')}
              sx={{
                color: '#0066FF',
                background: 'rgba(0, 102, 255, 0.08)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 102, 255, 0.15)',
                ml: 0.5,
                '&:hover': { 
                  background: 'rgba(0, 102, 255, 0.12)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out'
                },
              }}
              size="small"
            >
              <ArrowBack />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Box 
              onClick={() => navigate('/')} 
              sx={{ 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8
                }
              }}
            >
              <img
                src="https://see.fontimg.com/api/rf5/KVdLp/YzgwNzgzNWY1N2M2NDc1MzgzNTExOWYzMWFkY2ViMmQudHRm/QVJBSVNUT1RMRQ/spartacus.png?r=fs&h=98&w=1500&fg=0066FF&bg=FFFFFF&tb=1&s=65"
                alt="ARAISTOTLE"
                style={{
                  paddingTop: '2px',
                  width: 'auto',
                  height: isMdUp ? '28px' : '24px',
                  transition: 'all 0.3s ease-in-out',
                }}
              />
            </Box>
            
          </Box>
          {isAuthenticated && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ml: 2,
                gap: 1,
              }}
            >
              <IconButton 
                onClick={() => router.push('/rewards')} 
                size="small" 
                sx={{ 
                  color: '#0066FF',
                  background: 'rgba(0, 102, 255, 0.08)',
                  '&:hover': { background: 'rgba(0, 102, 255, 0.12)' }
                }}
              >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
              <Credits credits={userCredits} isLoading={creditsLoading} />
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 4 }}>
        <Grid container spacing={2} justifyContent="center">
        {/* Left Spacer Column */}
        <Grid item xs={12} md={1}></Grid>

        {/* Center Content Box */}
        <Grid item xs={12} md={10}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              API Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>API Key:</strong> {apiKey}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  <strong>Remaining Tokens:</strong> {remainingTokens}
                </Typography>
              </Grid>
            </Grid>

            {/* Additional Details */}
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Model Versions and Token Usage
            </Typography>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Version</strong></TableCell>
                    <TableCell><strong>Accuracy</strong></TableCell>
                    <TableCell><strong>Token Usage per Request</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>v3</TableCell>
                    <TableCell>92%</TableCell>
                    <TableCell>1 Token</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>v2</TableCell>
                    <TableCell>85%</TableCell>
                    <TableCell>0.5 Token</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Endpoint</strong></TableCell>
                    <TableCell><strong>-</strong></TableCell>
                    <TableCell><strong>Token Usage</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Claim Extraction</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>1 Token per 1,000,000 characters processed</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Explanation of Token Usage */}
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              Each API request for fact-checking will require a specific number of tokens depending on the model chosen:
              <ul>
                <li>Version v3 (92% accuracy) requires 1 token per request.</li>
                <li>Version v2 (85% accuracy) requires 0.5 tokens per request.</li>
              </ul>
              Choose the version that best suits your accuracy needs and token availability.
            </Typography>

            {/* Book an Intro Button */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowOverlay(true)}
                sx={{
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Spacer Column */}
        <Grid item xs={12} md={1}></Grid>
      </Grid>

      {/* Swagger UI */}
      <SwaggerUI url={`${process.env.PUBLIC_URL}/swagger.yaml`} />
      </Box>

      {/* Contact Form Overlay */}
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <button 
              className="close-button" 
              onClick={() => setShowOverlay(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              ×
            </button>
            <p className="contact-text">Email us at <a href="mailto:enquiries@aiseer.co">enquiries@aiseer.co</a></p>
            <hr className="divider" />
            <p className="contact-text">
              Set up a meeting at <a href="https://www.calendly.com/aiseer.co" target="_blank" rel="noopener noreferrer">Calendly</a>
            </p>
            <hr className="divider" />

            {success ? (
              <p className="success-message">Your message has been sent!</p>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <label>Name:</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-row">
                  <label>Email:</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-row">
                  <label>Message:</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required />
                </div>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Submit"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
            </Snackbar>
    </Box>
  );
};

export default Api;
