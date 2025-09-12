"use client";
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
} from "@mui/material";
// import FactCheckDisplay from '../FactCheckDisplay/FactCheckDisplay';
import FactCheckDisplay from '@/components/FactCheckDisplay'
import '@/styles/globals.css'; // Animation and scrollbar styles are now in globals.css
import { useAppContext } from '../../AppProvider';
import { v4 as uuidv4 } from 'uuid';
import SearchBar from './searchBar';
import ErrorComponent from './ErrorComponent';
import VideoParagraphComponent from '../Video/videoExpand';
import useAuth from '../../auth/useAuthHook';
import { Button as NESButton, setDarkModeActivation } from "nes-ui-react";
import MUIButton from "@mui/material/Button";


import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from "axios";
import HeadlineDisplay from './HeadlineDisplay';
import ExampleCards from "./Examples";

import {  } from '@mui/icons-material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import { useRouter, usePathname } from 'next/navigation';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

//import { Collapse } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Link from 'next/link';

import { KeyboardArrowLeft, KeyboardArrowRight, KeyboardArrowDown, KeyboardArrowUp, Image as ImageIcon, Description as FileTextIcon, YouTube as YoutubeIcon, TextFields as TextIcon, UnfoldLess as UnfoldLessIcon, UnfoldMore as UnfoldMoreIcon, ShoppingCart as ShoppingCartIcon, ShoppingBagSharp } from "@mui/icons-material";

// Buy $FACY Button Component
const BuyFACYButton = ({ variant = "contained", size = "medium", sx = {} }) => {
  const handleBuyFACY = () => {
    if (typeof window !== 'undefined') {
      window.open('https://app.uniswap.org/swap?chain=base&inputCurrency=NATIVE&outputCurrency=0xfac77f01957ed1b3dd1cbea992199b8f85b6e886', '_blank', 'noopener,noreferrer');
    }
  };

  const isOutlined = variant === 'outlined';

  return (
    <Chip
      icon={<ShoppingCartIcon fontSize="small" />}
      label="Buy $FACY"
      clickable
      onClick={handleBuyFACY}
      sx={{
        fontWeight: 700,
        borderRadius: '16px',
        // Filled vs outlined styles to keep a slight distinction
        bgcolor: isOutlined ? 'transparent' : 'rgba(0, 102, 255, 0.12)',
        color: isOutlined ? '#0066FF' : '#0052CC',
        border: isOutlined ? '1px solid rgba(0, 102, 255, 0.35)' : '1px solid rgba(0, 102, 255, 0.22)',
        boxShadow: 'none',
        '&:hover': {
          bgcolor: isOutlined ? 'rgba(0, 102, 255, 0.08)' : 'rgba(0, 102, 255, 0.18)',
        },
        '& .MuiChip-icon': {
          color: 'inherit',
          marginLeft: '8px',
        },
        '& .MuiChip-label': {
          paddingLeft: '4px',
        },
        // Inherit caller-provided sizing so it sits well next to other chips
        ...sx,
      }}
    />
  );
};

