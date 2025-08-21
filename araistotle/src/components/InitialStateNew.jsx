import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
// Import the actual components used in each section
import DiscoverPostCarousel from './SearchComponent'; // Update this import if DiscoverPostCarousel is in a different file
import CompactLeaderboardDisplay from './SearchComponent'; // Update this import if CompactLeaderboardDisplay is in a different file
import ExampleCards from './Examples';
import HeadlineDisplay from './HeadlineDisplay';

const InitialStatePanel = ({
  scrollableDivRef,
  discoverPosts = [],
  headlines = [],
  setSearchQuery,
  errorDisplay,
}) => {
  return (
    <Box
      ref={scrollableDivRef}
      sx={{
        width: '100%',
        maxWidth: 1000,
        mx: 'auto',
        p: 2,
        boxSizing: 'border-box',
      }}
    >
      {/* Discover Section: Shows a carousel of discover posts for users to browse and interact with. */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#0066FF', fontWeight: 'bold' }}>
          🎯 Discover
        </Typography>
        {discoverPosts.length > 0 ? (
          <DiscoverPostCarousel posts={discoverPosts} />
        ) : (
          <Skeleton variant="rectangular" height={100} />
        )}
      </Box>

      {/* Leaderboard Section: Displays a compact leaderboard of top users or scores. */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#0066FF', fontWeight: 'bold' }}>
          🏆 Leaderboard
        </Typography>
        <CompactLeaderboardDisplay />
      </Box>

      {/* Examples Section: Shows example fact-checks to help users understand how the platform works. */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#0066FF', fontWeight: 'bold' }}>
          ✅ Examples
        </Typography>
        <ExampleCards setSearchQuery={setSearchQuery} />
      </Box>

      {/* Headlines Section: Renders trending or recent headlines for users to fact-check. */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#0066FF', fontWeight: 'bold' }}>
          📰 Headlines
        </Typography>
        {headlines.length > 0 ? (
          <HeadlineDisplay headlines={headlines} setSearchQuery={setSearchQuery} />
        ) : (
          <Skeleton variant="rectangular" height={60} />
        )}
      </Box>

      {/* Error Section: Displays any error messages if present. */}
      {errorDisplay && (
        <Box sx={{ color: 'red', mt: 2 }}>
          Error: {errorDisplay.message || 'Something went wrong'}
        </Box>
      )}
    </Box>
  );
};

export default InitialStatePanel;
