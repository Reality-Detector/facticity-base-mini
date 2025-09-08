'use client'; // marks this component as client component
import { ThemeProvider } from '@mui/material/styles';
import { PrivyProvider } from '@privy-io/react-auth';
import theme from '@/theme';
import { AppProvider } from '@/AppProvider'; // if default export, adjust
import AuthWrapper from '@/auth/AuthWrapper'; // your existing dual-auth wrapper if any

export default function ClientProviders({ children }) {
  return (
    <PrivyProvider appId="cmcbmq4ea0197gs0lfur2kew5">
      <AuthWrapper>
        <AppProvider>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </AppProvider>
      </AuthWrapper>
    </PrivyProvider>
  );
}
