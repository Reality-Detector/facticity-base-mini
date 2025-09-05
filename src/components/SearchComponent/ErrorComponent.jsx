import React from 'react';
import { Typography, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorComponent = ({ errorDisplay }) => {
  return (
    <Box
      mt={4}
      p={2}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#FFEBEE"
      borderRadius="8px"
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
    >
      <ErrorOutlineIcon style={{ color: '#FF1744', marginRight: '8px' }} />
      <Typography variant="h5" color="#D32F2F">
        {errorDisplay}
      </Typography>
    </Box>
  );
};

export default ErrorComponent;
