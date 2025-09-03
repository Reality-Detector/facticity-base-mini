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
const TASK_ACTIONS_FEEDBACK_COLOR = '#0066FF'; // Define the custom blue color

const TaskActions = ({ task_id, disable_like }) => {
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
  const { backendUrl } = useAppContext();

  const buttonsRef = useRef(null); // Ref for the buttons container

  // Centralized function to handle POST requests
  const postTaskAction = async (actionType, data = {}) => {
    setLoading(true);
    // console.log({ task_id });
    try {
      const response = await fetch(backendUrl+`/api/tasks/${task_id}/${actionType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const result = await response.json();
      if (actionType === 'feedback') {
        setSnackbar({ open: true, message: 'Thanks for your feedback', severity: 'success' });
      }
      return result;
    } catch (error) {
      console.error(`Failed to ${actionType}:`, error);
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const currentUrl = window.location.href; // Get the current browser URL
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setSnackbar({ open: true, message: 'link copied!', severity: 'success' });
      })
      .catch((error) => {
        console.error('Failed to copy the URL: ', error);
        setSnackbar({ open: true, message: 'Failed to copy the link.', severity: 'error' });
      });
  };

  const handleLike = async () => {
    if (liked) return; // Prevent multiple likes

    setLiked(true);
    setDisliked(false);
    setShowFeedback(false);

    const result = await postTaskAction('like');
  };

  const handleDislike = async () => {
    if (disliked) return; // Prevent multiple dislikes

    setDisliked(true);
    setLiked(false);
    setShowFeedback(true);
    
    const result = await postTaskAction('dislike');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmitFeedback = async () => {
    const feedbackData = {
      reasons: feedbackReason,
      comments: feedbackText,
    };

    const result = await postTaskAction('feedback', feedbackData);
    if (result) {
      setShowFeedback(false);
      setFeedbackText('');
      setFeedbackReason([]);
    }
  };

  const handleReasonToggle = (reason) => {
    setFeedbackReason((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div
        style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}
        ref={buttonsRef} // Attach the ref to the buttons container
      >
        {/* Share Button */}
        {/* <Tooltip title="Share">
          <IconButton
            onClick={handleShare}
            style={{ padding: '4px', color: '#606060' }} // Adjust color
            disabled={loading}
          >
            <ShareIcon fontSize="small" />
          </IconButton>
        </Tooltip> */}

        {/* Like Button */}
        <Tooltip title="Like">
          <IconButton
            onClick={handleLike}
            style={{
              padding: '4px',
              color: liked ? '#1976d2' : '#606060', // Change color if liked
            }}
            disabled={loading}
          >
            <ThumbUpOffAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Dislike Button */}
        <Tooltip title="Dislike">
          <IconButton
            onClick={handleDislike}
            style={{
              padding: '4px',
              color: disliked ? '#d32f2f' : '#606060', // Change color if disliked
            }}
            disabled={loading}
          >
            <ThumbDownOffAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

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

      {/* Feedback Form (Inline below Dislike Button) */}
      {showFeedback && (
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            marginTop: '10px',
            width: '100%',
            boxSizing: 'border-box', // Ensures it fits the parent width
          }}
        >
          <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>How Can We Improve?</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            {['Not factually correct', 'Out of date', 'Harmful or offensive', 'Not helpful'].map((reason) => (
              <Button
                key={reason}
                variant={feedbackReason.includes(reason) ? 'contained' : 'outlined'}
                // Remove the color prop and use sx for custom color
                sx={{
                  textTransform: 'none',
                  backgroundColor: feedbackReason.includes(reason) ? TASK_ACTIONS_FEEDBACK_COLOR : 'inherit',
                  color: feedbackReason.includes(reason) ? '#fff' : 'inherit',
                  borderColor: feedbackReason.includes(reason) ? TASK_ACTIONS_FEEDBACK_COLOR : 'inherit',
                  '&:hover': feedbackReason.includes(reason)
                    ? {
                        backgroundColor: TASK_ACTIONS_FEEDBACK_COLOR,
                        borderColor: TASK_ACTIONS_FEEDBACK_COLOR,
                      }
                    : {},
                }}
                fullWidth
                onClick={() => handleReasonToggle(reason)}
              >
                {reason}
              </Button>
            ))}
          </div>
          <TextField
            multiline
            rows={3}
            placeholder="Your feedback (optional)"
            variant="outlined"
            fullWidth
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="text" onClick={() => setShowFeedback(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              // Remove the color prop and use sx for custom color
              sx={{
                backgroundColor: TASK_ACTIONS_FEEDBACK_COLOR,
                '&:hover': {
                  backgroundColor: '#0052cc', // Darker shade on hover
                },
              }}
              onClick={handleSubmitFeedback}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskActions;
