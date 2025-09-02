import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Input,
  FormControlLabel,
  Checkbox,
  Avatar,
  Chip,
  Alert,
  TextField,
  IconButton,
  Divider,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Paper,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Person as User,
  Security as Shield,
  Palette,
  CreditCard,
  Settings as SettingsIcon,
  AccountBalanceWallet as Wallet,
  Logout as LogOut,
  Delete as Trash2,
  Chat as MessageSquare,
  Link,
  MonetizationOn as Coins,
  Refresh as RefreshCw,
  Edit,
  Close as X,
  Check,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  AutoAwesome as AutoAwesomeIcon,
  ArrowBack as ArrowBackIcon,
  InfoOutlined as InfoOutlinedIcon,
  Email as EmailIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon2
} from '@mui/icons-material';

// Custom X (Twitter) icon component
const XIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
import useAuth from '../../useAuthHook';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../AppProvider';
import Loader from './Loader';
import Credits from '../../Credits';
import { useUser, useWallets, useLinkAccount, usePrivy } from '@privy-io/react-auth';

const Settings = ({ onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { 
    backendUrl, 
    accessToken, 
    skipDisambiguation, 
    setSkipDisambiguation,
    showRewardPopup,
    setShowRewardPopup,
    isProUser,
    fetchSubscriptionStatus,
    profile,
    profileLoading,
    profileLoaded,
    fetchProfile,
    userHandle,
    setUserHandle,
    handleLoading,
    setHandleLoading,
    fetchUserHandle,
    userCredits,
    creditsLoading
  } = useAppContext();

  // Privy hooks for progressive onboarding
  const { refreshUser } = useUser();
  const { wallets: connectedWallets, ready: walletsReady } = useWallets();
  const privy = usePrivy();
  const { linkEmail, linkWallet, linkOAuth } = useLinkAccount({
    onSuccess: async () => {
      console.log('Link account success callback triggered');
      await refreshUser();
      // Reset loading states
      setConnectionLoading({
        email: false,
        wallet: false,
        x: false,
      });
    },
    onError: (err) => {
      console.error('Link account error callback triggered:', err);
      // Reset loading states on error
      setConnectionLoading({
        email: false,
        wallet: false,
        x: false,
      });
    },
  });

  // Debug: Log Privy hooks availability
  console.log('Privy hooks debug:', {
    linkEmail: !!linkEmail,
    linkWallet: !!linkWallet,
    linkOAuth: !!linkOAuth,
    refreshUser: !!refreshUser,
    privy: !!privy,
    privyLinkOAuth: !!(privy?.linkOAuth),
    privyMethods: privy ? Object.keys(privy) : [],
    useLinkAccountMethods: useLinkAccount ? Object.keys(useLinkAccount) : []
  });

  // Enhanced connection actions with loading states
  const handleLinkEmail = async () => {
    setConnectionLoading(prev => ({ ...prev, email: true }));
    try {
      await linkEmail();
    } catch (error) {
      console.error('Email linking failed:', error);
    }
  };

  const handleLinkWallet = async () => {
    setConnectionLoading(prev => ({ ...prev, wallet: true }));
    try {
      await linkWallet();
    } catch (error) {
      console.error('Wallet linking failed:', error);
    }
  };

  const handleLinkX = async () => {
    console.log('handleLinkX called');
    setConnectionLoading(prev => ({ ...prev, x: true }));
    try {
      console.log('Attempting to link Twitter account...');
      
      // Check if Twitter OAuth is available
      if (!privy) {
        throw new Error('Privy not available');
      }
      
      console.log('Available privy methods:', Object.keys(privy));
      
      // Use the correct linkTwitter method
      if (privy.linkTwitter) {
        console.log('Using privy.linkTwitter');
        await privy.linkTwitter();
      } else {
        // Show user-friendly message
        alert('Twitter OAuth is not configured in your Privy dashboard. Please enable Twitter OAuth in your Privy app settings.');
        throw new Error('Twitter OAuth not configured');
      }
      
      console.log('Twitter account linked successfully');
      await refreshUser();
      setConnectionLoading(prev => ({ ...prev, x: false }));
    } catch (error) {
      console.error('X (Twitter) linking failed:', error);
      
      // Show user-friendly error message
      if (error.message?.includes('not allowed') || error.message?.includes('403')) {
        alert('Twitter OAuth is not enabled in your Privy dashboard. Please:\n\n1. Go to dashboard.privy.io\n2. Select your app\n3. Enable Twitter OAuth in Login Methods\n4. Configure Twitter OAuth credentials');
      }
      
      setConnectionLoading(prev => ({ ...prev, x: false }));
    }
  };
  
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  
  // Main state
  const [activeSection, setActiveSection] = useState("profile");
  
  // Handle creation state
  const [handleInput, setHandleInput] = useState('');
  const [isHandleValid, setIsHandleValid] = useState(false);
  const [handleError, setHandleError] = useState('');
  const [handleErrorDetails, setHandleErrorDetails] = useState('');
  const [handleSuggestions, setHandleSuggestions] = useState([]);
  const [showCreateHandle, setShowCreateHandle] = useState(false);
  
  // Edit modes
  const [editModes, setEditModes] = useState({
    profile: false,
    password: false,
    personalization: false,
    conversion: false,
  });

  // Connection loading states
  const [connectionLoading, setConnectionLoading] = useState({
    email: false,
    wallet: false,
    x: false,
  });

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    company: '',
    occupation: '',
  });

  // Personalization data state
  const [personalizationData, setPersonalizationData] = useState({
    skipDisambiguation: skipDisambiguation,
    showRewardPopup: showRewardPopup,
  });

  // Temporary edit data
  const [editData, setEditData] = useState({
    profile: { ...profileData },
    personalization: { ...personalizationData },
  });

  const sections = [
    // { id: "profile", label: "Profile Edit", icon: User },
    // { id: "password", label: "Change Password", icon: Shield },
    { id: "connections", label: "Connections", icon: Link },
    { id: "personalization", label: "Personalization", icon: Palette },
    // { id: "billing", label: "Billing Plan", icon: CreditCard },
    { id: "web3", label: "Web3 Blockchain", icon: Wallet },
    // { id: "advanced", label: "Advanced", icon: SettingsIcon },
  ];

  // Validate handle
  const validateHandle = (handle) => {
    // Basic validation: 3-20 chars, alphanumeric and underscores only
    return /^[a-zA-Z0-9_]{3,20}$/.test(handle);
  };

  // Handle input change
  const handleHandleInputChange = (e) => {
    const newHandle = e.target.value;
    setHandleInput(newHandle);
    setIsHandleValid(validateHandle(newHandle));
  };

  // Generate handle suggestions
  const generateSuggestions = () => {
    const email = user?.email;
    const base = (typeof email === 'string' && email.includes('@')) 
      ? email.split('@')[0] 
      : 'user';
    const suggestions = [
      `${base}_${Math.floor(Math.random() * 1000)}`,
      `anon_${Math.floor(Math.random() * 10000)}`,
      `user_${Math.floor(Math.random() * 100000)}`,
      `${base}_${Math.floor(Math.random() * 100)}_${Math.floor(Math.random() * 100)}`
    ];
    setHandleSuggestions(suggestions);
  };

  // Generate user handle from X (Twitter) username
  const generateUserHandleFromX = async () => {
    if (!xAccount?.username) return;
    
    setHandleLoading(true);
    setHandleError('');
    setHandleErrorDetails('');
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
        headers['Validator'] = 'privy';
      }
      
      const response = await fetch(`${backendUrl}/api/generate_userhandle`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ 
          email: user.email,
          requested_handle: xAccount.username 
        }),
      });
      const data = await response.json();
      if (data.handle) {
        setUserHandle(data.handle);
      } else {
        setHandleError(data.error || 'Failed to generate handle');
        if (data.error_details) {
          setHandleErrorDetails(data.error_details);
        }
      }
    } catch (error) {
      console.error('Error generating user handle from X:', error);
      setHandleError('Failed to generate handle');
    } finally {
      setHandleLoading(false);
    }
  };



  // Extract profile data when profile is loaded from AppProvider
  useEffect(() => {
    if (profile && profile.user_data && profile.user_data[0] && profile.user_data[0].user_metadata) {
      const metadata = profile.user_data[0].user_metadata;
      const extractedProfile = {
        name: metadata.first_name && metadata.last_name 
          ? `${metadata.first_name} ${metadata.last_name}` 
          : '',
        company: metadata.company || '',
        occupation: metadata.occupation || '',
      };
      setProfileData(extractedProfile);
      setEditData(prev => ({ ...prev, profile: extractedProfile }));
    }
  }, [profile]);



  // Update personalization data when context changes
  useEffect(() => {
    setPersonalizationData({
      skipDisambiguation: skipDisambiguation,
      showRewardPopup: showRewardPopup,
    });
    setEditData(prev => ({
      ...prev,
      personalization: {
        skipDisambiguation: skipDisambiguation,
        showRewardPopup: showRewardPopup,
      }
    }));
  }, [skipDisambiguation, showRewardPopup]);

  const toggleEditMode = (section) => {
    setEditModes((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));

    // Reset edit data when entering edit mode
    if (!editModes[section]) {
      if (section === "profile") {
        setEditData((prev) => ({ ...prev, profile: { ...profileData } }));
      } else if (section === "personalization") {
        setEditData((prev) => ({ ...prev, personalization: { ...personalizationData } }));
      }
    }
  };

  const saveChanges = (section) => {
    if (section === "profile") {
      setProfileData({ ...editData.profile });
      // Here you would typically save to backend
    } else if (section === "personalization") {
      setPersonalizationData({ ...editData.personalization });
      // Update context state
      setSkipDisambiguation(editData.personalization.skipDisambiguation);
      setShowRewardPopup(editData.personalization.showRewardPopup);
    }
    toggleEditMode(section);
  };

  const cancelEdit = (section) => {
    // Reset edit data to original values
    if (section === "profile") {
      setEditData((prev) => ({ ...prev, profile: { ...profileData } }));
    } else if (section === "personalization") {
      setEditData((prev) => ({ ...prev, personalization: { ...personalizationData } }));
    }
    toggleEditMode(section);
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveSection(sectionId);
  };

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  // Tier ladder definition
  const tiers = [
    { name: 'None', min_balance: 0 },
    { name: 'Bronze', min_balance: 1 },
    { name: 'Silver', min_balance: 2 },
    { name: 'Gold', min_balance: 3 },
    { name: 'Platinum', min_balance: 10 },
  ];

  // Helper to capitalize tier
  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  const getTierColor = (tier) => {
    switch(tier) {
      case 'platinum': return '#1976d2';
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      case 'bronze': return '#cd7f32';
      default: return '#888';
    }
  };

  // Connection status detection
  const hasEmail = Boolean(user?.email?.address || user?.email);
  const linkedWallets = (user?.linkedAccounts || []).filter(a => a.type === 'wallet');
  const hasAnyLinkedWallet = linkedWallets.length > 0;
  
  // Debug: Log user object to see the structure
  console.log('User object for connection detection:', user);
  console.log('User oauthAccounts:', user?.oauthAccounts);
  console.log('User linkedAccounts:', user?.linkedAccounts);
  
  // Try different ways to find Twitter connection
  const xAccount = user?.twitter || 
                   user?.linkedAccounts?.find(a => a.type === 'twitter_oauth') ||
                   user?.oauthAccounts?.find(a => a.provider === 'twitter') || 
                   user?.linkedAccounts?.find(a => a.type === 'oauth' && a.provider === 'twitter') ||
                   user?.linkedAccounts?.find(a => a.type === 'twitter');
  const hasX = Boolean(xAccount);
  
  console.log('X account found:', xAccount);
  console.log('Has X:', hasX);

  // Auto-generate username from X when connected
  useEffect(() => {
    if (isAuthenticated && hasX && !userHandle && !handleLoading) {
      // Auto-generate username from X (Twitter) username
      generateUserHandleFromX();
    }
  }, [hasX, userHandle, handleLoading, isAuthenticated]);

  // Connection types configuration
  const connectionTypes = [
    {
      id: 'email',
      label: 'Email',
      icon: EmailIcon,
      connected: hasEmail,
      description: hasEmail ? (user?.email?.address || user?.email) : 'Connect your email address',
      action: hasEmail ? null : handleLinkEmail,
      actionLabel: 'Connect Email',
      loading: connectionLoading.email
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: Wallet,
      connected: hasAnyLinkedWallet,
      description: hasAnyLinkedWallet 
        ? linkedWallets.length > 1 
          ? `${linkedWallets.length} wallets connected`
          : `${linkedWallets[0]?.address?.slice(0, 6)}...${linkedWallets[0]?.address?.slice(-4)}`
        : 'Connect your crypto wallet',
      action: hasAnyLinkedWallet ? null : handleLinkWallet,
      actionLabel: 'Connect Wallet',
      loading: connectionLoading.wallet
    },
    {
      id: 'x',
      label: 'X (Twitter)',
      icon: XIcon,
      connected: hasX,
      description: hasX ? `@${xAccount?.username || xAccount?.name || 'Connected'}` : 'Connect your X (Twitter) account',
      action: hasX ? null : handleLinkX,
      actionLabel: 'Connect X',
      loading: connectionLoading.x
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFF' }}>
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
              <ArrowBackIcon />
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

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account settings and preferences.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
          {/* Sidebar Navigation */}
          <Box sx={{ 
            width: { lg: 256 }, 
            position: { lg: 'sticky' }, 
            top: { lg: 32 }, 
            alignSelf: { lg: 'flex-start' } 
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <Button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    sx={{
                      justifyContent: 'flex-start',
                      gap: 1.5,
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      color: activeSection === section.id ? 'white' : 'text.primary',
                      bgcolor: activeSection === section.id ? '#0066FF' : 'transparent',
                      '&:hover': {
                        bgcolor: activeSection === section.id ? '#1557b0' : 'action.hover',
                      },
                    }}
                  >
                                         <Icon sx={{ fontSize: 16 }} />
                     {section.label}
                   </Button>
                 );
               })}

               {/* Log Out Button */}
               <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider', mt: 2 }}>
                 <Button
                   onClick={() => logout({ returnTo: window.location.origin })}
                   sx={{
                     justifyContent: 'flex-start',
                     gap: 1.5,
                     px: 1.5,
                     py: 1,
                     borderRadius: 2,
                     textTransform: 'none',
                     color: 'error.main',
                     width: '100%',
                     '&:hover': {
                       bgcolor: 'error.light',
                       color: 'error.contrastText',
                     },
                   }}
                 >
                   <LogOut sx={{ fontSize: 16 }} />
                   Log Out
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Username Display */}
            <Box sx={{ mb: 3 }}>
              <Card>
                <CardContent sx={{ pt: 3 }}>
                  {handleLoading ? (
                    // Loading state
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 64, height: 64 }}>
                        <CircularProgress size={24} />
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          Loading...
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Setting up username
                        </Typography>
                      </Box>
                    </Box>
                  ) : userHandle ? (
                    // Display existing handle
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 64, height: 64 }}>
                        {userHandle.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          @{userHandle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Username from X (Twitter)
                        </Typography>
                      </Box>
                    </Box>
                  ) : hasX ? (
                    // X connected but no username generated yet
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 64, height: 64 }}>
                        <XIcon style={{ width: 32, height: 32 }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          @{xAccount?.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          X (Twitter) connected - generating username...
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => generateUserHandleFromX()}
                          disabled={handleLoading}
                          startIcon={handleLoading ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
                          sx={{ mt: 1, textTransform: 'none' }}
                        >
                          {handleLoading ? 'Generating...' : 'Generate Username'}
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    // No X connection - show connect X message
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 64, height: 64, bgcolor: 'action.hover' }}>
                        <XIcon style={{ width: 32, height: 32, color: 'text.secondary' }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          No username set
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Connect your X (Twitter) account to generate a username
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleLinkX}
                          disabled={connectionLoading.x}
                          startIcon={connectionLoading.x ? <CircularProgress size={16} /> : <XIcon />}
                          sx={{ mt: 1, textTransform: 'none' }}
                        >
                          {connectionLoading.x ? 'Connecting...' : 'Connect X (Twitter)'}
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {handleError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {handleError}
                      </Typography>
                      {handleErrorDetails && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                          {handleErrorDetails}
                        </Typography>
                      )}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Box>

            {/* Connections Section */}
            <Box id="connections" sx={{ scrollMarginTop: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Connections
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Connect your accounts to enhance your experience and unlock additional features.
                </Typography>
              </Box>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {connectionTypes.map((connection) => {
                      const Icon = connection.icon;
                      return (
                        <Box
                          key={connection.id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 2,
                            border: 1,
                            borderColor: connection.connected ? 'success.light' : 'divider',
                            borderRadius: 2,
                            bgcolor: connection.connected ? 'success.light' : 'background.paper',
                            opacity: connection.connected ? 1 : 0.7,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              opacity: 1,
                              borderColor: connection.connected ? 'success.main' : 'primary.light',
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: connection.connected ? 'success.main' : 'action.hover',
                                color: connection.connected ? 'white' : 'text.secondary'
                              }}
                            >
                              <Icon sx={{ fontSize: 20 }} />
                            </Box>
                            <Box>
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  fontWeight: 500,
                                  color: connection.connected ? 'success.dark' : 'text.primary'
                                }}
                              >
                                {connection.label}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ 
                                  color: connection.connected ? 'success.dark' : 'text.secondary'
                                }}
                              >
                                {connection.description}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {connection.connected ? (
                              <Chip
                                icon={<CheckCircleIcon2 sx={{ fontSize: 16 }} />}
                                label="Connected"
                                color="success"
                                size="small"
                                sx={{ 
                                  bgcolor: 'success.main',
                                  color: 'white',
                                  '& .MuiChip-icon': {
                                    color: 'white'
                                  }
                                }}
                              />
                            ) : (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={connection.loading ? <CircularProgress size={16} /> : <AddIcon sx={{ fontSize: 16 }} />}
                                onClick={connection.action}
                                disabled={connection.loading}
                                sx={{
                                  textTransform: 'none',
                                  borderColor: 'primary.main',
                                  color: 'primary.main',
                                  '&:hover': {
                                    borderColor: 'primary.dark',
                                    bgcolor: 'primary.light',
                                    color: 'primary.dark'
                                  }
                                }}
                              >
                                {connection.loading ? 'Connecting...' : connection.actionLabel}
                              </Button>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                  
                  {/* Connection Status Summary */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 102, 255, 0.05)', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Connection Status
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {connectionTypes.filter(c => c.connected).length} of {connectionTypes.length} accounts connected
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {connectionTypes.map((connection) => (
                        <Chip
                          key={connection.id}
                          label={connection.label}
                          size="small"
                          color={connection.connected ? "success" : "default"}
                          variant={connection.connected ? "filled" : "outlined"}
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Profile Edit Section */}
            {/* <Box id="profile" sx={{ scrollMarginTop: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Profile Edit
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Update your personal information.
                </Typography>
              </Box>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  {!editModes.profile ? (
                    // Read-only view
                    <>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Name
                          </Typography>
                          <Typography variant="body1">
                            {profileData.name || 'Not specified'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Company
                          </Typography>
                          <Typography variant="body1">
                            {profileData.company || 'Not specified'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Occupation
                          </Typography>
                          <Typography variant="body1">
                            {profileData.occupation || 'Not specified'}
                          </Typography>
                        </Box>
                      </Box>
                                             <Button 
                         onClick={() => toggleEditMode("profile")} 
                         startIcon={<Edit sx={{ fontSize: 16 }} />}
                         variant="contained"
                       >
                         Edit Profile
                       </Button>
                    </>
                  ) : (
                    // Edit mode
                    <>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Name
                          </Typography>
                          <TextField
                            fullWidth
                            value={editData.profile.name}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                profile: { ...prev.profile, name: e.target.value },
                              }))
                            }
                            placeholder="Your full name"
                            size="small"
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Company
                          </Typography>
                          <TextField
                            fullWidth
                            value={editData.profile.company}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                profile: { ...prev.profile, company: e.target.value },
                              }))
                            }
                            placeholder="Your company name"
                            size="small"
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Occupation
                          </Typography>
                          <TextField
                            fullWidth
                            value={editData.profile.occupation}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                profile: { ...prev.profile, occupation: e.target.value },
                              }))
                            }
                            placeholder="Your job title"
                            size="small"
                          />
                        </Box>
                      </Box>
                                             <Box sx={{ display: 'flex', gap: 1 }}>
                         <Button 
                           onClick={() => saveChanges("profile")} 
                           startIcon={<Check sx={{ fontSize: 16 }} />}
                           variant="contained"
                         >
                           Save Changes
                         </Button>
                         <Button 
                           onClick={() => cancelEdit("profile")} 
                           startIcon={<X sx={{ fontSize: 16 }} />}
                           variant="outlined"
                         >
                           Cancel
                         </Button>
                       </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Box> */}

                        {/* Change Password Section */}
            {/* <Box id="password" sx={{ scrollMarginTop: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Change Password
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Update your account password for security.
                </Typography>
              </Box>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  {!editModes.password ? (
                    // Read-only view
                    <>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          Password
                        </Typography>
                        <Typography variant="body1">••••••••••••</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          Last updated 30 days ago
                        </Typography>
                      </Box>
                      <Button 
                        onClick={() => toggleEditMode("password")} 
                        startIcon={<Edit sx={{ fontSize: 16 }} />}
                        variant="contained"
                      >
                        Change Password
                      </Button>
                    </>
                  ) : (
                    // Edit mode
                    <>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Current Password
                          </Typography>
                          <TextField
                            fullWidth
                            type="password"
                            placeholder="Enter current password"
                            size="small"
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            New Password
                          </Typography>
                          <TextField
                            fullWidth
                            type="password"
                            placeholder="Enter new password"
                            size="small"
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Confirm New Password
                          </Typography>
                          <TextField
                            fullWidth
                            type="password"
                            placeholder="Confirm new password"
                            size="small"
                          />
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          onClick={() => toggleEditMode("password")} 
                          startIcon={<Check sx={{ fontSize: 16 }} />}
                          variant="contained"
                        >
                          Update Password
                        </Button>
                        <Button 
                          onClick={() => cancelEdit("password")} 
                          startIcon={<X sx={{ fontSize: 16 }} />}
                          variant="outlined"
                        >
                          Cancel
                        </Button>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Box> */}

            {/* Personalization Section */}
            <Box id="personalization" sx={{ scrollMarginTop: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Personalization
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Customize your experience preferences.
                </Typography>
              </Box>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  {!editModes.personalization ? (
                    // Read-only view
                    <>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Skip Disambiguation
                          </Typography>
                          <Chip 
                            label={personalizationData.skipDisambiguation ? "Enabled" : "Disabled"}
                            color={personalizationData.skipDisambiguation ? "primary" : "default"}
                            size="small"
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Show Reward Popup After Fact Checks
                          </Typography>
                          <Chip 
                            label={personalizationData.showRewardPopup ? "Enabled" : "Disabled"}
                            color={personalizationData.showRewardPopup ? "primary" : "default"}
                            size="small"
                          />
                        </Box>
                      </Box>
                                             <Button 
                         onClick={() => toggleEditMode("personalization")} 
                         startIcon={<Edit sx={{ fontSize: 16 }} />}
                         variant="contained"
                       >
                         Edit Preferences
                       </Button>
                    </>
                  ) : (
                    // Edit mode
                    <>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={editData.personalization.skipDisambiguation}
                              onChange={(e) =>
                                setEditData((prev) => ({
                                  ...prev,
                                  personalization: { ...prev.personalization, skipDisambiguation: e.target.checked },
                                }))
                              }
                            />
                          }
                          label="Skip Disambiguation"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={editData.personalization.showRewardPopup}
                              onChange={(e) =>
                                setEditData((prev) => ({
                                  ...prev,
                                  personalization: { ...prev.personalization, showRewardPopup: e.target.checked },
                                }))
                              }
                            />
                          }
                          label="Show Reward Popup After Fact Checks"
                        />
                      </Box>
                                             <Box sx={{ display: 'flex', gap: 1 }}>
                         <Button 
                           onClick={() => saveChanges("personalization")} 
                           startIcon={<Check sx={{ fontSize: 16 }} />}
                           variant="contained"
                         >
                           Save Preferences
                         </Button>
                         <Button 
                           onClick={() => cancelEdit("personalization")} 
                           startIcon={<X sx={{ fontSize: 16 }} />}
                           variant="outlined"
                         >
                           Cancel
                         </Button>
                       </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Box>

                        {/* Billing Plan Section */}
            {/* <Box id="billing" sx={{ scrollMarginTop: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Billing Plan
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage your subscription and billing information.
                </Typography>
              </Box>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2, 
                      bgcolor: 'action.hover', 
                      borderRadius: 2 
                    }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Current Plan
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {isProUser ? 'Pro User' : 'Basic User'}
                        </Typography>
                      </Box>
                      <Chip label="Active" color="primary" />
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2, 
                      border: 1, 
                      borderColor: 'divider', 
                      borderRadius: 2 
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: 'primary.light', 
                          borderRadius: 2, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          <CreditCard sx={{ fontSize: 16 }} />
                        </Box>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Payment Method
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            •••• •••• •••• 4242
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Next Billing Cycle
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        January 15, 2025
                      </Typography>
                    </Box>

                    <Button variant="outlined" color="error" fullWidth>
                      🔘 Cancel Plan
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box> */}

            {/* Web3 Blockchain Section */}
            <Box id="web3" sx={{ scrollMarginTop: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Web3 Blockchain
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage your wallet connection and tokens.
                </Typography>
              </Box>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  {profileLoading ? (
                    // Loading state for wallet section
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      py: 8
                    }}>
                      <CircularProgress size={40} sx={{ mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        Loading wallet information...
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {/* Connect Wallet */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        p: 2, 
                        border: 1, 
                        borderColor: 'divider', 
                        borderRadius: 2 
                      }}>
                                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                           <Link sx={{ fontSize: 20, color: '#1976d2' }} />
                           <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              Connect Wallet
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user?.wallet?.address ? 
                                `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` :
                                'No wallet connected'
                              }
                            </Typography>
                          </Box>
                        </Box>
                        <Chip 
                          label={user?.wallet?.address ? "Connected" : "Disconnected"}
                          color={user?.wallet?.address ? "success" : "default"}
                          sx={{ 
                            bgcolor: user?.wallet?.address ? 'success.light' : 'default',
                            color: user?.wallet?.address ? 'success.dark' : 'default'
                          }}
                        />
                      </Box>

                      {/* Tokens Available */}
                      <Box sx={{ 
                        p: 2, 
                        background: 'linear-gradient(135deg, #f3e5f5 0%, #e1f5fe 100%)', 
                        borderRadius: 2 
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                             <Coins sx={{ fontSize: 20, color: '#9c27b0' }} />
                             <Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Tokens Available
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Your earned FACY coins
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                              {profile.token_balance || '0'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              FACY
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Tier Display */}
                      {profile.tier && (
                        <Box sx={{ 
                          p: 2, 
                          border: 1, 
                          borderColor: 'divider', 
                          borderRadius: 2 
                        }}>
                          <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                            Current Tier
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: getTierColor(profile.tier),
                                fontWeight: 'bold',
                                textTransform: 'capitalize'
                              }}
                            >
                              {capitalize(profile.tier)}
                            </Typography>
                          </Box>
                          
                          {/* Tier Ladder */}
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Tier Ladder
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {tiers.map((tier) => (
                              <Box 
                                key={tier.name} 
                                sx={{ 
                                  p: 1, 
                                  borderRadius: 1, 
                                  border: 1, 
                                  borderColor: profile.tier === tier.name.toLowerCase() ? 'primary.main' : 'divider',
                                  bgcolor: profile.tier === tier.name.toLowerCase() ? 'primary.light' : 'background.paper',
                                  minWidth: 80, 
                                  textAlign: 'center',
                                  flex: '1 1 auto'
                                }}
                              >
                                <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                                  {tier.name}
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block' }}>
                                  Min: {tier.min_balance}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}

                      {/* Convert to Platform Credits */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 2, 
                          border: 1, 
                          borderColor: 'divider', 
                          borderRadius: 2 
                        }}>
                                                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                             <RefreshCw sx={{ fontSize: 20, color: '#4caf50' }} />
                             <Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Convert to Platform Credits
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Exchange rate: 1 FACY = 5 Credits
                              </Typography>
                            </Box>
                          </Box>
                                                   {!editModes.conversion && (
                             <Button 
                               onClick={() => toggleEditMode("conversion")} 
                               startIcon={<Edit sx={{ fontSize: 16 }} />}
                               variant="outlined"
                               size="small"
                             >
                               Convert
                             </Button>
                           )}
                        </Box>

                        {editModes.conversion && (
                          <>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <TextField
                                placeholder="Enter TRUTH amount"
                                defaultValue="10"
                                size="small"
                                sx={{ flex: 1 }}
                              />
                              <Button onClick={() => toggleEditMode("conversion")} variant="contained">
                                Convert
                              </Button>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                You will receive ~100 Platform Credits
                              </Typography>
                                                           <Button 
                                 onClick={() => cancelEdit("conversion")} 
                                 size="small"
                                 startIcon={<X sx={{ fontSize: 12 }} />}
                               >
                                 Cancel
                               </Button>
                            </Box>
                          </>
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>

                        {/* Advanced Section */}
            {/* <Box id="advanced" sx={{ scrollMarginTop: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Advanced
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Advanced account management options.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Data Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Manage your stored data and conversations.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<MessageSquare sx={{ fontSize: 16 }} />}
                    >
                      🗑️ Delete All Chats
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Account Deletion
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </Typography>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Deleting your account will permanently remove all your data, including earned tokens and
                      transaction history.
                    </Alert>
                    <Button 
                      variant="outlined" 
                      color="error"
                      fullWidth 
                      startIcon={<Trash2 sx={{ fontSize: 16 }} />}
                    >
                      ❌ Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            </Box> */}
                     </Box>
         </Box>
       </Container>
     </Box>
  );
};

export default Settings;
