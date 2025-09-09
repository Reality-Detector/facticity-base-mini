"use client";
import { usePathname, useParams, useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { IconButton, Grid, Box, Typography, useTheme, useMediaQuery, AppBar, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchComponent from '../SearchComponent/SearchComponent';
import Credits from '../Credits';
import ThirdColumn from './ThirdColumn';
import useAuth from '../../auth/useAuthHook';
import { useAppContext } from '../../AppProvider';


// import EditNoteIcon from '@mui/icons-material/EditNote';
import LoginModal from './loginModal';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import Banner from './Banner';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import '@/styles/globals.css'; // Animation styles are now in globals.css

const Home = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { 
    isSearchMoved, 
    setIsSearchMoved, 
    setCurrentConversation, 
    setNewSearch, 
    setErrorDisplay, 
    setQueries, 
    setIds, 
    setIdHistory, 
    userCredits, 
    creditsLoading, 
    totalUserCredits,
    dailyUserCredits, 
    temporaryUserCreditsList, 
    totalTemporaryUserCredits,
    temporaryExpiries
  } = useAppContext();
  

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const { id } = useParams(); // Retrieve the ID from the URL
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [initialUrlParam, setInitialUrlParam] = useState(null);
  
  // Check if we're on the game path
  const isGamePath = pathname === '/game';
  
  useEffect(() => {
    // Handle URL parameter
    const encodedUrl = searchParams.get('url');
    if (encodedUrl) {
      const decodedUrl = decodeURIComponent(encodedUrl);
      console.log('Encoded URL:', encodedUrl);
      console.log('Decoded URL:', decodedUrl);
      setInitialUrlParam(decodedUrl);
    }

    // console.log({ id });
    setCurrentConversation(id);
    setNewSearch(false);
    if (!id) {
      setNewSearch(true);
    }
  }, [id, searchParams, setCurrentConversation, setNewSearch]);

  useEffect(() => {
    if (isSearchMoved) {
      setIsBannerVisible(false);
    }
  }, [isSearchMoved]);

  // Trigger fade-in animations after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setComponentsLoaded(true);
    }, 100); // Small delay to ensure DOM is ready
    return () => clearTimeout(timer);
  }, []);

  const createConversation = () => {
    setIsSearchMoved(false);
    setErrorDisplay("");
    setQueries([]);
    setIds([]);
    setCurrentConversation('');
    setIdHistory({});
    setNewSearch(true);
    window.history.replaceState(null, '', `/`);
    if (!isMdUp) {
      setSidebarOpen(false);
    }
  };

  // useEffect(() => {
  //   if (isMdUp) {
  //     setSidebarOpen(true);
  //   } else {
  //     setSidebarOpen(false);
  //   }
  // }, [isMdUp]);

  const toggleSidebar = () => {
    console.log('Toggling sidebar...', isSidebarOpen);
    setSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    console.log('Closing sidebar...');
    setSidebarOpen(false);
  };

  return (
    <Box
      sx={{
        // Ensure at least full-viewport height, but allow page to extend and scroll
        minHeight: { xs: '100svh', sm: '100vh' },
        background: '#F8FAFF',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',      // Hide horizontal overflow
        overflowY: 'auto',        // Enable page vertical scrolling
        position: 'relative',
        // Mobile momentum scrolling
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <LoginModal />
      
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
            {isAuthenticated && (
              <IconButton 
                onClick={toggleSidebar} 
                className="facti-tut-step-sidebar"
                sx={{
                  color: '#0066FF',
                  background: 'rgba(0, 102, 255, 0.08)',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 102, 255, 0.15)',
                  ml: 0.5,
                  '&:hover': { 
                    background: 'rgba(0, 102, 255, 0.12)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease-in-out'
                  },
                }}
                size="small"
              >
                <MenuIcon />
              </IconButton>
            )}
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
            {(!isAuthenticated || isMdUp) ? (
              <ThirdColumn />
            ) : (
              <IconButton
                onClick={createConversation}
                sx={{ 
                  zIndex: 1000,
                  color: '#0066FF',
                  background: 'rgba(0, 102, 255, 0.08)',
                  '&:hover': { background: 'rgba(0, 102, 255, 0.12)' }
                }}
              >
                <AddBoxOutlinedIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Component */}
      {isAuthenticated && (
        <Sidebar
          isOpen={isSidebarOpen}
          handleCloseSidebar={handleCloseSidebar}
          toggleSidebar={toggleSidebar}
          sx={{ 
            marginTop: '70px',
            opacity: componentsLoaded ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out 0.5s',
          }}
          setIsSearchMoved={setIsSearchMoved}
          createConversation={createConversation}
        />
      )}
      
      {/* Banner - takes up space in flex layout to push content down */}
      {isBannerVisible && (
                  <Box
            sx={{
              flexShrink: 0, // Don't shrink - always take up its natural height
              flexGrow: 0, // Don't grow beyond natural size
              flexBasis: 'auto', // Use natural height
              width: '100%',
              position: 'static', // Explicit static positioning to ensure normal flow
              display: 'block', // Ensure it's a block element
              zIndex: 1, // Lower than SearchComponent
              opacity: componentsLoaded ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out 0.6s',
              // Ensure the banner takes up space even during opacity transition
              visibility: 'visible',
              height: 'auto',
              minHeight: 'fit-content',
            }}
          >
          <Banner 
            isVisible={isBannerVisible} 
            setIsVisible={setIsBannerVisible}
          />
        </Box>
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: '1 1 0', // Take remaining space after AppBar and Banner, allow shrinking to 0
          display: 'flex',
          position: 'relative',
          background: '#F1F3FE',
          opacity: componentsLoaded ? 1 : 0,
          transform: componentsLoaded ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.5s ease-in-out 0.3s',
          // Allow this box to grow naturally with content; scrolling handled by page
          overflowY: 'auto', // Allow scrolling if SearchComponent is taller than viewport
          overflowX: 'hidden',
          zIndex: 2, // Higher than Banner
          // Mobile-specific fixes
          WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
        }}
      >
        <SearchComponent 
          isSearchMoved={isSearchMoved} 
          setIsSearchMoved={setIsSearchMoved} 
          isMdUp={isMdUp}
          initialUrlParam={initialUrlParam} 
        />
      </Box>
    </Box>
  );
};

export default Home;