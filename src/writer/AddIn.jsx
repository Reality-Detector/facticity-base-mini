// src/AddIn.js
import React from 'react';
import { Box, Typography } from '@mui/material';

function AddIn() {
  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        minHeight: '400px',
        padding: '16px',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
        overflow: 'auto',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Add-In
      </Typography>
      <Typography variant="body1">
        This is where your Add-in content can be displayed.
      </Typography>
      {/* Future Add-In Components can be added here */}
    </Box>
  );
}

export default AddIn;
