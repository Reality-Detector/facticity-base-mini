import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Fade,
  Zoom,
  Collapse,
  IconButton,
  Divider,
  Fab,
  useTheme,
  useMediaQuery,
  Link,
  Avatar,
  Stack,
  TextField
} from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { useAppContext } from './AppProvider';
import useAuth from './useAuthHook';
import confetti from 'canvas-confetti';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';
import TimerIcon from '@mui/icons-material/Timer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GamepadIcon from '@mui/icons-material/Gamepad';
import QuizIcon from '@mui/icons-material/Quiz';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ShareIcon from '@mui/icons-material/Share';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import RedditIcon from '@mui/icons-material/Reddit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import TwitterIcon from '@mui/icons-material/Twitter';
import { marked } from 'marked';
import { keyframes } from '@mui/system';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Storage keys
const STORAGE_KEYS = {
  GAME_STATE: 'facticity_game_state',
  STATS: 'facticity_game_stats',
  CURRENT_DATE: 'facticity_current_date',
  GAME_COMPLETED: 'facticity_game_completed',
  GAME_RESULTS: 'facticity_game_results',
  FINAL_POINTS: 'facticity_final_points',
  GAME_ID: 'facticity_game_id' // Add new storage key for game ID
};

// Feature flags
const FEATURES = {
  ENABLE_RESTART: true // Toggle this to enable/disable restart functionality
};

// Initialize or get stats from localStorage
const getInitialStats = () => {
  const storedStats = localStorage.getItem(STORAGE_KEYS.STATS);
  if (storedStats) {
    return JSON.parse(storedStats);
  }
  return {
    totalPlays: 0,
    wins: 0,
    fails: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastPlayedDate: null,
  };
};

// Check if we need to reset daily progress
const shouldResetDailyProgress = () => {
  const storedDate = localStorage.getItem(STORAGE_KEYS.CURRENT_DATE);
  const today = new Date().toDateString();
  return storedDate !== today;
};

// Check if game is completed for today
const isGameCompletedToday = () => {
  if (!FEATURES.ENABLE_RESTART) return false;
  const storedDate = localStorage.getItem(STORAGE_KEYS.CURRENT_DATE);
  const today = new Date().toDateString();
  const isCompleted = localStorage.getItem(STORAGE_KEYS.GAME_COMPLETED) === 'true';
  console.log({storedDate, today, isCompleted});
  return storedDate === today && isCompleted;
};

// Define animations
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 102, 255, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(0, 102, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 102, 255, 0);
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(10deg);
  }
  75% {
    transform: rotate(-10deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

// Custom styled tooltip that looks like a chat bubble
const ChatBubbleTooltip = styled(({ className, ...props }) => (
  <Tooltip
    arrow
    placement="left"                 // popper shows left of the target
    classes={{ popper: className }}  // let `styled()` inject its class here
    {...props}
  />
))(({ theme }) => ({
  // bubble
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    maxWidth: 240,
    fontSize: theme.typography.pxToRem(13),
    fontWeight: 600,
    padding: theme.spacing(1.5, 2),
    borderRadius: 16,
  },
  // arrow gets same colour so it blends in
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.primary.main,
  },
}));

// Game component
const Game = ({ tooltip = "Play games to earn credits!", color = "primary", size = "large", autoOpen = false, position = { top: 80, right: 30 }, ...props }) => {
  const [open, setOpen] = useState(autoOpen);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleOpen = () => {
    setOpen(true);
    setShowTooltip(false);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleHideButton = (e) => {
    e.stopPropagation();
    setIsHidden(true);
  };

  // Show tooltip after 5 seconds, then hide it after 10 seconds total
  useEffect(() => {
    if (!autoOpen) {
      // Show tooltip after 5 seconds
      const showTimer = setTimeout(() => {
        setShowTooltip(true);
      }, 5000);

      // Hide tooltip after 15 seconds total (5 seconds delay + 10 seconds visible)
      const hideTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 15000);
      
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [autoOpen]);
  
  // Effect to handle autoOpen prop changes
  useEffect(() => {
    setOpen(autoOpen);
    if (autoOpen) {
      setShowTooltip(false);
    }
  }, [autoOpen]);

  // If button is hidden, don't render anything
  if (isHidden) {
    return null;
  }

  return (
    <>
      <Box sx={{ 
        position: 'fixed', 
        bottom: 100, // Changed from top: 80 to bottom: 100 to position above SearchBar
        right: position.right,
        zIndex: 1000000 
      }}>
        <ChatBubbleTooltip 
          title={tooltip}
          placement="left"
          open={showTooltip}
          arrow
          TransitionComponent={Zoom}
          PopperProps={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
              {
                name: 'preventOverflow',
                options: {
                  padding: 8,
                },
              },
            ],
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Fab
              color={color}
              size={isMobile ? "medium" : size}
              onClick={handleOpen}
              sx={{
                boxShadow: 3,
                animation: `${pulse} 2s infinite`,
                background: 'linear-gradient(45deg, #0066FF 30%, #5C9DFF 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #0056D6 30%, #0066FF 90%)',
                  boxShadow: '0 5px 15px rgba(0, 102, 255, 0.4)',
                  '& .game-icon': {
                    animation: `${rotate} 0.5s ease-in-out`,
                  },
                },
                transition: 'all 0.3s',
                ...props.sx
              }}
              {...props}
            >
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SportsEsportsIcon 
                  className="game-icon"
                  sx={{ 
                    fontSize: isMobile ? 24 : 28,
                    color: 'white',
                  }} 
                />
                <Box 
                  sx={{
                    position: 'absolute',
                    top: isMobile ? -6 : -8,
                    right: isMobile ? -6 : -8,
                    backgroundColor: '#FF4081',
                    borderRadius: '50%',
                    width: isMobile ? 16 : 20,
                    height: isMobile ? 16 : 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    border: '2px solid white'
                  }}
                >
                  <EmojiEventsIcon sx={{ fontSize: isMobile ? 10 : 12, color: 'white' }} />
                </Box>
              </Box>
            </Fab>
            <IconButton
              onClick={handleHideButton}
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                width: 24,
                height: 24,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: 16,
                },
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </ChatBubbleTooltip>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: '95vh',
            maxHeight: '95vh',
            width: '95vw',
            maxWidth: '1400px',
            overflow: 'hidden',
            zIndex: 1500000, // Increased from 1000000
            m: 1
          }
        }}
        sx={{
          zIndex: 1500000, // Added main Dialog z-index
          '& .MuiDialog-container': {
            zIndex: 1500000 // Increased from 1000000
          },
          '& .MuiBackdrop-root': {
            zIndex: 1499999 // Increased from 999999
          }
        }}
        slotProps={{
          root: {
            style: {
              zIndex: 1500000 // Additional z-index for the Modal root
            }
          }
        }}
      >
        <DialogContent sx={{ p: 0, height: '100%', overflow: 'hidden' }}>
          <GameContent onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

