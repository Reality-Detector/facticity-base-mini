import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../useAuthHook';
import { CircularProgress, Box, Typography } from '@mui/material';

const SignupEmailRedirect = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }

    // Trigger Auth0 signup redirect specifically for email/password
    const handleEmailSignup = async () => {
      try {
        await loginWithRedirect({
          authorizationParams: {
            screen_hint: 'signup', // Show signup screen
            connection: 'Username-Password-Authentication', // Force email/password authentication
          }
        });
        // Note: After redirect, user will return to the redirect_uri (home page)
      } catch (error) {
        console.error('Email signup redirect failed:', error);
        // On error, redirect to home
        navigate('/', { replace: true });
      }
    };

    // Small delay to ensure page loads properly before triggering redirect
    const timer = setTimeout(handleEmailSignup, 500);

    return () => clearTimeout(timer);
  }, [loginWithRedirect, navigate, isAuthenticated]);

  // Show loading spinner while processing
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="h6" color="textSecondary">
        Opening email signup...
      </Typography>
    </Box>
  );
};

export default SignupEmailRedirect; 