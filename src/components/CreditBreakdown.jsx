// src/pages/CreditBreakdown.jsx
import React from 'react';
import { Box, Typography, List, ListItem, Tooltip } from '@mui/material';
import { useAppContext } from '../AppProvider';
import {useEffect, useState} from 'react'

const CreditBreakdown = ({loadingReferral}) => {

    const { isSearchMoved, setIsSearchMoved, setCurrentConversation, setNewSearch, setErrorDisplay, setQueries, setIds, setIdHistory, userCredits, creditsLoading, totalUserCredits,
      dailyUserCredits, dailyTaskCredits, CommunityCredits
     } = useAppContext();  

     const [refresh, setRefresh] = useState(false)

     useEffect(() => {
      setRefresh(!refresh)
    }, [loadingReferral]);
    
  return (
    <Box sx={{ p: 1 }}>
      {/* <Typography variant="h5" gutterBottom>
        Credit Breakdown
      </Typography> */}

      {/* <Typography variant="h6">Total Credits: {totalUserCredits}</Typography> */}

      <List>
        <ListItem>
          <Tooltip title="Fact Checking Coins: used for fact checking" arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img 
                src="/public/icons/credit_icons/goldcoin.png" 
                alt="Gold Coin" 
                style={{ width: '20px', height: '20px' }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#000000',
                  fontFamily: '"Press Start 2P", "Orbitron", "Arial Black", sans-serif',
                  fontSize: '0.9rem',
                  letterSpacing: '0.5px'
                }}
              >
                {dailyUserCredits}
              </Typography>
            </Box>
          </Tooltip>
        </ListItem>
        <ListItem>
          <Tooltip title="Community Diamonds: used for earning FACY" arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img 
                src="/public/icons/credit_icons/diamond.png" 
                alt="Diamond" 
                style={{ width: '20px', height: '20px' }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#000000',
                  fontFamily: '"Press Start 2P", "Orbitron", "Arial Black", sans-serif',
                  fontSize: '0.9rem',
                  letterSpacing: '0.5px'
                }}
              >
                {dailyTaskCredits}
              </Typography>
            </Box>
          </Tooltip>
        </ListItem>
      </List>
    </Box>
  );
};

export default CreditBreakdown;
