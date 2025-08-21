// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    // Set the base font size (default is 16px)
    htmlFontSize: 14, // You can adjust this value as needed

    // Define global font family
    fontFamily: 'IBM Plex Sans, Arial, sans-serif',

    // Customize specific typography variants
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    // Add more variants as needed
  },
  // Other theme customizations can go here
});

export default theme;
