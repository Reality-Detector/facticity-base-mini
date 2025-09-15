// SearchComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Box,
  Paper,
  Skeleton,
  useMediaQuery,
  useTheme,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  //useTheme,
  Chip,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Button,
} from "@mui/material";
import FactCheckDisplay from './FactCheckDisplay'
import '@/styles/globals.css'; // Animation and scrollbar styles are now in globals.css
import { useAppContext } from '../AppProvider';
import { v4 as uuidv4 } from 'uuid';
import SearchBar from './searchBar';
import ErrorComponent from './ErrorComponent';
import VideoParagraphComponent from './Video/videoExpand';
import useAuth from '../auth/useAuthHook';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from "axios";
import HeadlineDisplay from './HeadlineDisplay';

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExampleCards from "./Examples";

import { KeyboardArrowLeft, KeyboardArrowRight, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import { useNavigate, useLocation } from 'react-router-dom';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

//import { Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Link } from 'react-router-dom';
import Game from '../game';

import { Image as ImageIcon, Description as FileTextIcon, YouTube as YoutubeIcon, TextFields as TextIcon, UnfoldLess as UnfoldLessIcon, UnfoldMore as UnfoldMoreIcon } from "@mui/icons-material";

// Compact Leaderboard Display Component
const CompactLeaderboardDisplay = () => {
  const [gamefiles, setGamefiles] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState({});
  const [leaderboardLoading, setLeaderboardLoading] = useState({});
  const [loading, setLoading] = useState(true);
  const [userHandle, setUserHandle] = useState('');
  const { backendUrl, accessToken } = useAppContext();
  const { isAuthenticated, user , getAccessTokenSilently} = useAuth();
  const navigate = useNavigate();
 

  // Fetch access token when authenticated

  // Fetch user handle when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetchUserHandle();
    }
  }, [isAuthenticated, user]);

  // Function to fetch user handle
  const fetchUserHandle = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
        headers['Validator'] = 'privy';
      }
      
      const response = await fetch(`${backendUrl}/api/get_userhandle?email=${encodeURIComponent(user.id)}`, {
        headers: headers,
      });
      if (!response.ok) throw new Error('Failed to fetch user handle');
      
      const data = await response.json();
      if (data.handle) {
        setUserHandle(data.handle);
      }
    } catch (error) {
      console.error('Error fetching user handle:', error);
      setUserHandle(user?.name || '');
    }
  };

  // Fetch gamefiles for leaderboard
  const fetchGamefiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/get-all-gamefiles`);
      
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      
      // Sort by timestamp - assuming IDs have timestamp information in the first 4 bytes
      const sortedIds = [...data.ids].sort().reverse(); // Simple sorting for now
      
      // Create formatted dates from ObjectIDs - only take the first 3 games
      const gamefilesWithDates = sortedIds.slice(0, 3).map(id => {
        // Extract timestamp from MongoDB ObjectID
        const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
        const date = new Date(timestamp);
        return {
          id,
          date: date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        };
      });
      
      setGamefiles(gamefilesWithDates);
      
      // Fetch leaderboard data for the first game automatically
      if (gamefilesWithDates.length > 0) {
        fetchLeaderboardForGame(gamefilesWithDates[0].id);
      }
    } catch (error) {
      console.error('Error fetching gamefiles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch leaderboard data for a specific game
  const fetchLeaderboardForGame = async (gameId) => {
    setLeaderboardLoading(prev => ({ ...prev, [gameId]: true }));
    
    try {
      const response = await fetch(`${backendUrl}/api/leaderboard/game/${gameId}`);
      
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      
      setLeaderboardData(prev => ({
        ...prev,
        [gameId]: data.leaderboard
      }));
    } catch (error) {
      console.error(`Error fetching leaderboard for game ${gameId}:`, error);
    } finally {
      setLeaderboardLoading(prev => ({ ...prev, [gameId]: false }));
    }
  };

  // Find user's rank in the leaderboard
  const findUserRank = (leaderboard) => {
    if (!isAuthenticated || !user || !leaderboard || leaderboard.length === 0) return null;
    
    // First try to find by user handle (preferred method)
    if (userHandle) {
      const userEntryByHandle = leaderboard.findIndex(entry => {
        return (
          (entry.user_handle && entry.user_handle.toLowerCase() === userHandle.toLowerCase()) ||
          (entry.handle && entry.handle.toLowerCase() === userHandle.toLowerCase())
        );
      });
      
      if (userEntryByHandle !== -1) {
        return {
          rank: userEntryByHandle + 1,
          score: leaderboard[userEntryByHandle].score,
          total: leaderboard.length
        };
      }
    }
    
    // Fallback to other identification methods
    const userEntry = leaderboard.findIndex(entry => {
      return (
        (entry.user_email && user.email && entry.user_email.toLowerCase() === user.email.toLowerCase()) ||
        (entry.user_handle && user.name && entry.user_handle.toLowerCase() === user.name.toLowerCase()) ||
        (entry.handle && user.name && entry.handle.toLowerCase() === user.name.toLowerCase()) ||
        (entry.user_name && user.name && entry.user_name.toLowerCase() === user.name.toLowerCase()) ||
        (entry.display_name && user.name && entry.display_name.toLowerCase() === user.name.toLowerCase())
      );
    });
    
    if (userEntry === -1) return null;
    
    return {
      rank: userEntry + 1,
      score: leaderboard[userEntry].score,
      total: leaderboard.length
    };
  };

  useEffect(() => {
    fetchGamefiles();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
      </Box>
    );
  }

  const latestGame = gamefiles[0];
  const leaderboard = latestGame ? leaderboardData[latestGame.id] : null;
  const isLoadingLatest = latestGame ? leaderboardLoading[latestGame.id] : false;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Game Date */}
      {latestGame && (
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary', 
            fontSize: '0.75rem',
            mb: 1
          }}
        >
          Game from {latestGame.date}
        </Typography>
      )}

      {/* User's Rank (if available) */}
      {isAuthenticated && leaderboard && findUserRank(leaderboard) && (
        <Box 
          sx={{ 
            mb: 1, 
            p: 1, 
            borderRadius: '8px', 
            bgcolor: 'rgba(0, 102, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmojiEventsIcon sx={{ color: '#0066FF', mr: 1, fontSize: '1rem' }} />
            <Box>
              <Typography variant="caption" sx={{ 
                fontWeight: 600, 
                color: '#0066FF',
                fontSize: '0.7rem',
                display: 'block'
              }}>
                Your Rank
              </Typography>
              <Typography variant="caption" sx={{ 
                color: 'text.secondary',
                fontSize: '0.65rem'
              }}>
                #{findUserRank(leaderboard).rank} / {findUserRank(leaderboard).total}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ 
            fontWeight: 600, 
            color: '#0066FF',
            fontSize: '0.7rem'
          }}>
            Score: {findUserRank(leaderboard).score}
          </Typography>
        </Box>
      )}

      {/* Leaderboard Table */}
      {isLoadingLatest ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={20} />
        </Box>
      ) : leaderboard?.length > 0 ? (
        <TableContainer sx={{ maxHeight: 150 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  color: '#0066FF',
                  fontSize: '0.7rem',
                  padding: '4px 8px'
                }}>
                  Rank
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  color: '#0066FF',
                  fontSize: '0.7rem',
                  padding: '4px 8px'
                }}>
                  Player
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  color: '#0066FF',
                  fontSize: '0.7rem',
                  padding: '4px 8px',
                  textAlign: 'right'
                }}>
                  Score
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard.slice(0, 5).map((entry, index) => (
                <TableRow 
                  key={`leaderboard-${index}`}
                  sx={{
                    '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 102, 255, 0.02)' },
                    height: '32px'
                  }}
                >
                  <TableCell sx={{ 
                    fontWeight: 500,
                    color: index < 3 ? '#0066FF' : 'inherit',
                    fontSize: '0.7rem',
                    padding: '2px 8px'
                  }}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ 
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    maxWidth: '80px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {entry.user_handle || entry.handle || 'Anonymous'}
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 500,
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    textAlign: 'right'
                  }}>
                    {entry.score}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '0.7rem',
            textAlign: 'center',
            py: 2
          }}
        >
          No leaderboard data available
        </Typography>
      )}
    </Box>
  );
};

// Enhanced Carousel component for discover posts
const DiscoverPostCarousel = ({ posts = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgError, setImgError] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (posts.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % posts.length);
      }, 5000); // Change post every 5 seconds
      return () => clearInterval(interval);
    }
  }, [posts.length]);

  if (posts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
      </Box>
    );
  }

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prevIndex) => (prevIndex + 1) % posts.length);
  };

  const handlePostClick = (postId) => {
    navigate(`/discover/feed?scrollTo=${postId}`);
  };

  const handleImageError = (postId) => {
    setImgError(prev => ({ ...prev, [postId]: true }));
  };

  const currentPost = posts[activeIndex];

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Single post card */}
      <Card 
        sx={{ 
          borderRadius: 2, 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          width: '100%',
          height: 200,
          display: 'flex',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 102, 255, 0.15)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        <CardActionArea 
          onClick={() => handlePostClick(currentPost.id)}
          sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'stretch' }}
        >
          {/* Thumbnail Image */}
          <Box
            sx={{
              width: 120,
              minWidth: 120,
              height: '100%',
              overflow: 'hidden',
              background: '#e3edfc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px 0 0 8px'
            }}
          >
            {currentPost.thumbnail && !imgError[currentPost.id] ? (
              <Box
                component="img"
                src={currentPost.thumbnail}
                alt="Post thumbnail"
                onError={() => handleImageError(currentPost.id)}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              <Box
                component="img"
                src="/facticityailogo-03.png"
                alt="Facticity.AI logo"
                sx={{
                  width: '80%',
                  height: 'auto',
                  maxHeight: '60%',
                  objectFit: 'contain',
                }}
              />
            )}
          </Box>

          {/* Content */}
          <CardContent sx={{ 
            flex: 1, 
            p: 1.5, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            height: '100%'
          }}>
            {/* Main content area */}
            <Box sx={{ flex: 1 }}>
              {/* Fact Check Query - Primary content */}
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(0, 102, 255, 0.7)', 
                  fontWeight: 500, 
                  fontSize: '0.7rem',
                  display: 'block',
                  mb: 0.5
                }}
              >
                Fact Check:
              </Typography>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: '0.85rem',
                  lineHeight: 1.3,
                  mb: 1.5,
                  color: '#0066FF',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {currentPost.query || "Fact check query not available"}
              </Typography>
              
              {/* Username with @ prefix */}
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.75rem',
                  color: '#0066FF',
                  fontWeight: 600,
                  mb: 1,
                  display: 'block'
                }}
              >
                @{currentPost.publish_name || "anonymous"}
              </Typography>

              {/* User Title */}
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  lineHeight: 1.2,
                  mb: 0.5,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {currentPost.publish_title || "Untitled Post"}
              </Typography>

              {/* Description */}
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                  lineHeight: 1.3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {(currentPost.description || currentPost.publish_description || currentPost.result_text)?.substring(0, 120) || "No description available"}
                {(currentPost.description || currentPost.publish_description || currentPost.result_text)?.length > 120 ? '...' : ''}
              </Typography>
            </Box>

            {/* Bottom action button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
              <Chip 
                label="View" 
                size="small" 
                sx={{ 
                  fontSize: '0.65rem', 
                  bgcolor: '#0066FF', 
                  color: 'white',
                  height: '20px',
                  '&:hover': {
                    bgcolor: '#004FCC'
                  }
                }}
              />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>

      {/* Navigation arrows (only show if more than 1 post) */}
      {posts.length > 1 && (
        <>
          <IconButton 
            size="small" 
            sx={{ 
              position: 'absolute', 
              left: 4, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              bgcolor: 'rgba(255,255,255,0.9)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              width: 28,
              height: 28,
              zIndex: 2,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,1)'
              }
            }}
            onClick={handlePrev}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ 
              position: 'absolute', 
              right: 4, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              bgcolor: 'rgba(255,255,255,0.9)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              width: 28,
              height: 28,
              zIndex: 2,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,1)'
              }
            }}
            onClick={handleNext}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </>
      )}

      {/* Navigation dots */}
      {posts.length > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
          {posts.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 6,
                height: 6,
                mx: 0.5,
                borderRadius: '50%',
                backgroundColor: index === activeIndex ? '#0066FF' : '#C4C4C4',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

const SearchComponent = ({ isSearchMoved, setIsSearchMoved, isMdUp, initialUrlParam }) => {
  //const [searchQuery, setSearchQuery] = useState("");
  const [isProMode, setIsProMode] = useState(false);
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth();
  const [searchVersion, setSearchVersion] = useState("basic"); // Default to 'basic'
  const [resultVersion, setResultVersion] = useState("basic"); // Default to 'basic'
  const [userVersion, setUserVersion] = useState("basic")
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [manualRefresh, setManualRefresh] = useState(false) // I am adding this for state update trigger
  const [searchCount, setSearchCount] = useState(0);
  const [isProDialogOpen, setProDialogOpen] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const [aboutExpanded, setAboutExpanded] = useState(false); // Add state for about expansion
  const location = useLocation();
  const isGamePath = location.pathname === '/game';

  const {
    version,
    setVersion,
    currentConversation,
    setConversations,
    setCurrentConversation,
    queries,
    setQueries,
    email,
    ids,
    workspaceLoading,
    mode,
    link,
    setLink,
    setIdHistory,
    setMode,
    errorDisplay,
    setErrorDisplay,
    setNewSearch,
    setOverlayLogin,
    hideSearchBar,
    setHideSearchBar,
    skipDisambiguation,
    isProUser,
    backendUrl,
    headlines,
    sourceFindMode,
    userCredits,
    creditsLoading,
    searchQuery, setSearchQuery,
    setRun, setForceRun,
    discoverPosts = [], // Get discoverPosts from AppContext with a default empty array
  } = useAppContext();
  

  // const theme = useTheme();
  // const isSmUp = useMediaQuery(theme.breakpoints.up('sm')); // >=600px
  // const isMdUp = useMediaQuery(theme.breakpoints.up('md')); // >=900px
  const scrollableDivRef = useRef(null);
  const bottomRef = useRef(null); // **New Ref for Sentinel Element**

  const [text, setText] = useState("");
  const fullText = "Let's get fact-checking!"; // The full text to type out
  const typingSpeed = 50; // Typing speed in milliseconds
  const indexRef = useRef(0); // To keep track of the current index
  const timeoutRef = useRef(null); // To store the timeout ID

  const [internalTrigger, setInternalTrigger] = useState(true)
  const [externalTrigger, setExternalTrigger] = useState(true)
  const [conversationIdMatch, setConversationIdMatch] = useState(true)

  const navigate = useNavigate(); // React Router's navigation hook
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const checkUserConvoMapping = async () => {
      if (!currentConversation || !user?.email) return;
      
      try {
        const response = await fetch(backendUrl+`/check-convo-user-mapping`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            // 'X-API-KEY': frontend_key,
          },
          body: JSON.stringify({
            userEmail: user.email,
            convoId: currentConversation,
          }),
        });
  
        console.log("user convo mapping response");
        console.log(response);
  
        if (!response.ok) {
          throw new Error('Failed to match convo id and user');
        }
  
        const data = await response.json();
        const convoMatch = data.id_match;
        console.log({convoMatch})
        if (convoMatch === false) {
          setConversationIdMatch(false);
        }
  
      } catch (error) {
        console.error('Error checking convo-user mapping:', error);
      }
    };
  
    checkUserConvoMapping();
  }, [currentConversation]);


  useEffect(() => {
    const typeWriter = () => {
      // Ensure that fullText is defined and index is within bounds
      if (indexRef.current < fullText.length) {
        const currentChar = fullText[indexRef.current];
        
        // Prevent appending undefined or null characters
        if (currentChar !== undefined && currentChar !== null) {
          setText((prev) => prev + currentChar);
          indexRef.current += 1;
          timeoutRef.current = setTimeout(typeWriter, typingSpeed);
        } else {
          // If currentChar is undefined or null, stop the typing
          clearTimeout(timeoutRef.current);
        }
      }
    };

    typeWriter();

    // Cleanup function to clear the timeout when the component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setText(''); // Optional: Reset text when unmounting
      indexRef.current = 0; // Reset index
    };
  }, [fullText, typingSpeed]);


  const iconMap = {
    text: <TextIcon sx={{ color: "#757575", fontSize: { xs: 18, sm: 20, md: 24 } }} />,
    image: <ImageIcon sx={{ color: "#757575", fontSize: { xs: 18, sm: 20, md: 24 } }} />,
    video: <YoutubeIcon sx={{ color: "#757575", fontSize: { xs: 18, sm: 20, md: 24 } }} />,
    document: <FileTextIcon sx={{ color: "#757575", fontSize: { xs: 18, sm: 20, md: 24 } }} />,
  };
  
  

  const handleToggle = (event) => {
    setIsProMode(event.target.checked);
    setVersion(event.target.checked ? "pro" : "basic");
  };

  useEffect(() => {
    setIsProMode(version === "pro");
  }, [version]);

  useEffect(() => {
    setManualRefresh(!manualRefresh)
  }, [userCredits])

  const sendCurrentConversation = async (email, currentConversation, query) => {
    try {
      await fetch(backendUrl+'/update_ids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'Validator': 'privy'
        },
        body: JSON.stringify({
          email: email, // user email
          id: {
            id: currentConversation, // current conversation ID
            query: query // conversation query
          }
        })
      });
    } catch (error) {
      console.error("Error sending current conversation:", error);
    }
  };

  const isUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const checkCreditBalance = async (queryType) => {
    var message = ""
    if(queryType == 'short'){
          message = 'You have exhausted your daily fact-checking credits. Kindly upgrade your subscription or wait until tomorrow for the credits to refresh or refer a friend to get more credits.'
    }
    else{
        message = "You've exhausted your daily fact-checking credits. We will still extract claims, but full fact-checks are paused. Kindly upgrade or refer a friend to get more credits "
    }
    const creditValue = userCredits
    console.log(creditValue)
    if(creditValue == 0 && !creditsLoading){
      setToastMessage(message)
      setToastOpen(true)
    }
  }

  const handleSearchClick = async () => {
    console.log("in handlesearch")
    await checkCreditBalance()

    
    setErrorDisplay("");
    // Clear the search input and move the search UI if needed
    setSearchQuery("");
    setIsSearchMoved(true);
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) return;

    // console.log("searchCount is: ", searchCount)
    // console.log("isURL: ", isUrl(trimmedQuery))
    if(!isAuthenticated || !isAuthenticated && isUrl(trimmedQuery) || !isAuthenticated && trimmedQuery.length>250){
      // alert('Please login to continue searching');
      setOverlayLogin(true)
      return;
    }



    let newMode = mode;
    let newQueries = [...queries];
    // console.log({ newQueries });
    let newLink = null;

    let newSearchState = false;
    // Determine if a new conversation should be started
    const shouldStartNewConversation =
      queries.length === 0 || isUrl(trimmedQuery) || mode === 'extractFacts' || conversationIdMatch === false;

    if (sourceFindMode===false){
      if (isUrl(trimmedQuery)) {
        await checkCreditBalance('long')
        newLink = trimmedQuery;
        newQueries = [trimmedQuery];
        newMode = 'extractFacts';
        setNewSearch(true);
      } else if (trimmedQuery.length > 250){
        await checkCreditBalance('long')
        newLink = trimmedQuery;
        newQueries = [trimmedQuery];
        newMode = 'extractFacts';
        setNewSearch(true);
      } else if (mode === 'extractFacts') {
        await checkCreditBalance('short')
        newMode = 'verify';
        newQueries = [trimmedQuery];
        setNewSearch(true);
        setManualRefresh(!manualRefresh)
      } else {
        await checkCreditBalance('short')
        if (!conversationIdMatch){
          newMode = 'verify';
          newQueries = [trimmedQuery];
          setNewSearch(true);
          setManualRefresh(!manualRefresh)
        }else{
          newMode = 'verify';
          newQueries.push(trimmedQuery);
          setManualRefresh(!manualRefresh)
        }

      }
    }else{
      await checkCreditBalance('short')
      setManualRefresh(!manualRefresh) 
      if (!conversationIdMatch){
        newMode = 'verify';
        newQueries = [trimmedQuery];
        setNewSearch(true)
      } else{
        newMode = 'verify';
        newQueries.push(trimmedQuery);
        setManualRefresh(!manualRefresh)
      }    
    }

    // Update states based on the above decisions
    if (newLink) setLink(newLink);
    setMode(newMode);
    setQueries(newQueries);
    // console.log({ trimmedQuery });

    if (shouldStartNewConversation) {
      setIdHistory({});
      let newConversationId = ""
      if (isAuthenticated){
        newConversationId = uuidv4();
      }else{
        newConversationId = "";

      }
      setCurrentConversation(newConversationId);

      setConversations((prevIds) => [
        ...prevIds,
        { query: trimmedQuery, id: newConversationId },
      ]);

      // Send conversation data and update URL without page navigation
      await sendCurrentConversation(email, newConversationId, trimmedQuery);
      window.history.replaceState(null, "", `/c/${newConversationId}`);
    }
    if(!isAuthenticated){
      setSearchCount(searchCount + 1)
    }
  };


  // useEffect(() => {
  //   console.log({ queries });
  // }, [queries]);

  // **Remove the previous useEffect for scrolling based on queries**

  // **Add a new useEffect to scroll to the sentinel element after each render**
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [queries, workspaceLoading, mode, link]); // Add dependencies as needed

  // useEffect(() => {
  //   console.log("use effect check daily credits left")

  //   const checkCreditBalance = async () => {
  //     try {
      
  //     const response = await axios.post(`${backendUrl}/check_credits_util`, {
  //       userEmail: user.email,
  //     });
  //     if(response.data.success){
  //       const alertValue = false
  //       alertValue = response.data.userCredits == 0 ? true: false
  //       console.log(response.data.userCredits )
  //       setToastMessage("You have exhausted your daily fact-checking limits. Kindly upgrade your subscription or wait until tomorrow for the credits to refresh.")
  //       setToastOpen(true)
  //       setManualRefresh(!manualRefresh)
  //     }
  //     }
  //     catch{

  //     }
  //   }

  //   if(mode == 'verify')
  //     {
  //       checkCreditBalance();
  //     }
  // }, [manualRefresh])

  useEffect(() => {
    console.log("use effect checkPro running")
    const checkProSearches = async () => {
      try {
        if(isProUser == false){
          const response = await axios.post(`${backendUrl}/check_pro_searches`, {
            userEmail: user.email,
          });
          //truth table logic
          // if sys is pro, user search pro -> pro
          // if sys is basic, user search basic -> basic
          // if sys is pro, user basic -> basic => alert/toast
          // if sys is basic, user pro -> basic
          
          if(response.data.success)
          {
            const userSearch = response.data.hasProSearches? 'pro': 'basic'
            console.log("userSearch is: ", userSearch)

            if(version == 'pro' && userSearch == 'pro')
            {
              setSearchVersion("pro")
              setResultVersion("pro")
            }
            else if (version == 'basic' && userSearch == 'basic') {
            setSearchVersion("basic")
            setResultVersion("basic")
            }
            else if (version == 'pro' && userSearch == 'basic') // throw toastie
            {
                setToastMessage("You have exhausted your 'pro' searches for the day. Your searches will be processed using 'basic' mode.");
                setToastOpen(true);
                setProDialogOpen(true)
                setSearchVersion("basic")
                setResultVersion("basic")
                setVersion("basic")
              }
            else {
              setSearchVersion("basic")
              setResultVersion("basic")
            }      

          }
          else{
            setSearchVersion("basic")
            setResultVersion("basic")
          }       

        }
        else { //user has a pro subscription
          setSearchVersion("pro")
          setResultVersion(version)
        }
      } catch (error) {
        console.error("Error checking pro searches:", error);
        setSearchVersion("basic"); // Fallback to 'basic' on error
      }
    };
    if(mode == 'verify')
    {
      //checkProSearches();
    }
  }, [manualRefresh]); // Run on component mount

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  const handleProDialogClose = () => {
    setProDialogOpen(false);
  };

  const sampleRecommendations = [
    {
      type: 'text',
      content: 'Mr Beast has sold his YouTube channel to Disney.',
      title: 'None',
    },
    {
      type: 'video',
      content: 'https://www.youtube.com/watch?v=HeG-laB_YL4',
      title: "Never Eat Broccoli with This🥦 Cause Cancer ..",
    },
    {
      type: 'text',
      content: 'Bananas are a type of berries',
      title: 'None',
    },
    {
      type: 'video',
      content: 'https://www.youtube.com/shorts/6hM6j4zyEjU',
      title: "Spicy food and stomach ulcers",
    }
  ];

  const handleCardClick = (query) => {
    setSearchQuery(query);
    setInternalTrigger((prevState) => !prevState);
  };
  
  // const handleCardClick = (sample) => {
  //   setSearchQuery(sample.content);
  //   setInternalTrigger((prevState) => !prevState);
  //   // We can set a short timeout to ensure the query updates
  //   // setTimeout(() => {
  //   //   initiateSearch();
  //   // }, 0);
  // };

  useEffect(() => {
    // Trigger an external toggle when `searchQuery` chnges
    setExternalTrigger((prevState) => !prevState); // Toggle the state
  }, [internalTrigger, setExternalTrigger]);

  useEffect(() => {
    if (initialUrlParam) {
      setSearchQuery(initialUrlParam);
      // Delay handleCardClick by 2 seconds
      setTimeout(() => {
        handleCardClick(initialUrlParam);
        // Then wait 100ms before handleSearchClick
        setTimeout(() => {
          handleSearchClick();
        }, 100);
      }, 2000);
    }
  }, [initialUrlParam]);
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        position: 'relative',
        backgroundColor: 'transparent',
        boxSizing: 'border-box',
      }}
    >
      {/* Content Area */}
      <Container
        maxWidth={false}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          position: 'relative',
          overflow: 'auto',
          boxSizing: 'border-box',
          pb: 2,
        }}
      >
        {/* Loading State */}
        {workspaceLoading ? (
          <Box sx={{ width: '100%', mt: 4, boxSizing: 'border-box' }}>
            <Skeleton
              variant="text"
              sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}
              height={60}
            />
            <Skeleton
              variant="rectangular"
              sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}
              height={400}
            />
            <Skeleton
              variant="text"
              sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}
              height={40}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: queries.length ? 'flex-start' : 'center',
              boxSizing: 'border-box',
              pt: queries.length ? 2 : 0,
            }}
          >
            {/* Initial State */}
            {!queries.length && (
              <Box
                sx={{
                  textAlign: 'center',
                  mb: 4,
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              >
                {/* Welcome Text */}
                <Typography
                  className='facti-tut-step-1'
                  variant={isMdUp ? "h5" : "h6"}
                  color="#0066FF"
                  sx={{
                    boxSizing: 'border-box',
                    fontWeight: 500,
                    textAlign: 'center',
                    mb: 4
                  }}
                >
                  Let's get fact-checking!
                </Typography>

                {/* Features and Examples Section */}
                {!hideSearchBar && (
                  <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
                    {/* Navigation Chips */}
                    <Box
                      sx={{
                        width: "100%",
                        mt: 2,
                        mb: "5px",
                        px: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "center",
                          gap: 1,
                          width: "100%",
                        }}
                      >
                        <Chip
                          label="Refer your friends to earn credits!"
                          clickable
                          component="a"
                          href="/rewards"
                          sx={{
                            bgcolor: "#0066FF",
                            color: "white",
                            fontSize: { xs: "12px", sm: "14px" },
                            px: { xs: 0.75, sm: 1 },
                            py: { xs: 0.2, sm: 0.25 },
                            "&:hover": { bgcolor: "#004FCC" },
                          }}
                        />
                        <Chip
                          label="Chrome Extension"
                          clickable
                          component="a"
                          href="https://chromewebstore.google.com/detail/facticity-ai-fact-checker/mlackneplpmmomaobipjjpebhgcgmocp"
                          sx={{
                            bgcolor: "#0066FF",
                            color: "white",
                            fontSize: { xs: "12px", sm: "14px" },
                            px: { xs: 0.75, sm: 1 },
                            py: { xs: 0.2, sm: 0.25 },
                            "&:hover": { bgcolor: "#004FCC" },
                          }}
                        />
                        <Chip
                          label="Tutorial"
                          clickable
                          onClick={() => {
                            setForceRun(true);
                            setRun(true);
                          }}
                          sx={{
                            bgcolor: "#0066FF",
                            color: "white",
                            fontSize: { xs: "12px", sm: "14px" },
                            px: { xs: 0.75, sm: 1 },
                            py: { xs: 0.2, sm: 0.25 },
                            "&:hover": { bgcolor: "#004FCC" },
                          }}
                        />
                        <Chip
                          label="7 days free Essential Plan!"
                          clickable
                          component="a"
                          href="/subscription"
                          sx={{
                            bgcolor: "#0066FF",
                            color: "white",
                            fontSize: { xs: "12px", sm: "14px" },
                            px: { xs: 0.75, sm: 1 },
                            py: { xs: 0.2, sm: 0.25 },
                            "&:hover": { bgcolor: "#004FCC" },
                          }}
                        />
                        <Chip
                          label="API"
                          clickable
                          component="a"
                          href="/api"
                          sx={{
                            bgcolor: "#0066FF",
                            color: "white",
                            fontSize: { xs: "12px", sm: "14px" },
                            px: { xs: 0.75, sm: 1 },
                            py: { xs: 0.2, sm: 0.25 },
                            "&:hover": { bgcolor: "#004FCC" },
                          }}
                        />
                        {/* Writer is currently disabled */}
                        {/* <Chip
                          label="Writer"
                          clickable
                          component="a"
                          href="/writer"
                          sx={{
                            bgcolor: "#0066FF",
                            color: "white",
                            fontSize: { xs: "12px", sm: "14px" },
                            px: { xs: 0.75, sm: 1 },
                            py: { xs: 0.2, sm: 0.25 },
                            "&:hover": { bgcolor: "#004FCC" },
                          }}
                        /> */}
                      </Box>
                    </Box>

                    <Chip
                      label="Features & Examples"
                      clickable
                      onClick={() => setShowExamples(!showExamples)}
                      variant="outlined"
                      sx={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",
                        width: "300px",
                        marginTop: '10px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                      }}
                      icon={showExamples ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
                    />

                    <Collapse in={showExamples}>
                      <br />
                      <Box sx={{ 
                        position: 'relative',
                      }}>
                        <Box sx={{ 
                          display: 'flex',
                          flexDirection: { xs: 'column', md: 'row' },
                          gap: 2,
                          mt: 2,
                          pb: { xs: 2, md: 0 },
                          alignItems: { xs: 'stretch', md: 'stretch' }, // Ensure equal height
                        }}>
                          {/* Left Column: Discover + Leaderboard */}
                          <Box sx={{ 
                            flex: { xs: 1, md: 0.4 }, // Keep 40% width for left column
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3, // Increased gap between the two main components
                            height: { xs: 'auto', md: '800px' }, // Fixed total height for equal columns
                            minHeight: { xs: 'auto', md: '800px' }, // Ensure minimum height
                          }}>
                            {/* Discover - Made bigger and more prominent */}
                            <Box sx={{ 
                              border: '2px solid rgba(0, 102, 255, 0.2)',
                              borderRadius: 2,
                              p: 2.5,
                              bgcolor: '#F1F3FE',
                              display: 'flex',
                              flexDirection: 'column',
                              flex: 1, // Take up available space
                              boxShadow: '0 4px 12px rgba(0, 102, 255, 0.15)',
                            }}
                            className='facti-tut-step-discover'>
                              <Typography 
                                variant="h5"
                                sx={{ 
                                  fontSize: { xs: '1.3rem', md: '1.4rem' },
                                  fontWeight: 'bold', 
                                  color: '#0066FF',
                                  mb: 1,
                                  flexShrink: 0
                                }}
                              >
                                🎯 Discover
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: { xs: '0.85rem', md: '0.9rem' },
                                  lineHeight: 1.5,
                                  mb: 2,
                                  flexShrink: 0,
                                  fontWeight: 500
                                }}
                              >
                                Earn Facticity credits by posting your fact-checks to discover (go to 'History' tab), liking and interacting with posts from other users in Discover
                              </Typography>
                              <Box sx={{ 
                                flex: 1, 
                                overflow: 'hidden', // Ensure content stays within bounds
                                display: 'flex',
                                alignItems: 'center', // Center content vertically
                                justifyContent: 'center', // Center content horizontally
                                width: '100%',
                                minHeight: 0, // Allow flex child to shrink
                              }}>
                                {discoverPosts.length > 0 ? (
                                  <Box sx={{ 
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <DiscoverPostCarousel posts={discoverPosts} />
                                  </Box>
                                ) : (
                                  <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: 2,
                                    width: '100%',
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1, width: '100%' }} />
                                  </Box>
                                )}
                              </Box>
                            </Box>

                            {/* Game Leaderboard - Made bigger and more prominent */}
                            <Box sx={{ 
                              border: '2px solid rgba(0, 102, 255, 0.2)',
                              borderRadius: 2,
                              p: 2.5,
                              bgcolor: '#F1F3FE',
                              display: 'flex',
                              flexDirection: 'column',
                              flex: 1, // Take up available space
                              boxShadow: '0 4px 12px rgba(0, 102, 255, 0.15)',
                            }}>
                              {/* Header with title and buttons */}
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                mb: 1,
                                flexShrink: 0
                              }}>
                                <Typography 
                                  variant="h5"
                                  sx={{ 
                                    fontSize: { xs: '1.3rem', md: '1.4rem' },
                                    fontWeight: 'bold', 
                                    color: '#0066FF',
                                    mb: 0 // Reset margin since we're using flex layout
                                  }}
                                >
                                  🏆 Game Leaderboard
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => navigate('/discover/leaderboard')}
                                    sx={{
                                      fontSize: '0.75rem',
                                      padding: '4px 8px',
                                      borderColor: '#0066FF',
                                      color: '#0066FF',
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      '&:hover': {
                                        borderColor: '#0052CC',
                                        backgroundColor: 'rgba(0, 102, 255, 0.04)'
                                      }
                                    }}
                                  >
                                    View All
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<EmojiEventsIcon sx={{ fontSize: '0.9rem' }} />}
                                    onClick={() => navigate('/game')}
                                    sx={{
                                      fontSize: '0.75rem',
                                      padding: '4px 12px',
                                      bgcolor: '#0066FF',
                                      borderRadius: '8px',
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      '&:hover': {
                                        bgcolor: '#0052CC',
                                        transform: 'translateY(-1px)',
                                        transition: 'all 0.2s ease-in-out'
                                      }
                                    }}
                                  >
                                    Play
                                  </Button>
                                </Box>
                              </Box>
                              <Typography
                                variant="body1"
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: { xs: '0.85rem', md: '0.9rem' },
                                  lineHeight: 1.5,
                                  mb: 2,
                                  flexShrink: 0,
                                  fontWeight: 500
                                }}
                              >
                                Play our fact-checking game and compete with other users!
                              </Typography>
                              <Box sx={{ 
                                flex: 1,
                                overflow: { xs: 'visible', md: 'auto' }, // Changed from 'hidden' to 'auto' for scrolling
                                display: 'flex',
                                flexDirection: 'column',
                                '&::-webkit-scrollbar': {
                                  width: '6px',
                                },
                                '&::-webkit-scrollbar-track': {
                                  background: '#f1f1f1',
                                  borderRadius: '3px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                  background: '#c1c1c1',
                                  borderRadius: '3px',
                                  '&:hover': {
                                    background: '#a8a8a8',
                                  },
                                },
                              }}>
                                <CompactLeaderboardDisplay />
                              </Box>
                            </Box>
                          </Box>

                          {/* Right Column: About + Examples + Headlines */}
                          <Box sx={{ 
                            flex: { xs: 1, md: 0.6 }, // Keep 60% width for right column
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            height: { xs: 'auto', md: '800px' }, // Fixed total height for equal columns
                            minHeight: { xs: 'auto', md: '800px' }, // Ensure minimum height
                          }}>
                            {/* About Facticity.AI - Made smaller */}
                            <Box sx={{ 
                              border: '2px solid rgba(0, 102, 255, 0.2)', // Thicker border for prominence
                              borderRadius: 2,
                              p: 1.5,
                              bgcolor: '#F1F3FE',
                              display: 'flex',
                              flexDirection: 'column',
                              flexShrink: 0, // Don't shrink
                              height: aboutExpanded ? 'auto' : { xs: 'auto', md: '160px' }, // Keep fixed height
                              transition: 'height 0.3s ease-in-out', // Smooth height transition
                              boxShadow: '0 4px 12px rgba(0, 102, 255, 0.15)', // Added shadow for prominence
                            }}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontSize: { xs: '1.1rem', md: '1.15rem' },
                                  fontWeight: 'bold', 
                                  color: '#0066FF',
                                  mb: 1,
                                  flexShrink: 0
                                }}
                              >
                                About Facticity.AI
                              </Typography>
                              <Box sx={{ 
                                flex: 1, 
                                overflow: aboutExpanded ? 'visible' : 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                              }}>
                                <Typography
                                  variant="body2"
                                  color="text.primary"
                                  sx={{
                                    fontWeight: 400,
                                    letterSpacing: "0.2px",
                                    fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                                    color: '#121212',
                                    lineHeight: 1.4,
                                    overflow: 'hidden',
                                    display: aboutExpanded ? 'block' : '-webkit-box',
                                    WebkitLineClamp: aboutExpanded ? 'none' : { xs: 'none', md: 5 }, // Show all lines when expanded
                                    WebkitBoxOrient: 'vertical',
                                    mb: 1
                                  }}
                                >
                                  Our multi-modal and multi-lingual fact-checker can fact-check text claims, video URLs from social media platforms - try it out using the search bar below!
                                  <br /><br />
                                  Plus, meet the{' '}
                                  <Link
                                    to="/writer"
                                    style={{
                                      color: "#0066FF",
                                      textDecoration: "underline",
                                      fontWeight: 500,
                                    }}
                                  >
                                    Facticity.AI "Writer"
                                  </Link>
                                  {' '}to assist you in essays, assignments, and research.
                                </Typography>
                                
                                {/* Show More/Less Button - Only show on desktop when needed */}
                                <Box sx={{ 
                                  display: { xs: 'none', md: 'flex' }, 
                                  justifyContent: 'center',
                                  mt: 'auto',
                                  pt: 0.5
                                }}>
                                  <Button
                                    size="small"
                                    onClick={() => setAboutExpanded(!aboutExpanded)}
                                    sx={{
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      color: '#0066FF',
                                      textTransform: 'none',
                                      minHeight: 'auto',
                                      padding: '2px 8px',
                                      '&:hover': {
                                        backgroundColor: 'rgba(0, 102, 255, 0.08)',
                                      }
                                    }}
                                    endIcon={aboutExpanded ? <ExpandLessIcon sx={{ fontSize: '1rem' }} /> : <ExpandMoreIcon sx={{ fontSize: '1rem' }} />}
                                  >
                                    {aboutExpanded ? 'Show less' : 'Show more'}
                                  </Button>
                                </Box>
                              </Box>
                            </Box>

                            {/* Fact Check Examples */}
                            <Box sx={{ 
                              border: '2px solid rgba(0, 102, 255, 0.2)', // Thicker border for prominence
                              borderRadius: 2,
                              p: 1.5,
                              bgcolor: '#F1F3FE',
                              display: 'flex',
                              flexDirection: 'column',
                              flexShrink: 0, // Don't shrink
                              height: { xs: 'auto', md: '280px' }, // Fixed height for examples
                              boxShadow: '0 4px 12px rgba(0, 102, 255, 0.15)', // Added shadow for prominence
                              overflow: 'auto', // Allow scrolling if content is too tall
                            }}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontSize: { xs: '1.1rem', md: '1.15rem' },
                                  fontWeight: 'bold', 
                                  color: '#0066FF',
                                  mb: 1,
                                  flexShrink: 0
                                }}
                              >
                                Fact-Checked Examples
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: '0.75rem',
                                  lineHeight: 1.3,
                                  mb: 1,
                                  flexShrink: 0
                                }}
                              >
                                Explore the examples below to see how Facticity works and discover the types of fact-check insights it provides.
                              </Typography>
                              <Box sx={{ 
                                // Allow content to expand naturally without any height or overflow constraints
                                width: '100%'
                              }}>
                                <div className='facti-tut-step-2'>
                                  <ExampleCards setSearchQuery={setSearchQuery} setInternalTrigger={setInternalTrigger} />
                                </div>
                              </Box>
                            </Box>

                            {/* Headlines - Moved from right side to left side */}
                            {headlines.length > 0 && (
                              <Box sx={{ 
                                border: '2px solid rgba(0, 102, 255, 0.2)', // Thicker border for prominence
                                borderRadius: 2,
                                p: 1.5,
                                bgcolor: '#F1F3FE',
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 1, // Take up most of the remaining space
                                boxShadow: '0 4px 12px rgba(0, 102, 255, 0.15)', // Added shadow for prominence
                              }}>
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    fontSize: { xs: '1.1rem', md: '1.15rem' },
                                    fontWeight: 'bold', 
                                    color: '#0066FF',
                                    mb: '2px',
                                    flexShrink: 0
                                  }}
                                >
                                  📰 Trending Headlines
                                </Typography>
                                <Box sx={{ 
                                  flex: 1,
                                  overflow: { xs: 'visible', md: 'auto' },
                                  '&::-webkit-scrollbar': {
                                    width: '4px',
                                  },
                                  '&::-webkit-scrollbar-track': {
                                    background: '#f1f1f1',
                                    borderRadius: '2px',
                                  },
                                  '&::-webkit-scrollbar-thumb': {
                                    background: '#c1c1c1',
                                    borderRadius: '2px',
                                    '&:hover': {
                                      background: '#a8a8a8',
                                    },
                                  },
                                }}>
                                  <div className='facti-tut-step-3'>
                                    <HeadlineDisplay headlines={headlines?.slice(0, 4) || []} setSearchQuery={setSearchQuery} />
                                  </div>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Collapse>
                  </Box>
                )}

                {errorDisplay && (
                  <ErrorComponent errorDisplay={errorDisplay} />
                )}
              </Box>
            )}

            {/* Results Area */}
            {queries.length > 0 && (
              <Box
                ref={scrollableDivRef}
                className="scrollable-container"
                sx={{
                  width: '100%',
                  flexGrow: 1,
                  scrollBehavior: 'smooth',
                  boxSizing: 'border-box',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    width: '100%',
                    maxWidth: mode === 'verify' ? '1400px' : '2800px',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    borderRadius: '10px',
                    margin: 'auto',
                    boxSizing: 'border-box',
                  }}
                >
                  {mode === 'verify' ? (
                    <>
                      {queries.map((query, index) => (
                        <FactCheckDisplay
                          key={index}
                          query={query}
                          id={ids[index] || null}
                          setDone={() => {}}
                          process
                          maxWidth="100%"
                          skipDisambiguation={skipDisambiguation}
                          sx={{
                            boxSizing: "border-box",
                          }}
                          version={resultVersion}
                          isVideo={false}
                          source_find_mode={sourceFindMode}
                        />
                      ))}
                    </>
                  ) : (
                    <VideoParagraphComponent
                      key={0}
                      id={0}
                      claim={link}
                      email={email}
                      readyin={false}
                      version={searchVersion}
                    />
                  )}
                  <div ref={bottomRef} style={{ height: 0 }} />
                </Paper>
              </Box>
            )}
          </Box>
        )}
      </Container>

      {/* SearchBar at Bottom */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(241, 243, 254, 0.95)',
          backdropFilter: 'blur(10px)',
          p: 2,
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            width: '100%',
            position: 'relative',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Game Component */}
          <Box
            sx={{
              position: 'absolute',
              top: '-60px',
              right: 0,
              zIndex: 1001,
            }}
          >
            <Game 
              tooltip="Play games to earn credits!"
              autoOpen={isGamePath}
            />
          </Box>

          {/* Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchClick={handleSearchClick}
            isProMode={isProMode}
            handleToggle={handleToggle}
            isSearchMoved={isSearchMoved}
            externalTrigger={externalTrigger}
            sx={{
              padding: { xs: '12px', sm: '12px 16px' },
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              boxSizing: 'border-box',
              width: '100%',
              maxWidth: '1200px',
              borderRadius: '24px'
            }}
          />
        </Box>
      </Box>

      {/* Snackbar for toast */}
      <Snackbar
        open={toastOpen}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseToast} severity="warning" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>

      {/* Dialog Box to prompt pro subscription purchase */}
      <Dialog
        open={isProDialogOpen}
        onClose={handleProDialogClose}
        aria-labelledby="pro-signup-dialog-title"
        aria-describedby="pro-signup-dialog-description"
      >
        <DialogTitle id="pro-signup-dialog-title">Upgrade to Pro</DialogTitle>
        <DialogContent>
          <Typography id="pro-signup-dialog-description" sx={{ mt: 1 }}>
            You've reached the limit for 'pro' searches for the day. Upgrade to Pro to enjoy unlimited access to premium features, including advanced fact-checking and better results.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProDialogClose} color="secondary">
            Not Now, Continue With Free
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleProDialogClose();
              navigate("/subscription")
            }}
          >
            Go Pro
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchComponent;
