import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { PrivyProvider } from '@privy-io/react-auth';

const AuthWrapper = ({ children, usePrivy = false }) => {
  // Check environment variable to determine auth provider
  const shouldUsePrivy = usePrivy ;

  if (shouldUsePrivy) {
    return (
      <PrivyProvider
        appId={"cmcbmq4ea0197gs0lfur2kew5"}
        config={{
          // Customize Privy's appearance in your app
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
          },
          // Create embedded wallets for users who don't have a wallet
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
          // Configure login methods
          loginMethods: ['email', 'wallet', 'twitter'],
        }}
      >
        {children}
      </PrivyProvider>
    );
  }

  // Default to Auth0 provider
  return (
    <Auth0Provider
      domain="dev-5h33aun.us.auth0.com"
      // domain="auth.facticity.ai"
      clientId="fvsQ9DT16eWAbmF6IL6ZApvkpdgjtf3L"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://backend.facticity.ai',
        scope: 'openid profile email offline_access'
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthWrapper; 