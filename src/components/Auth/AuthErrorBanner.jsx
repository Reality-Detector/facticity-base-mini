import useAuth from '../../auth/useAuthHook';
import React, { useState, useEffect } from 'react';

const AuthErrorBanner = ({ error, onRetry, onDismiss }) => {
  const { logout } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Listen for authentication errors
    const handleAuthError = (event) => {
      if (event.detail && event.detail.type === 'AUTH_ERROR') {
        setErrorMessage(event.detail.message);
        setShowBanner(true);
      }
    };

    window.addEventListener('auth-error', handleAuthError);
    return () => window.removeEventListener('auth-error', handleAuthError);
  }, []);

  const handleLogout = async () => {
    try {
      await logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#f44336',
      color: 'white',
      padding: '12px 20px',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px'
    }}>
      <div style={{ flex: 1 }}>
        <strong>Authentication Issue:</strong> {errorMessage}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'white',
            color: '#f44336',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          Log Out & Re-login
        </button>
        <button
          onClick={handleDismiss}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default AuthErrorBanner; 