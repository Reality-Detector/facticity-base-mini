import React, { useState } from 'react'; 
import { 
  Box, 
  Typography, 
  CircularProgress, 
  useMediaQuery,
  Popover,
  Paper,
  Divider
} from '@mui/material'; 
import StarsIcon from '@mui/icons-material/Stars'; 
import { MonetizationOn as CoinsIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../AppProvider';

const Credits = ({ credits, isLoading }) => {
    const theme = useTheme(); 
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { 
      profile, 
      profileLoading, 
      dailyUserCredits, 
      dailyTaskCredits, 
      creditsLoading 
    } = useAppContext();
    
    // State for dropdown
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          backgroundColor: 'rgba(0, 102, 255, 0.1)',
          padding: '4px 12px',
          borderRadius: '20px',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(0, 102, 255, 0.15)',
          },
        }}
      > 
        <StarsIcon sx={{ color: '#0066FF', fontSize: 16 }} />

          {creditsLoading ? (
            <CircularProgress size={14} sx={{ color: '#0066FF' }} />
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: { xs: 0.5, sm: 1 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <img 
                  src="/icons/credit_icons/goldcoin.png" 
                  alt="Gold Coin" 
                  style={{ width: '14px', height: '14px' }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#0066FF',
                    fontWeight: 600,
                    fontSize: {
                      xs: '0.75rem',
                      sm: '0.85rem',
                    },
                  }}
                >
                  {dailyUserCredits || '0'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <img 
                  src="/icons/credit_icons/diamond.png" 
                  alt="Diamond" 
                  style={{ width: '14px', height: '14px' }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#0066FF',
                    fontWeight: 600,
                    fontSize: {
                      xs: '0.75rem',
                      sm: '0.85rem',
                    },
                  }}
                >
                  {dailyTaskCredits || '0'}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

      {/* Dropdown Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          mt: 1,
        }}
      >
        <Paper sx={{ p: 2, minWidth: 220 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Daily Credits Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img 
                src="/icons/credit_icons/goldcoin.png" 
                alt="Gold Coin" 
                style={{ width: '20px', height: '20px' }}
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Fact Checking Credits
                </Typography>
                <Typography variant="body1" sx={{ color: '#0066FF', fontWeight: 700 }}>
                  {creditsLoading ? <CircularProgress size={14} /> : dailyUserCredits || '0'}
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* Lifetime Credits Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img 
                src="/icons/credit_icons/diamond.png" 
                alt="Diamond" 
                style={{ width: '20px', height: '20px' }}
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Points
                </Typography>
                <Typography variant="body1" sx={{ color: '#0066FF', fontWeight: 700 }}>
                  {creditsLoading ? <CircularProgress size={14} /> : dailyTaskCredits || '0'}
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* FACY Coins Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CoinsIcon sx={{ color: '#0066FF', fontSize: 18 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  FACY Coins
                </Typography>
                <Typography variant="body1" sx={{ color: '#0066FF', fontWeight: 700 }}>
                  {profileLoading ? (
                    <CircularProgress size={14} />
                  ) : (
                    profile?.token_balance || '0'
                  )}
                </Typography>
              </Box>
            </Box>

            {/* Exchange Rate Info */}
            <Box sx={{ 
              bgcolor: 'rgba(0, 102, 255, 0.1)', 
              p: 1.5, 
              borderRadius: 1,
              textAlign: 'center'
            }}>
              <Typography variant="caption" color="text.secondary">
                Exchange Rate: 1 FACY = 5 Credits
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Popover>
    </>
  );
};

export default Credits;