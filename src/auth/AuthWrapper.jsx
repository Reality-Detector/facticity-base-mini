"use client";
import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

// Create centralized Wagmi configuration
export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    metaMask(),
    // WalletConnect removed to avoid 403 errors with placeholder project ID
    // Add back when you have a real WalletConnect project ID:
    // walletConnect({
    //   projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    // }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

// Create a client for React Query
const queryClient = new QueryClient();

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
          // Configure supported chains - Base Mainnet
          supportedChains: [base],
          // Set default chain to Base Mainnet
          defaultChain: base,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            {children}
          </WagmiProvider>
        </QueryClientProvider>
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
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
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