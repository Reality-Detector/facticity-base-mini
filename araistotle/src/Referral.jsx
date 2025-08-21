import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
  Tooltip,
  IconButton,
  TextField,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Grid,
  Container,
  Fade,
  Card,
  CardContent,
  Divider,
  Stack,
  AppBar,
  Toolbar
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useAppContext } from './AppProvider';
import useAuth from './useAuthHook';
import ThirdColumn from './components/ThirdColumn';
import { useNavigate } from 'react-router-dom';
import CreditBreakdown from './components/CreditBreakdown';
import AuthDialog from './AuthDialog';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShareIcon from '@mui/icons-material/Share';
import TelegramIcon from '@mui/icons-material/Telegram';
import Credits from './Credits';

// Custom styles
const styles = {
  pageContainer: {
    minHeight: { xs: '100svh', sm: '100vh' },
    background: '#F8FAFF',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'relative',
    WebkitOverflowScrolling: 'touch',
  },
  header: {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottom: '1px solid rgba(0, 102, 255, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  mainCard: {
    borderRadius: 2,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
    }
  },
  button: {
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    }
  },
  tableContainer: {
    borderRadius: 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    '& .MuiTableCell-head': {
      fontWeight: 600,
      backgroundColor: '#f5f5f5'
    }
  },
  shareButton: {
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    padding: '8px 16px',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    }
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    color: 'white',
    '&:hover': {
      backgroundColor: '#128C7E',
    }
  },
  telegramButton: {
    backgroundColor: '#0088cc',
    color: 'white',
    '&:hover': {
      backgroundColor: '#006699',
    }
  },
  shareGenericButton: {
    backgroundColor: '#1a73e8',
    color: 'white',
    '&:hover': {
      backgroundColor: '#1557b0',
    }
  }
};

