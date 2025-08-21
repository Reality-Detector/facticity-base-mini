import { useAuth0 } from '@auth0/auth0-react';
import { usePrivy } from '@privy-io/react-auth';

const useAuth = () => {
  let auth0, privy;
  
  // Try to get Privy context first (preferred)
  try {
    privy = usePrivy();
  } catch (error) {
    privy = null;
  }
  
  // Try to get Auth0 context as fallback
  try {
    auth0 = useAuth0();
  } catch (error) {
    auth0 = null;
  }

  // Use Privy if available (preferred)
  if (privy) {
    // Map Privy's interface to match Auth0's common interface
    const privyLogout = (options = {}) => {
      // Privy's logout doesn't take returnTo parameter, handle redirect manually if needed
      privy.logout();
      if (options.returnTo) {
        setTimeout(() => {
          window.location.href = options.returnTo;
        }, 100);
      }
    };

    const privyLogin = async (options = {}) => {
      try {
        await privy.login();
        // Handle redirect after login if needed
        if (options.redirectUri || options.returnTo) {
          setTimeout(() => {
            window.location.href = options.redirectUri || options.returnTo || '/';
          }, 100);
        }
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    };

    return {
      // Authentication status - mapping Auth0 properties to Privy
      isLoading: privy.loading,
      isAuthenticated: privy.authenticated,
      error: null, // Privy handles errors differently
      
      // User information - mapping Auth0 user structure to Privy
      user: privy.user ? {
        // Map Auth0's user.sub to Privy's user.id
        sub: privy.user.id,
        // Map Auth0's user.email to Privy's user.email.address
        email: privy.user.email?.address || privy.user.email,
        // Map other common Auth0 user fields
        name: privy.user.name || '',
        picture: privy.user.picture || '',
        email_verified: privy.user.email?.verified || false,
        // Keep original Privy user object for advanced usage
        ...privy.user,
        // Override with mapped values to ensure consistency
        id: privy.user.id // Some code might check user.id instead of user.sub
      } : null,
      
      // Authentication methods - mapping Auth0 methods to Privy
      loginWithRedirect: privyLogin,
      loginWithPopup: privyLogin, // Both Auth0 methods map to Privy's single login method
      logout: privyLogout,
      
      // Token methods
      getAccessTokenSilently: async (options = {}) => {
        try {
          return await privy.getAccessToken() || null;
        } catch (error) {
          console.error('Failed to get access token:', error);
          return null;
        }
      },
      
      // Additional Privy-specific methods (for advanced usage)
      connectWallet: privy.connectWallet,
      linkEmail: privy.linkEmail,
      linkWallet: privy.linkWallet,
      unlinkEmail: privy.unlinkEmail,
      unlinkWallet: privy.unlinkWallet,
      ready: privy.ready,
      
      // Provider identification
      _provider: 'privy',
      _original: privy
    };
  }

  // Return Auth0 interface (fallback when Privy is not available)
  if (auth0) {
    return {
      ...auth0,
      // Ensure consistent user structure
      user: auth0.user ? {
        ...auth0.user,
        // Add id field for consistency (some code might use user.id instead of user.sub)
        id: auth0.user.sub
      } : null,
      _provider: 'auth0',
      _original: auth0
    };
  }

  // Fallback if neither provider is available or working properly
  return {
    isLoading: false,
    isAuthenticated: false,
    error: new Error(`No auth provider available. Privy: ${!!privy}, Auth0: ${!!auth0}`),
    user: null,
    loginWithRedirect: () => console.warn('No auth provider available'),
    loginWithPopup: () => console.warn('No auth provider available'),
    logout: () => console.warn('No auth provider available'),
    getAccessTokenSilently: async () => null,
    _provider: 'none',
    _original: null
  };
};

export default useAuth; 