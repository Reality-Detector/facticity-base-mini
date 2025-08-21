import React, { useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const VideoProcessingLoader = ({ videoDuration, done, idx}) => {
  const [progress, setProgress] = useState(0);
  const estimatedProcessingTime = videoDuration * 0.125; // Example heuristic: processing takes twice the duration of the video
  const [timeLeft, setTimeLeft] = useState(estimatedProcessingTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 75) {
          return oldProgress;
        }
        const diff = 75 / estimatedProcessingTime;
        return Math.min(oldProgress + diff, 75);
      });
      setTimeLeft((oldTime) => {
        if (oldTime === 0) {
          clearInterval(interval);
          return 0;
        }
        return oldTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [estimatedProcessingTime]);

  useEffect(() => {
    if (done) {
      setProgress(100);
      setTimeLeft(0);
    }
  }, [done]);

  return (
    <Box sx={{ width: '100%' }}>
        <Typography variant="body2" color="textSecondary">
            {`Extracting claims:`}
        </Typography>
        <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{
            backgroundColor: 'white', 
            '& .MuiLinearProgress-bar': {
            backgroundColor: 'black',
            },
        }} 
        />

      <Box display="flex" justifyContent="space-between" mt={2}>
        {/* <Typography variant="body2" color="textSecondary">
          {`Estimated Time Left: ${timeLeft}s`}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {`${Math.round(progress)}%`}
        </Typography> */}
      </Box>
    </Box>
  );
};

export default VideoProcessingLoader;
