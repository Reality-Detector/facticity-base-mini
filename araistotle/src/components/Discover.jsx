// src/components/Discover.js

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Divider,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Paper,
  InputAdornment,
  Snackbar,
  Alert,
  Tooltip,
  AppBar,
  Toolbar,
  ToggleButton,
  ToggleButtonGroup,
  Tabs,
  Tab,
  Avatar,
  Skeleton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link
} from "@mui/material";
import {
  ThumbUp,
  ThumbDown,
  Comment,
  Search,
  AccessTime,
  Share,
  ArrowBack,
  Bookmark,
  BookmarkBorder,
  Delete,
  Edit,
  KeyboardArrowDown,
  KeyboardArrowUp
} from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import { useAppContext } from '../AppProvider';
import { formatDistanceToNow } from 'date-fns';
import useAuth from "../useAuthHook";
import Credits from '../Credits';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InfiniteScroll from 'react-infinite-scroll-component';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const theme = createTheme({
  typography: {
    fontFamily: '"Playfair Display", serif',
  },
});

const PostSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '16px',
        bgcolor: '#fff',
        boxShadow: '0 4px 20px rgba(0, 102, 255, 0.08)',
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box'
      }}>
        {/* Thumbnail Skeleton */}
        <Box
          sx={{
            width: { xs: '100%', sm: 280 },
            minWidth: { xs: '100%', sm: 280 },
            maxWidth: { xs: '100%', sm: 280 },
            height: { xs: 180, sm: 200 },
            flexShrink: 0,
            borderRadius: { xs: '16px 16px 0 0', sm: '16px 0 0 16px' },
            overflow: 'hidden',
            background: '#e3edfc',
            mt: { xs: 0, sm: 2 },
            ml: { xs: 0, sm: 2 },
            mb: { xs: 0, sm: 2 },
            mr: { xs: 0, sm: 2 }
          }}
        >
          <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
        </Box>

        {/* Content Skeleton */}
        <Box sx={{ 
          flex: 1, 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* Author Skeleton */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Skeleton variant="circular" width={36} height={36} sx={{ mr: 1.5 }} />
            <Skeleton variant="text" width={120} height={24} />
          </Box>

          {/* Title Skeleton */}
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="text" width="90%" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="70%" height={24} />
          </Box>

          {/* Description Skeleton */}
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="95%" height={20} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="85%" height={20} />
          </Box>

          {/* Actions Skeleton */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mt: 2,
            pt: 2,
            borderTop: '1px solid rgba(0, 102, 255, 0.1)'
          }}>
            <Skeleton variant="text" width={100} height={20} />
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="circular" width={32} height={32} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

// Utility function to convert URLs in text to clickable links
const linkifyText = (text) => {
  if (!text) return text;
  
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Split text by URLs and create clickable links
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <Link
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          sx={{
            color: '#0066FF',
            textDecoration: 'underline',
            '&:hover': {
              color: '#0052CC',
              textDecoration: 'underline'
            }
          }}
        >
          {part}
        </Link>
      );
    }
    return part;
  });
};