// Compact Leaderboard Display Component
const CompactLeaderboardDisplay = () => {
  const [gamefiles, setGamefiles] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState({});
  const [leaderboardLoading, setLeaderboardLoading] = useState({});
  const [loading, setLoading] = useState(true);
  const [userHandle, setUserHandle] = useState('');
  const { backendUrl, accessToken } = useAppContext();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

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
      
      const response = await fetch(`/api/api/get_userhandle?email=${encodeURIComponent(user.email)}`, {
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
      const response = await fetch('/api/get-all-gamefiles');
      
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
      const response = await fetch(`/api/api/leaderboard/game/${gameId}`);
      
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
            mb: 1,
            textAlign: 'left'
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ 
              fontWeight: 600, 
              color: '#0066FF',
              fontSize: '0.7rem'
            }}>
              Score: {findUserRank(leaderboard).score}
            </Typography>
            <BuyFACYButton 
              variant="outlined"
              size="small"
              sx={{
                fontSize: '0.6rem',
                px: 1,
                py: 0.25,
                height: '20px',
                minWidth: 'auto',
              }}
            />
          </Box>
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



const InitialStatePanel = ({
  scrollableDivRef,
  discoverPosts,
  headlines,
  setSearchQuery,
  setInternalTrigger,
  setForceRun,
  setRun,
  hideSearchBar,
  errorDisplay,
  aboutExpanded,
  setAboutExpanded,
}) => {
  return (
    <Card 
      variant="outlined" 
      p={0} 
      sx={{
        fontFamily: 'IBM Plex Sans',
        backgroundColor: 'transparent', // Make the card transparent
        border: 'none', // Remove border
        p: 2, // Add padding around the card
      }}
    >
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
                justifyContent: "flex-start",
                gap: 1,
                width: "100%",
              }}
            >
              <Chip
                label="Refer and earn!"
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
              />
              <BuyFACYButton 
                variant="contained"
                size="small"
                sx={{
                  fontSize: { xs: "12px", sm: "14px" },
                  px: { xs: 0.75, sm: 1 },
                  py: { xs: 0.2, sm: 0.25 },
                  height: { xs: "28px", sm: "32px" },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ 
            position: 'relative',
          }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              mt: 3,
              pb: { xs: 2, md: 0 },
              alignItems: { xs: 'stretch', md: 'flex-start' },
            }}>
              {/* Left Column: About + Examples */}
              <Box sx={{ 
                flex: { xs: 1, md: 0.5 },
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}>
                {/* About Facticity.AI */}
                <Box sx={{ 
                  border: '2px solid rgba(0, 102, 255, 0.2)',
                  borderRadius: 2,
                  p: 2,
                  bgcolor: '#F1F3FE',
                  display: 'flex',
                  flexDirection: 'column',
                  flexShrink: 0,
                  height: aboutExpanded ? 'auto' : { xs: 'auto', md: '180px' },
                  transition: 'height 0.3s ease-in-out',
                  boxShadow: '0 4px 12px rgba(0, 102, 255, 0.15)',
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontSize: { xs: '1.1rem', md: '1.2rem' },
                      fontWeight: 'bold', 
                      color: '#0066FF',
                      mb: 1.5,
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
                        fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                        color: '#121212',
                        lineHeight: 1.5,
                        overflow: 'hidden',
                        display: aboutExpanded ? 'block' : '-webkit-box',
                        WebkitLineClamp: aboutExpanded ? 'none' : { xs: 'none', md: 6 },
                        WebkitBoxOrient: 'vertical',
                        textAlign: 'left',
                        mb: 1.5
                      }}
                    >
                      Our multi-modal and multi-lingual fact-checker can fact-check text claims, video URLs from social media platforms - try it out using the search bar below!
                      <br /><br />
                      Plus, meet the{' '}
                      <Link
                        href="/writer"
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
                    
                    {/* Show More/Less Button */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center',
                      mt: 'auto',
                      pt: 1
                    }}>
                      <MUIButton
                        size="small"
                        onClick={() => setAboutExpanded(!aboutExpanded)}
                        variant="outlined"
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#0066FF',
                          textTransform: 'none',
                          minHeight: 'auto',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '999px',
                          borderColor: 'rgba(0, 102, 255, 0.35)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 102, 255, 0.06)',
                            borderColor: '#0066FF',
                          }
                        }}
                        endIcon={aboutExpanded ? <KeyboardArrowUp sx={{ fontSize: '1rem' }} /> : <KeyboardArrowDown sx={{ fontSize: '1rem' }} />}
                      >
                        {aboutExpanded ? 'Show less' : 'Show more'}
                      </MUIButton>
                    </Box>
                  </Box>
                </Box>

                {/* Fact Check Examples */}
                <Box sx={{ 
                  border: '2px solid rgba(0, 102, 255, 0.2)',
                  borderRadius: 2,
                  p: 2,
                  bgcolor: '#F1F3FE',
                  display: 'flex',
                  flexDirection: 'column',
                  flexShrink: 0,
                  height: { xs: 'auto', md: '320px' },
                  boxShadow: '0 4px 12px rgba(0, 102, 255, 0.15)',
                  overflow: 'auto',
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontSize: { xs: '1.1rem', md: '1.2rem' },
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
                      fontSize: '0.8rem',
                      lineHeight: 1.4,
                      mb: 1.5,
                      flexShrink: 0,
                      textAlign: 'left'
                    }}
                  >
                    Explore the examples below to see how Facticity works and discover the types of fact-check insights it provides.
                  </Typography>
                  <Box sx={{ 
                    flex: 1,
                    width: '100%'
                  }}>
                    <div className='facti-tut-step-2'>
                      <ExampleCards setSearchQuery={setSearchQuery} setInternalTrigger={setInternalTrigger} />
                    </div>
                  </Box>
                </Box>
              </Box>

              {/* Right Column: Headlines + Leaderboard */}
              <Box sx={{ 
                flex: { xs: 1, md: 0.5 },
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}>
                {/* Headlines */}
                {headlines.length > 0 && (
                  <Box sx={{ 
                    border: '2px solid rgba(0, 102, 255, 0.2)',
                    borderRadius: 2,
                    p: 2,
                    bgcolor: '#F1F3FE',
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                    height: { xs: 'auto', md: '280px' },
                    boxShadow: '0 4px 12px rgba(0, 102, 255, 0.15)',
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: { xs: '1.1rem', md: '1.2rem' },
                        fontWeight: 'bold', 
                        color: '#0066FF',
                        mb: 1,
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

        </Box>
      )}

      {errorDisplay && (
        <ErrorComponent errorDisplay={errorDisplay} />
      )}
    </Card>
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
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [creditDialogMessage, setCreditDialogMessage] = useState("");
  const [manualRefresh, setManualRefresh] = useState(false) // I am adding this for state update trigger
  const [searchCount, setSearchCount] = useState(0);
  const [isProDialogOpen, setProDialogOpen] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const [aboutExpanded, setAboutExpanded] = useState(false); // Add state for about expansion
  const pathname = usePathname();
  const isGamePath = pathname === '/game';

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
    accessToken,
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

  const router = useRouter(); // React Router's navigation hook
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const checkUserConvoMapping = async () => {
      if (!currentConversation || !user?.email) return;
      
      try {
        const response = await fetch(`/api/check-convo-user-mapping`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Validator': 'privy',
            // 'X-API-KEY': frontend_key,
          },
          body: JSON.stringify({
            userEmail: user.email.address,
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
      await fetch('/api/update_ids', {
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
      setCreditDialogMessage(message);
      setCreditDialogOpen(true);
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
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, "", `/c/${newConversationId}`);
      }
    }
    if(!isAuthenticated){
      setSearchCount(searchCount + 1)
    }
  };


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

  // Close handler for credit exhaustion dialog
  const handleCreditDialogClose = () => {
    setCreditDialogOpen(false);
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
        height: 'auto', // Allow page to control scroll
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        backgroundColor: '#F1F3FE',
        boxSizing: 'border-box',
        // Allow content to extend; scrolling handled by page/viewport
        flex: '1 1 auto',
      }}
    >
      {/* Content Area - Single Scrollable Container */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto', // Let the window handle vertical scroll
          overflowX: 'hidden',
          minHeight: 0,
          boxSizing: 'border-box',
          pt: { xs: 0.5, sm: 1 },
          pb: 2,
          position: 'relative',
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
                alignItems: 'center',
                justifyContent: queries.length ? 'flex-start' : 'center',
                minHeight: 0,
                width: '100%',
                boxSizing: 'border-box',
                pt: queries.length ? { xs: 1, sm: 2 } : 0, // Less padding on mobile
                pb: { xs: 1, sm: 0 }, // Bottom padding on mobile for spacing
                // Ensure content can be accessed from the very top on mobile
                position: 'relative',
                // No flex or overflow properties - let parent handle scrolling
              }}
            >

            {/* Initial State */}
            {!queries.length && (
              <InitialStatePanel
                scrollableDivRef={scrollableDivRef}
                discoverPosts={discoverPosts}
                headlines={headlines}
                setSearchQuery={setSearchQuery}
                setInternalTrigger={setInternalTrigger}
                setForceRun={setForceRun}
                setRun={setRun}
                hideSearchBar={hideSearchBar}
                errorDisplay={errorDisplay}
                aboutExpanded={aboutExpanded}
                setAboutExpanded={setAboutExpanded}
              />
            )}

            {/* Results Area */}
            {queries.length > 0 && (
              <Box
                ref={scrollableDivRef}
                className="scrollable-container"
                sx={{
                  width: '100%',
                  boxSizing: 'border-box',
                  display: 'flex',
                  justifyContent: 'center',
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
                    margin: '0 auto', // Explicitly center the container
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // Center align the content inside
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
                          AccessToken={accessToken}
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
                      AccessToken={accessToken}
                    />
                  )}
                  <div ref={bottomRef} style={{ height: 0 }} />
                </Paper>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* SearchBar at Bottom */}
      <Box
        sx={{
          flexShrink: 0, // Prevent shrinking
          width: '100%',
          p: { xs: 1, sm: 2 },
          pb: { xs: 'calc(env(safe-area-inset-bottom) + 16px)', sm: 2 }, // Account for iPhone safe area
          zIndex: 1000,
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          // Add backdrop blur and background for better visibility on mobile
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(241, 243, 254, 0.95)',
          borderTop: '1px solid rgba(28, 108, 228, 0.1)',
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
              padding: { xs: '16px', sm: '12px 16px' }, // Increased padding on mobile
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)', // Stronger shadow for better visibility
              boxSizing: 'border-box',
              width: '100%',
              maxWidth: '1200px',
              borderRadius: '24px',
              // Ensure proper touch target size on mobile
              minHeight: { xs: '56px', sm: 'auto' },
              // Add subtle border for better definition
              border: '1px solid rgba(0, 102, 255, 0.1)',
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

      {/* Dialog Box for credit exhaustion prompting upgrade */}
      <Dialog
        open={creditDialogOpen}
        onClose={handleCreditDialogClose}
        aria-labelledby="credit-dialog-title"
        aria-describedby="credit-dialog-description"
        PaperProps={{
          sx: { borderRadius: 3, p: 1.5 }
        }}
      >
        <DialogTitle
          id="credit-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 600,
            color: '#0066FF',
            fontSize: { xs: '1.1rem', sm: '1.2rem' },
            pb: 0
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: '1.75rem' }} />
          Daily Limit Reached
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#F1F3FE', mt: 1, borderRadius: 2 }}>
          <Typography
            id="credit-dialog-description"
            sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#121212', textAlign: 'left' }}
          >
            {creditDialogMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pt: 2, pb: 1, px: 3 }}>
          <MUIButton
            onClick={handleCreditDialogClose}
            variant="outlined"
            sx={{
              borderColor: '#0066FF',
              color: '#0066FF',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { borderColor: '#0052CC', backgroundColor: 'rgba(0,102,255,0.08)' }
            }}
          >
            Not Now
          </MUIButton>
          <MUIButton
            variant="contained"
            sx={{
              bgcolor: '#0066FF',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#0052CC' }
            }}
            onClick={() => {
              handleCreditDialogClose();
              router.push('/subscription');
            }}
          >
            Upgrade
          </MUIButton>
        </DialogActions>
      </Dialog>
      
      {/* Dialog Box to prompt pro subscription purchase */}
      <Dialog
        open={isProDialogOpen}
        onClose={handleProDialogClose}
        aria-labelledby="pro-signup-dialog-title"
        aria-describedby="pro-signup-dialog-description"
      >
        <DialogTitle id="pro-signup-dialog-title">Upgrade to Pro</DialogTitle>
        <DialogContent>
          <Typography id="pro-signup-dialog-description" sx={{ mt: 1, textAlign: 'left' }}>
            You've reached the limit for 'pro' searches for the day. Upgrade to Pro to enjoy unlimited access to premium features, including advanced fact-checking and better results.
          </Typography>
        </DialogContent>
        <DialogActions>
          <MUIButton onClick={handleProDialogClose} color="secondary">
            Not Now, Continue With Free
          </MUIButton>
          <MUIButton
            variant="contained"
            color="primary"
            onClick={() => {
              handleProDialogClose();
              router.push("/subscription")
            }}
          >
            Go Pro
          </MUIButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchComponent;