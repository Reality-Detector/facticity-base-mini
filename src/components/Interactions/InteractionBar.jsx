import React, { useState, useRef, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import Popover from '@mui/material/Popover';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppContext } from '../../AppProvider';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Badge from '@mui/material/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import RedditIcon from '@mui/icons-material/Reddit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TwitterIcon from '@mui/icons-material/Twitter';
import SendIcon from '@mui/icons-material/Send';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DiscoverPostButton from './DiscoverPostButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
const TASK_ACTIONS_FEEDBACK_COLOR = '#0066FF'; // Define the custom blue color

/**
 * TaskActions component that provides interaction buttons for a task
 * 
 * @param {string} task_id - The ID of the task
 * @param {string} userEmail - The email of the current user
 * @param {boolean} showRatingButtons - Whether to show like/dislike buttons (default: true)
 * @returns {JSX.Element}
 */
const TaskActions = ({ conversation_id, task_id, userEmail, showRatingButtons = true }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackReason, setFeedbackReason] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl, accessToken } = useAppContext();
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  // const backendUrl = 'http://localhost:5000';

  const buttonsRef = useRef(null); // Ref for the buttons container

  // Add a new state variable to track feedback type
  const [feedbackType, setFeedbackType] = useState('');
  const [showCreditAnimation, setShowCreditAnimation] = useState(false);
  const { setUserCredits, setDailyTaskCredits, setCommunityCredits, setDailyUserCredits } = useAppContext();
  // Add new state for share dialog
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Add new state for feedback dialog
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  // Add state for LinkedIn copy
  const [linkedInCopied, setLinkedInCopied] = useState(false);

  // Add new state variables for tracking shares
  const [shareTracking, setShareTracking] = useState({
    window: null,
    platform: '',
    shareStartTime: null,
    shareCompleted: false
  });

  // Add new state for share credit animation
  const [showShareCreditAnimation, setShowShareCreditAnimation] = useState(false);

  // Add new state for the "already awarded" animation
  const [showAlreadyAwardedAnimation, setShowAlreadyAwardedAnimation] = useState(false);

  // New state to track if user is logged in
  const isLoggedIn = Boolean(userEmail);

  // Add new state for responsive like/dislike buttons
  const [anchorEl, setAnchorEl] = useState(null);
  const [isNarrow, setIsNarrow] = useState(null); // Initialize as null to indicate not yet measured

  // Add resize observer to detect narrow screens
  useEffect(() => {
    const checkWidth = () => {
      if (buttonsRef.current) {
        const containerWidth = buttonsRef.current.offsetWidth;
        setIsNarrow(containerWidth < 300);
      }
    };

    // Check width immediately on mount
    checkWidth();

    const resizeObserver = new ResizeObserver(checkWidth);
    if (buttonsRef.current) {
      resizeObserver.observe(buttonsRef.current);
    }

    return () => {
      if (buttonsRef.current) {
        resizeObserver.unobserve(buttonsRef.current);
      }
    };
  }, []);

  // Centralized function to handle POST requests
  const postTaskAction = async (actionType, data = {}) => {
    setLoading(true);
    // console.log({ task_id });
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Validator': 'privy'
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(backendUrl+`/api/tasks/${task_id}/${actionType}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          ...data,
          userEmail // Include the userEmail in all requests
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Failed to ${actionType}:`, error);
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleShareDialogOpen = () => {
    setShareDialogOpen(true);
  };

  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
    setCopied(false);
  };

  const getShareMessage = () => {
    return `Check out this fact-check on Facticity.AI: ${window.location.href}`;
  };

  const getLinkedInShareMessage = () => {
    return `I just fact-checked this with Facticity.AI and wanted to share the results: ${window.location.href}\n\nFacticity.AI uses AI to verify claims, analyze sources, and provide real-time fact-checking.`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error('Failed to copy the URL: ', error);
        setSnackbar({ open: true, message: 'Failed to copy the link.', severity: 'error' });
      });
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(getShareMessage());
    
    // Open as popup instead of new tab
    const width = 550;
    const height = 550;
    const left = window.screen.width/2 - width/2;
    const top = window.screen.height/2 - height/2;
    
    const shareWindow = window.open(
      `https://wa.me/?text=${message}`,
      'whatsapp-share',
      `width=${width},height=${height},top=${top},left=${left}`
    );
    
    setShareTracking({
      window: shareWindow,
      platform: 'whatsapp',
      shareStartTime: new Date(),
      shareCompleted: false
    });
    
    // Monitor the window
    const checkInterval = setInterval(() => {
      if (shareWindow.closed) {
        clearInterval(checkInterval);
        const timeSpent = new Date() - shareTracking.shareStartTime;
        if (timeSpent > 5000) {
          handleShareComplete('whatsapp');
        }
      }
    }, 1000);
    
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
          
          const shareWindow = window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            'linkedin-share',
            `width=${width},height=${height},top=${top},left=${left}`
          );
          
          // Start tracking
          setShareTracking({
            window: shareWindow,
            platform: 'linkedin',
            shareStartTime: new Date(),
            shareCompleted: false
          });
          
          // Set interval to check window state
          const checkInterval = setInterval(() => {
            if (shareWindow.closed) {
              clearInterval(checkInterval);
              const timeSpent = new Date() - shareTracking.shareStartTime;
              if (timeSpent > 5000) {
                handleShareComplete('linkedin');
              }
            }
          }, 1000);
        }, 1500);
      })
      .catch((error) => {
        console.error('Failed to copy the LinkedIn message: ', error);
        // If copying fails, just open LinkedIn directly with tracking
        const url = encodeURIComponent(window.location.href);
        const width = 550;
        const height = 550;
        const left = window.screen.width/2 - width/2;
        const top = window.screen.height/2 - height/2;
        
        const shareWindow = window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
          'linkedin-share',
          `width=${width},height=${height},top=${top},left=${left}`
        );
        
        // Start tracking
        setShareTracking({
          window: shareWindow,
          platform: 'linkedin',
          shareStartTime: new Date(),
          shareCompleted: false
        });
        
        // Set interval to check window state
        const checkInterval = setInterval(() => {
          if (shareWindow.closed) {
            clearInterval(checkInterval);
            const timeSpent = new Date() - shareTracking.shareStartTime;
            if (timeSpent > 5000) {
              handleShareComplete('linkedin');
            }
          }
        }, 1000);
      });
  };

  const handleRedditShare = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Fact check from Facticity.AI');
    
    const width = 550;
    const height = 600;
    const left = window.screen.width/2 - width/2;
    const top = window.screen.height/2 - height/2;
    
    const shareWindow = window.open(
      `https://www.reddit.com/submit?url=${url}&title=${title}`,
      'reddit-share',
      `width=${width},height=${height},top=${top},left=${left}`
    );
    
    // Start tracking
    setShareTracking({
      window: shareWindow,
      platform: 'reddit',
      shareStartTime: new Date(),
      shareCompleted: false
    });
    
    // Set interval to check window state
    const checkInterval = setInterval(() => {
      if (shareWindow.closed) {
        clearInterval(checkInterval);
        const timeSpent = new Date() - shareTracking.shareStartTime;
        if (timeSpent > 5000) {
          handleShareComplete('reddit');
        }
      }
    }, 1000);
    
    handleShareDialogClose();
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(getShareMessage());
    
    // Open as popup window instead of new tab
    const width = 550;
    const height = 420;
    const left = window.screen.width/2 - width/2;
    const top = window.screen.height/2 - height/2;
    
    const shareWindow = window.open(
      `https://twitter.com/intent/tweet?text=${text}`, 
      'twitter-share', 
      `width=${width},height=${height},top=${top},left=${left}`
    );
    
    // Start tracking
    setShareTracking({
      window: shareWindow,
      platform: 'twitter',
      shareStartTime: new Date(),
      shareCompleted: false
    });
    
    // Set interval to check window state
    const checkInterval = setInterval(() => {
      // If window is closed after minimum time (10 seconds)
      if (shareWindow.closed) {
        clearInterval(checkInterval);
        
        // Check if window was open long enough for user to likely complete action
        const timeSpent = new Date() - shareTracking.shareStartTime;
        if (timeSpent > 5000) { // 5 seconds minimum
          handleShareComplete('twitter');
        }
      }
    }, 1000);
  };

  const handleLike = async () => {
    if (!showRatingButtons) return;
    if (liked) return; // Prevent multiple likes

    setLiked(true);
    setDisliked(false);
    setFeedbackType('like'); // Set feedback type to like
    // Open feedback dialog instead of showing inline feedback
    setFeedbackDialogOpen(true);
    
    const result = await postTaskAction('like');
  };

  const handleDislike = async () => {
    if (!showRatingButtons) return;
    if (disliked) return; // Prevent multiple dislikes

    setDisliked(true);
    setLiked(false);
    setFeedbackType('dislike'); // Set feedback type to dislike
    // Open feedback dialog instead of showing inline feedback
    setFeedbackDialogOpen(true);
    
    const result = await postTaskAction('dislike');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseFeedbackDialog = () => {
    setFeedbackDialogOpen(false);
    // Reset feedback form when dialog is closed without submitting
    setFeedbackText('');
    setFeedbackReason([]);
  };

  // Function to check if bonus points can be awarded
  // This is a placeholder that returns true/false


  // TODO: make this an internal endpoint, do not initiate using the browser
  const rewardBonusPoint = async (type, points) => {
    try {
        
        // Don't proceed if no email or task ID
        if (!userEmail || !task_id) {
            console.log("Cannot reward points: missing user email or task ID");
            return;
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
                task_id: task_id,
                userEmail: userEmail,
                points: points,
                url: encodeURIComponent(window.location.href),
                type: type // Either "feedback" or "share"
            }),
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log(`Successfully rewarded ${points} points for ${type}`, data);
            // Could update userCredits here if the backend returns the updated credit count
            if (data.updatedCredits !== undefined) {
                setUserCredits(data.updatedCredits || 0);
                setDailyUserCredits(data.dailyCredits || 0);
                setDailyTaskCredits(data.lifetimeCredits || 0);
                setCommunityCredits(data.communityCredits || 0);
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

  const handleDiscoverPostReward = async () => {
    // This feature is currently disabled - will be available soon
    console.log("Post to Discover feature coming soon!");
  };

  const handleSubmitFeedback = async () => {
    const feedbackData = {
      reasons: feedbackReason,
      comments: feedbackText,
    };

    const result = await postTaskAction('feedback', feedbackData);
    if (result) {
      // Close the dialog
      setFeedbackDialogOpen(false);
      
      // Determine points based on whether text feedback was provided
      const hasTextFeedback = feedbackText.trim().length > 0;
      const pointsToAward = hasTextFeedback ? 6 : 3;
      
      // First check if we can award bonus points
      const canAwardPoints = await rewardBonusPoint('feedback', pointsToAward);
      
      if (canAwardPoints) {
        // Set the credit amount for the animation
        setCreditAmount(pointsToAward);
        
        // Show credit animation
        setShowCreditAnimation(true);
        
        // Hide the animation after 2.5 seconds
        setTimeout(() => {
          setShowCreditAnimation(false);
          setFeedbackText('');
          setFeedbackReason([]);
        }, 2500);
      } else {
        // Show "already awarded" animation
        setShowAlreadyAwardedAnimation(true);
        
        // Hide the animation after 2.5 seconds
        setTimeout(() => {
          setShowAlreadyAwardedAnimation(false);
          setFeedbackText('');
          setFeedbackReason([]);
        }, 2500);
      }
    }
  };

  const handleReasonToggle = (reason) => {
    setFeedbackReason((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  // Get feedback options based on feedback type
  const getFeedbackOptions = () => {
    if (feedbackType === 'like') {
      return ['Good sources', 'Balanced assessment', 'Clear explanation'];
    } else {
      return ['Not factually correct', 'Out of date', 'Harmful or offensive'];
    }
  };

  // Auto-hide the Popover after 3 seconds when it's open
  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        handleCloseSnackbar();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  // Function to handle share completion and reward
  const handleShareComplete = async (platform) => {
    // Show animation for credits after 2 seconds
    setTimeout(async () => {
      // Check if we can award bonus points
      const canAwardPoints = await rewardBonusPoint(platform, 2);
      
      if (canAwardPoints) {
        // Show animation for credits
        setShowShareCreditAnimation(true);
        
        // Hide the animation after 2.5 seconds
        setTimeout(() => {
          setShowShareCreditAnimation(false);
        }, 2500);
      } else {
        // Show "already awarded" animation
        setShowAlreadyAwardedAnimation(true);
        
        // Hide the animation after 2.5 seconds
        setTimeout(() => {
          setShowAlreadyAwardedAnimation(false);
        }, 2500);
      }
    }, 2000);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Add new state for credit amount
  const [creditAmount, setCreditAmount] = useState(3);

  return (
    <Box sx={{ 
      padding: '10px',
      transition: 'all 0.3s ease',
      position: 'relative' // For absolute positioning of animation
    }}>
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
              zIndex: 10,
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
              sx={{ mb: 2, color: TASK_ACTIONS_FEEDBACK_COLOR }}
            >
              <CheckCircleIcon sx={{ fontSize: 60, color: TASK_ACTIONS_FEEDBACK_COLOR }} />
            </Box>
            
            <Box
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              sx={{ mb: 1, fontWeight: 'bold', fontSize: '1.2rem' }}
            >
              Thank You!
            </Box>
            
            <Box
              component={motion.div}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1, 
                fontWeight: 'bold', 
                color: TASK_ACTIONS_FEEDBACK_COLOR
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
                      ? TASK_ACTIONS_FEEDBACK_COLOR 
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
      
      {/* Share Credit Animation */}
      <AnimatePresence>
        {showShareCreditAnimation && (
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
              zIndex: 10,
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
              sx={{ mb: 2, color: TASK_ACTIONS_FEEDBACK_COLOR }}
            >
              <CheckCircleIcon sx={{ fontSize: 60, color: TASK_ACTIONS_FEEDBACK_COLOR }} />
            </Box>
            
            <Box
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              sx={{ mb: 1, fontWeight: 'bold', fontSize: '1.2rem' }}
            >
              Thanks for sharing!
            </Box>
            
            <Box
              component={motion.div}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1, 
                fontWeight: 'bold', 
                color: TASK_ACTIONS_FEEDBACK_COLOR
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
                +2 Credits
              </Box>
            </Box>
            
            {/* Same confetti particles as in feedback animation */}
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
              zIndex: 10,
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
              sx={{ mb: 2, color: '#F5A623' }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 60, color: '#F5A623' }} />
            </Box>
            
            <Box
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              sx={{ mb: 1, fontWeight: 'bold', fontSize: '1.2rem' }}
            >
              Thank You!
            </Box>
            
            <Box
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              sx={{ 
                textAlign: 'center',
                px: 2,
                color: '#555'
              }}
            >
              Points already awarded for this action.
            </Box>
          </Box>
        )}
      </AnimatePresence>
      
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%'
      }}>
        {/* Action buttons group */}
        <Box sx={{
          display: 'flex',
          gap: { xs: '20px', sm: '28px', md: '32px' },
          justifyContent: 'flex-end',
          flexShrink: 0,
          '@media (max-width: 600px)': {
            width: '100%'
          }
        }} ref={buttonsRef}>
          {/* Discover Post Button - Coming Soon */}
          <Tooltip title="Post to Discover - Coming Soon!">
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              position: 'relative'
            }}>
              <IconButton
                className="post-button"
                onClick={handleDiscoverPostReward}
                sx={{ 
                  padding: '6px', 
                  color: '#c0c0c0',
                  backgroundColor: 'transparent',
                  opacity: 0.6,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    transform: 'none',
                    boxShadow: 'none'
                  },
                  '&:active': {
                    transform: 'none',
                    boxShadow: 'none'
                  },
                  transition: 'all 0.2s ease',
                  cursor: 'not-allowed'
                }}
                disabled={true}
                size="small"
              >
                <PostAddIcon fontSize="small" />
              </IconButton>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.7rem', 
                  color: '#c0c0c0',
                  fontWeight: 'bold',
                  position: 'absolute',
                  bottom: '-16px',
                  minWidth: '70px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  '@media (max-width: 400px)': {
                    fontSize: '0.55rem',
                    minWidth: '56px'
                  }
                }}
              >
                Post (+4)
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.6rem', 
                  color: '#999',
                  fontWeight: 'normal',
                  position: 'absolute',
                  bottom: '-32px',
                  minWidth: '70px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  fontStyle: 'italic',
                  '@media (max-width: 400px)': {
                    fontSize: '0.5rem',
                    minWidth: '56px'
                  }
                }}
              >
                Coming Soon
              </Typography>
            </Box>
          </Tooltip>

          {/* Share Button */}
          <Tooltip title={isLoggedIn ? "Share and earn 8 credits (2 per social share)" : "Login to share"}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              position: 'relative'
            }}>
              <IconButton
                className="share-button"
                onClick={handleShareDialogOpen}
                sx={{ 
                  padding: '6px', 
                  color: isLoggedIn ? '#505050' : '#c0c0c0',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: isLoggedIn ? 'rgba(255,255,255,0.5)' : 'transparent',
                    transform: isLoggedIn ? 'translateY(-2px) scale(1.05)' : 'none',
                    boxShadow: isLoggedIn ? '0 2px 5px rgba(0,0,0,0.06)' : 'none'
                  },
                  '&:active': {
                    transform: isLoggedIn ? 'translateY(1px) scale(0.98)' : 'none',
                    boxShadow: 'none'
                  },
                  transition: 'all 0.2s ease',
                  cursor: isLoggedIn ? 'pointer' : 'not-allowed'
                }}
                disabled={loading || !isLoggedIn}
                size="small"
              >
                <SendIcon fontSize="small" />
              </IconButton>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.7rem', 
                  color: isLoggedIn ? TASK_ACTIONS_FEEDBACK_COLOR : '#c0c0c0',
                  fontWeight: 'bold',
                  position: 'absolute',
                  bottom: '-16px',
                  minWidth: '70px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  '@media (max-width: 400px)': {
                    fontSize: '0.55rem',
                    minWidth: '56px'
                  }
                }}
              >
                Share (+8)
              </Typography>
            </Box>
          </Tooltip>

          {/* Rate Button */}
          {showRatingButtons && (
            <Tooltip title={isLoggedIn ? "Rate this fact-check" : "Login to rate"}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                position: 'relative'
              }}>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    padding: '6px',
                    color: liked ? '#1976d2' : disliked ? '#d32f2f' : (isLoggedIn ? '#505050' : '#c0c0c0'),
                    backgroundColor: liked ? 'rgba(25,118,210,0.08)' : disliked ? 'rgba(211,47,47,0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isLoggedIn ? 'rgba(255,255,255,0.5)' : 'transparent',
                      transform: isLoggedIn ? 'translateY(-2px) scale(1.05)' : 'none',
                      boxShadow: isLoggedIn ? '0 2px 5px rgba(0,0,0,0.06)' : 'none'
                    },
                    '&:active': {
                      transform: isLoggedIn ? 'translateY(1px) scale(0.98)' : 'none',
                      boxShadow: 'none'
                    },
                    transition: 'all 0.2s ease',
                    cursor: isLoggedIn ? 'pointer' : 'not-allowed'
                  }}
                  disabled={loading || !isLoggedIn}
                  size="small"
                >
                  {liked ? <ThumbUpOffAltIcon fontSize="small" /> : 
                   disliked ? <ThumbDownOffAltIcon fontSize="small" /> : 
                   <MoreVertIcon fontSize="small" />}
                </IconButton>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: '0.7rem', 
                    color: isLoggedIn ? TASK_ACTIONS_FEEDBACK_COLOR : '#c0c0c0',
                    fontWeight: 'bold',
                    position: 'absolute',
                    bottom: '-16px',
                    minWidth: '85px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    '@media (max-width: 400px)': {
                      fontSize: '0.55rem',
                      minWidth: '70px'
                    }
                  }}
                >
                  Rate (+6)
                </Typography>
              </Box>
            </Tooltip>
          )}
        </Box>

        {/* Credits badge */}
        {showRatingButtons && (
          <Box component="span" sx={{ 
            fontSize: '0.85rem', 
            color: TASK_ACTIONS_FEEDBACK_COLOR, 
            fontWeight: 'bold',
            border: `1px dashed ${TASK_ACTIONS_FEEDBACK_COLOR}`,
            borderRadius: '20px',
            padding: '3px 12px',
            backgroundColor: 'rgba(0, 102, 255, 0.08)',
            boxShadow: '0 2px 4px rgba(0, 102, 255, 0.1)',
            alignSelf: 'flex-start',
            marginLeft: '8px',
            marginTop: '18px',
          }}>
            Get more credits!
          </Box>
        )}
      </Box>

      {/* Feedback Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            mt: 1
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            handleLike();
            handleMenuClose();
          }}
          sx={{
            color: liked ? '#1976d2' : '#505050',
            '&:hover': {
              backgroundColor: 'rgba(25,118,210,0.08)'
            }
          }}
        >
          <ThumbUpOffAltIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          Like
        </MenuItem>
        <MenuItem 
          onClick={() => {
            handleDislike();
            handleMenuClose();
          }}
          sx={{
            color: disliked ? '#d32f2f' : '#505050',
            '&:hover': {
              backgroundColor: 'rgba(211,47,47,0.08)'
            }
          }}
        >
          <ThumbDownOffAltIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          Dislike
        </MenuItem>
      </Menu>

      {/* Share Dialog */}
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
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '16px 24px',
          color: '#1a73e8',
          fontWeight: 600
        }}>
          Share this fact-check
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
            Share this fact-check with your network: +2 credits per social share.
          </Typography>
          
          <Stack spacing={2}>
            <Button
              fullWidth
              startIcon={<WhatsAppIcon />}
              onClick={handleWhatsAppShare}
              sx={{ 
                ...styles.shareButton, 
                backgroundColor: '#25D366',
                color: 'white',
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
                ...styles.shareButton, 
                backgroundColor: '#000000',
                color: 'white',
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
                ...styles.shareButton, 
                backgroundColor: linkedInCopied ? '#e8f5e9' : '#0077B5',
                color: linkedInCopied ? '#2e7d32' : 'white',
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
                ...styles.shareButton, 
                backgroundColor: '#FF4500',
                color: 'white',
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
                ...styles.shareButton, 
                backgroundColor: copied ? '#e8f5e9' : '#f5f5f5',
                color: copied ? '#2e7d32' : '#666',
                '&:hover': {
                  backgroundColor: copied ? '#e8f5e9' : '#eeeeee',
                }
              }}
            >
              {copied ? 'Link copied!' : 'Copy link'}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* NEW Feedback Dialog */}
      <Dialog
        open={feedbackDialogOpen}
        onClose={handleCloseFeedbackDialog}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            maxWidth: '500px',
            width: '100%',
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
          {feedbackType === 'like' ? 'What did you like?' : 'How Can We Improve?'}
          <IconButton 
            edge="end" 
            onClick={handleCloseFeedbackDialog}
            aria-label="close"
            sx={{ color: 'rgba(0, 0, 0, 0.54)' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ padding: '24px' }}>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Please share your feedback to help us improve:
            </Typography>
            <Box component="span" sx={{ 
              fontSize: '0.85rem', 
              color: TASK_ACTIONS_FEEDBACK_COLOR, 
              fontWeight: 'bold',
              border: `1px solid ${TASK_ACTIONS_FEEDBACK_COLOR}`,
              borderRadius: '20px',
              padding: '3px 12px',
              backgroundColor: 'rgba(0, 102, 255, 0.08)',
              boxShadow: '0 2px 6px rgba(0, 102, 255, 0.15)'
            }}>
              +6 Credits for feedback
            </Box>
          </Box>
          
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
          }}>
            {getFeedbackOptions().map((reason) => (
              <Button
                key={reason}
                variant={feedbackReason.includes(reason) ? 'contained' : 'outlined'}
                sx={{
                  textTransform: 'none',
                  padding: '10px 16px',
                  fontSize: '0.9rem',
                  backgroundColor: feedbackReason.includes(reason) ? TASK_ACTIONS_FEEDBACK_COLOR : 'rgba(255, 255, 255, 0.8)',
                  color: feedbackReason.includes(reason) ? '#fff' : '#555',
                  borderColor: feedbackReason.includes(reason) ? TASK_ACTIONS_FEEDBACK_COLOR : 'rgba(0,0,0,0.15)',
                  boxShadow: feedbackReason.includes(reason) ? '0 3px 6px rgba(0, 102, 255, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                  '&:hover': {
                    backgroundColor: feedbackReason.includes(reason) 
                      ? TASK_ACTIONS_FEEDBACK_COLOR 
                      : 'rgba(255, 255, 255, 0.95)',
                    borderColor: TASK_ACTIONS_FEEDBACK_COLOR,
                    transform: 'translateY(-2px)',
                    boxShadow: feedbackReason.includes(reason) 
                      ? '0 4px 8px rgba(0, 102, 255, 0.3)' 
                      : '0 3px 6px rgba(0,0,0,0.1)'
                  },
                  '&:active': {
                    transform: 'translateY(1px)',
                    boxShadow: 'none'
                  },
                  transition: 'all 0.2s ease'
                }}
                fullWidth
                onClick={() => handleReasonToggle(reason)}
              >
                {reason}
              </Button>
            ))}
          </Box>
          
          <TextField
            multiline
            rows={3}
            placeholder={feedbackType === 'like' ? "Tell us what you liked (written feedback gets 3 additional points)" : "Your feedback (written feedback gets 3 additional points)"}
            variant="outlined"
            fullWidth
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            sx={{ 
              marginBottom: '10px',
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover fieldset': {
                  borderColor: TASK_ACTIONS_FEEDBACK_COLOR,
                },
                '&.Mui-focused fieldset': {
                  borderColor: TASK_ACTIONS_FEEDBACK_COLOR,
                  boxShadow: '0 0 0 3px rgba(0, 102, 255, 0.1)'
                },
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', justifyContent: 'flex-end' }}>
          <Button 
            variant="text" 
            onClick={handleCloseFeedbackDialog} 
            disabled={loading}
            sx={{ 
              color: '#555',
              padding: '8px 16px',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: TASK_ACTIONS_FEEDBACK_COLOR,
              color: 'white',
              padding: '10px 24px',
              borderRadius: '8px',
              boxShadow: '0 3px 8px rgba(0, 102, 255, 0.25)',
              '&:hover': {
                backgroundColor: '#0052cc',
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 12px rgba(0, 102, 255, 0.3)'
              },
              '&:active': {
                transform: 'translateY(1px)',
                boxShadow: '0 2px 4px rgba(0, 102, 255, 0.2)'
              },
              transition: 'all 0.2s ease'
            }}
            onClick={handleSubmitFeedback}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 
             `Submit & Get ${feedbackText.trim().length > 0 ? '6' : '3'} Credits`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popover for Notifications */}
      <Popover
        open={snackbar.open}
        anchorEl={buttonsRef.current}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        disableRestoreFocus
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '200px' }}
        >
          {snackbar.message}
        </Alert>
      </Popover>

      {/* DiscoverPostButton - Coming Soon */}
      <DiscoverPostButton
        userEmail={userEmail}
        backendUrl={backendUrl}
        taskId={conversation_id}
        open={postDialogOpen}
        onClose={() => setPostDialogOpen(false)}
        onPostSuccess={handleDiscoverPostReward}
      />
    </Box>
  );
};

// Add styles for new share buttons
const styles = {
  shareButton: {
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    padding: '10px 16px',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    }
  },
};

export default TaskActions;
