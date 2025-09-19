"use client";
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Container,
  Card,
  CardContent,
  AppBar,
  Toolbar
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useAppContext } from '../../AppProvider';
import useAuth from '../../auth/useAuthHook';
import ThirdColumn from '../Home/ThirdColumn';
import { useRouter } from 'next/navigation';
import CreditBreakdown from './CreditBreakdown';
import Credits from '../Credits';
import { TIER_CONFIG, TIER_MULTIPLIERS } from '../../config/tierConfig';

// Custom styles
const styles = {
  pageContainer: {
    minHeight: { xs: '100svh', sm: '100vh' },
    background: '#F8FAFF',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'relative',
    WebkitOverflowScrolling: 'touch',
  },
  header: {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottom: '1px solid rgba(0, 102, 255, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  mainCard: {
    borderRadius: 2,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
    }
  },
  button: {
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    }
  },
  tableContainer: {
    borderRadius: 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    '& .MuiTableCell-head': {
      fontWeight: 600,
      backgroundColor: '#f5f5f5'
    }
  },

};

const CreditsPage = () => {
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("credits");
  
  const {userCredits, creditsLoading, dailyUserCredits, dailyTaskCredits} = useAppContext()

  const { isAuthenticated } = useAuth();
  const router = useRouter()
  // Responsive Design
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  // Sidebar sections
  const sections = [
    { id: "credits", label: "Credits System", icon: AccountBalanceWalletIcon },
    { id: "points", label: "Points & Rewards", icon: InfoOutlinedIcon },
    { id: "facy", label: "$FACY Tokens", icon: AccountBalanceWalletIcon },
  ];



  // Trigger fade-in animations after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setComponentsLoaded(true);
    }, 100); // Small delay to ensure DOM is ready
    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveSection(sectionId);
  };

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = typeof window !== 'undefined' ? window.scrollY + 100 : 0;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);



  return (
    <Box sx={styles.pageContainer}>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          borderBottom: '1px solid rgba(0, 102, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ minHeight: '50px !important', justifyContent: 'space-between', paddingX: { xs: 2, sm: 4 } }}>
          <Box sx={{ width: { xs: 40, md: 60 }, display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => router.push('/')}
              sx={{
                color: '#0066FF',
                background: 'rgba(0, 102, 255, 0.08)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 102, 255, 0.15)',
                '&:hover': { 
                  background: 'rgba(0, 102, 255, 0.12)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out'
                },
              }}
              size="small"
            >
              <ArrowBack />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img
                src="https://see.fontimg.com/api/rf5/KVdLp/YzgwNzgzNWY1N2M2NDc1MzgzNTExOWYzMWFkY2ViMmQudHRm/QVJBSVNUT1RMRQ/spartacus.png?r=fs&h=98&w=1500&fg=0066FF&bg=FFFFFF&tb=1&s=65"
                alt="ARAISTOTLE"
                style={{
                  paddingTop: '2px',
                  width: 'auto',
                  height: isMdUp ? '28px' : '24px',
                }}
              />
            </a>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {/* Credits */}
            {isAuthenticated && (
              <>
                <IconButton 
                  onClick={() => router.push('/rewards')} 
                  size="small" 
                  sx={{ 
                    color: '#0066FF',
                    background: 'rgba(0, 102, 255, 0.08)',
                    '&:hover': { background: 'rgba(0, 102, 255, 0.12)' },
                  }}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
                <Box>
                  <Credits credits={userCredits} isLoading={creditsLoading} />
                </Box>
              </>
            )}

            {/* Right-most Element */}
            {(!isAuthenticated || isMdUp) && (
              <ThirdColumn />
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 1,
            fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' }
          }}>
            Credits
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            Manage your credits and view your usage breakdown.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
          {/* Sidebar Navigation */}
          <Box sx={{ 
            width: { lg: 256 }, 
            position: { lg: 'sticky' }, 
            top: { lg: 32 }, 
            alignSelf: { lg: 'flex-start' } 
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <Button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    sx={{
                      justifyContent: 'flex-start',
                      gap: 1.5,
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      color: activeSection === section.id ? 'white' : 'text.primary',
                      bgcolor: activeSection === section.id ? '#0066FF' : 'transparent',
                      '&:hover': {
                        bgcolor: activeSection === section.id ? '#1557b0' : 'action.hover',
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: 16 }} />
                    {section.label}
                  </Button>
                );
              })}
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 6,
            opacity: componentsLoaded ? 1 : 0,
            transform: componentsLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.5s ease-in-out 0.3s',
          }}>


            {/* Credits Section */}
            <Box id="credits" sx={{ scrollMarginTop: 4 }}>
              <Box sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  mb: 1, 
                  color: 'black',
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' }
                }}>
                  Credits System
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ 
                  mb: 3,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  Credits are based on your tier and refresh daily, allowing you access to a certain number of fact checks. Each fact check costs 5 credits.
                </Typography>
              </Box>
              <Card sx={styles.mainCard}>
                <CardContent>
                  {/* <CreditBreakdown /> */}
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2, 
                    color: 'black',
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}>
                    Your Current Credits
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Gold Coin - Daily Credits */}
                    <Box sx={{ 
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      border: '1px solid rgba(255, 215, 0, 0.3)'
                    }}>
                      {/* Header with icon and credit amount */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <Box sx={{ mr: 2 }}>
                          <img 
                            src="/icons/credit_icons/goldcoin.png" 
                            alt="Gold Coin" 
                            style={{ width: '32px', height: '32px' }}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 'bold', 
                            color: '#B8860B', 
                            mb: 0.5,
                            fontSize: { xs: '0.875rem', sm: '1.25rem' }
                          }}>
                            Daily Credits
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ 
                            mb: 1,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}>
                            Credits that refresh every 24 hours for fact checking
                          </Typography>
                          <Typography variant="h4" sx={{ 
                            fontWeight: 'bold',
                            color: '#B8860B',
                            fontFamily: '"Press Start 2P", "Orbitron", "Arial Black", sans-serif',
                            fontSize: { xs: '1rem', sm: '1.5rem' },
                            letterSpacing: '0.5px'
                          }}>
                            {dailyUserCredits || '0'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Daily Credits by Tier - Below the main credit display */}
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" sx={{ 
                          fontWeight: 'bold', 
                          mb: 1.5, 
                          color: '#B8860B',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                          Daily Credits by Tier
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {Object.values(TIER_CONFIG).map((tier) => (
                            <Box key={tier.name} sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              p: 1,
                              borderRadius: 0.5,
                              backgroundColor: 'rgba(184, 134, 11, 0.1)',
                              border: '1px solid rgba(184, 134, 11, 0.2)'
                            }}>
                              <Box>
                                <Typography variant="caption" sx={{ 
                                  fontWeight: 600,
                                  fontSize: { xs: '0.625rem', sm: '0.75rem' },
                                  color: '#B8860B'
                                }}>
                                  {tier.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{
                                  fontSize: { xs: '0.5rem', sm: '0.625rem' },
                                  display: 'block'
                                }}>
                                  {tier.minBalance === 0 ? '0' : `≥ ${tier.minBalance.toLocaleString()}`} $FACY
                                </Typography>
                              </Box>
                              <Typography variant="caption" sx={{ 
                                fontWeight: 'bold', 
                                color: '#B8860B',
                                fontSize: { xs: '0.625rem', sm: '0.75rem' }
                              }}>
                                {tier.creditsPerDay}/day
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Box>

                    {/* Diamond - Accumulated Points */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: 'rgba(0, 191, 255, 0.1)',
                      border: '1px solid rgba(0, 191, 255, 0.3)'
                    }}>
                      <Box sx={{ mr: 2 }}>
                        <img 
                          src="/icons/credit_icons/diamond.png" 
                          alt="Diamond" 
                          style={{ width: '32px', height: '32px' }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold', 
                          color: '#00BFFF', 
                          mb: 0.5,
                          fontSize: { xs: '0.875rem', sm: '1.25rem' }
                        }}>
                          Accumulated Points
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          mb: 1,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                          Points earned through feedback (can be converted to $FACY monthly)
                        </Typography>
                        <Typography variant="h4" sx={{ 
                          fontWeight: 'bold',
                          color: '#00BFFF',
                          fontFamily: '"Press Start 2P", "Orbitron", "Arial Black", sans-serif',
                          fontSize: { xs: '1rem', sm: '1.5rem' },
                          letterSpacing: '0.5px'
                        }}>
                          {dailyTaskCredits || '0'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Points Section */}
            <Box id="points" sx={{ scrollMarginTop: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  mb: 1, 
                  color: 'black',
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' }
                }}>
                  Points & Rewards
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ 
                  mb: 3,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  Earn points by participating in app activities like providing feedback. Points are awarded based on your tier multiplier.
                </Typography>
              </Box>
              
              <Card sx={styles.mainCard} style={{ marginBottom: '24px' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2, 
                    color: 'black',
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}>
                    How to Earn Points
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: 'rgba(0, 102, 255, 0.05)',
                      border: '1px solid rgba(0, 102, 255, 0.1)'
                    }}>
                      <Box sx={{ mr: 2, flex: 1 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold', 
                          color: '#0066FF',
                          fontSize: { xs: '0.875rem', sm: '1.25rem' }
                        }}>
                          Feedback
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                          Provide feedback on fact checks (capped at 5 per day) multiplied by your tier multiplier
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right', minWidth: 'fit-content' }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '0.875rem', sm: '1.25rem' }
                        }}>
                          3-6 points
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                          per feedback
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: 'rgba(0, 102, 255, 0.05)',
                      border: '1px solid rgba(0, 102, 255, 0.1)'
                    }}>
                      <Box sx={{ mr: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0066FF' }}>
                          Sharing
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Share fact checks on social media
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          2 points
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          per share
                        </Typography>
                      </Box>
                    </Box> */}
                  </Box>
                </CardContent>
              </Card>

              <Card sx={styles.mainCard}>
                <CardContent>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2, 
                    color: 'black',
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}>
                    Tier Multipliers
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {Object.entries(TIER_MULTIPLIERS).map(([tier, multiplier]) => (
                      <Box key={tier} sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        p: 1.5,
                        borderRadius: 1,
                        backgroundColor: 'rgba(0, 102, 255, 0.05)',
                        border: '1px solid rgba(0, 102, 255, 0.1)'
                      }}>
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 600, 
                          textTransform: 'capitalize',
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>
                          {tier} Tier
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold', 
                          color: '#0066FF',
                          fontSize: { xs: '0.875rem', sm: '1.25rem' }
                        }}>
                          {multiplier}x multiplier
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    mt: 2, 
                    fontStyle: 'italic',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    * Higher tier holders earn more points for the same activities
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* $FACY Tokens Section */}
            <Box id="facy" sx={{ scrollMarginTop: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  mb: 1, 
                  color: 'black',
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' }
                }}>
                  $FACY Tokens
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ 
                  mb: 3,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  At the end of each month, your accumulated points are converted to $FACY tokens that you can claim and use to access higher tiers.
                </Typography>
              </Box>
              
              <Card sx={styles.mainCard}>
                <CardContent>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2, 
                    color: 'black',
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}>
                    Monthly Conversion Process
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: 'rgba(0, 102, 255, 0.05)',
                      border: '1px solid rgba(0, 102, 255, 0.1)'
                    }}>
                      <Box sx={{ 
                        mr: 2, 
                        width: { xs: 24, sm: 32 }, 
                        height: { xs: 24, sm: 32 }, 
                        borderRadius: '50%', 
                        backgroundColor: '#0066FF', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'white', 
                        fontWeight: 'bold',
                        fontSize: { xs: '0.75rem', sm: '1rem' },
                        flexShrink: 0
                      }}>
                        1
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>
                          Accumulate Points
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                          Earn points throughout the month through feedback and sharing
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: 'rgba(0, 102, 255, 0.05)',
                      border: '1px solid rgba(0, 102, 255, 0.1)'
                    }}>
                      <Box sx={{ 
                        mr: 2, 
                        width: { xs: 24, sm: 32 }, 
                        height: { xs: 24, sm: 32 }, 
                        borderRadius: '50%', 
                        backgroundColor: '#0066FF', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'white', 
                        fontWeight: 'bold',
                        fontSize: { xs: '0.75rem', sm: '1rem' },
                        flexShrink: 0
                      }}>
                        2
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>
                          Monthly Conversion
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                          Points are automatically converted to $FACY tokens at month-end
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: 'rgba(0, 102, 255, 0.05)',
                      border: '1px solid rgba(0, 102, 255, 0.1)'
                    }}>
                      <Box sx={{ 
                        mr: 2, 
                        width: { xs: 24, sm: 32 }, 
                        height: { xs: 24, sm: 32 }, 
                        borderRadius: '50%', 
                        backgroundColor: '#0066FF', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'white', 
                        fontWeight: 'bold',
                        fontSize: { xs: '0.75rem', sm: '1rem' },
                        flexShrink: 0
                      }}>
                        3
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>
                          Claim Tokens
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                          Claim your $FACY tokens and use them to access higher tiers for more daily credits
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    mt: 3, 
                    p: 2, 
                    backgroundColor: 'rgba(0, 102, 255, 0.1)', 
                    borderRadius: 1, 
                    fontStyle: 'italic',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    💡 <strong>Pro Tip:</strong> The more $FACY tokens you stake, the higher your tier and the more daily credits you receive!
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CreditsPage;
