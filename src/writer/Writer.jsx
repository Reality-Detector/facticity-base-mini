import React, { useState, useContext, useEffect } from 'react';
import {
  Grid,
  Button,
  Box,
  AppBar,
  Toolbar as MuiToolbar,
  Typography,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import Toolbar from './Toolbar';
import Editor from './Editor';
import Taskpane from './components/taskpane';
import { AppContext } from './components/AppContext';
import useAuth from '../auth/useAuthHook';
import { useAppContext } from '../AppProvider';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useRouter } from 'next/navigation';
import Credits from '../components/Credits';
// Create a custom theme (optional)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ffffff',
    },
  },
});

function Writer() {
  const [fontSize, setFontSize] = useState('3'); // Default font size
  const [fontName, setFontName] = useState('Arial');
  const [fontColor, setFontColor] = useState('#000000');
  const [isTaskpaneVisible, setTaskpaneVisible] = useState(true);
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

  const { isAuthenticated } = useAuth();
  const { userCredits, creditsLoading, componentsLoaded } = useAppContext();
  const router = useRouter();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const [isModalOpen, setModalOpen] = useState(false);

  const { editorRef, handleCommand, focusEditor, highlightColor, setHighlightColor } = useContext(AppContext);

  useEffect(() => {
    // Update isLandscape state on window resize
    // const handleResize = () => {
    //   setIsLandscape(window.innerWidth > window.innerHeight);
    // };

    const handleResize = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
    
      // Check if the device is a phone based on userAgent or screen size
      const isPhone = /Android|iPhone|Mobile/i.test(navigator.userAgent) || window.innerWidth < 768;
    
      // Disallow phones in landscape mode
      if (isLandscape && isPhone) {
        setIsLandscape(false);
      } else {
        setIsLandscape(isLandscape);
      }
    };


    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
    localStorage.setItem('isModalOpen', JSON.stringify(false));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: '#ffffff',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Modal for YouTube Tutorial */}
        {/* <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={isModalOpen}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 2,
                p: 2,
                maxWidth: 600,
                width: '90%',
              }}
            >
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                }}
                onClick={handleCloseModal}
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mb: 2 }}>
                Welcome to Facticity!
              </Typography>
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                title="YouTube tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseModal}
                fullWidth
                sx={{ mt: 2 }}
              >
                Got it, let's get fact-checking!
              </Button>
            </Box>
          </Fade>
        </Modal> */}
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={isModalOpen}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 2,
                p: 2,
                maxWidth: 800,
                width: '90%',
              }}
            >
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                }}
                onClick={handleCloseModal}
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mb: 2 }}>
                Welcome to Facticity.AI!
              </Typography>
              <video
                controls
                style={{
                  width: '100%',
                  borderRadius: '8px',
                }}
              >
                <source
                  src="https://storage.googleapis.com/public_resources_seer/Facticity.AI%20Footnoting(3).mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseModal}
                fullWidth
                sx={{ mt: 2 }}
              >
                Got it, let's get verifying!
              </Button>
            </Box>
          </Fade>
        </Modal>

        {/* Header AppBar */}
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: '#F1F3FE',
            boxShadow: 'none',
            borderBottom: '2px solid #0066FF',
            padding: '8px 16px',
            zIndex: 1201,
          }}
        >
          <MuiToolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <a href="https://facticity.ai" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img
                src="/facticityailogo-02.png"
                alt="Facticity.AI"
                style={{
                  height: '32px',
                  width: 'auto',
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  marginLeft: '8px',
                  color: '#0066FF',
                  fontWeight: 'bold',
                }}
              >
                beta
              </Typography>
            </a>
          </MuiToolbar>

          {isAuthenticated && (
            <Box
              sx={{
                position: 'absolute',
                right: 60,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                opacity: 1,
                transition: 'opacity 0.6s ease-in-out 0.4s',
              }}
            >
              <IconButton onClick={() => router.push('/rewards')} size="small" sx={{ ml: 1 }}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
              <Credits credits={userCredits} isLoading={creditsLoading} />
            </Box>
          )}


        </AppBar>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'row',
            marginTop: '60px',
            overflow: 'hidden',
          }}
        >
          {!isLandscape ? (
            // Message for unsupported views
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                backgroundColor: '#F9FAFF',
                padding: '16px',
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: '16px' }}>
                This layout is optimized for landscape mode.
              </Typography>
              <Typography variant="body1">
                Please rotate your tablet to landscape orientation or switch to a desktop computer for the best experience.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => (window.location.href = '/')} // Navigate to the root
                sx={{ marginTop: '16px' }}
              >
                Return to Facticity Web
              </Button>
            </Box>
          ) : (
            <Grid container direction="row" sx={{ flexGrow: 1, height: '100%', width: '100%' }}>
              {/* Left Column - Writer */}
              <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', paddingRight: '8px', maxWidth: { xs: '100%', md: '66.67%' }, flexBasis: { xs: '100%', md: '66.67%' }, flexShrink: 0 }}>
                <br></br>
                <br></br>
                <Toolbar
                  onCommand={handleCommand}
                  fontSize={fontSize}
                  setFontSize={setFontSize}
                  fontName={fontName}
                  setFontName={setFontName}
                  fontColor={fontColor}
                  setFontColor={setFontColor}
                  highlightColor={highlightColor}
                  setHighlightColor={setHighlightColor}
                />

                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    flex: 1,
                    overflow: 'auto',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <Editor editorRef={editorRef} focusEditor={focusEditor} />
                  {/* <WordAddInBadge /> */}
                </div>
              </Grid>

              {/* Right Column - Taskpane */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  borderLeft: '2px solid #e0e0e0',
                  paddingLeft: '16px',
                  boxSizing: 'border-box',
                  backgroundColor: '#F9FAFF',
                  height: '100%',
                  overflow: 'auto',
                  maxWidth: { xs: '100%', md: '33.33%' },
                  flexBasis: { xs: '100%', md: '33.33%' },
                  flexShrink: 0,
                }}
              >
                <br></br>
                <Taskpane />
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Writer;
