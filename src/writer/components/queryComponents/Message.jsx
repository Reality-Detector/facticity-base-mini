// src/components/Message.js

import React from 'react';
import { Typography, Box } from '@mui/material';
import { marked } from 'marked';

const Message = ({ sender, text }) => {
  const isUser = sender === 'user';

  return (
    <Box
      display="flex"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      mb={1}
    >
      <Box
        bgcolor={isUser ? 'primary.main' : 'grey.300'}
        color={isUser ? 'white' : 'black'}
        px={2}
        py={1}
        borderRadius={2}
        maxWidth="80%"
      >
        
        {typeof text === 'string' ? (
          <Typography variant="body1" style={{ fontSize: '12px' }}
          dangerouslySetInnerHTML={{
            __html:marked(text)
          }}
          
          />
        ) : (
          text
        )}
      </Box>
    </Box>
  );
};

export default Message;