// Game content component
const GameContent = ({ onClose }) => {
  const [gamefile, setGamefile] = useState(null);
  const [currentClaimIndex, setCurrentClaimIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: false, message: '', explanation: '', awardedPoints: null });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [stats, setStats] = useState(getInitialStats());
  const [expandedClaims, setExpandedClaims] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const { email, backendUrl, setUserCredits, accessToken, enableSharePoints } = useAppContext();
  const { loginWithPopup, isAuthenticated, user } = useAuth();
  const [points, setPoints] = useState(0);
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);
  const [detailedExplanationExpandedMap, setDetailedExplanationExpandedMap] = useState({});
  const [showComboPopup, setShowComboPopup] = useState(false);
  const [comboPoints, setComboPoints] = useState(0);
  
  // Add new states for share functionality
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkedInCopied, setLinkedInCopied] = useState(false);
  
  // Add new states for leaderboard functionality
  const [leaderboardDialogOpen, setLeaderboardDialogOpen] = useState(false);
  const [earnedCredits, setEarnedCredits] = useState(0);
  const [leaderboardSubmitted, setLeaderboardSubmitted] = useState(false);
  
  // Add animation states
  const [showCreditAnimation, setShowCreditAnimation] = useState(false);
  const [creditAmount, setCreditAmount] = useState(0);
  const [showAlreadyAwardedAnimation, setShowAlreadyAwardedAnimation] = useState(false);
  
  const ROUND_DURATION = 15; // Duration for each round in seconds
  const [countdown, setCountdown] = useState(ROUND_DURATION);
  const theme = useTheme(); // Moved useTheme here to be available for the Chip

  // Store proceedToNextClaim in a ref to avoid dependency issues
  const proceedToNextClaimRef = useRef();
  
  const proceedToNextClaim = () => {
    setShowFeedback(false);
    setIsExplanationExpanded(false); // Reset main feedback explanation
    
    // Only increment the index after user has viewed the feedback and clicked "Next"
    if (currentClaimIndex < gamefile.claims.length - 1) {
      setCurrentClaimIndex(currentClaimIndex + 1);
      setCountdown(ROUND_DURATION); // Reset countdown for next claim
    }
  };

  // Update the ref whenever proceedToNextClaim changes
  useEffect(() => {
    proceedToNextClaimRef.current = proceedToNextClaim;
  }, [currentClaimIndex, gamefile]);

  // Create a ref for the timeout handler function
  const handleTimeoutRef = useRef();
  
  // Update handleTimeoutRef whenever needed deps change
  useEffect(() => {
    handleTimeoutRef.current = (isLastQuestion) => {
      try {
        // If this is the last claim, we don't need to auto-advance
        if (!isLastQuestion) {
          // Set a small delay before auto-advancing to ensure feedback is shown briefly
          setTimeout(() => {
            // Only advance if we're still showing feedback (not manually advanced)
            if (showFeedback) {
              proceedToNextClaimRef.current();
            }
          }, 2000); // 2 second delay to show feedback briefly
        }
      } catch (error) {
        console.error('Error in timeout handler:', error);
      }
    };
  }, [showFeedback]);

  // Timer effect for countdown
  useEffect(() => {
    let timerId;
    if (gameStarted && !showFeedback) {
      // Reset countdown for the new question/attempt
      setCountdown(ROUND_DURATION);

      timerId = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(timerId);
            // Call handleAnswer only if it's the tick that takes it to 0
            if (prevCountdown === 1) {
              try {
                // Handle timeout - mark as unverifiable
                const isLastQuestion = currentClaimIndex >= (gamefile?.claims?.length - 1 || 0);
                
                // Use handleAnswer directly, not from dependency
                handleAnswer('unverifiable', true); // true for timeout
                
                // Handle auto-advancement via the ref
                if (handleTimeoutRef.current) {
                  handleTimeoutRef.current(isLastQuestion);
                }
              } catch (error) {
                console.error('Error handling timeout:', error);
                // Still ensure the countdown stops
                setCountdown(0);
              }
            }
            return 0; // Ensure countdown displays 0
          }
          return prevCountdown - 1;
        });
      }, 1000);
    } else if (!gameStarted && countdown !== ROUND_DURATION) {
      // If game is not started (e.g. initial screen or after game ends), reset countdown visually
      setCountdown(ROUND_DURATION);
    }
    
    return () => {
      if (timerId) {
        clearInterval(timerId); // Cleanup interval
      }
    };
  }, [gameStarted, currentClaimIndex, showFeedback, gamefile]);

  // Add close button to the game UI
  const CloseButton = () => (
    <IconButton
      onClick={onClose}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: 'text.secondary',
        zIndex: 1000,
        '&:hover': {
          color: 'text.primary',
        },
      }}
    >
      <CancelIcon />
    </IconButton>
  );

  // Load game state from localStorage on mount
  useEffect(() => {
    const loadGameState = () => {
      try {
        const storedState = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
        if (storedState) {
          const parsedState = JSON.parse(storedState);
          const { currentClaimIndex, results, gameStarted, points: storedPoints } = parsedState;
          
          // Validate the data before using it
          if (currentClaimIndex === undefined || !Array.isArray(results)) {
            console.error('Invalid game state in localStorage, resetting');
            localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
            return;
          }
          
          // Only load game state if the game isn't completed for today
          if (!shouldResetDailyProgress() && !isGameCompletedToday()) {
            // Ensure current claim index is valid
            setCurrentClaimIndex(Math.max(0, currentClaimIndex));
            setResults(results);
            setPoints(storedPoints !== undefined ? storedPoints : 0);
            
            // Only set game as started if the flag was true
            if (gameStarted) {
              // Use a small delay to ensure the game is fully loaded before starting
              setTimeout(() => {
                setGameStarted(true);
                setCountdown(ROUND_DURATION); // Reset countdown on new game start
              }, 100);
            }
          } else {
            // If game is completed or it's a new day, clear the game state
            localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
            setPoints(0);
          }
        } else {
          setPoints(0);
        }
      } catch (error) {
        console.error('Error loading game state from localStorage:', error);
        // Clear potentially corrupt state
        localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
        setPoints(0);
      }
    };

    // First load the game file, then the saved state
    fetchGamefile().then(() => {
      // Load state with a slight delay to ensure game file is processed
      setTimeout(loadGameState, 100);
    });
  }, []);

  // Save game state to localStorage
  useEffect(() => {
    if (gameStarted && !gameEnded) {
      const gameState = {
        currentClaimIndex,
        results,
        gameStarted,
        points,
      };
      localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(gameState));
      localStorage.setItem(STORAGE_KEYS.CURRENT_DATE, new Date().toDateString());
    }
  }, [currentClaimIndex, results, gameStarted, gameEnded, points]);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  }, [stats]);

  // Add effect to handle authentication changes
  useEffect(() => {
    console.log('this is running');
    console.log('isAuthenticated', isAuthenticated);
    // TODO DEBUG WHY submit results is not executing
    if (isAuthenticated && user && gameEnded) {
      // If user just authenticated and game is ended, submit results
      submitResults();
    }
  }, [isAuthenticated, user, gameEnded]);

  const updateStats = (isWin) => {
    setStats(prevStats => {
      const newStats = { ...prevStats };
      newStats.totalPlays += 1;
      
      if (isWin) {
        newStats.wins += 1;
        newStats.currentStreak += 1;
        newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak);
      } else {
        newStats.fails += 1;
        newStats.currentStreak = 0;
      }
      
      newStats.lastPlayedDate = new Date().toISOString();
      return newStats;
    });
  };

  const fetchGamefile = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(`${backendUrl}/get-latest-gamefile`, {
        method: 'GET',
        headers: headers,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // Check if game ID matches the one in localStorage
      const storedGameId = localStorage.getItem(STORAGE_KEYS.GAME_ID);
      if (storedGameId && storedGameId !== data._id) {
        // Game ID has changed, reset game state
        console.log('Game ID changed, resetting game state');
        localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
        localStorage.removeItem(STORAGE_KEYS.GAME_COMPLETED);
        localStorage.removeItem(STORAGE_KEYS.GAME_RESULTS);
        localStorage.removeItem(STORAGE_KEYS.FINAL_POINTS);
        setCurrentClaimIndex(0);
        setResults([]);
        setPoints(0);
      }
      
      // Check if stored results might be incompatible with the current gamefile
      const storedResults = loadStoredResults();
      if (storedResults.length > 0 && storedResults.length > data.claims.length) {
        console.log('Stored results count exceeds available claims, resetting game state');
        localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
        localStorage.removeItem(STORAGE_KEYS.GAME_COMPLETED);
        localStorage.removeItem(STORAGE_KEYS.GAME_RESULTS);
        localStorage.removeItem(STORAGE_KEYS.FINAL_POINTS);
        setCurrentClaimIndex(0);
        setResults([]);
        setPoints(0);
      }

      // Store the new game ID
      localStorage.setItem(STORAGE_KEYS.GAME_ID, data._id);

      setGamefile(data);
      setLoading(false);
      
      // Don't reset game state if game is already completed for today
      if (!isGameCompletedToday()) {
        setPoints(0);
        
        // Only remove game state if it's a new day
        if (shouldResetDailyProgress()) {
          localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
          localStorage.removeItem(STORAGE_KEYS.GAME_COMPLETED);
        }
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Error loading game: ' + error.message,
        severity: 'error',
      });
    }
  };

  const startGame = () => {
    // Check if game is already completed for today
    if (isGameCompletedToday()) {
      console.log('Game already completed today, showing results instead of starting new game');
      return; // Don't start a new game if already completed
    }
    
    // Reset daily progress if needed
    if (shouldResetDailyProgress()) {
      setCurrentClaimIndex(0);
      setResults([]);
      setPoints(0);
      localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
      localStorage.removeItem(STORAGE_KEYS.GAME_COMPLETED);
    }
    
    setGameStarted(true);
    setCountdown(ROUND_DURATION); // Reset countdown on new game start
  };

  const handleAnswer = async (answer, isTimeout = false) => {
    try {
      // Safety check to ensure gamefile and currentClaim exist
      if (!gamefile || !gamefile.claims || currentClaimIndex >= gamefile.claims.length) {
        console.error('Game data not ready or invalid claim index:', { 
          hasGamefile: !!gamefile, 
          claimsLength: gamefile?.claims?.length, 
          currentClaimIndex 
        });
        setSnackbar({
          open: true,
          message: 'Error: Game data is not ready. Please restart the game.',
          severity: 'error',
        });
        return;
      }

      const timeTaken = isTimeout ? ROUND_DURATION : (ROUND_DURATION - countdown);
      const currentClaim = gamefile.claims[currentClaimIndex];
      const isCorrect = answer.toLowerCase() === currentClaim.expected_classification.toLowerCase();

      let awardedBasePoints = 0;
      let awardedTimeBonusPoints = 0;
      let totalAwardedPoints = 0;

      if (isCorrect) {
        const difficulty = currentClaim.difficulty.toLowerCase();
        switch (difficulty) {
          case 'low':
            awardedBasePoints = 40;
            break;
          case 'med':
            awardedBasePoints = 50;
            break;
          case 'hard':
            awardedBasePoints = 70;
            break;
          default:
            awardedBasePoints = 10; // Default points for unknown difficulty
        }
        awardedTimeBonusPoints = Math.floor(countdown * 5) // Time left * 5 points per second
        totalAwardedPoints = awardedBasePoints + awardedTimeBonusPoints;
        setPoints(prevPoints => prevPoints + totalAwardedPoints);
        
        if (totalAwardedPoints > 0) {
          setComboPoints(totalAwardedPoints);
          setShowComboPopup(true);
          setTimeout(() => {
            setShowComboPopup(false);
          }, 1500); // Show combo for 1.5 seconds
        }

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Show feedback with explanation
      setFeedback({
        correct: isCorrect,
        message: isCorrect ? `Correct! +${totalAwardedPoints} points` : 'Incorrect!',
        explanation: currentClaim.overall_assessment || 'No explanation available',
        awardedPoints: isCorrect ? { base: awardedBasePoints, bonus: awardedTimeBonusPoints, total: totalAwardedPoints } : null
      });
      setShowFeedback(true);

      const result = {
        claim_id: currentClaim._id || `claim-${currentClaimIndex}`, // Fallback if _id is missing
        answer: answer.toLowerCase(),
        time_taken: timeTaken,
      };

      const newResults = [...results, result];
      setResults(newResults);

      // Check if this is the last question - either by index or by results length
      const isLastClaim = currentClaimIndex >= gamefile.claims.length - 1 || newResults.length >= gamefile.claims.length;
      
      if (isLastClaim) {
        const isWin = newResults.filter((res, index) => {
          const claim = gamefile.claims[index];
          // Skip results that don't have a corresponding claim
          if (!claim) return false;
          return res.answer === claim.expected_classification.toLowerCase();
        }).length === Math.min(newResults.length, gamefile.claims.length);
        
        console.log('Game completed, setting completion state:', { isWin, results: newResults });
        updateStats(isWin);

        // Capture final score
        const finalAccumulatedPoints = points + totalAwardedPoints; 

        localStorage.setItem(STORAGE_KEYS.GAME_COMPLETED, 'true');
        localStorage.setItem(STORAGE_KEYS.GAME_RESULTS, JSON.stringify(newResults));
        localStorage.setItem(STORAGE_KEYS.FINAL_POINTS, JSON.stringify(finalAccumulatedPoints)); // Save final points

        setGameStarted(false);
        setGameEnded(true);
        setPoints(0); // Reset points state for a potential new game session
        setCountdown(ROUND_DURATION); // Reset countdown
        submitResults(newResults);
      }
    } catch (error) {
      console.error('Error in handleAnswer:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred processing your answer. Please try again.',
        severity: 'error',
      });
    }
  };

  const submitResults = async (resultsArg) => {
    const resultsToSubmit = resultsArg || results;
    try {
      // Check for required fields
      if (!gamefile?._id) {
        throw new Error('Game file ID is missing');
      }
      if (!isAuthenticated) {
        console.log('User not authenticated, skipping result submission');
        return;
      }
      if (!resultsToSubmit || resultsToSubmit.length === 0) {
        throw new Error('No results to submit');
      }

      // Get the final score from localStorage or use 0 if not available
      let gameFinalScore = 0;
      const storedFinalScoreString = localStorage.getItem(STORAGE_KEYS.FINAL_POINTS);
      if (storedFinalScoreString) {
        try {
          gameFinalScore = JSON.parse(storedFinalScoreString);
        } catch (e) {
          console.error('Error parsing stored final score:', e);
        }
      }

      console.log('Submitting results:', { 
        gamefile_id: gamefile._id,
        email: user?.email || 'anonymous',
        resultsCount: resultsToSubmit.length,
        score: gameFinalScore
      });

      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(`${backendUrl}/record-game-results`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          gamefile_id: gamefile._id,
          email: user?.email || 'anonymous',
          results: resultsToSubmit,
          score: gameFinalScore,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit results');
      }

      console.log('Results submitted successfully');
      setSnackbar({
        open: true,
        message: 'Results recorded successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error submitting results:', error);
      setSnackbar({
        open: true,
        message: 'Error submitting results: ' + error.message,
        severity: 'error',
      });
      // Still mark the game as completed even if submission fails
      localStorage.setItem(STORAGE_KEYS.GAME_COMPLETED, 'true');
      setGameStarted(false);
      setGameEnded(true);
      setPoints(0);
    }
  };

  const restartGame = () => {
    setGameStarted(false);
    setGameEnded(false);
    setCurrentClaimIndex(0);
    setResults([]);
    setCountdown(ROUND_DURATION); // Reset countdown
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
    localStorage.removeItem(STORAGE_KEYS.GAME_COMPLETED);
    setPoints(0);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'low':
        return '#4CAF50';
      case 'med':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const toggleClaimExpansion = (index) => {
    setExpandedClaims(prev => {
      const newExpandedState = !prev[index];
      // If we are collapsing the claim, also reset its specific text expansion state
      if (!newExpandedState) { 
        setDetailedExplanationExpandedMap(p => ({ ...p, [index]: false }));
      }
      return {
        ...prev,
        [index]: newExpandedState
      };
    });
  };

  // Function to toggle explanation text expansion in results
  const toggleDetailedExplanationText = (index) => {
    setDetailedExplanationExpandedMap(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Add function to load stored results
  const loadStoredResults = () => {
    const storedResults = localStorage.getItem(STORAGE_KEYS.GAME_RESULTS);
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        // Validate that parsedResults is an array and contains properly formatted results
        if (Array.isArray(parsedResults) && parsedResults.length > 0 && 
            parsedResults.every(res => typeof res === 'object' && 'answer' in res)) {
          return parsedResults;
        } else {
          console.warn('Invalid stored results format, returning empty array');
          return [];
        }
      } catch (e) {
        console.error('Error parsing stored results:', e);
        return [];
      }
    }
    return [];
  };

  // Debug function to clear localStorage
  const clearLocalStorage = () => {
    console.log('Clearing localStorage');
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_DATE);
    localStorage.removeItem(STORAGE_KEYS.GAME_COMPLETED);
    localStorage.removeItem(STORAGE_KEYS.GAME_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.FINAL_POINTS);
    window.location.reload();
  };

  // Debug function to show current state
  const showDebugState = () => {
    const state = {
      gameState: localStorage.getItem(STORAGE_KEYS.GAME_STATE),
      stats: localStorage.getItem(STORAGE_KEYS.STATS),
      currentDate: localStorage.getItem(STORAGE_KEYS.CURRENT_DATE),
      gameCompleted: localStorage.getItem(STORAGE_KEYS.GAME_COMPLETED),
      componentState: {
        gameStarted,
        gameEnded,
        currentClaimIndex,
        results
      }
    };
    console.log('Current Debug State:', state);
  };

  // Add debug state logging on mount and state changes
  useEffect(() => {
    showDebugState();
  }, [gameStarted, gameEnded, currentClaimIndex, results]);

  // Add effect to handle game completion state
  useEffect(() => {
    if (gameEnded) {
      setGameStarted(false);
      
      // Award completion credits if authenticated
      if (isAuthenticated && user?.email) {
        const storedFinalScoreString = localStorage.getItem(STORAGE_KEYS.FINAL_POINTS);
        if (storedFinalScoreString) {
          try {
            const finalScore = JSON.parse(storedFinalScoreString);
            awardGameCompletionCredits(finalScore);
          } catch (e) {
            console.error('Error parsing stored final score:', e);
          }
        }
      }
    }
  }, [gameEnded, isAuthenticated, user?.email]);

  // Add effect to handle localStorage game completion
  useEffect(() => {
    const checkGameCompletion = () => {
      if (isGameCompletedToday() && gameStarted) {
        setGameStarted(false);
        setGameEnded(true);
      }
    };

    checkGameCompletion();
  }, [gameStarted]);

  // Debug buttons container
  const DebugButtons = () => (
    <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
      <Button
        variant="outlined"
        color="error"
        onClick={clearLocalStorage}
      >
        [DEBUG] Clear Local Storage
      </Button>
      <Button
        variant="outlined"
        color="info"
        onClick={showDebugState}
      >
        [DEBUG] Show State
      </Button>
    </Box>
  );

  const handleShareDialogOpen = () => {
    console.log('Opening share dialog...');
    setShareDialogOpen(true);
  };

  const handleShareDialogClose = () => {
    console.log('Closing share dialog...');
    setShareDialogOpen(false);
    setCopied(false);
    setLinkedInCopied(false);
  };

  const getShareMessage = () => {
    const gameDate = gamefile?.timestamp ? new Date(gamefile.timestamp).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : '';
    
    // Calculate correct answers
    const storedResults = loadStoredResults();
    const correctCount = storedResults.filter((result, index) => {
      const claim = gamefile.claims[index];
      if (!claim) return false;
      return result.answer === claim.expected_classification.toLowerCase();
    }).length;
    
    return `I scored ${localStorage.getItem(STORAGE_KEYS.FINAL_POINTS) || 0} on TRUE/FALSE/UNVERIFIABLE! 🔥\n\n${correctCount}/${storedResults.length} correct\n\n${getEmojiResults()}\n\n${gameDate}\nPlay the daily fact-checking game at https://app.facticity.ai/game`;
  };
  
  const getLinkedInShareMessage = () => {
    const gameDate = gamefile?.timestamp ? new Date(gamefile.timestamp).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : '';
    
    // Calculate correct answers
    const storedResults = loadStoredResults();
    const correctCount = storedResults.filter((result, index) => {
      const claim = gamefile.claims[index];
      if (!claim) return false;
      return result.answer === claim.expected_classification.toLowerCase();
    }).length;
    
    return `I scored ${localStorage.getItem(STORAGE_KEYS.FINAL_POINTS) || 0} on TRUE/FALSE/UNVERIFIABLE! 🔥\n\n${correctCount}/${storedResults.length} correct\n\n${getEmojiResults()}\n\n${gameDate}\nPlay the daily fact-check challenge at https://app.facticity.ai/game`;
  };
  

  const getEmojiResults = () => {
    const storedResults = loadStoredResults();
    return storedResults.map((result, index) => {
      const claim = gamefile.claims[index];
      if (!claim) return '⬜'; // Return a neutral emoji if claim doesn't exist
      return result.answer === claim.expected_classification.toLowerCase() ? '🟩' : '🟥';
    }).join('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareMessage())
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setSnackbar({
          open: true,
          message: enableSharePoints 
            ? 'Results copied to clipboard! Share with friends to earn 5 credits!'
            : 'Results copied to clipboard! Share with friends!',
          severity: 'success',
        });
        
        // Award credits for sharing
        // if (isAuthenticated && user?.email) {
        //   handleShareCredit('copy', 5);
        // }
      })
      .catch((error) => {
        console.error('Failed to copy the URL: ', error);
        setSnackbar({ open: true, message: 'Failed to copy the message.', severity: 'error' });
      });
  };

  const getWhatsAppShareMessage = () => {
    const gameDate = gamefile?.timestamp ? new Date(gamefile.timestamp).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : '';
    const storedResults = loadStoredResults();
    const resultsText = storedResults.map((result, index) => {
      const claim = gamefile.claims[index];
      if (!claim) return '-';
      return result.answer === claim.expected_classification.toLowerCase() ? '🟩' : '🟥';
    }).join('');
    
    // Calculate correct answers
    const correctCount = storedResults.filter((result, index) => {
      const claim = gamefile.claims[index];
      if (!claim) return false;
      return result.answer === claim.expected_classification.toLowerCase();
    }).length;
    
    return `I scored ${localStorage.getItem(STORAGE_KEYS.FINAL_POINTS) || 0} on TRUE/FALSE/UNVERIFIABLE!\n\n${correctCount}/${storedResults.length} correct\n\n${resultsText}\n\n${gameDate}\nPlay the daily fact-checking game at https://app.facticity.ai/game`;
  };

  const handleWhatsAppShare = () => {
    const message = getWhatsAppShareMessage();
    const encodedMessage = encodeURIComponent(message).replace(/'/g, "%27").replace(/"/g, "%22");
    
    // Open as popup instead of new tab
    const width = 550;
    const height = 550;
    const left = window.screen.width/2 - width/2;
    const top = window.screen.height/2 - height/2;
    
    window.open(
      `https://wa.me/?text=${encodedMessage}`,
      'whatsapp-share',
      `width=${width},height=${height},top=${top},left=${left}`
    );
    
    // setSnackbar({
    //   open: true,
    //   message: 'Shared with WhatsApp! You earned 5 credits!',
    //   severity: 'success',
    // });
    
    // Award credits for sharing
    if (isAuthenticated && user?.email) {
      handleShareCredit('whatsapp', 2);
    }
    
    handleShareDialogClose();
  };

  const handleLinkedInShare = () => {
    // Copy the suggested message to clipboard
    navigator.clipboard.writeText(getLinkedInShareMessage())
      .then(() => {
        setLinkedInCopied(true);
        setTimeout(() => setLinkedInCopied(false), 3000);
        
        // After a short delay, open LinkedIn as a popup
        setTimeout(() => {
          const url = encodeURIComponent(window.location.href);
          const width = 550;
          const height = 550;
          const left = window.screen.width/2 - width/2;
          const top = window.screen.height/2 - height/2;
          
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            'linkedin-share',
            `width=${width},height=${height},top=${top},left=${left}`
          );
          
          // setSnackbar({
          //   open: true,
          //   message: 'Shared with LinkedIn! You earned 5 credits!',
          //   severity: 'success',
          // });
          
          // Award credits for sharing
          if (isAuthenticated && user?.email) {
            handleShareCredit('linkedin', 2);
          }
          
        }, 1500);
      })
      .catch((error) => {
        console.error('Failed to copy the LinkedIn message: ', error);
        // If copying fails, just open LinkedIn directly
        const url = encodeURIComponent(window.location.href);
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
          '_blank'
        );
      });
      
    handleShareDialogClose();
  };

  const getRedditShareMessage = () => {
    const gameDate = gamefile?.timestamp ? new Date(gamefile.timestamp).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : '';
    const storedResults = loadStoredResults();
    const resultsText = storedResults.map((result, index) => {
      const claim = gamefile.claims[index];
      if (!claim) return '-';
      return result.answer === claim.expected_classification.toLowerCase() ? '🟩' : '🟥';
    }).join('');
    
    // Calculate correct answers
    const correctCount = storedResults.filter((result, index) => {
      const claim = gamefile.claims[index];
      if (!claim) return false;
      return result.answer === claim.expected_classification.toLowerCase();
    }).length;
    
    return `I scored ${localStorage.getItem(STORAGE_KEYS.FINAL_POINTS) || 0} on TRUE/FALSE/UNVERIFIABLE!\n\n${correctCount}/${storedResults.length} correct\n\n${resultsText}\n\n${gameDate}\nPlay the daily fact-checking game at https://app.facticity.ai/game`;
  };

  const handleRedditShare = () => {
    const message = getRedditShareMessage();
    const url = 'https://app.facticity.ai/game';
    const title = encodeURIComponent(message);
    
    const width = 550;
    const height = 600;
    const left = window.screen.width/2 - width/2;
    const top = window.screen.height/2 - height/2;
    
    window.open(
      `https://www.reddit.com/submit?url=${url}&title=${title}`,
      'reddit-share',
      `width=${width},height=${height},top=${top},left=${left}`
    );
    
    // setSnackbar({
    //   open: true,
    //   message: 'Shared with Reddit! You earned 5 credits!',
    //   severity: 'success',
    // });
    
    // Award credits for sharing
    if (isAuthenticated && user?.email) {
      handleShareCredit('reddit', 2);
    }
    
    handleShareDialogClose();
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(getShareMessage());
    
    // Open as popup window instead of new tab
    const width = 550;
    const height = 420;
    const left = window.screen.width/2 - width/2;
    const top = window.screen.height/2 - height/2;
    
    window.open(
      `https://twitter.com/intent/tweet?text=${text}`, 
      'twitter-share', 
      `width=${width},height=${height},top=${top},left=${left}`
    );
    
    // setSnackbar({
    //   open: true,
    //   message: 'Shared with Twitter/X! You earned 5 credits!',
    //   severity: 'success',
    // });
    
    // Award credits for sharing
    if (isAuthenticated && user?.email) {
      handleShareCredit('twitter', 2);
    }
    
    handleShareDialogClose();
  };

  // Function to calculate credits earned based on score
  const calculateCreditsEarned = useCallback((score) => {
    if (score >= 500 && score <= 625) {
      return 15;
    } else if (score >= 300 && score < 500) {
      return 10;
    } else {
      return 5;
    }
  }, []);

  // Reward bonus points function adapted from InteractionBar.js
  const rewardBonusPoint = async (type, points) => {
    try {
      // Don't proceed if no email or game details
      if (!isAuthenticated || !user?.email || !gamefile?._id) {
        console.log("Cannot reward points: missing user email or game ID");
        return false;
      }
      
      const headers = {
        'Content-Type': 'application/json',
        'Validator': 'privy'
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(`${backendUrl}/reward_point`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          game_id: gamefile._id,
          task_id: gamefile._id, // Include task_id set to game_id for API consistency
          userEmail: user.email,
          points: points,
          url: encodeURIComponent(window.location.href),
          type: type // "leaderboard", "share", "game_completion"
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log(`Successfully rewarded ${points} points for ${type}`, data);
        
        // Update user credits if the backend returns the updated credit count
        if (data.updatedCredits !== undefined) {
          setUserCredits?.(data.updatedCredits);
        }
        
        return true;
      } else {
        console.error("Failed to reward points:", data.message || "Unknown error");
        return false;
      }
    } catch (error) {
      console.error("Error rewarding points:", error);
      return false;
    }
  };

  // Function to submit score to leaderboard
  const submitScoreToLeaderboard = async (score, email) => {
    try {
      setLeaderboardSubmitted(true);
      setLoading(true);
      
      // First, try to get the user's handle
      let userHandle = '';
      
      try {
        // Check if user already has a handle
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
          headers['Validator'] = 'privy';
        }
        
        const handleResponse = await fetch(`${backendUrl}/api/get_userhandle?email=${email}`, {
          method: 'GET',
          headers: headers,
        });
        const handleData = await handleResponse.json();
        
        if (handleData.handle) {
          userHandle = handleData.handle;
          console.log(`Using existing handle: ${userHandle}`);
          
          // If we have a handle, submit score right away
          await submitScoreWithHandle(userHandle, score, email);
        } else {
          // User doesn't have a handle, show handle selection UI
          setLoading(false);
          // We'll handle the actual submission in the handle selection UI
          // The leaderboardDialogOpen state is already true at this point
        }
      } catch (handleError) {
        console.error('Error with user handle:', handleError);
        setSnackbar({
          open: true,
          message: 'Error with user handle: ' + handleError.message,
          severity: 'error',
        });
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error submitting score to leaderboard:', error);
      setSnackbar({
        open: true,
        message: 'Failed to submit score to leaderboard: ' + error.message,
        severity: 'error',
      });
      setLoading(false);
    }
  };
  
  // New function to submit score with a chosen handle
  const submitScoreWithHandle = async (handle, score, email) => {
    try {
      setLoading(true);
      console.log(`Submitting score ${score} for ${email} with handle ${handle} to leaderboard`);
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const leaderboardResponse = await fetch(`${backendUrl}/api/leaderboard/submit`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          email: email,
          user_handle: handle,
          score: score,
          game_id: gamefile?._id || 'unknown',
        }),
      });
      
      const leaderboardData = await leaderboardResponse.json();
      
      if (!leaderboardResponse.ok) {
        // Handle the specific case where score already exists
        if (leaderboardData.error === "Score already exists for this user in this game") {
          setSnackbar({
            open: true,
            message: 'You have already submitted a score for this game!',
            severity: 'info',
          });
          setLeaderboardDialogOpen(false);
          setLoading(false);
          
          // Redirect to the leaderboard page after a short delay even if score already submitted
          setTimeout(() => {
            window.location.href = '/discover/leaderboard';
          }, 1500);
          return;
        }
        throw new Error(leaderboardData.error || 'Failed to submit to leaderboard');
      }
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Score submitted to leaderboard!',
        severity: 'success',
      });
      
      // Close leaderboard dialog
      setLeaderboardDialogOpen(false);
      setLoading(false);
      
      // Redirect to the leaderboard page after a short delay
      setTimeout(() => {
        window.location.href = '/discover/leaderboard';
      }, 1500);
    } catch (error) {
      console.error('Error submitting score to leaderboard:', error);
      setSnackbar({
        open: true,
        message: 'Failed to submit score to leaderboard: ' + error.message,
        severity: 'error',
      });
      setLoading(false);
    }
  };

  // Function to award game completion credits
  const awardGameCompletionCredits = async (score) => {
    if (!isAuthenticated || !user?.email) return;
    
    // Calculate credits based on score
    const points = calculateCreditsEarned(score);
    
    try {
      // Don't proceed if no email or game details
      if (!gamefile?._id) {
        console.log("Cannot reward points: missing game ID");
        return false;
      }
      
      const headers = {
        'Content-Type': 'application/json',
        'Validator': 'privy'
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(`${backendUrl}/reward_point`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          game_id: gamefile._id,
          task_id: gamefile._id,
          userEmail: user.email,
          points: points,
          url: encodeURIComponent(window.location.href),
          type: 'game_completion'
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log(`Successfully rewarded ${points} points for game completion`, data);
        
        // Update user credits if the backend returns the updated credit count
        if (data.updatedCredits !== undefined) {
          setUserCredits?.(data.updatedCredits);
        }
        
        // Show success animation
        setCreditAmount(points);
        setShowCreditAnimation(true);
        
        // Hide animation after a delay
        setTimeout(() => {
          setShowCreditAnimation(false);
        }, 2500);
      } else {
        // Show "already awarded" animation
        console.log("Credits already awarded:", data.message || "Unknown error");
        setShowAlreadyAwardedAnimation(true);
        
        // Hide the animation after 2.5 seconds
        setTimeout(() => {
          setShowAlreadyAwardedAnimation(false);
        }, 2500);
      }
    } catch (error) {
      console.error("Error awarding game completion points:", error);
    }
  };

  // Handle awarding share credits
  const handleShareCredit = async (platform, points = 2) => {
    // Only award points if sharing points are enabled
    if (!enableSharePoints) {
      return;
    }

    const canAwardPoints = await rewardBonusPoint(`share_${platform}`, points);
    
    if (canAwardPoints) {
      // Show animation for credits
      setCreditAmount(points);
      setShowCreditAnimation(true);
      
      // Hide the animation after 2.5 seconds
      setTimeout(() => {
        setShowCreditAnimation(false);
      }, 2500);
    } else {
      // Show "already awarded" animation
      setShowAlreadyAwardedAnimation(true);
      
      // Hide the animation after 2.5 seconds
      setTimeout(() => {
        setShowAlreadyAwardedAnimation(false);
      }, 2500);
    }
  };

  // Function to open leaderboard dialog
  const openLeaderboardDialog = () => {
    // If score is already submitted, redirect directly to leaderboard page
    if (leaderboardSubmitted) {
      window.location.href = '/discover/leaderboard';
      return;
    }
    setLeaderboardDialogOpen(true);
  };

  // Function to close leaderboard dialog
  const closeLeaderboardDialog = () => {
    setLeaderboardDialogOpen(false);
  };

  // Add effect for updating earned credits when game is completed
  useEffect(() => {
    // Only run this effect when game is completed
    if (isGameCompletedToday() && !gameStarted) {
      const storedFinalScoreString = localStorage.getItem(STORAGE_KEYS.FINAL_POINTS);
      if (storedFinalScoreString) {
        try {
          const gameFinalScore = JSON.parse(storedFinalScoreString);
          if (gameFinalScore > 0 && !leaderboardSubmitted) {
            const credits = calculateCreditsEarned(gameFinalScore);
            setEarnedCredits(credits);
          }
        } catch (e) {
          console.error('Error parsing stored final score in effect:', e);
        }
      }
    }
  }, [gameStarted, leaderboardSubmitted, calculateCreditsEarned]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
        <CloseButton />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography color="error">{error}</Typography>
        <CloseButton />
      </Box>
    );
  }

  if (!gamefile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography>No game available at the moment.</Typography>
        <CloseButton />
      </Box>
    );
  }

  // Check if game is completed for today and show endgame screen
  if (isGameCompletedToday() && !gameStarted) {
    console.log('Rendering endgame screen - game completed today');
    const storedResults = loadStoredResults();
    const displayResults = storedResults.length > 0 ? storedResults : results;
    
    const correctAnswers = displayResults.filter(result => {
      const index = displayResults.indexOf(result);
      const claim = gamefile.claims[index];
      // Skip this result if the claim doesn't exist in the current gamefile
      if (!claim) return false;
      return result.answer === claim.expected_classification.toLowerCase();
    }).length;

    const totalTime = displayResults.reduce((sum, result) => sum + result.time_taken, 0);
    const averageTime = displayResults.length > 0 ? totalTime / displayResults.length : 0;

    let gameFinalScore = 0;
    const storedFinalScoreString = localStorage.getItem(STORAGE_KEYS.FINAL_POINTS);
    if (storedFinalScoreString) {
      try {
        gameFinalScore = JSON.parse(storedFinalScoreString);
      } catch (e) {
        console.error('Error parsing stored final score:', e);
        gameFinalScore = 0; // Fallback if parsing fails
      }
    }
    
    // Calculate credits earned based on score
    const credits = calculateCreditsEarned(gameFinalScore);
    
    return (
      <>
        <Box sx={{ height: '100%', width: '100%', overflow: 'auto', position: 'relative', m: 0, p: 0, display: 'flex', flexDirection: 'column' }}>
          <CloseButton />
          <Box maxWidth="800px" margin="0 auto" padding={2}>
            {/* <DebugButtons /> */}
            <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', p: { xs: 2, sm: 4 } }}>
                {/* <Typography variant="h4" gutterBottom>
                  Game Complete!
                </Typography> */}
                <Box sx={{ my: 4 }}>
                  {/* <Typography variant="h6" gutterBottom>
                    Results Summary
                  </Typography> */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 1, 
                    fontSize: '2rem',
                    mb: 2 
                  }}>
                    {displayResults.map((result, index) => {
                      const claim = gamefile.claims[index];
                      // Handle case where claim doesn't exist
                      if (!claim) {
                        return (
                          <span key={index} role="img" aria-label="unavailable">
                            ⬜
                          </span>
                        );
                      }
                      const isCorrect = result.answer === claim.expected_classification.toLowerCase();
                      return (
                        <span key={index} role="img" aria-label={isCorrect ? "correct" : "incorrect"}>
                          {isCorrect ? '🟩' : '🟥'}
                        </span>
                      );
                    })}
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    ({correctAnswers}/{displayResults.length} correct)
                  </Typography>    
                  <Typography variant="h5" color="primary" gutterBottom>
                    Final Score: {gameFinalScore} points
                  </Typography>

                  
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    mb: 2,
                    fontWeight: 'bold',
                    color: 'primary.main'
                  }}>
                    <EmojiEventsIcon color="primary" />
                    <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
                      You earned {credits} credits!
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" color="text.secondary">
                    {gamefile?.timestamp ? new Date(gamefile.timestamp).toLocaleDateString('en-US', { 
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }) : ''}
                  </Typography>
                  
                  <Box sx={{ mt: 3, mb: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShareIcon />}
                      onClick={() => {
                        console.log('Share button clicked');
                        handleShareDialogOpen();
                      }}
                      sx={{
                        px: 3,
                        py: 1.5,
                        backgroundColor: '#0066FF',
                        '&:hover': {
                          backgroundColor: '#0056D6',
                        },
                      }}
                    >
                      {enableSharePoints ? 'Share Results & Earn Credits' : 'Share Results'}
                    </Button>
                    
                    {!leaderboardSubmitted ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<EmojiEventsIcon />}
                        onClick={openLeaderboardDialog}
                        sx={{
                          px: 3,
                          py: 1.5,
                          borderColor: '#0066FF',
                          color: '#0066FF',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 102, 255, 0.08)',
                            borderColor: '#0056D6',
                          },
                        }}
                      >
                        Add to Leaderboard
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<EmojiEventsIcon />}
                        onClick={() => window.location.href = '/discover/leaderboard'}
                        sx={{
                          px: 3,
                          py: 1.5,
                          borderColor: '#0066FF',
                          color: '#0066FF',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 102, 255, 0.08)',
                            borderColor: '#0056D6',
                          },
                        }}
                      >
                        View Leaderboard
                      </Button>
                    )}
                  </Box>
                  
                  <Typography variant="caption" display="block" mt={1} color="text.secondary">
                    Be in the top 5 by end of day and get up to 100 additional credits!
                  </Typography>
                  
                  {/* <Typography variant="caption" display="block" mt={1} color="text.secondary">
                    Share your results to earn credits!
                  </Typography> */}
                </Box>

                <Box sx={{ textAlign: 'left', mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Detailed Results
                  </Typography>
                  {!isAuthenticated && (
                    <Box sx={{ 
                      mb: 3, 
                      p: 2, 
                      backgroundColor: 'warning.light', 
                      borderRadius: 2,
                      textAlign: 'center'
                    }}>
                      <Typography variant="body1" color="warning.contrastText" gutterBottom>
                        Sign in to save your results and track your progress!
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => loginWithPopup()}
                        sx={{
                          mt: 1,
                          backgroundColor: '#0066FF',
                          '&:hover': {
                            backgroundColor: '#0056D6',
                          },
                        }}
                      >
                        Sign In
                      </Button>
                    </Box>
                  )}
                  {displayResults.map((result, index) => {
                    const claim = gamefile.claims[index];
                    // Skip results where claim doesn't exist
                    if (!claim) return null;
                    const isCorrect = result.answer === claim.expected_classification.toLowerCase();
                    const isClaimSectionExpanded = expandedClaims[index] || false;
                    const isExplanationTextExpanded = detailedExplanationExpandedMap[index] || false;

                    return (
                      <Box 
                        key={index}
                        sx={{
                          mb: 2,
                          p: 2,
                          backgroundColor: isCorrect ? 'success.light' : 'error.light',
                          borderRadius: 2,
                          color: 'white'
                        }}
                      >
                        <Box 
                          onClick={() => toggleClaimExpansion(index)}
                          sx={{ 
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            Claim {index + 1}: {claim.claim}
                          </Typography>
                          <IconButton 
                            size="small" 
                            sx={{ 
                              color: 'white',
                              transform: isClaimSectionExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s'
                            }}
                          >
                            <ArrowForwardIcon />
                          </IconButton>
                        </Box>
                        <Box display="flex" alignItems="center" mt={1}>
                          {isCorrect ? (
                            <CheckCircleIcon sx={{ mr: 1 }} />
                          ) : (
                            <CancelIcon sx={{ mr: 1 }} />
                          )}
                          <Typography>
                            Your answer: {result.answer.toUpperCase()}
                          </Typography>
                        </Box>
                        <Typography>
                          Correct answer: {claim.expected_classification.toUpperCase()}
                        </Typography>
                        <Typography variant="caption" display="block" mt={1}>
                          Time taken: {result.time_taken.toFixed(1)} seconds
                        </Typography>
                        
                        <Collapse in={isClaimSectionExpanded}>
                          <Box mt={2}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              Explanation:
                            </Typography>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: marked(claim.overall_assessment || 'No explanation available')
                              }}
                              style={{
                                color: 'white',
                                lineHeight: 1.5,
                                textAlign: 'left',
                                fontFamily: 'Arial',
                                overflow: isExplanationTextExpanded ? 'auto' : 'hidden',
                                textOverflow: 'ellipsis',
                                display: isExplanationTextExpanded ? 'block' : '-webkit-box',
                                WebkitLineClamp: isExplanationTextExpanded ? 'none' : 3,
                                WebkitBoxOrient: 'vertical',
                                maxHeight: isExplanationTextExpanded ? '300px' : 'none',
                                overflowX: 'hidden',
                                wordBreak: 'break-word',
                                wordWrap: 'break-word',
                                width: '100%'
                              }}
                            />
                            {marked(claim.overall_assessment || '').length > 150 && (
                              <Link
                                component="button"
                                variant="body2"
                                onClick={(e) => { 
                                  e.stopPropagation();
                                  toggleDetailedExplanationText(index);
                                }}
                                sx={{
                                  display: 'inline-block',
                                  mt: 1,
                                  color: 'white',
                                  fontWeight: 'bold',
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  padding: 0,
                                  '&:hover': {
                                      textDecoration: 'none',
                                  }
                                }}
                              >
                                {isExplanationTextExpanded ? 'Read Less' : 'Read More'}
                              </Link>
                            )}
                          </Box>
                        </Collapse>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
        
        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        
        {/* Share Dialog - moved outside the main box for better z-index handling */}
        <Dialog
          open={shareDialogOpen}
          onClose={handleShareDialogClose}
          PaperProps={{
            sx: {
              borderRadius: '12px',
              maxWidth: '400px',
              width: '100%',
            }
          }}
          sx={{
            zIndex: 1500002, // Higher than main game dialog (1500000)
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)', // Make backdrop more visible for debugging
            }
          }}
          disablePortal={false} // Force using a portal for rendering
          keepMounted  // Keep the dialog in the DOM when closed
          slotProps={{
            backdrop: {
              onClick: () => {
                console.log('Backdrop clicked, closing dialog');
                handleShareDialogClose();
              }
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '16px 24px',
            color: '#1a73e8',
            fontWeight: 600
          }}>
            Share your results
            <IconButton 
              edge="end" 
              onClick={handleShareDialogClose}
              aria-label="close"
              sx={{ color: 'rgba(0, 0, 0, 0.54)' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ padding: '24px' }}>
            <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
            {enableSharePoints 
                ? 'Share your game results with your network: +2 credits per social share.'
                : 'Share your game results with your network.'
            }
            </Typography>
            
            <Stack spacing={2}>
              <Button
                fullWidth
                startIcon={<WhatsAppIcon />}
                onClick={handleWhatsAppShare}
                sx={{ 
                  backgroundColor: '#25D366',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#128C7E',
                  }
                }}
              >
                Share via WhatsApp
              </Button>
              
              <Button
                fullWidth
                startIcon={<TwitterIcon />}
                onClick={handleTwitterShare}
                sx={{ 
                  backgroundColor: '#000000',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#333333',
                  }
                }}
              >
                Share on X (Twitter)
              </Button>
              
              <Button
                fullWidth
                startIcon={linkedInCopied ? <CheckCircleIcon /> : <LinkedInIcon />}
                onClick={handleLinkedInShare}
                sx={{ 
                  backgroundColor: linkedInCopied ? '#e8f5e9' : '#0077B5',
                  color: linkedInCopied ? '#2e7d32' : 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: linkedInCopied ? '#e8f5e9' : '#005582',
                  }
                }}
              >
                {linkedInCopied ? 'Message copied! Opening LinkedIn...' : 'Share on LinkedIn'}
              </Button>
              
              <Button
                fullWidth
                startIcon={<RedditIcon />}
                onClick={handleRedditShare}
                sx={{ 
                  backgroundColor: '#FF4500',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#CC3700',
                  }
                }}
              >
                Share on Reddit
              </Button>
              
              <Button
                fullWidth
                startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                onClick={handleCopyLink}
                sx={{ 
                  backgroundColor: copied ? '#e8f5e9' : '#f5f5f5',
                  color: copied ? '#2e7d32' : '#666',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: copied ? '#e8f5e9' : '#eeeeee',
                  }
                }}
              >
                {copied ? 'Results copied!' : 'Copy results'}
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
        
        {/* Leaderboard Dialog */}
        <Dialog
          open={leaderboardDialogOpen}
          onClose={closeLeaderboardDialog}
          PaperProps={{
            sx: {
              borderRadius: '12px',
              maxWidth: '450px',
              width: '100%',
            }
          }}
          sx={{
            zIndex: 1500001, // Higher than main game dialog (1500000)
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '16px 24px',
            color: '#1a73e8',
            fontWeight: 600
          }}>
            Add Your Score to Leaderboard
            <IconButton 
              edge="end" 
              onClick={closeLeaderboardDialog}
              aria-label="close"
              sx={{ color: 'rgba(0, 0, 0, 0.54)' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ padding: '24px' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <EmojiEventsIcon sx={{ fontSize: 48, color: '#FFD700', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Your Score: {gameFinalScore} points
              </Typography>
              
              {isAuthenticated ? (
                <>
                  {/* Handle selection UI - similar to DiscoverPostButton */}
                  <HandleSelectionForm 
                    email={user?.email} 
                    score={gameFinalScore} 
                    onSubmit={submitScoreWithHandle} 
                  />
                </>
              ) : (
                <Box>
                  <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                    You need to sign in to submit your score to the leaderboard.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => loginWithPopup()}
                    sx={{
                      py: 1.5,
                      fontWeight: 'bold',
                      backgroundColor: '#0066FF',
                      '&:hover': {
                        backgroundColor: '#0056D6',
                      },
                    }}
                  >
                    Sign In to Submit
                  </Button>
                </Box>
              )}
            </Box>
          </DialogContent>
        </Dialog>
        
        {/* Credit Animation */}
        <AnimatePresence>
          {showCreditAnimation && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1500,
                backgroundColor: 'rgba(241, 243, 254, 0.9)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
              }}
            >
              <Box
                component={motion.div}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                sx={{ mb: 2, color: '#0066FF' }}
              >
                <CheckCircleIcon sx={{ fontSize: 60, color: '#0066FF' }} />
              </Box>
              
              <Box
                component={motion.div}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                sx={{ mb: 1, fontWeight: 'bold', fontSize: '1.2rem' }}
              >
                Congratulations!
              </Box>
              
              <Box
                component={motion.div}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1, 
                  fontWeight: 'bold', 
                  color: '#0066FF'
                }}
              >
                <EmojiEventsIcon />
                <Box
                  component={motion.span}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ 
                    repeat: 1, 
                    repeatType: "reverse", 
                    duration: 0.4,
                    delay: 0.4
                  }}
                  sx={{ fontSize: '1.5rem' }}
                >
                  +{creditAmount} Credits
                </Box>
              </Box>
              
              {/* Confetti-like particles */}
              {[...Array(20)].map((_, i) => {
                const randomX = Math.random() * 200 - 100;
                const randomY = Math.random() * 200 - 100;
                const randomDelay = Math.random() * 0.5;
                const randomDuration = 0.8 + Math.random() * 1;
                const randomSize = 8 + Math.random() * 12;
                
                return (
                  <Box
                    key={i}
                    component={motion.div}
                    initial={{ 
                      x: 0, 
                      y: 0, 
                      opacity: 0, 
                      scale: 0 
                    }}
                    animate={{ 
                      x: randomX, 
                      y: randomY, 
                      opacity: [0, 1, 0], 
                      scale: [0, 1, 0.5]
                    }}
                    transition={{ 
                      delay: randomDelay, 
                      duration: randomDuration,
                      times: [0, 0.2, 1]
                    }}
                    sx={{
                      position: 'absolute',
                      width: randomSize,
                      height: randomSize,
                      borderRadius: '50%',
                      backgroundColor: i % 3 === 0 
                        ? '#0066FF' 
                        : i % 3 === 1 
                          ? '#FFD700' 
                          : '#4CAF50',
                      zIndex: -1
                    }}
                  />
                );
              })}
            </Box>
          )}
        </AnimatePresence>
        
        {/* Already Awarded Animation */}
        <AnimatePresence>
          {showAlreadyAwardedAnimation && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1500,
                backgroundColor: 'rgba(241, 243, 254, 0.9)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
              }}
            >
              <Box
                component={motion.div}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6, times: [0, 0.6, 1] }}
              >
                <ErrorOutlineIcon sx={{ fontSize: 60, color: '#FF9800' }} />
              </Box>
              
              <Box
                component={motion.div}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                sx={{ mt: 2, fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }}
              >
                Credits already awarded
              </Box>
              
              <Box
                component={motion.div}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                sx={{ mt: 1, color: '#666', textAlign: 'center', maxWidth: '80%' }}
              >
                You've already received credits for this action.
              </Box>
            </Box>
          )}
        </AnimatePresence>
      </>
    );
  }

  if (!gameStarted) {
    const isCompleted = isGameCompletedToday();
    console.log('Rendering start screen:', { isCompleted });
    
    return (
      <Box
        sx={{
          height: '100%',
          width: '100%',
          overflow: 'auto',
          position: 'relative',
          m: 0,
          p: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CloseButton />
        {/* <DebugButtons /> */}
        <Card
          elevation={3}
          sx={{
            borderRadius: 0,          // square edges
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0,                     // remove outer padding
          }}
        >
          <CardContent
            sx={{
              textAlign: 'center',
              p: 2,                  // minimal inner padding
              width: '100%',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/TRUE FALSE UNVERIFIABLE LOGO.svg"
              alt="True False Unverifiable Logo"
              style={{ width: 'auto', height: '40px', marginBottom: '8px' }}
            />
    
            <Typography
              variant="h6"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 'bold', letterSpacing: '0.05em', mb: 1 }}
            >
              TRUE FALSE UNVERIFIABLE
            </Typography>
    
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Test your fact checking skills — 5 claims a day
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {gamefile?.timestamp ? new Date(gamefile.timestamp).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }) : 'Loading...'}
            </Typography>
    
            <Button
              variant="outlined"
              onClick={startGame}
              sx={{
                minWidth: '200px',
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                color: 'black',
                borderColor: 'black',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'black',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              Play
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const currentClaim = gamefile.claims[currentClaimIndex];

  return (
      <Box
          sx={{
            height: '100%',
            width: '100%',
            overflow: 'auto',
            position: 'relative',
            m: 0,
            p: 0,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
      {/* —──────── Close button sits absolutely in parent —──────── */}
      <CloseButton />

      {/* —──────── Round countdown chip —──────── */}
      {gameStarted && !showFeedback && ( // Show timer only during active gameplay
        <Chip
          label={countdown}
          sx={{
            position: 'absolute',
            top: theme.spacing(2),
            right: theme.spacing(2),
            borderRadius: '50%',
            width: 52,
            height: 52,
            fontWeight: 'bold',
            fontSize: '1rem',
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.secondary.dark : theme.palette.secondary.light,
            color: theme.palette.secondary.contrastText,
            boxShadow: 3,
            '& .MuiChip-label': {
              padding: '0 8px',
            },
            zIndex: 10,
          }}
        />
      )}

          <Box
            sx={{
              flexGrow: 1,
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 0.5, sm: 1 }  // Reduced padding to maximize space
            }}
          >
          <Card
            elevation={3}
            sx={{
              position: 'relative',
              borderRadius: 1,  // Reduced border radius
              overflow: 'hidden',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
          <CardContent sx={(theme) => { 
            const smallHeightQuery = `@media (max-height: 600px)`;
            return {
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              p: { xs: 1, sm: 2 },  // Reduced padding for all screen sizes
              [smallHeightQuery]: {
                p: { xs: 0.75, sm: 1.5 }  // Even less padding for small screens
              }
            };
          }}>
            {/* —──────── Progress Circles —──────── */}
            <Box display="flex" justifyContent="center" gap={1} mb={2}
              sx={(theme) => {
                const smallHeightQuery = `@media (max-height: 600px)`;
                return {
                  [smallHeightQuery]: {
                    mb: 1
                  }
                };
              }}
            >
              {gamefile.claims.map((_, idx) => (
                <Avatar
                  key={idx}
                  sx={(theme) => {
                    const smallHeightQuery = `@media (max-height: 600px)`;
                    return {
                      width: 28,
                      height: 28,
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      bgcolor:
                        idx < currentClaimIndex
                          ? 'success.main'
                          : idx === currentClaimIndex
                          ? 'primary.main'
                          : 'grey.300',
                      color: idx < currentClaimIndex || idx === currentClaimIndex ? 'common.white' : 'grey.600',
                      [smallHeightQuery]: {
                        width: 24,
                        height: 24,
                        fontSize: '0.75rem'
                      }
                    };
                  }}
                >
                  {idx + 1}
                </Avatar>
              ))}
            </Box>

            {/* —──────── Points + Difficulty —──────── */}
            <Typography variant="h6" align="center" sx={(theme) => {
              const smallHeightQuery = `@media (max-height: 600px)`;
              return {
                fontWeight: 'bold', 
                mb: 0.5, 
                position: 'relative',
                [smallHeightQuery]: {
                  fontSize: '1rem',
                  mb: 0.25
                }
              };
            }}>
              {points} points
              <Zoom in={showComboPopup}>
                <Typography
                  sx={(theme) => {
                    const smallHeightQuery = `@media (max-height: 600px)`;
                    return {
                      position: 'absolute',
                      top: '-30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: theme.palette.success.main,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                      [smallHeightQuery]: {
                        top: '-25px',
                        fontSize: '1.5rem'
                      }
                    };
                  }}
                >
                  +{comboPoints}
                </Typography>
              </Zoom>
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              sx={(theme) => {
                const smallHeightQuery = `@media (max-height: 600px)`;
                return {
                  fontWeight: 'bold', 
                  letterSpacing: 1, 
                  mb: 3,
                  [smallHeightQuery]: {
                    fontSize: '0.7rem',
                    mb: 1.5
                  }
                };
              }}
            >
              DIFFICULTY: {gamefile.claims[currentClaimIndex].difficulty.toUpperCase()}
            </Typography>

            {/* —──────── Claim Text —──────── */}
            {!showFeedback && (
              <Typography
                variant="h5"
                align="center"
                paragraph
                sx={(theme) => {
                  const smallHeightQuery = `@media (max-height: 600px)`;
                  
                  return {
                    fontWeight: 'bold', 
                    color: 'text.primary', 
                    mb: 4,
                    [smallHeightQuery]: {
                      fontSize: '1.2rem',
                      mb: 2
                    }
                  };
                }}
              >
                {gamefile.claims[currentClaimIndex].claim}
              </Typography>
            )}

            {/* —──────── Feedback panel —──────── */}
            <Fade in={showFeedback}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                mb={3}
                sx={(theme) => {
                  const smallHeightQuery = `@media (max-height: 600px)`;
                  return {
                    backgroundColor: feedback.correct ? 'success.light' : 'error.light',
                    color: 'white',
                    p: 2,
                    borderRadius: 2,
                    minHeight: 60,
                    [smallHeightQuery]: {
                      p: 1.5,
                      mb: 2,
                      minHeight: 50
                    }
                  };
                }}
              >
                <Box display="flex" alignItems="center" mb={feedback.correct ? 1 : 2}
                  sx={(theme) => {
                    const smallHeightQuery = `@media (max-height: 600px)`;
                    return {
                      [smallHeightQuery]: {
                        mb: feedback.correct ? 0.5 : 1
                      }
                    };
                  }}
                > 
                  {feedback.correct ? (
                    <CheckCircleIcon sx={(theme) => {
                      const smallHeightQuery = `@media (max-height: 600px)`;
                      return {
                        fontSize: 40, 
                        mr: 1,
                        [smallHeightQuery]: {
                          fontSize: 30
                        }
                      };
                    }} />
                  ) : (
                    <CancelIcon sx={(theme) => {
                      const smallHeightQuery = `@media (max-height: 600px)`;
                      return {
                        fontSize: 40, 
                        mr: 1,
                        [smallHeightQuery]: {
                          fontSize: 30
                        }
                      };
                    }} />
                  )}
                  <Typography variant="h6" sx={(theme) => {
                    const smallHeightQuery = `@media (max-height: 600px)`;
                    return {
                      [smallHeightQuery]: {
                        fontSize: '1rem'
                      }
                    };
                  }}>{feedback.message}</Typography>
                </Box>

                {feedback.correct && feedback.awardedPoints && (
                  <Box textAlign="center" mb={2} sx={(theme) => {
                    const smallHeightQuery = `@media (max-height: 600px)`;
                    return {
                      [smallHeightQuery]: {
                        mb: 1
                      }
                    };
                  }}>
                    <Typography variant="body1" sx={(theme) => {
                      const smallHeightQuery = `@media (max-height: 600px)`;
                      return {
                        fontWeight: 'bold',
                        [smallHeightQuery]: {
                          fontSize: '0.85rem'
                        }
                      };
                    }}>
                      Difficulty: +{feedback.awardedPoints.base} pts
                    </Typography>
                    <Typography variant="body1" sx={(theme) => {
                      const smallHeightQuery = `@media (max-height: 600px)`;
                      return {
                        fontWeight: 'bold',
                        [smallHeightQuery]: {
                          fontSize: '0.85rem'
                        }
                      };
                    }}>
                      Time Bonus: +{feedback.awardedPoints.bonus} pts
                    </Typography>
                  </Box>
                )}

                <Collapse in={showFeedback}>
                  <Box
                    sx={(theme) => {
                      const smallHeightQuery = `@media (max-height: 600px)`;
                      return {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        p: 2,
                        borderRadius: 1,
                        width: '100%',
                        mt: 1,
                        [smallHeightQuery]: {
                          maxHeight: '120px',
                          overflowY: 'auto',
                          p: 1.5
                        }
                      };
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Explanation:
                    </Typography>
                    <div
                      dangerouslySetInnerHTML={{ __html: marked(feedback.explanation) }}
                      style={{
                        color: 'white',
                        lineHeight: 1.5,
                        textAlign: 'left',
                        fontFamily: 'Arial',
                        overflow: isExplanationExpanded ? 'auto' : 'hidden',
                        textOverflow: 'ellipsis',
                        display: isExplanationExpanded ? 'block' : '-webkit-box',
                        WebkitLineClamp: isExplanationExpanded ? 'none' : 3,
                        WebkitBoxOrient: 'vertical',
                        maxHeight: isExplanationExpanded ? '300px' : 'none',
                        overflowX: 'hidden',
                        wordBreak: 'break-word',
                        wordWrap: 'break-word',
                        width: '100%'
                      }}
                    />
                    {marked(feedback.explanation).length > 150 && (
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => setIsExplanationExpanded(!isExplanationExpanded)}
                        sx={{
                          display: 'inline-block',
                          mt: 1,
                          color: 'white',
                          fontWeight: 'bold',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          backgroundColor: 'transparent',
                          border: 'none',
                          p: 0,
                          '&:hover': { textDecoration: 'none' },
                        }}
                      >
                        {isExplanationExpanded ? 'Read Less' : 'Read More'}
                      </Link>
                    )}
                  </Box>
                </Collapse>

                {showFeedback && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={proceedToNextClaim}
                    endIcon={<ArrowForwardIcon />}
                    sx={(theme) => {
                      const smallHeightQuery = `@media (max-height: 600px)`;
                      return {
                        mt: 2,
                        bgcolor: 'white',
                        color: 'primary.main',
                        fontWeight: 'bold',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s',
                        [smallHeightQuery]: {
                          mt: 1,
                          py: 0.5,
                          px: 1.5,
                          fontSize: '0.85rem'
                        }
                      };
                    }}
                  >
                    {results.length < gamefile.claims.length ? 'Next Claim' : 'See Results'}
                  </Button>
                )}
              </Box>
            </Fade>

            {/* —──────── Answer buttons —──────── */}
            {!showFeedback && (
              <Box
                display="flex"
                flexDirection={{xs: 'column', sm: 'column'}}
                gap={2}
                alignItems="center"
                mt="auto"
                mb={2}
                sx={(theme) => {
                  // Media query for screens with small height
                  const smallHeightQuery = `@media (max-height: 600px)`;
                  const smallLandscapeQuery = `@media (max-height: 500px) and (min-width: 600px)`;
                  
                  return {
                    width: '100%',
                    // Responsive layout for small height screens
                    [smallHeightQuery]: {
                      flexDirection: 'row !important',
                      justifyContent: 'center',
                      gap: 1,
                      mb: 1,
                      flexWrap: 'wrap'
                    },
                    // Special layout for landscape orientation on small screens
                    [smallLandscapeQuery]: {
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gridTemplateRows: 'repeat(2, auto)',
                      gap: 1,
                      '& .MuiButton-root:nth-of-type(3)': {
                        gridColumn: 'span 2',
                      }
                    },
                    '& .MuiButton-root': { 
                      width: '100%', 
                      maxWidth: 400, 
                      height: 50, 
                      fontSize: '1rem', 
                      fontWeight: 'bold',
                      // Responsive styles for small height screens
                      [smallHeightQuery]: {
                        height: 40,
                        py: 0.5,
                        fontSize: '0.8rem',
                        maxWidth: 'none',
                        width: 'auto',
                        minWidth: '110px',
                      },
                      [smallLandscapeQuery]: {
                        minWidth: '120px',
                        width: '100%',
                        maxWidth: 'none'
                      }
                    }
                  };
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleAnswer('true')}
                  sx={{ background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)' }}
                >
                  TRUE
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleAnswer('false')}
                  sx={{ background: 'linear-gradient(45deg, #c62828 30%, #f44336 90%)' }}
                >
                  FALSE
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => handleAnswer('unverifiable')}
                  sx={{ background: 'linear-gradient(45deg, #f57c00 30%, #ff9800 90%)' }}
                >
                  UNVERIFIABLE
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* —──────── Snackbar —──────── */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

// Add the HandleSelectionForm component
const HandleSelectionForm = ({ email, score, onSubmit }) => {
  const [handle, setHandle] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [error, setError] = useState('');
  const [handleCreated, setHandleCreated] = useState(false);
  const [createdHandle, setCreatedHandle] = useState('');
  const [loading, setLoading] = useState(true);
  const { backendUrl, accessToken, enableSharePoints } = useAppContext();
  
  // Check if user already has a handle
  useEffect(() => {
    const checkExistingHandle = async () => {
      if (!email) return;
      
      try {
        setLoading(true);
        const headers = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
        headers['Validator'] = 'privy';
      }
      
      const response = await fetch(`${backendUrl}/api/get_userhandle?email=${email}`, {
        method: 'GET',
        headers: headers,
      });
        const data = await response.json();
        
        if (data.handle) {
          // User already has a handle
          setCreatedHandle(data.handle);
          setHandleCreated(true);
        } else {
          // User doesn't have a handle, set a suggested one
          const baseHandle = email.split('@')[0];
          setHandle(baseHandle);
        }
      } catch (error) {
        console.error('Error checking existing handle:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkExistingHandle();
  }, [email, backendUrl]);
  
  // Remove the checkHandleAvailability function
  
  // Replace the debounced check useEffect
  useEffect(() => {
    if (handle && handle.length >= 3) {
      // Directly set valid state if handle has required length
      setError('');
      setIsAvailable(true);
    } else if (handle) {
      setError('Handle must be at least 3 characters');
      setIsAvailable(false);
    }
  }, [handle]);
  
  // Step 1: Create handle
  const createHandle = async () => {
    if (!handle || handle.length < 3) return;
    
    try {
      setLoading(true);
      // Generate the handle on the server
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const generateResponse = await fetch(`${backendUrl}/api/generate_userhandle`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ 
          email: email,
          requested_handle: handle 
        }),
      });
      
      const generateData = await generateResponse.json();
      
      if (generateData.handle) {
        // Handle created successfully
        setCreatedHandle(generateData.handle);
        setHandleCreated(true);
      } else {
        throw new Error(generateData.error || 'Failed to generate handle');
      }
    } catch (error) {
      console.error('Error creating handle:', error);
      setError('Error creating handle: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit to leaderboard
  const submitToLeaderboard = () => {
    // Use the created handle to submit to leaderboard
    onSubmit(createdHandle, score, email);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }
  
  return (
    <Box sx={{ width: '100%' }}>
      {!handleCreated ? (
        // Step 1: Handle creation UI
        <>
          <Typography variant="subtitle2" align="left" sx={{ mb: 1 }}>
            Choose a handle for the leaderboard:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="Your handle"
              variant="outlined"
              size="small"
              error={!!error}
              helperText={error}
              InputProps={{
                endAdornment: isChecking ? (
                  <CircularProgress size={20} />
                ) : isAvailable === true ? (
                  <CheckCircleIcon color="success" />
                ) : isAvailable === false ? (
                  <CancelIcon color="error" />
                ) : null
              }}
            />
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={!isAvailable || isChecking}
            onClick={createHandle}
            sx={{
              py: 1.5,
              fontWeight: 'bold',
              backgroundColor: '#0066FF',
              '&:hover': {
                backgroundColor: '#0056D6',
              },
            }}
          >
            Create Handle
          </Button>
        </>
      ) : (
        // Step 2: Leaderboard submission UI
        <>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              {createdHandle}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Your leaderboard handle
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, fontStyle: 'italic' }}>
              Be in the top 5 by end of day and get UPTO 100 additional credits!
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={submitToLeaderboard}
            sx={{
              py: 1.5,
              fontWeight: 'bold',
              backgroundColor: '#0066FF',
              '&:hover': {
                backgroundColor: '#0056D6',
              },
            }}
          >
            Submit to Leaderboard
          </Button>
        </>
      )}
    </Box>
  );
};

export default Game; 