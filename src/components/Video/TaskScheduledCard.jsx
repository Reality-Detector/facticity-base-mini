import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, LinearProgress, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import StopIcon from '@mui/icons-material/Stop';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { keyframes } from '@mui/system';

// Add a pulse animation for the progress bar
const pulseAnimation = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const TaskScheduledCard = ({ progressDetails, taskId, userEmail, backendUrl }) => {
  const [isTerminating, setIsTerminating] = useState(false);
  const [terminateError, setTerminateError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const handleTerminate = async () => {
    setIsTerminating(true);
    setTerminateError(null);
    try {
      const response = await fetch('/api/terminate-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_id: taskId,
          user_email: userEmail
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsReloading(true);
        console.log("Reloading page...");
        setTimeout(() => {
          window.location.reload();
        }, 10000);
      } else {
        throw new Error(data.message || 'Failed to terminate task');
      }

    } catch (error) {
      setTerminateError(error.message);
      console.error('Error terminating task:', error);
    } finally {
      setIsTerminating(false);
    }
  };

  const handleTerminateClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmTerminate = () => {
    setIsDialogOpen(false);
    handleTerminate();
  };

  // Calculate progress percentage, defaulting to 0 if not provided
  const progressPercentage = progressDetails?.progress?.percentage ?? 0;
  const isComplete = progressPercentage >= 100;

  return (
    <>
      <Card 
        sx={{ 
          minWidth: 275, 
          my: 2,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s ease',
          position: 'relative',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        {isReloading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'inherit',
            }}
          >
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Task terminated. Refreshing page...
            </Typography>
          </Box>
        )}
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Task Scheduled
            </Typography>
            <Box flexGrow={1} />
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={isTerminating ? <CircularProgress size={20} color="inherit" /> : <StopIcon />}
              onClick={handleTerminateClick}
              disabled={isTerminating || isComplete}
              sx={{
                '&:hover': {
                  backgroundColor: '#d32f2f',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                minWidth: '120px',
                transition: 'all 0.2s ease-in-out',
                opacity: isComplete ? 0.5 : 1,
              }}
            >
              {isTerminating ? 'Terminating...' : 'Terminate'}
            </Button>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              bgcolor: 'info.light', 
              p: 2, 
              borderRadius: 1,
              mb: 2
            }}
          >
            <InfoOutlinedIcon sx={{ mr: 1, color: 'info.dark' }} />
            <Typography variant="body2" color="info.dark">
              We're processing your fact-checking request. You'll receive an email when it's ready. You can close this window now.
            </Typography>
          </Box>
          
          <Box mt={2}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                {Math.min(progressPercentage, 100)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(progressPercentage, 100)}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  animation: progressPercentage < 100 ? `${pulseAnimation} 2s ease-in-out infinite` : 'none',
                  backgroundColor: isComplete ? 'success.main' : 'primary.main',
                },
              }}
            />
          </Box>

          {terminateError && (
            <Box 
              sx={{ 
                mt: 2, 
                p: 1.5, 
                bgcolor: 'error.light', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Typography color="error" variant="body2">
                Error: {terminateError}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="terminate-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: '350px'
          }
        }}
      >
        <DialogTitle id="terminate-dialog-title" sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center">
            <StopIcon sx={{ color: 'error.main', mr: 1 }} />
            <Typography variant="h6" component="span">
              Warning: Partial Fact Check
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Terminating this task will result in a partial fact check. Are you sure you want to proceed?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={handleDialogClose} 
            variant="outlined"
            sx={{ minWidth: '100px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmTerminate} 
            color="error" 
            variant="contained"
            sx={{ 
              minWidth: '100px',
              '&:hover': {
                backgroundColor: 'error.dark',
              }
            }}
          >
            Terminate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskScheduledCard; 