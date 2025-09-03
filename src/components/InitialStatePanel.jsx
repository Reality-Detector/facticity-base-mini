import React from 'react';
import { Box, Chip, Typography, Button, Skeleton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExampleCards from './Examples';
import HeadlineDisplay from './HeadlineDisplay';
import ErrorComponent from './ErrorComponent';

// These two are used as children in the panel, so import them as well
import DiscoverPostCarousel from './SearchComponent'; // Will fix this import if needed
import CompactLeaderboardDisplay from './SearchComponent'; // Will fix this import if needed

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
  const navigate = useNavigate();
  return (
    <Box
      ref={scrollableDivRef}
      className="scrollable-container"
      sx={{
        width: '100%',
        // Remove flexGrow and let content flow naturally
        boxSizing: 'border-box',
        // Remove scrollBehavior as parent handles scrolling
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
            </Box>
          </Box>

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
                  width: '100%', // Fixed width
                  maxWidth: '100%', // Prevent expansion beyond container
                  minWidth: 0, // Allow flex shrinking
                  overflow: 'hidden', // Prevent content from overflowing
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
                      fontWeight: 500,
                      textAlign: 'left'
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
                    maxWidth: '100%', // Prevent expansion beyond container
                    minWidth: 0, // Allow flex shrinking
                    minHeight: 0, // Allow flex child to shrink
                  }}>
                    {discoverPosts.length > 0 ? (
                      <Box sx={{ 
                        width: '100%',
                        maxWidth: '100%', // Prevent expansion beyond container
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden', // Prevent content overflow
                      }}>
                        <DiscoverPostCarousel posts={discoverPosts} />
                      </Box>
                    ) : (
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2,
                        width: '100%',
                        maxWidth: '100%', // Prevent expansion beyond container
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
                      fontWeight: 500,
                      textAlign: 'left'
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
                        textAlign: 'left',
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
                      flexShrink: 0,
                      textAlign: 'left'
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

        </Box>
      )}

      {errorDisplay && (
        <ErrorComponent errorDisplay={errorDisplay} />
      )}
    </Box>
  );
};

export default InitialStatePanel; 