const Referral = () => {
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("credits");
  
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemMessage, setRedeemMessage] = useState('');
  const [loadingReferral, setLoadingReferral] = useState(false);
  const [loadingRedeem, setLoadingRedeem] = useState(false);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const {fetchSubscriptionStatus, backendUrl, accessToken, userCredits, creditsLoading} = useAppContext()

  // New state for config values
  const [creditConfig, setCreditConfig] = useState({ credit_amount: 150, max_redemptions: 10 });

  const { user, isAuthenticated, getAccessTokenSilently, loginWithPopup } = useAuth();
  const navigate = useNavigate()
  // Responsive Design
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);

  // Sidebar sections
  const sections = [
    { id: "credits", label: "Credits Breakdown", icon: AccountBalanceWalletIcon },
    { id: "referrals", label: "Referral & Rewards", icon: CardGiftcardIcon },
  ];

  // Fetch config on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${backendUrl}/get-credit-amount-config`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setCreditConfig({
            credit_amount: data.credit_amount ?? 150,
            max_redemptions: data.max_redemptions ?? 10,
          });
        }
      } catch (err) {
        // fallback to defaults
      }
    };
    fetchConfig();
  }, [backendUrl]);

  // Trigger fade-in animations after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setComponentsLoaded(true);
    }, 100); // Small delay to ensure DOM is ready
    return () => clearTimeout(timer);
  }, []);

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

  const handleLogin = async () => {
    try {
      await loginWithPopup();
      setAuthDialogOpen(false);     // Close dialog on success
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await fetch(`${backendUrl}/get-user-signup-date?user_id=${encodeURIComponent(user.sub)}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Validator': 'privy'
        }
      });
      const data = await response.json();
      console.log("User signed up at:", data.created_at);
    } catch (err) {
      console.error("Failed to fetch user signup time", err);
    }
  };

  useEffect(() => {
    //getUserDetails()
  }, [])

  const handleGenerateReferral = async () => {
    if(!isAuthenticated) {
      setAuthDialogOpen(true);
    }
    else {
    setLoadingReferral(true);
    setReferralCode('');
    setCopied(false);
    try {
      const response = await fetch(`${backendUrl}/generate-referral-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${accessToken}`},
        body: JSON.stringify({
          user_email: user?.email,
          purpose_type: 'joining',
          expiry_type: 'lifetime',
          credit_amount: 150,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate referral code');
      }

      const data = await response.json();
      setReferralCode(data.referral_code);
    } catch (error) {
      console.error('Error generating referral code:', error);
    } finally {
      setLoadingReferral(false);
    }
  }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeemReferral = async () => {
    if(!isAuthenticated) {
      setAuthDialogOpen(true);
    }
    else{
    setLoadingRedeem(true);
    setRedeemMessage('');
    try {
      const response = await fetch(`${backendUrl}/redeem-referral`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}`, 'Validator': 'privy' },
        body: JSON.stringify({
          referral_code: redeemCode,
          redeemer_email: user?.email,
          user_id : user?.sub
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to redeem referral code');
      }

      setRedeemMessage(data.message);
      fetchSubscriptionStatus()
    } catch (error) {
      console.error('Error redeeming referral code:', error);
      setRedeemMessage(error.message);
    } finally {
      setLoadingRedeem(false);
    }
  }
  };

  const fetchRewardHistory = async () => {
    setLoadingRewards(true);
    try {
      const response = await fetch(`${backendUrl}/get-user-reward-history?user_email=${encodeURIComponent(user?.email)}`, {
        headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${accessToken}`, 'Validator': 'privy'}
      });

      const data = await response.json();
      setRewardHistory(data.reward_logs || []);
    } catch (err) {
      console.error('Error fetching reward history:', err);
    } finally {
      setLoadingRewards(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchRewardHistory();
    }
  }, [user?.email, loadingRedeem, accessToken]);

  const getShareMessage = () => {
    return `Join me on https://app.facticity.ai! Use my referral code ${referralCode} to get 150 bonus credits when you sign up.
  
  Facticity AI lets you fact-check news, claims, text, and video content in real time. Just enter a claim, paragraph, or audio/video link—Facticity will analyze sources, detect false or misleading claims, and provide real-time insights.
  
  Let's get fact-checking!`;
  };
  

  const handleShare = async () => {
    const shareData = {
      title: 'Join Facticity.AI',
      text: getShareMessage(),
      url: 'https://app.facticity.ai'
    };

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(getShareMessage());
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleTelegramShare = () => {
    const message = encodeURIComponent(getShareMessage());
    window.open(`https://t.me/share/url?url=https://facticity.ai&text=${message}`, '_blank');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(getShareMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={styles.pageContainer}>
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
            <a href="https://app.facticity.ai" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img
                src="/facticityailogo-02.png"
                alt="Facticity.AI"
                style={{
                  paddingTop: '2px',
                  width: 'auto',
                  height: isMdUp ? '36px' : '30px',
                }}
              />
            </a>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {/* Credits */}
            {isAuthenticated && (
              <>
                <IconButton 
                  onClick={() => navigate('/rewards')} 
                  size="small" 
                  sx={{ 
                    color: '#0066FF',
                    background: 'rgba(0, 102, 255, 0.08)',
                    '&:hover': { background: 'rgba(0, 102, 255, 0.12)' },
                  }}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
                <Box>
                  <Credits credits={userCredits} isLoading={creditsLoading} />
                </Box>
              </>
            )}

            {/* Right-most Element */}
            {(!isAuthenticated || isMdUp) && (
              <ThirdColumn />
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
            Referrals & Credits
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your credits and refer friends to earn rewards.
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
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 6,
            opacity: componentsLoaded ? 1 : 0,
            transform: componentsLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.5s ease-in-out 0.3s',
          }}>
            <AuthDialog
              open={isAuthDialogOpen}
              onClose={() => setAuthDialogOpen(false)}
              onLogin={handleLogin}
            />

            {/* Credits Section */}
            <Box id="credits" sx={{ scrollMarginTop: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'black' }}>
                  Credits Breakdown
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Overview of your current credit balance and usage.
                </Typography>
              </Box>
              <Card sx={styles.mainCard}>
                <CardContent>
                  {loadingRedeem ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <CreditBreakdown loadingReferral={loadingReferral} />
                  )}
                </CardContent>
              </Card>
            </Box>

            {/* Referral & Rewards Section */}
            <Box id="referrals" sx={{ scrollMarginTop: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'black' }}>
                  Referral & Rewards
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Share Facticity.AI with your friends and both get {creditConfig.credit_amount} lifetime credits! You can refer up to {creditConfig.max_redemptions} people.
                  Note: Generate and share your referral code before your friend creates their account.
                </Typography>
              </Box>
              
              <Card sx={styles.mainCard}>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Generate Code Section */}
                    <Box>
                      <Button
                        variant="contained"
                        onClick={handleGenerateReferral}
                        disabled={loadingReferral}
                        sx={{
                          ...styles.button,
                          backgroundColor: '#1a73e8',
                          '&:hover': {
                            backgroundColor: '#1557b0',
                          }
                        }}
                        fullWidth
                      >
                        {loadingReferral ? <CircularProgress size={24} color="inherit" /> : 'Generate Referral Code'}
                      </Button>

                      {referralCode && (
                        <Fade in timeout={500}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <TextField
                                label="Your Referral Code"
                                value={referralCode}
                                InputProps={{
                                  readOnly: true,
                                  sx: { borderRadius: '8px' }
                                }}
                                fullWidth
                                variant="outlined"
                              />
                              <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                                <IconButton
                                  onClick={handleCopy}
                                  color="primary"
                                  sx={{
                                    ...styles.button,
                                    backgroundColor: copied ? '#e8f5e9' : 'transparent'
                                  }}
                                >
                                  {copied ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                                </IconButton>
                              </Tooltip>
                            </Box>
                            
                            <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                              Share your referral code:
                            </Typography>
                            
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              <Tooltip title="Share via WhatsApp">
                                <IconButton
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
                                  <WhatsAppIcon />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Share via Telegram">
                                <IconButton
                                  onClick={handleTelegramShare}
                                  sx={{ 
                                    ...styles.shareButton, 
                                    backgroundColor: '#0088cc',
                                    color: 'white',
                                    '&:hover': {
                                      backgroundColor: '#006699',
                                    }
                                  }}
                                >
                                  <TelegramIcon />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Share">
                                <IconButton
                                  onClick={handleShare}
                                  sx={{ 
                                    ...styles.shareButton, 
                                    backgroundColor: '#1a73e8',
                                    color: 'white',
                                    '&:hover': {
                                      backgroundColor: '#1557b0',
                                    }
                                  }}
                                >
                                  <ShareIcon />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title={copied ? 'Message copied!' : 'Copy message'}>
                                <IconButton
                                  onClick={handleCopyMessage}
                                  sx={{ 
                                    ...styles.shareButton, 
                                    backgroundColor: copied ? '#e8f5e9' : '#f5f5f5',
                                    color: copied ? '#2e7d32' : '#666',
                                    '&:hover': {
                                      backgroundColor: copied ? '#e8f5e9' : '#eeeeee',
                                    }
                                  }}
                                >
                                  {copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Box>
                        </Fade>
                      )}
                    </Box>

                    <Divider />

                    {/* Redeem Code Section */}
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ color: '#1a73e8' }}>
                        Redeem a Code
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                          label="Enter Referral Code"
                          value={redeemCode}
                          onChange={(e) => setRedeemCode(e.target.value)}
                          fullWidth
                          variant="outlined"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                        <Button
                          variant="outlined"
                          onClick={handleRedeemReferral}
                          disabled={loadingRedeem}
                          sx={styles.button}
                        >
                          {loadingRedeem ? <CircularProgress size={24} /> : 'Redeem'}
                        </Button>
                      </Box>

                      {redeemMessage && (
                        <Fade in timeout={500}>
                          <Alert 
                            severity="info" 
                            sx={{ 
                              mt: 2,
                              borderRadius: '8px',
                              '& .MuiAlert-message': { color: '#1a73e8' }
                            }}
                          >
                            {redeemMessage}
                          </Alert>
                        </Fade>
                      )}
                    </Box>

                    <Divider />

                    {/* Reward History Section */}
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ color: '#1a73e8' }}>
                        Reward History
                      </Typography>
                      
                      {loadingRewards ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                          <CircularProgress />
                        </Box>
                      ) : rewardHistory.length === 0 ? (
                        <Typography variant="body1" sx={{ color: '#666', textAlign: 'center', py: 3 }}>
                          No rewards yet. Start referring friends to earn credits!
                        </Typography>
                      ) : (
                        <TableContainer component={Paper} sx={styles.tableContainer}>
                          <Table size="medium">
                            <TableHead>
                              <TableRow>
                                <TableCell>Credits</TableCell>
                                <TableCell>Source</TableCell>
                                <TableCell>Referral/Promo</TableCell>
                                <TableCell>Earned</TableCell>
                                <TableCell>Expires</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rewardHistory.map((log) => (
                                <TableRow 
                                  key={log._id}
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: '#f5f5f5',
                                      transition: 'background-color 0.2s ease'
                                    }
                                  }}
                                >
                                  <TableCell>{log.amount}</TableCell>
                                  <TableCell>{log.source}</TableCell>
                                  <TableCell>{log.referral_code}</TableCell>
                                  <TableCell>{new Date(log.timestamp).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    {log.expiry === 'lifetime' ? 'No Expiry' : new Date(log.expiry).toLocaleDateString()}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Referral;
