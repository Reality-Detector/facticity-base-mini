/**
 * Utility functions for handling Auth0 authentication errors
 */

/**
 * Handles Auth0 token errors and provides appropriate logging and suggestions
 * @param {Error} error - The error object from Auth0
 * @param {string} context - The context where the error occurred (e.g., 'token fetch', 'subscription fetch')
 */
export const handleAuth0Error = (error, context = 'authentication') => {
  console.error(`Error in ${context}:`, error);
  
  // Check for specific Auth0 error types
  if (error.message && error.message.includes('Missing Refresh Token')) {
    console.warn(`Refresh token missing in ${context}. User may need to log out and log back in to get a new refresh token.`);
    return {
      type: 'MISSING_REFRESH_TOKEN',
      message: 'Refresh token is missing. Please log out and log back in.',
      requiresReauth: true
    };
  }
  
  if (error.message && error.message.includes('Consent required')) {
    console.warn(`Consent required in ${context}. User needs to grant additional permissions.`);
    return {
      type: 'CONSENT_REQUIRED',
      message: 'Additional permissions are required. Please log out and log back in.',
      requiresReauth: true
    };
  }
  
  if (error.message && error.message.includes('Login required')) {
    console.warn(`Login required in ${context}. User needs to authenticate.`);
    return {
      type: 'LOGIN_REQUIRED',
      message: 'Please log in to continue.',
      requiresReauth: true
    };
  }
  
  // Generic error
  return {
    type: 'UNKNOWN_ERROR',
    message: 'An authentication error occurred. Please try again.',
    requiresReauth: false
  };
};

/**
 * Safely gets an access token with error handling
 * @param {Function} getAccessTokenSilently - Auth0's getAccessTokenSilently function
 * @param {string} context - The context where the token is being fetched
 * @returns {Promise<string|null>} - The access token or null if failed
 */
export const getTokenSafely = async (getAccessTokenSilently, context = 'token fetch') => {
  try {
    const token = await getAccessTokenSilently();
    return token;
  } catch (error) {
    const errorInfo = handleAuth0Error(error, context);
    
    // You could trigger a logout or show a user-friendly message here
    if (errorInfo.requiresReauth) {
      // Optionally trigger logout or show reauth message
      console.warn('Re-authentication may be required:', errorInfo.message);
    }
    
    return null;
  }
};

/**
 * Clears Auth0-related data from localStorage to force a fresh authentication
 * This is useful when users have old tokens without the required scope
 */
export const clearAuth0Data = () => {
  try {
    // Clear Auth0-specific localStorage items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('auth0') || key.includes('Auth0') || key.includes('@@auth0spajs'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('Cleared Auth0 data from localStorage');
    return true;
  } catch (error) {
    console.error('Error clearing Auth0 data:', error);
    return false;
  }
};

/**
 * Attempts to get a token with fallback strategies
 * @param {Function} getAccessTokenSilently - Auth0's getAccessTokenSilently function
 * @param {Function} logout - Auth0's logout function (optional)
 * @param {string} context - The context where the token is being fetched
 * @returns {Promise<{token: string|null, needsReauth: boolean}>} - Token and reauth flag
 */
export const getTokenWithFallback = async (getAccessTokenSilently, logout = null, context = 'token fetch') => {
  try {
    const token = await getAccessTokenSilently();
    return { token, needsReauth: false };
  } catch (error) {
    const errorInfo = handleAuth0Error(error, context);
    
    // Dispatch custom event for UI components to listen to
    if (errorInfo.requiresReauth) {
      window.dispatchEvent(new CustomEvent('auth-error', {
        detail: {
          type: 'AUTH_ERROR',
          message: errorInfo.message,
          errorType: errorInfo.type
        }
      }));
    }
    
    if (errorInfo.type === 'MISSING_REFRESH_TOKEN') {
      // Try to clear old Auth0 data and suggest re-authentication
      clearAuth0Data();
      
      if (logout) {
        console.log('Attempting to logout user to resolve refresh token issue...');
        try {
          await logout({ returnTo: window.location.origin });
          return { token: null, needsReauth: true };
        } catch (logoutError) {
          console.error('Error during logout:', logoutError);
        }
      }
      
      return { token: null, needsReauth: true };
    }
    
    return { token: null, needsReauth: errorInfo.requiresReauth };
  }
}; 