'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  useMediaQuery,
  useTheme,
  Grid,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Stack
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  InfoOutlined as InfoOutlinedIcon,
  Refresh as RefreshIcon,
  Twitter as TwitterIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  ShowChart as ShowChartIcon,
  TrendingUp as TrendingUpIcon,
  Message as MessageIcon,
  Reply as ReplyIcon,
  Create as CreateIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import useAuth from '../../auth/useAuthHook';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../AppProvider';
import Credits from '../Credits';

const TaggedTweets = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    backendUrl, 
    accessToken, 
    userCredits,
    creditsLoading
  } = useAppContext();
  
  const router = useRouter();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  
  // State management
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [taggerUsername, setTaggerUsername] = useState('');
  const [activeChartTab, setActiveChartTab] = useState(1);

  // Fetch tagged tweets analytics from the API
  const fetchTaggedTweetsAnalytics = async () => {
    if (!isAuthenticated || !accessToken) {
      setError('Please log in to view tagged tweets analytics');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Validator': 'privy',
        'Frontend': 'web3'
      };

      const response = await fetch(`${backendUrl}/api/get-tagged-tweets`, {
        method: 'GET',
        headers: headers,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAnalytics(data);
          setTaggerUsername(data.tagger_username || '');
        } else {
          const errorMessage = data.error || 'Failed to fetch tagged tweets analytics';
          if (errorMessage.includes('tagger_username parameter is required')) {
            setError('CONNECT_X_ACCOUNT');
          } else {
            setError(errorMessage);
          }
        }
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to fetch tagged tweets analytics';
        if (errorMessage.includes('tagger_username parameter is required')) {
          setError('CONNECT_X_ACCOUNT');
        } else {
          setError(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error fetching tagged tweets analytics:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load analytics on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchTaggedTweetsAnalytics();
    }
  }, [isAuthenticated, accessToken]);

  // Memoized analytics calculations
  const analyticsData = useMemo(() => {
    if (!analytics) return null;
    
    const { summary, plotting_data } = analytics;
    
    return {
      totalTweets: summary?.total_tagged_tweets || 0,
      tweetsWithMentions: summary?.tweets_with_mentions || 0,
      tweetsWithParents: summary?.tweets_with_parents || 0,
      recentTweets: summary?.recent_activity?.tweets_last_7_days || 0,
      dateRange: summary?.date_range || {},
      plottingData: plotting_data || {}
    };
  }, [analytics]);

  // Format date for display
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }, []);

  // Calculate activity percentage
  const getActivityPercentage = useCallback((current, total) => {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
  }, []);

  // Chart component for line chart
  const LineChart = ({ data, title, xAxisLabel, yAxisLabel }) => {
    if (!data || !data.labels || !data.data) return null;
    
    const maxValue = Math.max(...data.data);
    const minValue = Math.min(...data.data);
    const range = maxValue - minValue;
    
    return (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#1f2937', fontSize: '0.9rem' }}>
          {title}
        </Typography>
        <Box sx={{ 
          height: 250, 
          position: 'relative',
          borderRadius: '6px',
          p: 1.5,
          bgcolor: '#fff',
          border: '1px solid #e2e8f0'
        }}>
          <svg width="100%" height="100%" viewBox="0 0 400 200">
            {/* Y-axis */}
            <line x1="40" y1="20" x2="40" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
            {/* X-axis */}
            <line x1="40" y1="180" x2="380" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
            
            {/* Y-axis label */}
            <text x="15" y="100" transform="rotate(-90, 15, 100)" fontSize="10" fill="#6b7280">
              {yAxisLabel}
            </text>
            
            {/* X-axis label */}
            <text x="210" y="195" textAnchor="middle" fontSize="10" fill="#6b7280">
              {xAxisLabel}
            </text>
            
            {/* Data points and lines */}
            {data.data.map((value, index) => {
              const x = 40 + (index * 340) / (data.labels.length - 1);
              const y = 180 - ((value - minValue) / range) * 150;
              
              return (
                <g key={index}>
                  {/* Data point */}
                  <circle cx={x} cy={y} r="3" fill="#0066FF" stroke="#fff" strokeWidth="1.5" />
                  {/* Value label */}
                  <text x={x} y={y - 8} textAnchor="middle" fontSize="9" fill="#1f2937" fontWeight="500">
                    {value}
                  </text>
                  {/* Line to next point */}
                  {index < data.data.length - 1 && (
                    <line
                      x1={x}
                      y1={y}
                      x2={40 + ((index + 1) * 340) / (data.labels.length - 1)}
                      y2={180 - ((data.data[index + 1] - minValue) / range) * 150}
                      stroke="#0066FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </Box>
      </Box>
    );
  };

  // Chart component for bar chart
  const BarChart = ({ data, title }) => {
    if (!data || !data.labels || !data.data) return null;
    
    const maxValue = Math.max(...data.data);
    
    // Convert month numbers or date strings to month names for monthly activity
    const formatLabel = (label) => {
      if (title === "Monthly Activity") {
        const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        // Handle date strings like "2025-06"
        if (typeof label === 'string' && label.includes('-')) {
          const parts = label.split('-');
          if (parts.length >= 2) {
            const monthNumber = parseInt(parts[1], 10);
            if (monthNumber >= 1 && monthNumber <= 12) {
              return monthNames[monthNumber - 1];
            }
          }
        }
        
        // Handle month numbers (1-12)
        if (typeof label === 'number' && label >= 1 && label <= 12) {
          return monthNames[label - 1];
        }
      }
      return label;
    };
    
    return (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#1f2937', fontSize: '0.9rem' }}>
          {title}
        </Typography>
        <Box sx={{ 
          height: 250, 
          position: 'relative',
          borderRadius: '6px',
          p: 1.5,
          bgcolor: '#fff',
          border: '1px solid #e2e8f0'
        }}>
          <svg width="100%" height="100%" viewBox="0 0 400 200">
            {/* Y-axis */}
            <line x1="40" y1="20" x2="40" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
            {/* X-axis */}
            <line x1="40" y1="180" x2="380" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
            
            {/* Bars */}
            {data.data.map((value, index) => {
              const barWidth = 300 / data.labels.length;
              const barHeight = (value / maxValue) * 150;
              const x = 50 + (index * barWidth);
              const y = 180 - barHeight;
              
              return (
                <g key={index}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth - 8}
                    height={barHeight}
                    fill="#0066FF"
                    rx="3"
                    ry="3"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={195}
                    textAnchor="middle"
                    fontSize="8"
                    fill="#6b7280"
                    transform={`rotate(-45, ${x + barWidth / 2}, 195)`}
                  >
                    {formatLabel(data.labels[index])}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#1f2937"
                    fontWeight="500"
                  >
                    {value}
                  </text>
                </g>
              );
            })}
          </svg>
        </Box>
      </Box>
    );
  };

  // Handle chart tab change
  const handleChartTabChange = (event, newValue) => {
    setActiveChartTab(newValue);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc',
    }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: '#fff',
          borderBottom: '1px solid rgba(0, 102, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important', justifyContent: 'space-between', paddingX: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <IconButton
               onClick={() => router.push('/')}
               sx={{
                 color: '#0066FF',
                 background: 'rgba(0, 102, 255, 0.08)',
                 borderRadius: '12px',
                 '&:hover': { 
                   background: 'rgba(0, 102, 255, 0.12)',
                   transform: 'translateY(-1px)',
                 },
               }}
             >
               <ArrowBackIcon />
             </IconButton>
            {/* <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
              Tweet Analytics
            </Typography> */}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated && (
              <>
                 <IconButton 
                   onClick={() => router.push('/rewards')} 
                   sx={{ 
                     color: '#0066FF',
                     background: 'rgba(0, 102, 255, 0.08)',
                     '&:hover': { background: 'rgba(0, 102, 255, 0.12)' }
                   }}
                 >
                   <InfoOutlinedIcon />
                 </IconButton>
                <Credits credits={userCredits} isLoading={creditsLoading} />
                 <IconButton 
                   onClick={() => router.push('/settings')} 
                   size="small"
                 >
                  <Avatar
                    src={user?.picture}
                    alt={user?.name}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 0.5,
              color: '#1f2937',
              fontSize: { xs: '1.5rem', md: '1.75rem' }
            }}
          >
            Tweet Analytics
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#6b7280',
              fontSize: '0.9rem'
            }}
          >
            View all tweets tagged by your username
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Card sx={{ 
          mb: 3,
          borderRadius: '12px',
          bgcolor: '#fff',
          boxShadow: '0 2px 8px rgba(0, 102, 255, 0.08)',
        }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: '#1f2937', fontSize: '1rem' }}>
                  Tweet Statistics
                </Typography>
                <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                  {taggerUsername ? `Tagged by @${taggerUsername}` : 'Loading...'}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchTaggedTweetsAnalytics}
                disabled={loading}
                size="small"
                sx={{
                  borderColor: '#0066FF',
                  color: '#0066FF',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  px: 2,
                  py: 0.5,
                  '&:hover': {
                    borderColor: '#0052CC',
                    backgroundColor: 'rgba(0, 102, 255, 0.08)'
                  }
                }}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#0066FF', mb: 0.5, fontSize: '1.5rem' }}>
                    {analyticsData?.totalTweets || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, fontSize: '0.75rem' }}>
                    Total Tweets
                  </Typography>
                </Box>
              </Grid>
              {/* <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#9C27B0', mb: 0.5, fontSize: '1.5rem' }}>
                    {analyticsData?.tweetsWithMentions || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, fontSize: '0.75rem' }}>
                    With Mentions
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#00BCD4', mb: 0.5, fontSize: '1.5rem' }}>
                    {analyticsData?.tweetsWithParents || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, fontSize: '0.75rem' }}>
                    Replies
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#4CAF50', mb: 0.5, fontSize: '1.5rem' }}>
                    {analyticsData ? analyticsData.totalTweets - analyticsData.tweetsWithParents : 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500, fontSize: '0.75rem' }}>
                    Original
                  </Typography>
                </Box>
              </Grid> */}
            </Grid>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity={error === 'CONNECT_X_ACCOUNT' ? 'info' : 'error'} 
            sx={{ mb: 4 }}
            action={
              error === 'CONNECT_X_ACCOUNT' ? (
                 <Button
                   color="inherit"
                   size="small"
                   onClick={() => router.push('/settings')}
                   sx={{
                     fontWeight: 600,
                     textTransform: 'none',
                     borderRadius: '8px',
                     px: 2,
                     py: 0.5,
                     bgcolor: 'rgba(0, 102, 255, 0.1)',
                     color: '#0066FF',
                     '&:hover': {
                       bgcolor: 'rgba(0, 102, 255, 0.15)',
                     }
                   }}
                 >
                   Go to Settings
                 </Button>
              ) : null
            }
          >
            {error === 'CONNECT_X_ACCOUNT' 
              ? 'Connect your X account to see your tagging activities on X'
              : error
            }
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 8
          }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Loading analytics...
            </Typography>
          </Box>
        )}

        {/* Analytics Dashboard */}
        {!loading && !error && analyticsData && (
          <Box>
            {analyticsData.totalTweets === 0 ? (
              <Card sx={{ 
                borderRadius: '16px',
                bgcolor: '#fff',
                boxShadow: '0 4px 20px rgba(0, 102, 255, 0.08)',
              }}>
                <CardContent sx={{ p: 6, textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(0, 102, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}>
                    <TwitterIcon sx={{ fontSize: 40, color: '#0066FF' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1f2937' }}>
                    No Tagged Tweets Found
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#6b7280', maxWidth: '400px', mx: 'auto' }}>
                    You haven't tagged any tweets yet. Start fact-checking to see your analytics here.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {/* Activity Timeline */}
                <Grid item xs={12} md={6} sx={{ width: { xs: '100%', md: 'auto' } }}>
                  <Card sx={{ 
                    height: '100%',
                    width: { xs: '100%', md: 'auto' },
                    borderRadius: '12px',
                    bgcolor: '#fff',
                    boxShadow: '0 2px 8px rgba(0, 102, 255, 0.08)',
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '8px',
                          bgcolor: 'rgba(0, 102, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1.5
                        }}>
                          <CalendarTodayIcon sx={{ color: '#0066FF', fontSize: '1.2rem' }} />
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '1rem' }}>
                          Activity Timeline
                        </Typography>
                      </Box>
                      
                      <Stack spacing={1.5}>
                        <Box sx={{ 
                          p: 1.5, 
                          bgcolor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <Typography variant="caption" sx={{ color: '#6b7280', mb: 0.5, fontWeight: 500, fontSize: '0.75rem' }}>
                            First Tagged Tweet
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.9rem' }}>
                            {formatDate(analyticsData.dateRange.first_tagged)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ 
                          p: 1.5, 
                          bgcolor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <Typography variant="caption" sx={{ color: '#6b7280', mb: 0.5, fontWeight: 500, fontSize: '0.75rem' }}>
                            Most Recent Tweet
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.9rem' }}>
                            {formatDate(analyticsData.dateRange.last_tagged)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ 
                          p: 1.5, 
                          bgcolor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <Typography variant="caption" sx={{ color: '#6b7280', mb: 0.5, fontWeight: 500, fontSize: '0.75rem' }}>
                            Total Active Days
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.9rem' }}>
                            {analyticsData.dateRange.total_days_active || 0} days
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Activity Insights */}
                <Grid item xs={12} md={6} sx={{ width: { xs: '100%', md: 'auto' } }}>
                  <Card sx={{ 
                    height: '100%',
                    borderRadius: '12px',
                    bgcolor: '#fff',
                    boxShadow: '0 2px 8px rgba(0, 102, 255, 0.08)',
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '8px',
                          bgcolor: 'rgba(0, 188, 212, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1.5
                        }}>
                          <AnalyticsIcon sx={{ color: '#00BCD4', fontSize: '1.2rem' }} />
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '1rem' }}>
                          Activity Insights
                        </Typography>
                      </Box>
                      
                      <Stack spacing={1.5}>
                        <Box sx={{ 
                          p: 1.5, 
                          bgcolor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <Typography variant="caption" sx={{ color: '#6b7280', mb: 0.5, fontWeight: 500, fontSize: '0.75rem' }}>
                            Most Active Period
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.9rem' }}>
                            {analyticsData.dateRange.total_days_active > 30 ? 'Last 30 days' : 'All time'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ 
                          p: 1.5, 
                          bgcolor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <Typography variant="caption" sx={{ color: '#6b7280', mb: 0.5, fontWeight: 500, fontSize: '0.75rem' }}>
                            Fact-Checking Consistency
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.9rem' }}>
                            {analyticsData.dateRange.total_days_active > 0 
                              ? `${Math.round(analyticsData.totalTweets / analyticsData.dateRange.total_days_active * 10) / 10}`
                              : '0'
                            } tweets per active day
                          </Typography>
                        </Box>
                        
                        <Box sx={{ 
                          p: 1.5, 
                          bgcolor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <Typography variant="caption" sx={{ color: '#6b7280', mb: 0.5, fontWeight: 500, fontSize: '0.75rem' }}>
                            Reply Activity
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.9rem' }}>
                            {analyticsData.tweetsWithParents > 0 
                              ? `${Math.round((analyticsData.tweetsWithParents / analyticsData.totalTweets) * 100)}%`
                              : '0%'
                            } replies
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Charts Section */}
                {analyticsData.plottingData && Object.keys(analyticsData.plottingData).length > 0 && (
                  <Grid item xs={12}>
                    <Card sx={{ 
                      borderRadius: '12px',
                      bgcolor: '#fff',
                      boxShadow: '0 2px 8px rgba(0, 102, 255, 0.08)',
                    }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '8px',
                            bgcolor: 'rgba(0, 102, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1.5
                          }}>
                            <ShowChartIcon sx={{ color: '#0066FF', fontSize: '1.2rem' }} />
                          </Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '1rem' }}>
                            Activity Charts
                          </Typography>
                        </Box>
                        
                        <Tabs 
                          value={activeChartTab} 
                          onChange={handleChartTabChange}
                          variant="scrollable"
                          scrollButtons="auto"
                          sx={{ 
                            mb: 2,
                            '& .MuiTab-root': {
                              textTransform: 'none',
                              fontWeight: 500,
                              fontSize: '0.8rem',
                              minHeight: 32,
                              borderRadius: '8px',
                              mx: 0.5,
                              px: 1.5,
                              '&.Mui-selected': {
                                bgcolor: '#0066FF',
                                color: 'white',
                                boxShadow: '0 1px 4px rgba(0, 102, 255, 0.3)',
                              }
                            },
                            '& .MuiTabs-indicator': {
                              display: 'none'
                            }
                          }}
                        >
                          {analyticsData.plottingData.tags_over_time && (
                            <Tab 
                              label="Tags Over Time" 
                              icon={<TrendingUpIcon sx={{ fontSize: '1rem' }} />}
                              iconPosition="start"
                            />
                          )}
                          {analyticsData.plottingData.monthly_activity && (
                            <Tab 
                              label="Monthly Activity" 
                              icon={<BarChartIcon sx={{ fontSize: '1rem' }} />}
                              iconPosition="start"
                            />
                          )}
                        </Tabs>

                        <Box sx={{ 
                          minHeight: 300,
                          bgcolor: '#f8fafc',
                          borderRadius: '8px',
                          p: 2,
                          border: '1px solid #e2e8f0'
                        }}>
                          {activeChartTab === 0 && analyticsData.plottingData.tags_over_time && (
                            <LineChart
                              data={analyticsData.plottingData.tags_over_time}
                              title={analyticsData.plottingData.tags_over_time.title || "Tags Over Time"}
                              xAxisLabel={analyticsData.plottingData.tags_over_time.x_axis_label || "Date"}
                              yAxisLabel={analyticsData.plottingData.tags_over_time.y_axis_label || "Number of Tags"}
                            />
                          )}
                          
                          {activeChartTab === 1 && analyticsData.plottingData.monthly_activity && (
                            <BarChart
                              data={analyticsData.plottingData.monthly_activity}
                              title="Monthly Activity"
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default TaggedTweets;