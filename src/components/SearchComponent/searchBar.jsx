// // SearchBar.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Popper,
  Paper,
  Menu,
  MenuItem,
  Switch,
  ListItemIcon,
  ListItemText,
  Chip,
  Typography,
  CircularProgress,
  Tooltip,
  Button,
  CardActionArea,
  ClickAwayListener,
  useMediaQuery,
  Card,
  CardContent
} from '@mui/material';
import {
  Business,
  Search,
  DisplaySettings as DisplaySettingsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  TextSnippet as TextSnippetIcon,
  VideoLibrary as VideoLibraryIcon,
} from '@mui/icons-material';
//import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useAppContext } from '../../AppProvider';
import useAuth from '../../auth/useAuthHook';
import { useTheme } from '@mui/material/styles';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
// ... [Rest of your imports and sampleRecommendations]
import '@/styles/searchBar.css'
function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearchClick,
  isProMode,
  handleToggle,
  isSearchMoved,
  externalTrigger
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openRecommend, setOpenRecommend] = useState(false);
  const [linkType, setLinkType] = useState(null);
  const [transcriptAvailable, setTranscriptAvailable] = useState(null);
  const [details, setDetails] = useState({});
  const [isCheckingTranscript, setIsCheckingTranscript] = useState(false);
  const [menuWidth, setMenuWidth] = useState(0);
  const sampleRecommendations = [
    {
      type: 'text',
      content: 'Bananas are a type of berries',
      title: 'None',
    },
    {
      type: 'video',
      content: 'https://www.youtube.com/watch?v=lQBsOT38sQY',
      title: "Elon Musk - Things Most People Don't Know About China",
    },
    {
      type: 'video',
      content: 'https://www.youtube.com/watch?v=HeG-laB_YL4',
      title: "Never Eat Broccoli with This🥦 Cause Cancer ..",
    },
    {
      type: 'video',
      content: 'https://www.youtube.com/watch?v=G8T1O81W96Y',
      title: "Sam Altman & Brad Lightcap: Which Companies Will Be Steamrolled by OpenAI?",
    },
    {
      type: 'video',
      content: 'https://www.youtube.com/shorts/6hM6j4zyEjU',
      title: "Spicy food and stomach ulcers",
    }
  ];
  const {
    skipDisambiguation,
    setSkipDisambiguation,
    mode,
    currentConversation,
    hideSearchBar,
    backendUrl,
    sourceFindMode,
    setSourceFindMode,
    userCredits,
    highlightSearch,
    setHighlightSearch,
    accessToken
  } = useAppContext();

  const handleToggleSkipDisambiguation = () => {
    setSkipDisambiguation(!skipDisambiguation);
    setSourceFindMode(false)
  };

  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const { loginWithRedirect, loginWithPopup, logout, isAuthenticated, user } = useAuth();


  useEffect(() => {
    initiateSearch()
  }, [externalTrigger]);

  const handleToggleSource = (event) => {
    setSourceFindMode(event.target.checked)
    if(!skipDisambiguation){
      setSkipDisambiguation(true)
    }
    
  };

  

  
  const handleLogin = async () => {
    try {
      await loginWithPopup();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Define the minimum number of words required for a valid search
  //const MIN_WORD_COUNT = 3;
  const MIN_WORD_COUNT = 0;

  // Helper function to count words in the search query
  const countWords = (query) => {
    return query.trim().split(/\s+/).length;
  };

  // Function to extract the video ID from a YouTube URL
  const extractVideoId = (url) => {
    const videoIdMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/
    );
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  // Function to check if a YouTube video has captions without using the API
  const checkYouTubeCaptions = async (url) => {
    try {
      const response = await fetch(
        `/api/check-youtube-transcript?input_url=${encodeURIComponent(
          url
        )}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Validator':'privy',
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setTranscriptAvailable(data.transcript_available);
      setDetails(data.details);
    } catch (error) {
      console.error('Error checking captions:', error);
      setTranscriptAvailable(false); // Assume no captions on error
    }
  };

  // Debounced search query state
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  // Effect to handle debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 50); // 500ms delay

    // Cleanup timeout if searchQuery changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Ref for the TextField to measure its width
  const searchBarRef = useRef(null);

  // Theme and media query for responsiveness
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define mobile breakpoint

  // Effect to update the Popper width based on the search bar's width and screen size
  useEffect(() => {
    const updatePopperWidth = () => {
      if (searchBarRef.current) {
        let width;
        if (isMobile) {
          width = window.innerWidth * 0.7; // 90% of viewport width on mobile
        } else {
          const searchBarWidth = searchBarRef.current.getBoundingClientRect().width;
          width = searchBarWidth * 0.8; // 80% of search bar's width on larger screens
        }
        setMenuWidth(width);
      }
    };

    updatePopperWidth();
    window.addEventListener('resize', updatePopperWidth);

    return () => {
      window.removeEventListener('resize', updatePopperWidth);
    };
  }, [isMobile]); // Re-run when screen size changes

  // Reference for the Popper anchor
  const popperAnchorRef = useRef(null);



  // Handle clicking on example card
  const handleCardClick = (sample) => {
    setSearchQuery(sample.content);
    // We can set a short timeout to ensure the query updates
    setTimeout(() => {
      initiateSearch();
    }, 0);
  };
  // Effect to detect input type and perform corresponding checks based on debouncedSearchQuery
  useEffect(() => {
    let detectedType = null;

    // Reset previous states
    setLinkType(null);
    setTranscriptAvailable(null);
    setDetails({});

    if (debouncedSearchQuery.trim() === '') {
      // If the search query is empty, no need to proceed further
      return;
    }

    // Determine if the *entire* (trimmed) query is a standalone URL. If there is
    // any additional text after the URL we no longer treat it as a URL-only
    // input but rather as a regular claim.
    const trimmedQuery = debouncedSearchQuery.trim();
    const isURL = /^(https?:\/\/\S+)$/i.test(trimmedQuery);

    if (isURL) {
      // Define supported websites within the component for encapsulation
      // const supportedWebsites = [
      //   {
      //     name: 'YouTube',
      //     regex: /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\//,
      //     color: '#FF0000', // YouTube red
      //   },
      //   { name: 'TikTok', regex: /^(https?:\/\/)?(www\.)?(vt\.)?tiktok\.com\//, color: '#000000' },
      //   { name: 'Reels', regex: /^(https?:\/\/)?(www\.)?(vt\.)?instagram\.com\//, color: '#E1306C' },
      //   // Add more supported websites here if needed
      // ];

      const supportedWebsites = [
        {
          name: 'YouTube',
          regex: /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\//,
          color: '#FF0000', // YouTube red
        },
        {
          name: 'TikTok',
          regex: /^(https?:\/\/)?(www\.)?(vt\.)?tiktok\.com\//,
          color: '#000000',
        },
        {
          name: 'Reels',
          regex: /^(https?:\/\/)?(www\.)?(vt\.)?instagram\.com\//,
          color: '#E1306C',
        },
        {
          name: 'Apple Podcasts',
          regex: /^(https?:\/\/)?(www\.)?podcasts\.apple\.com\//,
          color: '#A2AAAD', // Apple grey
        },
        // Add more supported websites here if needed
      ];
      
      // Check if the standalone URL matches any of the supported websites
      for (const site of supportedWebsites) {
        if (site.regex.test(trimmedQuery)) {
          detectedType = site;
          break;
        }
      }

      if (detectedType) {
        setLinkType(detectedType);
        // If it's a supported URL (e.g., YouTube), check for captions
        const videoId = extractVideoId(trimmedQuery);
        if (videoId) { //add time limit logic here
          const fetchCaptions = async () => {
            setIsCheckingTranscript(true);
            await checkYouTubeCaptions(trimmedQuery);
            setIsCheckingTranscript(false);
          };
          fetchCaptions();
        }
      } else {
        setLinkType({ name: 'Unsupported Link', color: '#808080' }); // Gray color for unsupported links
      }
    } else {
      // If it's not a URL, validate it as a proper claim
      if (countWords(debouncedSearchQuery) < MIN_WORD_COUNT) {
        // Handle in the render logic
      }
    }
  }, [debouncedSearchQuery]);

  // Additional Effect to Control Popper Visibility Based on searchQuery
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      setOpenRecommend(false); // Hide Popper when there's input
    } else {
      // Optionally, you can decide to reopen Popper when input is cleared
      // setOpenRecommend(true);
    }
  }, [searchQuery]);

  // Determine the current input state
  const isLink = linkType !== null;
  const isSupportedLink = isLink && linkType.name !== 'Unsupported Link';
  const isQueryTooShort =
    !isLink &&
    debouncedSearchQuery.trim() !== '' &&
    countWords(debouncedSearchQuery) < MIN_WORD_COUNT;
  
  const isLongQuery = sourceFindMode ? false : debouncedSearchQuery.length > 250;

  const initiateSearch = () => {
    if (searchQuery.trim() !== '') {
      if (isSupportedLink) {
        if (transcriptAvailable !== false && !isCheckingTranscript) {
          handleSearchClick();
        }
      } else if (isLink && linkType.name === 'Unsupported Link') {
        // Do not proceed with unsupported links
      } else {
        // It's a claim
        if (!isQueryTooShort) {
          handleSearchClick();
        }
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '20px',
        padding: isMobile ? '8px 0px' : '12px 0px',
        boxShadow: 2,
        width: '100%',
        position: 'relative',
        
      }}
      className = 'facti-tut-step-4'
    >

      {/* Transcript Availability Message */}
      {isSupportedLink && transcriptAvailable !== null && (
        <Box
          sx={{
            width: '90%',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: transcriptAvailable
              ? 'success.light'
              : 'error.light',
            color: transcriptAvailable ? 'success.dark' : 'error.dark',
            borderRadius: '6px',
            padding: '5px 10px',
            fontSize: '0.9rem',
          }}
        >
          {transcriptAvailable ? (
            <Typography variant="body2">
              '{details.title?.slice(0, 60)}...
            </Typography>
          ) : (
            <>
              <CancelIcon sx={{ mr: 1, fontSize: '1rem' }} />
              <Typography variant="body2">Transcript unavailable</Typography>
            </>
          )}
        </Box>
      )}

      {/* Loading Indicator */}
      {isCheckingTranscript && (
        <Box sx={{ width: '90%', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={16} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Checking transcript...
          </Typography>
        </Box>
      )}

      {/* Extract Facts Message */}
      {isLongQuery && (
        <Box
          sx={{
            width: '90%',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'warning.light',
            color: 'warning.dark',
            borderRadius: '6px',
            padding: '5px 10px',
          }}
        >
          <Typography variant="body2">Long query detected. Extracting claims...</Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: 0, position: 'relative' }}>
        {hideSearchBar && !isAuthenticated ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
            sx={{
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: isMobile ? '0.9rem' : '1rem',
              textTransform: 'none',
            }}
          >
            Sign in to continue
          </Button>
        ) : (
          <ClickAwayListener onClickAway={() => setOpenRecommend(false)}>
            <Box sx={{ width: '100%', position: 'relative' }}>
              <TextField
                id="search-bar-text-field"
                className= 'facti-tut-search-bar-text-field'
                variant="standard"
                placeholder="Type a claim or paste a youtube, tiktok, instagram, or apple podcasts link..."
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  setOpenRecommend(value.trim() === '');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    initiateSearch();
                  }
                }}
                multiline
                maxRows={3}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton sx={{ color: 'text.secondary' }} onClick={handleMenuClick} size="small">
                        <DisplaySettingsIcon className='facti-tut-step-5'/>
                      </IconButton>
                      {/* <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            Credits Left: {userCredits}
                          </Typography>
                      </Box> */}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {isLink && (
                        <Chip
                          label={linkType.name}
                          sx={{
                            mr: 1,
                            backgroundColor: linkType.color,
                            color: linkType.name === 'TikTok' ? '#FFF' : 'text.primary',
                            fontSize: '0.8rem',
                          }}
                          size="small"
                        />
                      )}
                      <Tooltip title={isCheckingTranscript ? 'Checking...' : 'Search'}>
                        <span>
                          <IconButton
                            onClick={initiateSearch}
                            disabled={isCheckingTranscript}
                            sx={{
                              backgroundColor: isCheckingTranscript ? 'grey.400' : '#0066FF',
                              color: 'white',
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              '&:hover': { backgroundColor: '#0055CC' },
                            }}
                          >
                            {isCheckingTranscript ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <Search className={`facti-tut-step-6 ${highlightSearch ? 'highlight' : ''}`}/>}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    width: '100%',
                    padding: '6px 10px',
                  },
                }}
                fullWidth
                disabled={isCheckingTranscript}
                inputRef={searchBarRef}
                onFocus={() => searchQuery.trim() === '' && setOpenRecommend(true)}
                ref={popperAnchorRef}
              />
            </Box>
          </ClickAwayListener>
        )}
      </Box>

      {/* Settings Menu */}
      {/* <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} PaperProps={{ sx: { borderRadius: '10px', padding: '8px', boxShadow: 3 } }}>
        <MenuItem>
          <ListItemIcon>
            <CheckCircleIcon color="primary" />
          </ListItemIcon>
          <ListItemText>Pro Mode</ListItemText>
          <Switch checked={isProMode} onChange={handleToggle} />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <FormatQuoteIcon color="primary" />
          </ListItemIcon>
          <ListItemText>Source Finder Mode</ListItemText>
          <Switch checked={sourceFindMode} onChange={handleToggleSource} />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Business color="action" />
          </ListItemIcon>
          <ListItemText>Disambiguate</ListItemText>
          <Switch checked={!skipDisambiguation} onChange={handleToggleSkipDisambiguation} />
        </MenuItem>
      </Menu> */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} PaperProps={{ sx: { borderRadius: '10px', padding: '8px', boxShadow: 3 } }}>
        {/* <MenuItem>
          <ListItemIcon>
            <FormatQuoteIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Source Finder Mode" 
            secondary="Helps you get exact quotes from sources." 
          />
          <Switch checked={sourceFindMode} onChange={handleToggleSource} />
        </MenuItem> */}
        <MenuItem>
          <ListItemIcon>
            <Business color="action" />
          </ListItemIcon>
          <ListItemText 
            primary="Disambiguate" 
            secondary="Asks clarification questions to refine the fact check." 
          />
          <Switch checked={!skipDisambiguation} onChange={handleToggleSkipDisambiguation} />
        </MenuItem>
      </Menu>

    </Box>
  );
};
//   );
// }

export default SearchBar;

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Box,
//   IconButton,
//   TextField,
//   InputAdornment,
//   Popper,
//   Paper,
//   Menu,
//   MenuItem,
//   Switch,
//   ListItemIcon,
//   ListItemText,
//   Chip,
//   Typography,
//   CircularProgress,
//   Tooltip,
//   Button,
//   ClickAwayListener,
//   useMediaQuery,
//   Card,
//   CardActionArea,
//   CardContent,
// } from '@mui/material';
// import {
//   Business,
//   Search,
//   DisplaySettings as DisplaySettingsIcon,
//   CheckCircle as CheckCircleIcon,
//   Cancel as CancelIcon,
//   TextSnippet as TextSnippetIcon,
//   VideoLibrary as VideoLibraryIcon,
// } from '@mui/icons-material';
// import { useAppContext } from '../AppProvider';
// import { useAuth0 } from '@auth0/auth0-react';
// import { useTheme } from '@mui/material/styles';

// function SearchBar({
//   searchQuery,
//   setSearchQuery,
//   handleSearchClick,
//   isProMode,
//   handleToggle,
//   isSearchMoved,
// }) {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [openRecommend, setOpenRecommend] = useState(false);
//   const [linkType, setLinkType] = useState(null);
//   const [transcriptAvailable, setTranscriptAvailable] = useState(null);
//   const [details, setDetails] = useState({});
//   const [isCheckingTranscript, setIsCheckingTranscript] = useState(false);
//   const [menuWidth, setMenuWidth] = useState(0);

//   const sampleRecommendations = [
//     {
//       type: 'text',
//       content: 'Bananas are a type of berries',
//       title: 'None',
//     },
//     {
//       type: 'video',
//       content: 'https://www.youtube.com/watch?v=lQBsOT38sQY',
//       title: "Elon Musk - Things Most People Don't Know About China",
//     },
//     {
//       type: 'video',
//       content: 'https://www.youtube.com/watch?v=HeG-laB_YL4',
//       title: 'Never Eat Broccoli with This🥦 Cause Cancer ..',
//     },
//     {
//       type: 'video',
//       content: 'https://www.youtube.com/watch?v=G8T1O81W96Y',
//       title: 'Sam Altman & Brad Lightcap: Which Companies Will Be Steamrolled by OpenAI?',
//     },
//     {
//       type: 'video',
//       content: 'https://www.youtube.com/shorts/6hM6j4zyEjU',
//       title: 'Spicy food and stomach ulcers',
//     },
//   ];

//   const {
//     skipDisambiguation,
//     setSkipDisambiguation,
//     mode,
//     currentConversation,
//     hideSearchBar,
//   } = useAppContext();

//   const handleToggleSkipDisambiguation = () => {
//     setSkipDisambiguation(!skipDisambiguation);
//   };

//   const open = Boolean(anchorEl);

//   const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

//   const handleLogin = async () => {
//     try {
//       await loginWithRedirect();
//     } catch (error) {
//       console.error('Login failed:', error);
//     }
//   };

//   // Define the minimum number of words required for a valid search
//   const MIN_WORD_COUNT = 0; // change as needed

//   // Helper function to count words in the search query
//   const countWords = (query) => {
//     return query.trim().split(/\s+/).length;
//   };

//   // Function to extract the video ID from a YouTube URL
//   const extractVideoId = (url) => {
//     const videoIdMatch = url.match(
//       /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/
//     );
//     return videoIdMatch ? videoIdMatch[1] : null;
//   };

//   // Function to check if a YouTube video has captions
//   const checkYouTubeCaptions = async (url) => {
//     try {
//       const response = await fetch(
//         `https://backend-word-testing-934923488639.us-central1.run.app/check-youtube-transcript?input_url=${encodeURIComponent(
//           url
//         )}`
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();

//       setTranscriptAvailable(data.transcript_available);
//       setDetails(data.details);
//     } catch (error) {
//       console.error('Error checking captions:', error);
//       setTranscriptAvailable(false); // Assume no captions on error
//     }
//   };

//   // Debounced search query state
//   const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

//   // Effect to handle debouncing
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearchQuery(searchQuery);
//     }, 50); // Adjust delay as needed

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [searchQuery]);

//   // Ref for the TextField to measure its width
//   const searchBarRef = useRef(null);

//   // Theme and media query for responsiveness
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   // Effect to update the Popper width based on the search bar's width and screen size
//   useEffect(() => {
//     const updatePopperWidth = () => {
//       if (searchBarRef.current) {
//         let width;
//         if (isMobile) {
//           width = window.innerWidth * 0.7; // 70% of viewport width on mobile
//         } else {
//           const searchBarWidth = searchBarRef.current.getBoundingClientRect().width;
//           width = searchBarWidth * 0.8; // 80% of search bar's width on larger screens
//         }
//         setMenuWidth(width);
//       }
//     };

//     updatePopperWidth();
//     window.addEventListener('resize', updatePopperWidth);

//     return () => {
//       window.removeEventListener('resize', updatePopperWidth);
//     };
//   }, [isMobile]);

//   // Reference for the Popper anchor
//   const popperAnchorRef = useRef(null);

//   // Effect to detect input type and perform checks based on debouncedSearchQuery
//   useEffect(() => {
//     let detectedType = null;

//     // Reset previous states
//     setLinkType(null);
//     setTranscriptAvailable(null);
//     setDetails({});

//     if (debouncedSearchQuery.trim() === '') {
//       // If the search query is empty, no need to proceed further
//       return;
//     }

//     const isURL = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?/.test(
//       debouncedSearchQuery
//     );

//     if (isURL) {
//       // Define supported websites within the component
//       const supportedWebsites = [
//         {
//           name: 'YouTube',
//           regex: /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\//,
//           color: '#FF0000',
//         },
//       ];

//       for (const site of supportedWebsites) {
//         if (site.regex.test(debouncedSearchQuery)) {
//           detectedType = site;
//           break;
//         }
//       }

//       if (detectedType) {
//         setLinkType(detectedType);
//         // If it's a supported URL, check for captions
//         const videoId = extractVideoId(debouncedSearchQuery);
//         if (videoId) {
//           const fetchCaptions = async () => {
//             setIsCheckingTranscript(true);
//             await checkYouTubeCaptions(debouncedSearchQuery);
//             setIsCheckingTranscript(false);
//           };
//           fetchCaptions();
//         }
//       } else {
//         setLinkType({ name: 'Unsupported Link', color: '#808080' });
//       }
//     } else {
//       // If it's not a URL, validate as a proper claim
//       if (countWords(debouncedSearchQuery) < MIN_WORD_COUNT) {
//         // Handle in the render logic
//       }
//     }
//   }, [debouncedSearchQuery]);

//   // Additional Effect to control Popper visibility based on searchQuery
//   useEffect(() => {
//     if (searchQuery.trim() !== '') {
//       setOpenRecommend(false);
//     } 
//     // else {
//     //   setOpenRecommend(true);
//     // }
//   }, [searchQuery]);

//   // Determine the current input state
//   const isLink = linkType !== null;
//   const isSupportedLink = isLink && linkType.name !== 'Unsupported Link';
//   const isQueryTooShort =
//     !isLink &&
//     debouncedSearchQuery.trim() !== '' &&
//     countWords(debouncedSearchQuery) < MIN_WORD_COUNT;
//   const isLongQuery = debouncedSearchQuery.length > 250;

//   // Initiate the search
//   const initiateSearch = () => {
//     if (searchQuery.trim() !== '') {
//       if (isSupportedLink) {
//         if (transcriptAvailable !== false && !isCheckingTranscript) {
//           handleSearchClick();
//         }
//       } else if (isLink && linkType.name === 'Unsupported Link') {
//         // Do not proceed for unsupported links
//       } else {
//         // It's a claim
//         if (!isQueryTooShort) {
//           handleSearchClick();
//         }
//       }
//     }
//   };

//   // Handle clicking on example card
//   const handleCardClick = (sample) => {
//     setSearchQuery(sample.content);
//     // We can set a short timeout to ensure the query updates
//     setTimeout(() => {
//       initiateSearch();
//     }, 0);
//   };

//   return (
//     <div>
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         transition: 'all 0.5s ease',
//         backgroundColor: 'background.paper',
//         borderRadius: '30px',
//         padding: '12px 0px',
//         boxShadow: 3,
//         width: '100%',
//         position: 'relative',
//       }}
//     >
//       {/* Transcript Availability Message */}
//       {isSupportedLink && transcriptAvailable !== null && (
//         <Box
//           sx={{
//             width: '80%',
//             mb: 1,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: transcriptAvailable
//               ? 'success.light'
//               : 'error.light',
//             color: transcriptAvailable ? 'success.dark' : 'error.dark',
//             borderRadius: '8px',
//             padding: '6px 12px',
//           }}
//         >
//           {transcriptAvailable ? (
//             <>
//               <Typography variant="body2">
//                 '{details.title?.slice(0, 60)}...
//               </Typography>
//             </>
//           ) : (
//             <>
//               <CancelIcon sx={{ mr: 1 }} />
//               <Typography variant="body2">Transcript unavailable</Typography>
//             </>
//           )}
//         </Box>
//       )}

//       {/* Loading Indicator while checking transcript */}
//       {isCheckingTranscript && (
//         <Box
//           sx={{
//             width: '80%',
//             mb: 1,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}
//         >
//           <CircularProgress size={20} />
//           <Typography variant="body2" sx={{ ml: 1 }}>
//             Checking transcript availability...
//           </Typography>
//         </Box>
//       )}

//       {/* Inform user about extractFacts mode for long queries */}
//       {isLongQuery && (
//         <Box
//           sx={{
//             width: '80%',
//             mb: 1,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: 'warning.light',
//             color: 'warning.dark',
//             borderRadius: '8px',
//             padding: '6px 12px',
//           }}
//         >
//           <Typography variant="body2">
//             Long query detected. Will perform claim extraction.
//           </Typography>
//         </Box>
//       )}

//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           width: '100%',
//           flexWrap: 'wrap',
//           gap: 0,
//           position: 'relative',
//         }}
//       >
//         {hideSearchBar ? (
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleLogin}
//             fullWidth
//             sx={{
//               borderRadius: '30px',
//               padding: '10px 20px',
//               textTransform: 'none',
//             }}
//           >
//             Sign in to continue fact checking
//           </Button>
//         ) : (
//           <>
//             <ClickAwayListener onClickAway={() => setOpenRecommend(false)}>
//               <Box sx={{ width: '100%', position: 'relative' }}>
//                 <TextField
//                   variant="standard"
//                   placeholder="Type your claim here or paste a Youtube URL..."
//                   value={searchQuery}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     setSearchQuery(value);

//                     if (value.trim() !== '') {
//                       setOpenRecommend(false);
//                     } else {
//                       setOpenRecommend(true);
//                     }
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       if (e.shiftKey) {
//                         return; // allow newline
//                       } else {
//                         e.preventDefault();
//                         initiateSearch();
//                       }
//                     }
//                   }}
//                   multiline
//                   maxRows={4}
//                   InputProps={{
//                     disableUnderline: true,
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <IconButton
//                           sx={{ color: 'text.secondary' }}
//                           onClick={handleMenuClick}
//                         >
//                           <DisplaySettingsIcon />
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         {isLink && (
//                           <Chip
//                             label={linkType.name}
//                             sx={{
//                               mr: 1,
//                               backgroundColor: linkType.color,
//                               color:
//                                 linkType.name === 'TikTok'
//                                   ? '#FFFFFF'
//                                   : 'text.primary',
//                             }}
//                             size="small"
//                           />
//                         )}
//                         <Tooltip
//                           title={
//                             isLink && linkType.name === 'Unsupported Link'
//                               ? 'Unsupported link. Cannot search.'
//                               : isSupportedLink && transcriptAvailable === false
//                               ? 'Cannot search without available transcript.'
//                               : isCheckingTranscript
//                               ? 'Checking transcript availability...'
//                               : isQueryTooShort
//                               ? `Please enter a proper claim.`
//                               : ''
//                           }
//                           disableHoverListener={
//                             (!isLink ||
//                               (isLink && linkType.name !== 'Unsupported Link')) &&
//                             transcriptAvailable !== false &&
//                             !isCheckingTranscript &&
//                             !isQueryTooShort
//                           }
//                         >
//                           <span>
//                             <IconButton
//                               id="searchBarIconButton"
//                               onClick={initiateSearch}
//                               disabled={
//                                 (isLink && linkType.name === 'Unsupported Link') ||
//                                 (isSupportedLink && transcriptAvailable === false) ||
//                                 isCheckingTranscript ||
//                                 isQueryTooShort
//                               }
//                               sx={{
//                                 backgroundColor:
//                                   (isLink && linkType.name === 'Unsupported Link') ||
//                                   (isSupportedLink && transcriptAvailable === false) ||
//                                   isQueryTooShort
//                                     ? 'grey.400'
//                                     : '#0066FF',
//                                 color: 'white',
//                                 width: 48,
//                                 height: 48,
//                                 borderRadius: '50%',
//                                 '&:hover': {
//                                   backgroundColor:
//                                     (isLink && linkType.name === 'Unsupported Link') ||
//                                     (isSupportedLink &&
//                                       transcriptAvailable === false) ||
//                                     isQueryTooShort
//                                       ? 'grey.400'
//                                       : '#0066FF',
//                                 },
//                               }}
//                             >
//                               {isCheckingTranscript ? (
//                                 <CircularProgress
//                                   size={24}
//                                   sx={{ color: 'white' }}
//                                 />
//                               ) : (
//                                 <Search />
//                               )}
//                             </IconButton>
//                           </span>
//                         </Tooltip>
//                       </InputAdornment>
//                     ),
//                     sx: {
//                       borderRadius: '30px',
//                       backgroundColor: 'background.default',
//                       width: '100%',
//                       padding: '8px 12px',
//                     },
//                   }}
//                   fullWidth
//                   disabled={isCheckingTranscript}
//                   inputRef={searchBarRef}
//                   onFocus={() => {
//                     if (searchQuery.trim() === '') {
//                       setOpenRecommend(true);
//                     }
//                   }}
//                   ref={popperAnchorRef}
//                 />
//                 {/* Recommendations Popper */}
//                 <Popper
//                   open={openRecommend}
//                   anchorEl={popperAnchorRef.current}
//                   placement="bottom-start"
//                   style={{ zIndex: 1300 }}
//                   modifiers={[
//                     {
//                       name: 'offset',
//                       options: {
//                         offset: [0, 8],
//                       },
//                     },
//                     {
//                       name: 'width',
//                       enabled: true,
//                       phase: 'beforeWrite',
//                       requires: ['computeStyles'],
//                       fn: ({ state }) => {
//                         state.styles.popper.width = `${menuWidth}px`;
//                       },
//                       effect: ({ state }) => {
//                         state.elements.popper.style.width = `${menuWidth}px`;
//                       },
//                     },
//                   ]}
//                 >
//                   <Paper
//                     sx={{
//                       borderRadius: '12px',
//                       padding: '8px 8px',
//                       boxShadow: 5,
//                       maxHeight: 300,
//                       overflow: 'auto',
//                       width: '100%',
//                     }}
//                   >
//                     {sampleRecommendations.map((sample, index) => (
//                       <MenuItem
//                         key={index}
//                         onClick={() => {
//                           setSearchQuery(sample.content);
//                           setTimeout(() => {
//                             initiateSearch();
//                           }, 0);
//                           setOpenRecommend(false);
//                         }}
//                         sx={{ cursor: 'pointer' }}
//                       >
//                         <ListItemIcon>
//                           {sample.type === 'text' ? (
//                             <TextSnippetIcon />
//                           ) : sample.type === 'video' ? (
//                             <VideoLibraryIcon />
//                           ) : null}
//                         </ListItemIcon>
//                         <ListItemText
//                           primary={sample.content}
//                           secondary={
//                             sample.title !== 'None' ? sample.title : ''
//                           }
//                         />
//                       </MenuItem>
//                     ))}
//                   </Paper>
//                 </Popper>
//               </Box>
//             </ClickAwayListener>
//           </>
//         )}
//       </Box>

//       {/* Settings Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleMenuClose}
//         PaperProps={{
//           sx: {
//             borderRadius: '12px',
//             padding: '8px 16px',
//             boxShadow: 5,
//           },
//         }}
//       >
//         <MenuItem>
//           <ListItemIcon>
//             <CheckCircleIcon color="primary" />
//           </ListItemIcon>
//           <ListItemText>Pro Mode</ListItemText>
//           <Switch checked={isProMode} onChange={handleToggle} />
//         </MenuItem>
//         <MenuItem>
//           <ListItemIcon>
//             <Business color="action" />
//           </ListItemIcon>
//           <ListItemText>Disambiguate</ListItemText>
//           <Switch
//             checked={!skipDisambiguation}
//             onChange={handleToggleSkipDisambiguation}
//           />
//         </MenuItem>
//       </Menu>
//     </Box>



//     </div>
//   );
// }

// export default SearchBar;
