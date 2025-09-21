'use client'; // marks this component as client component
import { ThemeProvider } from '@mui/material/styles';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import theme from '@/theme';
import { AppProvider } from '@/AppProvider'; // if default export, adjust
import AuthWrapper from '@/auth/AuthWrapper'; // your existing dual-auth wrapper if any
import Walkthrough from '@/Walkthrough';

export default function ClientProviders({ children }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: 'auto',
          theme: 'default',
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
      }}
      miniKit={{ enabled: true }}
    >
      <AuthWrapper usePrivy={true}>
        <AppProvider>
          <ThemeProvider theme={theme}>
            {children}
            <Walkthrough />
          </ThemeProvider>
        </AppProvider>
      </AuthWrapper>
    </OnchainKitProvider>
  );
}