const Discover = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });
  const [sortBy, setSortBy] = useState('recent');
  const [tab, setTab] = useState('feed');
  const [imgError, setImgError] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;
  const [editDialog, setEditDialog] = useState({
    open: false,
    post: null,
    title: '',
    description: ''
  });
  const [gamefiles, setGamefiles] = useState([]);
  const [gamefilesLoading, setGamefilesLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState({});
  const [expandedGames, setExpandedGames] = useState({});
  const [leaderboardLoading, setLeaderboardLoading] = useState({});
  const [userHandle, setUserHandle] = useState('');
  const postRefs = useRef({});

  const navigate = useNavigate();
  const { tab: tabParam } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { backendUrl } = useAppContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const { isAuthenticated, user, isLoading, loginWithRedirect } = useAuth();
  const { userCredits, creditsLoading, setCreditsLoading, setUserCredits, accessToken, setDailyUserCredits, setDailyTaskCredits, setCommunityCredits } = useAppContext();

  // Fetch user handle when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetchUserHandle();
    }
  }, [isAuthenticated, user]);

  // Handle scrolling to specific post
  useEffect(() => {
    const scrollToPostId = searchParams.get('scrollTo');
    if (scrollToPostId && posts.length > 0) {
      // Wait a bit for the posts to render
      const timer = setTimeout(() => {
        const postElement = postRefs.current[scrollToPostId];
        if (postElement) {
          postElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          // Optional: Add a highlight effect
          postElement.style.boxShadow = '0 0 20px rgba(0, 102, 255, 0.3)';
          setTimeout(() => {
            postElement.style.boxShadow = '';
          }, 3000);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams, posts]);

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
      
      const response = await fetch(`${backendUrl}/api/get_userhandle?email=${encodeURIComponent(user.email)}`, {
        method: 'GET',
        headers: headers,
      });
      if (!response.ok) throw new Error('Failed to fetch user handle');
      
      const data = await response.json();
      if (data.handle) {
        setUserHandle(data.handle);
        console.log('User handle fetched:', data.handle);
      }
    } catch (error) {
      console.error('Error fetching user handle:', error);
      // Still use Auth0 user name as fallback
      setUserHandle(user.name || '');
    }
  };

  const validTabs = ['feed', 'my-posts', 'bookmarked', 'leaderboard'];
  const initialTab = validTabs.includes(tabParam) ? tabParam : 'feed';

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));
  const showNotification = (message, severity = "info") => setSnackbar({ open: true, message, severity });
  const requireAuth = (actionMessage) => {
    if (!isAuthenticated) {
      showNotification(`Please sign in to ${actionMessage}`, "warning");
      return false;
    }
    return true;
  };
  const formatTimeAgo = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "Unknown time";
    }
  };

  // Sorting handler
  const handleSortChange = (event, newSort) => {
    if (newSort) setSortBy(newSort);
  };

  // Update the displayedPosts memo to only handle filtering for non-authenticated users
  const displayedPosts = React.useMemo(() => {
    return filteredPosts;  // No need for additional filtering since backend handles it
  }, [filteredPosts]);

  // Sort the filtered posts
  const sortedPosts = React.useMemo(() => {
    const postsToSort = [...displayedPosts];
    if (sortBy === 'likes') {
      postsToSort.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    } else {
      // Sort by publish_timestamp (recent first)
      postsToSort.sort((a, b) => {
        const dateA = a.publish_timestamp ? new Date(a.publish_timestamp).getTime() : 0;
        const dateB = b.publish_timestamp ? new Date(b.publish_timestamp).getTime() : 0;
        return dateB - dateA;  // Descending order (newest first)
      });
    }
    return postsToSort;
  }, [displayedPosts, sortBy]);

  // Update the fetchPosts function to handle tab loading
  const fetchPosts = async (reset = false, currentTab = tab) => {
    if (reset) {
      setPage(0);
      setPosts([]);
      setFilteredPosts([]);
      setTabLoading(true);  // Set tab loading when resetting
    }
    
    setLoading(true);
    try {
      const skip = reset ? 0 : page * PAGE_SIZE;
      const userParam = (isAuthenticated && user?.email) ? `&user_email=${encodeURIComponent(user.email)}` : '';
      const sortParam = `&sort_by=${sortBy}`;
      const tabParam = `&tab=${currentTab}`;
      const headers = {
        'Content-Type': 'application/json',
        'Validator': 'privy'
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(
        `${backendUrl}/api/published-posts?skip=${skip}&limit=${PAGE_SIZE}${userParam}${sortParam}${tabParam}`,
        {
          method: 'GET',
          headers: headers,
        }
      );
      
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      
      if (reset) {
        setPosts(data);
        setFilteredPosts(data);
        // Extract unique parent categories from the nested structure
        const categories = [...new Set(data.flatMap(post => post.tags?.parent_categories || []))];
        setAvailableCategories(['all', ...categories]);
      } else {
        setPosts(prev => [...prev, ...data]);
        setFilteredPosts(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === PAGE_SIZE);
      if (!reset) {
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
      setTabLoading(false);  // Clear tab loading state
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!isLoading) {
      fetchPosts(true);
    }
  }, [isLoading]);

  // Load more handler
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts();
    }
  };

  // Filter posts based on category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.tags?.parent_categories && post.tags.parent_categories.includes(selectedCategory)
      );
      setFilteredPosts(filtered);
    }
  }, [selectedCategory, posts]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = posts.filter(post =>
      (post.query?.toLowerCase() || '').includes(query) ||
      (post.publish_title?.toLowerCase() || '').includes(query)
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const updatePostState = (postId, updatedData) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: updatedData.likes,
              dislikes: updatedData.dislikes,
              user_liked: updatedData.user_liked,
              user_disliked: updatedData.user_disliked,
              user_bookmarked: updatedData.user_bookmarked,
            }
          : post
      )
    );
    setFilteredPosts(prevFilteredPosts =>
      prevFilteredPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: updatedData.likes,
              dislikes: updatedData.dislikes,
              user_liked: updatedData.user_liked,
              user_disliked: updatedData.user_disliked,
              user_bookmarked: updatedData.user_bookmarked,
            }
          : post
      )
    );
  }

  const handleLike = async (postId) => {
    if (!requireAuth('like posts')) return;
    // setPostLoading(prev => ({ ...prev, [postId]: true }));
    setCreditsLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Validator': 'privy'
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(`${backendUrl}/api/post/${postId}/like`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ user_email: user.email }),
      });

      if (!response.ok) throw new Error('Failed to toggle like');
      const data = await response.json();
      updatePostState(postId, data);

      // Reward the liker (actor)
      const rewardRes = await rewardBonusPoint(postId, user.email, "discover");
      if (rewardRes) showNotification(rewardRes, "success");

      // Reward the post author (if not anonymous and not the actor)
      const post = posts.find(p => p.id === postId);
      if (post && post.publish_email && post.publish_email !== user.email) {
        rewardBonusPoint(postId, post.publish_email, "discover_author", user.email);
        // Do NOT show notification for author
      }

      // await fetchSinglePost(postId); // <-- Commented out
    } catch (error) {
      console.error('Error toggling like:', error);
      showNotification('Failed to update like status', 'error');
    } finally {
      // setTimeout(() => {
      //   setPostLoading(prev => ({ ...prev, [postId]: false }));
      // }, 1000);
      setCreditsLoading(false);
    }
  };

  const handleDislike = async (postId) => {
    if (!requireAuth('dislike posts')) return;
    // setPostLoading(prev => ({ ...prev, [postId]: true }));
    setCreditsLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Validator': 'privy'
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(`${backendUrl}/api/post/${postId}/dislike`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ user_email: user.email }),
      });

      if (!response.ok) throw new Error('Failed to toggle dislike');
      const data = await response.json();
      updatePostState(postId, data);

      // Reward the disliker (actor)
      const rewardRes = await rewardBonusPoint(postId, user.email, "discover");
      if (rewardRes) showNotification(rewardRes, "success");

      // Reward the post author (if not anonymous and not the actor)
      const post = posts.find(p => p.id === postId);
      if (post && post.publish_email && post.publish_email !== user.email) {
        rewardBonusPoint(postId, post.publish_email, "discover_author", user.email);
        // Do NOT show notification for author
      }

      // await fetchSinglePost(postId); // <-- Commented out
    } catch (error) {
      console.error('Error toggling dislike:', error);
      showNotification('Failed to update dislike status', 'error');
    } finally {
      // setTimeout(() => {
      //   setPostLoading(prev => ({ ...prev, [postId]: false }));
      // }, 1000);
      setCreditsLoading(false);
    }
  };

  const handleComment = async (postId, commentText) => {
    if (!requireAuth('comment on posts')) return;
    // setPostLoading(prev => ({ ...prev, [postId]: true }));
    setCreditsLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(`${backendUrl}/api/post/${postId}/comment`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          user_email: user.email,
          user_name: user.name,
          comment: commentText
        }),
      });

      if (!response.ok) throw new Error('Failed to add comment');
      const data = await response.json();
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, comments: [...(post.comments || []), data.comment] }
            : post
        )
      );
      showNotification('Comment added successfully', 'success');

      // Reward the commenter (actor)
      const rewardRes = await rewardBonusPoint(postId, user.email, "discover");
      if (rewardRes) showNotification(rewardRes, "success");

      // Reward the post author (if not anonymous and not the actor)
      const post = posts.find(p => p.id === postId);
      if (post && post.publish_email && post.publish_email !== user.email) {
        rewardBonusPoint(postId, post.publish_email, "discover_author", user.email);
        // Do NOT show notification for author
      }

      // await fetchSinglePost(postId); // <-- Optional: comment out if you don't need to refresh comments
    } catch (error) {
      console.error('Error adding comment:', error);
      showNotification('Failed to add comment', 'error');
    } finally {
      // setPostLoading(prev => ({ ...prev, [postId]: false }));
      setCreditsLoading(false);
    }
  };

  const handleShare = (postId) => {
    const url = `${window.location.origin}/discover/feed?scrollTo=${postId}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        showNotification("Link copied to clipboard", "success");
      })
      .catch((err) => {
        console.error('Could not copy URL: ', err);
        showNotification("Failed to copy link to clipboard", "error");
      });
  };

  const handlePostClick = (postId) => {
    navigate(`/c/${postId}`);
  };

  const handleTabChange = (event, newValue) => {
    if ((newValue === 'bookmarked' || newValue === 'my-posts') && !isAuthenticated) {
      showNotification('Please sign in to view your bookmarked posts', 'warning');
      return;
    }
    setTab(newValue);
    navigate(`/discover/${newValue}`);
    
    // Reset sort to 'recent' when changing tabs
    setSortBy('recent');
    
    // For leaderboard tab, fetch gamefiles
    if (newValue === 'leaderboard') {
      fetchGamefiles();
    } else {
      // For other tabs, fetch posts
      fetchPosts(true, newValue);
    }
  };

  const rewardBonusPoint = async (postId, userEmail, type = "discover", interactorEmail = null) => {
    try {
      const url = `https://app.facticity.ai/c/${postId}`;
      const body = {
        task_id: postId,
        userEmail,
        points: 1,
        type,
        url,
      };
      if (interactorEmail) {
        body.interactorEmail = interactorEmail;
      }
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
        headers['Validator'] = 'privy';
      }
      
      const response = await fetch(`${backendUrl}/reward_point`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.updatedCredits !== undefined) {
          setUserCredits(data.updatedCredits || 0);
          setDailyUserCredits(data.dailyCredits || 0);
          setDailyTaskCredits(data.lifetimeCredits || 0);
          setCommunityCredits(data.communityCredits || 0);
      }
        return data.message || "You earned a reward!";
      } else {
        return "Interaction registered, but reward could not be processed.";
      }
    } catch (err) {
      return "Interaction registered, but reward could not be processed.";
    }
  };

  const fetchSinglePost = async (postId) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(`${backendUrl}/api/published-posts?post_id=${postId}`, {
        method: 'GET',
        headers: headers,
      });
      if (!response.ok) throw new Error('Failed to fetch post');
      const [updatedPost] = await response.json();
      if (updatedPost) {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId ? { ...post, ...updatedPost } : post
          )
        );
        setFilteredPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId ? { ...post, ...updatedPost } : post
          )
        );
      }
    } catch (error) {
      console.error('Error fetching updated post:', error);
    }
  };

  const handleBookmark = async (postId) => {
    if (!requireAuth('bookmark posts')) return;
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(`${backendUrl}/api/post/${postId}/bookmark`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ user_email: user.email }),
      });
      if (!response.ok) throw new Error('Failed to toggle bookmark');
      const data = await response.json();
      updatePostState(postId, data);
      showNotification(data.message || 'Bookmark updated', 'success');
    } catch (error) {
      showNotification('Failed to update bookmark', 'error');
    }
  };

  const DESCRIPTION_CHAR_LIMIT = 100;

  const truncateText = (text, limit) => {
    if (!text) return '';
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  };

  const handleToggleDescription = (postId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleDelete = async (postId, e) => {
    e.stopPropagation(); // Prevent post click
    if (!requireAuth('delete posts')) return;
    
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setCreditsLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(`${backendUrl}/api/post/${postId}/delete`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ user_email: user.email }),
      });

      if (!response.ok) throw new Error('Failed to delete post');
      
      // Remove the post from the local state
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      setFilteredPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      
      showNotification('Post deleted successfully', 'success');
      
      // Refresh the feed to ensure UI is in sync with backend
      await fetchPosts(true);
    } catch (error) {
      console.error('Error deleting post:', error);
      showNotification('Failed to delete post', 'error');
    } finally {
      setCreditsLoading(false);
    }
  };

  const handleEdit = (post, e) => {
    e.stopPropagation(); // Prevent post click
    if (!requireAuth('edit posts')) return;
    
    setEditDialog({
      open: true,
      post,
      title: post.publish_title,
      description: post.description || ''
    });
  };

  const handleEditClose = () => {
    setEditDialog({
      open: false,
      post: null,
      title: '',
      description: ''
    });
  };

  const handleEditSave = async () => {
    if (!editDialog.post) return;
    
    setCreditsLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(`${backendUrl}/api/post/${editDialog.post.id}/edit`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          user_email: user.email,
          title: editDialog.title,
          description: editDialog.description
        }),
      });

      if (!response.ok) throw new Error('Failed to update post');
      
      const data = await response.json();
      
      // Update the post in the local state
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === editDialog.post.id
            ? {
                ...post,
                publish_title: data.post.publish_title,
                description: data.post.description
              }
            : post
        )
      );
      
      setFilteredPosts(prevFilteredPosts =>
        prevFilteredPosts.map(post =>
          post.id === editDialog.post.id
            ? {
                ...post,
                publish_title: data.post.publish_title,
                description: data.post.description
              }
            : post
        )
      );
      
      showNotification('Post updated successfully', 'success');
      handleEditClose();
      
      // Refresh the feed to ensure UI is in sync with backend
      await fetchPosts(true);
    } catch (error) {
      console.error('Error updating post:', error);
      showNotification('Failed to update post', 'error');
    } finally {
      setCreditsLoading(false);
    }
  };

  // Fetch gamefiles for leaderboard
  const fetchGamefiles = async () => {
    setGamefilesLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(`${backendUrl}/get-all-gamefiles`, {
        method: 'GET',
        headers: headers,
      });
      
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      
      // Sort by timestamp - assuming IDs have timestamp information in the first 4 bytes
      // MongoDB ObjectIDs contain timestamp information in the first 4 bytes
      const sortedIds = [...data.ids].sort().reverse(); // Simple sorting for now
      
      // Create formatted dates from ObjectIDs
      const gamefilesWithDates = sortedIds.map(id => {
        // Extract timestamp from MongoDB ObjectID
        // First 4 bytes of ObjectID represent seconds since Unix epoch
        const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
        const date = new Date(timestamp);
        return {
          id,
          date: date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
      });
      
      setGamefiles(gamefilesWithDates);
      
      // Auto-expand the first item if there is one
      if (gamefilesWithDates.length > 0) {
        const topGameId = gamefilesWithDates[0].id;
        setExpandedGames(prev => ({
          ...prev,
          [topGameId]: true
        }));
        
        // Fetch leaderboard data for the top game
        fetchLeaderboardForGame(topGameId);
      }
    } catch (error) {
      console.error('Error fetching gamefiles:', error);
      setError('Failed to load leaderboard data. Please try again later.');
    } finally {
      setGamefilesLoading(false);
    }
  };

  // New function to toggle game expansion
  const toggleGameExpansion = (gameId) => {
    setExpandedGames(prev => ({
      ...prev,
      [gameId]: !prev[gameId]
    }));
    
    // Fetch the leaderboard data if not already loaded
    if (!leaderboardData[gameId] && !leaderboardLoading[gameId]) {
      fetchLeaderboardForGame(gameId);
    }
  };

  // New function to fetch leaderboard data for a specific game
  const fetchLeaderboardForGame = async (gameId) => {
    // Set loading state for this specific game
    setLeaderboardLoading(prev => ({
      ...prev,
      [gameId]: true
    }));
    
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch(`${backendUrl}/api/leaderboard/game/${gameId}`, {
        method: 'GET',
        headers: headers,
      });
      
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      
      // Store the leaderboard data
      setLeaderboardData(prev => ({
        ...prev,
        [gameId]: data.leaderboard
      }));
    } catch (error) {
      console.error(`Error fetching leaderboard for game ${gameId}:`, error);
      showNotification(`Failed to load leaderboard for game ${gameId}`, 'error');
    } finally {
      setLeaderboardLoading(prev => ({
        ...prev,
        [gameId]: false
      }));
    }
  };

  // Find user's rank in the leaderboard
  const findUserRank = (leaderboard) => {
    if (!isAuthenticated || !user || !leaderboard || leaderboard.length === 0) return null;
    
    // Log the first entry to see what fields are available
    if (leaderboard.length > 0 && process.env.NODE_ENV === 'development') {
      console.log('Sample leaderboard entry:', leaderboard[0]);
    }
    
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
      // Check different possible fields where user info could be stored
      return (
        // Check email matches
        (entry.user_email && user.email && entry.user_email.toLowerCase() === user.email.toLowerCase()) ||
        // Check user_handle matches user's name
        (entry.user_handle && user.name && entry.user_handle.toLowerCase() === user.name.toLowerCase()) ||
        // Check handle matches user's name
        (entry.handle && user.name && entry.handle.toLowerCase() === user.name.toLowerCase()) ||
        // Check name matches user's name
        (entry.user_name && user.name && entry.user_name.toLowerCase() === user.name.toLowerCase()) ||
        // Check display_name matches user's name
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

  // Fetch leaderboard data for all games when the tab loads
  const fetchAllLeaderboardRanks = async (gameIds) => {
    if (!isAuthenticated || !user) return;
    
    // For each game, fetch just enough data to determine user's rank
    for (const gameId of gameIds) {
      if (!leaderboardData[gameId] && !leaderboardLoading[gameId]) {
        fetchLeaderboardForGame(gameId);
      }
    }
  };

  // Load user ranks when leaderboard tab is active and gamefiles are loaded
  useEffect(() => {
    if (tab === 'leaderboard' && gamefiles.length > 0 && isAuthenticated) {
      fetchAllLeaderboardRanks(gamefiles.map(game => game.id));
    }
  }, [tab, gamefiles, isAuthenticated]);

  // Format date helper function
  const formatDate = (isoString) => {
    if (!isoString) return 'Unknown date';
    try {
      const date = new Date(isoString);
      return date.toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  useEffect(() => {
    if (validTabs.includes(tabParam) && tab !== tabParam) {
      setTab(tabParam);
      if (tabParam === 'leaderboard') {
        fetchGamefiles();
      }
    }
    if (!validTabs.includes(tabParam)) {
      navigate('/discover/feed', { replace: true });
    }
  }, [tabParam]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFF' }}>
        <AppBar
          position="sticky"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderBottom: '1px solid rgba(0, 102, 255, 0.1)',
          }}
        >
          <Toolbar sx={{ minHeight: '70px !important', justifyContent: 'space-between', paddingX: { xs: 2, sm: 4 } }}>
            <Box sx={{ width: { xs: 40, md: 60 }, display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={() => navigate('/')}
                sx={{
                  color: '#0066FF',
                  background: 'rgba(0, 102, 255, 0.08)',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 102, 255, 0.15)',
                  ml: 0.5,
                  '&:hover': { 
                    background: 'rgba(0, 102, 255, 0.12)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease-in-out'
                  },
                }}
                size="small"
              >
                <ArrowBack />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <img
                  src="/facticityailogo-02.png"
                  alt="Facticity.AI"
                  style={{
                    paddingTop: '2px',
                    width: 'auto',
                    height: isMdUp ? '36px' : '30px',
                    transition: 'all 0.3s ease-in-out',
                  }}
                />
              </a>
            </Box>
            {isAuthenticated && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ml: 2,
                  gap: 1,
                }}
              >
                <IconButton 
                  onClick={() => navigate('/rewards')} 
                  size="small" 
                  sx={{ 
                    color: '#0066FF',
                    background: 'rgba(0, 102, 255, 0.08)',
                    '&:hover': { background: 'rgba(0, 102, 255, 0.12)' }
                  }}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
                <Credits credits={userCredits} isLoading={creditsLoading} />
              </Box>
            )}
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            maxWidth: 1200,
            width: '100%',
            margin: '0 auto',
            padding: theme.spacing(isMobile ? 2 : 4),
            paddingTop: theme.spacing(3),
            minWidth: 0, // Allow proper shrinking
            boxSizing: 'border-box', // Include padding in width calculations
          }}
        >
          <Typography
            variant="h6"
            component="h1"
            gutterBottom
            sx={{
              mb: 2,
              fontWeight: 800,
              background: 'linear-gradient(45deg, #0066FF, #00B4DB)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              fontFamily: '"Playfair Display", serif'
            }}
          >
            {tab === 'leaderboard' ? 'Leaderboard' : 'Discover Fact-Checked Content'}
          </Typography>
          
          {/* Subtext for non-leaderboard tabs */}
          {tab !== 'leaderboard' && (
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                mb: 3,
                textAlign: 'left'
              }}
            >
              Earn Facticity credits by posting your fact-checks to discover (go to 'History' tab), liking and interacting with posts from other users in Discover
            </Typography>
          )}

          {/* Category Filter - Only display for non-leaderboard tabs */}
          {tab !== 'leaderboard' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                Filter by Category
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category === 'all' ? 'All Categories' : category}
                    onClick={() => setSelectedCategory(category)}
                    color={selectedCategory === category ? 'primary' : 'default'}
                    sx={{
                      fontWeight: 600,
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Search - Only display for non-leaderboard tabs */}
          {tab !== 'leaderboard' && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 4,
                borderRadius: '16px',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(0, 102, 255, 0.08)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: '0 6px 24px rgba(0, 102, 255, 0.12)',
                }
              }}
            >
              <TextField
                fullWidth
                variant="standard"
                placeholder="Search by query or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start" sx={{ pl: 1 }}>
                      <Search sx={{ color: '#0066FF' }}/>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '12px 0',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                  }
                }}
              />
            </Paper>
          )}

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2,
            mb: 3,
            alignItems: { xs: 'stretch', sm: 'center' }
          }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              sx={{ 
                flex: 1,
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0, 102, 255, 0.08)',
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  minHeight: 48,
                  '&.Mui-selected': {
                    color: '#0066FF',
                  }
                }
              }}
            >
              <Tab label={tabLoading && tab === 'feed' ? <CircularProgress size={20} /> : "Feed"} value="feed" />
              <Tab label={tabLoading && tab === 'my-posts' ? <CircularProgress size={20} /> : "My Posts"} value="my-posts" disabled={!isAuthenticated} />
              <Tab label={tabLoading && tab === 'bookmarked' ? <CircularProgress size={20} /> : "Bookmarked"} value="bookmarked" disabled={!isAuthenticated} />
              <Tab label={gamefilesLoading ? <CircularProgress size={20} /> : "Leaderboard"} value="leaderboard" />
            </Tabs>

            {/* Sort buttons - Only show for content tabs, not for leaderboard */}
            {tab !== 'leaderboard' && (
              <ToggleButtonGroup
                value={sortBy}
                exclusive
                onChange={handleSortChange}
                size="small"
                color="primary"
                sx={{ 
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(0, 102, 255, 0.08)',
                  '& .MuiToggleButton-root': {
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    border: 'none',
                    '&.Mui-selected': {
                      background: 'rgba(0, 102, 255, 0.08)',
                      color: '#0066FF',
                    }
                  }
                }}
              >
                <ToggleButton value="recent">Sort by Recent</ToggleButton>
                <ToggleButton value="likes">Sort by Likes</ToggleButton>
              </ToggleButtonGroup>
            )}
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(211, 47, 47, 0.08)'
              }}
            >
              {error}
            </Alert>
          )}

          {/* Leaderboard View */}
          {tab === 'leaderboard' && (
            <Paper
              elevation={0}
              sx={{
                borderRadius: '16px',
                bgcolor: '#fff',
                boxShadow: '0 4px 20px rgba(0, 102, 255, 0.08)',
                padding: { xs: 2, sm: 3 },
                overflow: 'hidden'
              }}
            >
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#0066FF'
                  }}
                >
                  Game Leaderboards
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<EmojiEventsIcon />}
                  onClick={() => navigate('/game')}
                  sx={{
                    bgcolor: '#0066FF',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '8px 16px',
                    '&:hover': {
                      bgcolor: '#0052CC',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  Play
                </Button>
              </Box>
              
              {gamefilesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : gamefiles.length === 0 ? (
                <Typography
                  variant="body1" 
                  align="center" 
                  sx={{ 
                    my: 4, 
                    color: 'text.secondary',
                    fontWeight: 500
                  }}
                >
                  No game files found.
                </Typography>
              ) : (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {gamefiles.map((game, index) => (
                    <React.Fragment key={game.id}>
                      <ListItem 
                        button
                        onClick={() => toggleGameExpansion(game.id)}
                        divider={!expandedGames[game.id] && index < gamefiles.length - 1}
                        sx={{
                          borderRadius: '8px',
                          '&:hover': {
                            bgcolor: 'rgba(0, 102, 255, 0.05)',
                          },
                          mb: 0.5,
                          padding: { xs: '8px 12px', sm: '16px' }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: { xs: 'column', sm: 'row' },
                              alignItems: { xs: 'flex-start', sm: 'center' },
                              gap: { xs: 1, sm: 0 }
                            }}>
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  fontWeight: 600,
                                  color: '#0066FF',
                                  flexGrow: 1,
                                  fontSize: { xs: '0.9rem', sm: '1rem' }
                                }}
                              >
                                {game.date}
                              </Typography>
                              {isAuthenticated && leaderboardData[game.id] && findUserRank(leaderboardData[game.id]) && (
                                <Chip
                                  icon={<EmojiEventsIcon sx={{ fontSize: '1rem !important' }} />}
                                  label={`Your Rank: #${findUserRank(leaderboardData[game.id]).rank}`}
                                  size="small"
                                  sx={{
                                    mr: { xs: 0, sm: 2 },
                                    fontWeight: 600,
                                    bgcolor: 'rgba(0, 102, 255, 0.12)',
                                    color: '#0066FF',
                                    '& .MuiChip-icon': {
                                      color: '#0066FF',
                                    },
                                    fontSize: { xs: '0.75rem', sm: '0.8125rem' }
                                  }}
                                />
                              )}
                              {leaderboardLoading[game.id] && !expandedGames[game.id] ? (
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                              ) : (
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: { xs: 'flex-end', sm: 'center' },
                                  width: { xs: '100%', sm: 'auto' },
                                  mt: { xs: 1, sm: 0 }
                                }}>
                                  {expandedGames[game.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                </Box>
                              )}
                            </Box>
                          }
                          secondary={
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'text.secondary',
                                fontSize: { xs: '0.7rem', sm: '0.75rem' }
                              }}
                            >
                              Click to view leaderboard
                            </Typography>
                          }
                        />
                      </ListItem>
                      
                      <Collapse in={expandedGames[game.id]} timeout="auto" unmountOnExit>
                        <Box sx={{ p: { xs: 1, sm: 2 }, bgcolor: 'rgba(0, 102, 255, 0.02)', borderRadius: '0 0 8px 8px', mb: 2 }}>
                          {leaderboardLoading[game.id] ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                              <CircularProgress size={24} />
                            </Box>
                          ) : leaderboardData[game.id]?.length > 0 ? (
                            <>
                              {/* User's rank section */}
                              {isAuthenticated && findUserRank(leaderboardData[game.id]) && (
                                <Box 
                                  sx={{ 
                                    mb: 2, 
                                    p: { xs: 1.5, sm: 2 }, 
                                    borderRadius: '8px', 
                                    bgcolor: 'rgba(0, 102, 255, 0.08)',
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    justifyContent: 'space-between',
                                    gap: { xs: 1, sm: 0 }
                                  }}
                                >
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    width: { xs: '100%', sm: 'auto' }
                                  }}>
                                    <EmojiEventsIcon sx={{ color: '#0066FF', mr: 1.5, fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                                    <Box>
                                      <Typography variant="subtitle1" sx={{ 
                                        fontWeight: 700, 
                                        color: '#0066FF',
                                        fontSize: { xs: '0.95rem', sm: '1rem' }
                                      }}>
                                        Your Ranking
                                      </Typography>
                                      <Typography variant="body2" sx={{ 
                                        color: 'text.secondary',
                                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                        lineHeight: 1.4
                                      }}>
                                        <Box component="span" sx={{ fontWeight: 700, color: '#0066FF' }}>
                                          @{userHandle || user.name || 'You'}
                                        </Box> 
                                        {' '} ranked #{findUserRank(leaderboardData[game.id]).rank} out of {findUserRank(leaderboardData[game.id]).total} players
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Typography variant="h6" sx={{ 
                                    fontWeight: 700, 
                                    color: '#0066FF',
                                    fontSize: { xs: '1rem', sm: '1.25rem' },
                                    mt: { xs: 0.5, sm: 0 },
                                    ml: { xs: 2.8, sm: 0 }
                                  }}>
                                    Score: {findUserRank(leaderboardData[game.id]).score}
                                  </Typography>
                                </Box>
                              )}
                            
                              <TableContainer>
                                <Table sx={{ minWidth: { xs: 'auto', sm: 400 } }} size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ 
                                        fontWeight: 700, 
                                        color: '#0066FF',
                                        padding: { xs: '8px 4px', sm: '16px 16px' },
                                        width: { xs: '20%', sm: 'auto' }
                                      }}>Rank</TableCell>
                                      <TableCell sx={{ 
                                        fontWeight: 700, 
                                        color: '#0066FF',
                                        padding: { xs: '8px 4px', sm: '16px 16px' },
                                        width: { xs: '50%', sm: 'auto' }
                                      }}>User</TableCell>
                                      <TableCell sx={{ 
                                        fontWeight: 700, 
                                        color: '#0066FF',
                                        padding: { xs: '8px 4px', sm: '16px 16px' },
                                        width: { xs: '30%', sm: 'auto' },
                                        textAlign: { xs: 'right', sm: 'left' }
                                      }}>Score</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {leaderboardData[game.id].map((entry, entryIndex) => (
                                      <TableRow 
                                        key={`${game.id}-${entryIndex}`}
                                        sx={{
                                          '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 102, 255, 0.02)' },
                                          '&:hover': { bgcolor: 'rgba(0, 102, 255, 0.05)' }
                                        }}
                                      >
                                        <TableCell 
                                          component="th" 
                                          scope="row"
                                          sx={{ 
                                            fontWeight: 600,
                                            color: entryIndex < 3 ? '#0066FF' : 'inherit',
                                            padding: { xs: '8px 4px', sm: '16px 16px' },
                                            fontSize: { xs: '0.875rem', sm: 'inherit' }
                                          }}
                                        >
                                          {entryIndex + 1}
                                        </TableCell>
                                        <TableCell sx={{ 
                                          padding: { xs: '8px 4px', sm: '16px 16px' },
                                          fontSize: { xs: '0.875rem', sm: 'inherit' },
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          maxWidth: { xs: '120px', sm: 'none' },
                                          whiteSpace: { xs: 'nowrap', sm: 'normal' }
                                        }}>
                                          {entry.user_handle || 'Anonymous'}
                                        </TableCell>
                                        <TableCell sx={{ 
                                          fontWeight: 600,
                                          padding: { xs: '8px 4px', sm: '16px 16px' },
                                          fontSize: { xs: '0.875rem', sm: 'inherit' },
                                          textAlign: { xs: 'right', sm: 'left' }
                                        }}>
                                          {entry.score}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </>
                          ) : (
                            <Typography 
                              variant="body2" 
                              align="center" 
                              sx={{ py: 2, color: 'text.secondary' }}
                            >
                              No leaderboard entries for this game.
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          )}

          {/* Regular Posts View - Only show for non-leaderboard tabs */}
          {tab !== 'leaderboard' && (
            <InfiniteScroll
              dataLength={filteredPosts.length}
              next={loadMore}
              hasMore={hasMore}
              loader={
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              }
              endMessage={
                <Typography 
                  variant="body2" 
                  align="center" 
                  sx={{ 
                    my: 4, 
                    color: 'text.secondary',
                    fontWeight: 500
                  }}
                >
                  {filteredPosts.length === 0 
                    ? 'No posts found matching your criteria.'
                    : 'No more posts to show.'}
                </Typography>
              }
              scrollThreshold="90%"
            >
              <Grid container spacing={isMobile ? 2 : 3} sx={{ width: '100%' }}>
                {(loading && page === 0) || tabLoading ? (
                  // Show skeleton loading for initial load and tab changes
                  Array.from(new Array(3)).map((_, index) => (
                    <Grid item xs={12} key={`skeleton-${index}`} sx={{ width: '100%', maxWidth: '100%' }}>
                      <PostSkeleton />
                    </Grid>
                  ))
                ) : (
                  // Show actual posts
                  sortedPosts.map((post) => (
                    <Grid item xs={12} key={post.id} sx={{ width: '100%', maxWidth: '100%' }}>
                      <Card
                        ref={(el) => {
                          if (el) {
                            postRefs.current[post.id] = el;
                          }
                        }}
                        elevation={0}
                        sx={{
                          borderRadius: '16px',
                          transition: 'all 0.3s ease-in-out',
                          bgcolor: '#fff',
                          boxShadow: '0 4px 20px rgba(0, 102, 255, 0.08)',
                          width: '100%',
                          minWidth: 0,
                          maxWidth: '100%',
                          boxSizing: 'border-box',
                          '&:hover': { 
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 30px rgba(0, 102, 255, 0.12)',
                            cursor: 'pointer' 
                          }
                        }}
                        onClick={() => handlePostClick(post.id)}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          width: '100%',
                          maxWidth: '100%',
                          minWidth: 0,
                          boxSizing: 'border-box'
                        }}>
                          {/* Thumbnail */}
                          <Box
                            sx={{
                              width: { xs: '100%', sm: 280 },
                              minWidth: { xs: '100%', sm: 280 },
                              maxWidth: { xs: '100%', sm: 280 },
                              height: { xs: 180, sm: 200 },
                              flexShrink: 0,
                              borderRadius: { xs: '16px 16px 0 0', sm: '16px 0 0 16px' },
                              overflow: 'hidden',
                              background: '#e3edfc',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mt: { xs: 0, sm: 2 },
                              ml: { xs: 0, sm: 2 },
                              mb: { xs: 0, sm: 2 },
                              mr: { xs: 0, sm: 2 }
                            }}
                          >
                            <img
                              src={
                                imgError[post.id] ||
                                post.thumbnail === "/default-thumbnail.png"
                                  ? "/facticityailogo-03.png"
                                  : post.thumbnail
                              }
                              alt="Post thumbnail"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                                flexShrink: 0,
                              }}
                              onError={() =>
                                setImgError(prev => ({ ...prev, [post.id]: true }))
                              }
                              onLoad={(e) => {
                                // Prevent layout shifts by ensuring consistent sizing
                                e.target.style.width = '100%';
                                e.target.style.height = '100%';
                              }}
                            />
                          </Box>

                          {/* Info */}
                          <Box sx={{ 
                            flex: 1, 
                            p: 3, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'space-between',
                            width: '100%',
                            maxWidth: '100%',
                            minWidth: 0,
                            overflow: 'hidden',
                            boxSizing: 'border-box'
                          }}>
                            {/* Title and Author */}
                            <Box>
                              {/* Click to view fact check text */}
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'rgba(0, 102, 255, 0.7)',
                                  fontWeight: 500,
                                  mb: 0.5,
                                  display: 'block'
                                }}
                              >
                                Click to view fact check of the following claim:
                              </Typography>

                              <Typography
                                variant="h6"
                                component="h2"
                                gutterBottom
                                sx={{
                                  fontWeight: 700,
                                  color: '#0066FF',
                                  fontSize: { xs: '1.25rem', sm: '1.4rem' },
                                  mb: 1,
                                  lineHeight: 1.3,
                                  width: '100%',
                                  maxWidth: '100%',
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word',
                                  hyphens: 'auto'
                                }}
                              >
                                {linkifyText(post.query)}
                              </Typography>
                              
                              {/* Author info moved here */}
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                mb: 2,
                                width: '100%',
                                maxWidth: '100%',
                                minWidth: 0
                              }}>
                                {post.publish_name
                                  ? (
                                    <>
                                      <Avatar sx={{ 
                                        width: 32, 
                                        height: 32, 
                                        mr: 1.5, 
                                        bgcolor: 'rgba(0, 102, 255, 0.08)', 
                                        color: '#0066FF',
                                        boxShadow: '0 2px 8px rgba(0, 102, 255, 0.15)'
                                      }}>
                                        <AccountCircleIcon />
                                      </Avatar>
                                      <Typography variant="subtitle2" sx={{ color: '#0066FF', fontWeight: 600 }}>
                                        {post.publish_name}
                                      </Typography>
                                    </>
                                  )
                                  : (
                                    <>
                                      <Avatar sx={{ 
                                        width: 32, 
                                        height: 32, 
                                        mr: 1.5, 
                                        bgcolor: 'rgba(0, 102, 255, 0.08)', 
                                        color: '#0066FF',
                                        boxShadow: '0 2px 8px rgba(0, 102, 255, 0.15)'
                                      }}>
                                        <AccountCircleIcon />
                                      </Avatar>
                                      <Typography variant="subtitle2" sx={{ color: '#0066FF', fontWeight: 600 }}>
                                        Anonymous
                                      </Typography>
                                    </>
                                  )
                                }
                                <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                                  :
                                </Typography>
                                <Typography
                                  variant="subtitle1"
                                  component="div"
                                  sx={{
                                    fontWeight: 500,
                                    color: 'text.secondary',
                                    fontSize: { xs: '1.05rem', sm: '1.15rem' },
                                    ml: 1,
                                    lineHeight: 1.4,
                                    flex: 1,
                                    minWidth: 0,
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word'
                                  }}
                                >
                                  {linkifyText(post.publish_title)}
                                </Typography>
                              </Box>

                              {/* Description */}
                              {post.description && (
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary" 
                                  sx={{ 
                                    mb: 2, 
                                    fontSize: '0.95rem',
                                    lineHeight: 1.6,
                                    color: 'rgba(0, 0, 0, 0.7)',
                                    width: '100%',
                                    maxWidth: '100%',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word'
                                  }}
                                >
                                  {expandedDescriptions[post.id]
                                    ? linkifyText(post.description)
                                    : linkifyText(truncateText(post.description, DESCRIPTION_CHAR_LIMIT))
                                  }
                                  {post.description.length > DESCRIPTION_CHAR_LIMIT && (
                                    <Button
                                      size="small"
                                      onClick={(e) => { e.stopPropagation(); handleToggleDescription(post.id); }}
                                      sx={{ 
                                        ml: 1, 
                                        textTransform: 'none', 
                                        fontWeight: 600, 
                                        color: '#0066FF',
                                        '&:hover': {
                                          background: 'rgba(0, 102, 255, 0.08)'
                                        }
                                      }}
                                    >
                                      {expandedDescriptions[post.id] ? 'Show less' : 'Show more'}
                                    </Button>
                                  )}
                                </Typography>
                              )}
                            </Box>

                            {/* Tags */}
                            {post.tags?.tags && post.tags.tags.length > 0 && (
                              <Box sx={{ 
                                mb: 2, 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: 0.5,
                                width: '100%',
                                maxWidth: '100%',
                                minWidth: 0
                              }}>
                                {post.tags.tags.map((tag) => (
                                  <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    sx={{
                                      bgcolor: 'rgba(0, 102, 255, 0.08)',
                                      color: '#0066FF',
                                      fontWeight: 500,
                                      '&:hover': {
                                        bgcolor: 'rgba(0, 102, 255, 0.12)',
                                      }
                                    }}
                                  />
                                ))}
                              </Box>
                            )}

                            {/* Time and Actions */}
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between', 
                              mt: 2,
                              pt: 2,
                              borderTop: '1px solid rgba(0, 102, 255, 0.1)',
                              width: '100%',
                              maxWidth: '100%',
                              minWidth: 0,
                              flexShrink: 0
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTime fontSize="small" sx={{ mr: 0.5, color: 'rgba(0, 102, 255, 0.7)' }} />
                                <Typography variant="caption" sx={{ color: 'rgba(0, 102, 255, 0.7)', fontWeight: 500 }}>
                                  {formatTimeAgo(post.publish_timestamp)}
                                </Typography>
                              </Box>
                              {/* Actions (like, dislike, comment, share, view details) */}
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Tooltip title={post.user_liked ? "Unlike" : "Like"}>
                                  <span>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                                      aria-label="like"
                                      color={post.user_liked ? "primary" : "default"}
                                      disabled={!isAuthenticated}
                                      sx={{ 
                                        color: post.user_liked ? '#0066FF' : 'rgba(0, 102, 255, 0.6)',
                                        background: post.user_liked ? 'rgba(0, 102, 255, 0.08)' : 'transparent',
                                        '&:hover': { 
                                          background: 'rgba(0, 102, 255, 0.12)',
                                          transform: 'translateY(-1px)',
                                          transition: 'all 0.2s ease-in-out'
                                        }
                                      }}
                                    >
                                      <>
                                        <ThumbUp fontSize="small" />
                                        <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 600 }}>
                                          {post.likes ?? 0}
                                        </Typography>
                                      </>
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title={post.user_disliked ? "Remove dislike" : "Dislike"}>
                                  <span>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => { e.stopPropagation(); handleDislike(post.id); }}
                                      aria-label="dislike"
                                      color={post.user_disliked ? "primary" : "default"}
                                      disabled={!isAuthenticated}
                                      sx={{ 
                                        color: post.user_disliked ? '#0066FF' : 'rgba(0, 102, 255, 0.6)',
                                        background: post.user_disliked ? 'rgba(0, 102, 255, 0.08)' : 'transparent',
                                        '&:hover': { 
                                          background: 'rgba(0, 102, 255, 0.12)',
                                          transform: 'translateY(-1px)',
                                          transition: 'all 0.2s ease-in-out'
                                        }
                                      }}
                                    >
                                      <>
                                        <ThumbDown fontSize="small" />
                                        <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 600 }}>
                                          {post.dislikes ?? 0}
                                        </Typography>
                                      </>
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title="Comments coming soon">
                                  <span>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => { e.stopPropagation(); handleComment(post.id); }}
                                      aria-label="comment"
                                      disabled={true}
                                      sx={{ 
                                        color: 'grey.400',
                                        '&:hover': { 
                                          bgcolor: 'transparent',
                                          cursor: 'not-allowed'
                                        }
                                      }}
                                    >
                                      <Comment fontSize="small" />
                                      <Typography variant="caption" sx={{ ml: 0.5, color: 'grey.400' }}>
                                        {post.comments || 0}
                                      </Typography>
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title="Share">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => { e.stopPropagation(); handleShare(post.id); }}
                                    aria-label="share"
                                    sx={{ 
                                      color: 'rgba(0, 102, 255, 0.6)',
                                      '&:hover': { 
                                        background: 'rgba(0, 102, 255, 0.12)',
                                        transform: 'translateY(-1px)',
                                        transition: 'all 0.2s ease-in-out'
                                      }
                                    }}
                                  >
                                    <Share fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={post.user_bookmarked ? "Remove bookmark" : "Bookmark"}>
                                  <span>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => { e.stopPropagation(); handleBookmark(post.id); }}
                                      aria-label="bookmark"
                                      color={post.user_bookmarked ? "primary" : "default"}
                                      disabled={!isAuthenticated}
                                      sx={{ 
                                        color: post.user_bookmarked ? '#0066FF' : 'rgba(0, 102, 255, 0.6)',
                                        background: post.user_bookmarked ? 'rgba(0, 102, 255, 0.08)' : 'transparent',
                                        '&:hover': { 
                                          background: 'rgba(0, 102, 255, 0.12)',
                                          transform: 'translateY(-1px)',
                                          transition: 'all 0.2s ease-in-out'
                                        }
                                      }}
                                    >
                                      {post.user_bookmarked ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                {tab === 'my-posts' && (
                                  <>
                                    <Tooltip title="Edit post">
                                      <span>
                                        <IconButton
                                          size="small"
                                          onClick={(e) => handleEdit(post, e)}
                                          aria-label="edit"
                                          sx={{ 
                                            color: 'rgba(0, 102, 255, 0.8)',
                                            '&:hover': { 
                                              background: 'rgba(0, 102, 255, 0.12)',
                                              transform: 'translateY(-1px)',
                                              transition: 'all 0.2s ease-in-out'
                                            }
                                          }}
                                        >
                                          <Edit fontSize="small" />
                                        </IconButton>
                                      </span>
                                    </Tooltip>
                                    <Tooltip title="Delete post">
                                      <span>
                                        <IconButton
                                          size="small"
                                          onClick={(e) => handleDelete(post.id, e)}
                                          aria-label="delete"
                                          sx={{ 
                                            color: 'rgba(211, 47, 47, 0.8)',
                                            '&:hover': { 
                                              background: 'rgba(211, 47, 47, 0.12)',
                                              transform: 'translateY(-1px)',
                                              transition: 'all 0.2s ease-in-out'
                                            }
                                          }}
                                        >
                                          <Delete fontSize="small" />
                                        </IconButton>
                                      </span>
                                    </Tooltip>
                                  </>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            </InfiniteScroll>
          )}
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ 
              width: '100%',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Dialog 
          open={editDialog.open} 
          onClose={handleEditClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 102, 255, 0.15)'
            }
          }}
        >
          <DialogTitle sx={{ 
            fontWeight: 600, 
            color: '#0066FF',
            borderBottom: '1px solid rgba(0, 102, 255, 0.1)',
            pb: 2
          }}>
            Edit Post
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              label="Title"
              value={editDialog.title}
              onChange={(e) => setEditDialog(prev => ({ ...prev, title: e.target.value }))}
              margin="normal"
              variant="outlined"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 102, 255, 0.5)',
                  },
                }
              }}
            />
            <TextField
              fullWidth
              label="Description"
              value={editDialog.description}
              onChange={(e) => setEditDialog(prev => ({ ...prev, description: e.target.value }))}
              margin="normal"
              variant="outlined"
              multiline
              rows={4}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 102, 255, 0.5)',
                  },
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
            <Button 
              onClick={handleEditClose}
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  background: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditSave}
              variant="contained"
              disabled={!editDialog.title.trim()}
              sx={{ 
                background: '#0066FF',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  background: '#0052CC'
                }
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Discover;