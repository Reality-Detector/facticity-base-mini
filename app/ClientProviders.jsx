'use client'; // marks this component as client component
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';
import { AppProvider } from '@/AppProvider'; // if default export, adjust
import AuthWrapper from '@/auth/AuthWrapper'; // your existing dual-auth wrapper if any
import Walkthrough from '@/Walkthrough';

export default function ClientProviders({ children }) {
  return (
    <AuthWrapper usePrivy={true}>
      <AppProvider>
        <ThemeProvider theme={theme}>
          {children}
          <Walkthrough />
        </ThemeProvider>
      </AppProvider>
    </AuthWrapper>
  );
}
