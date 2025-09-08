import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../../auth/useAuthHook';
import { CircularProgress, Box, Typography } from '@mui/material';

const SignupRedirect = () => {
  const router = useRouter();
  const { loginWithRedirect, isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      router.replace('/');
      return;
    }

    // Trigger Auth0 signup redirect with screen_hint to show signup screen
    const handleSignup = async () => {
      try {
        await loginWithRedirect({
          authorizationParams: {
            screen_hint: 'signup', // This tells Auth0 to show the signup screen
          }
        });
        // Note: After redirect, user will return to the redirect_uri (home page)
        // No need to manually navigate here as the redirect handles it
      } catch (error) {
        console.error('Signup redirect failed:', error);
        // On error, redirect to home
        router.replace('/');
      }
    };

    // Small delay to ensure page loads properly before triggering redirect
    const timer = setTimeout(handleSignup, 500);

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
        Opening signup...
      </Typography>
    </Box>
  );
};

export default SignupRedirect; 