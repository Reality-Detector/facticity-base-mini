// src/components/TypingIndicator.js

import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@mui/system';

const bounce = keyframes`
  0%, 80%, 100% { 
    transform: scale(0); 
  } 
  40% { 
    transform: scale(1.0); 
  }
`;

const TypingIndicator = () => (
  <Box display="flex" alignItems="center" justifyContent="flex-start">
    <Box
      width={8}
      height={8}
      bgcolor="grey.500"
      borderRadius="50%"
      mr={1}
      animation={`${bounce} 1.4s infinite ease-in-out both`}
      sx={{ animationDelay: '0s' }}
    />
    <Box
      width={8}
      height={8}
      bgcolor="grey.500"
      borderRadius="50%"
      mr={1}
      animation={`${bounce} 1.4s infinite ease-in-out both`}
      sx={{ animationDelay: '0.2s' }}
    />
    <Box
      width={8}
      height={8}
      bgcolor="grey.500"
      borderRadius="50%"
      animation={`${bounce} 1.4s infinite ease-in-out both`}
      sx={{ animationDelay: '0.4s' }}
    />
  </Box>
);

export default TypingIndicator;
