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
  
  const {userCredits, creditsLoading} = useAppContext()

  const { isAuthenticated } = useAuth();
  const router = useRouter()
  // Responsive Design
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  // Sidebar sections
  const sections = [
    { id: "credits", label: "Credits Breakdown", icon: AccountBalanceWalletIcon },
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
      const scrollPosition = window.scrollY + 100;

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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        <Toolbar sx={{ minHeight: '70px !important', justifyContent: 'space-between', paddingX: { xs: 2, sm: 4 } }}>
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
            <a href="https://app.facticity.ai" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img
                src="/facticityailogo-02.png"
                alt="Facticity.AI"
                style={{
                  paddingTop: '2px',
                  width: 'auto',
                  height: isMdUp ? '36px' : '30px',
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
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
            Credits
          </Typography>
          <Typography variant="body1" color="text.secondary">
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
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'black' }}>
                  Credits Breakdown
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Overview of your current credit balance and usage.
                </Typography>
              </Box>
              <Card sx={styles.mainCard}>
                <CardContent>
                  <CreditBreakdown />
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
