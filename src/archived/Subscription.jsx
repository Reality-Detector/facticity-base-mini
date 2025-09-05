import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IconButton, 
  Grid, 
  Box, 
  useTheme, 
  useMediaQuery, 
  Button, 
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Paper,
  TextField,
  Divider,
  Container
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { Link } from '@mui/material';

import useAuth from './useAuthHook';
import { useAppContext } from './AppProvider';

import Sidebar from './components/Home/Sidebar';
import ThirdColumn from './components/Home/ThirdColumn';

const Subscription = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth();
  const [isProUser, setIsProUser] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const {
    isSidebarOpen,
    toggleSidebar,
    handleCloseSidebar,
    setIsSearchMoved,
    createConversation,
    backendUrl,
    accessToken
  } = useAppContext();

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (isAuthenticated && user?.email) {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch(`${backendUrl}/get_user_subscription_by_email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Validator: 'privy',
            },
            body: JSON.stringify({ email: user.email }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.subscriptions && data.subscriptions.some(sub => sub.status === "active" || sub.status === "trialing")) {
              setIsProUser(true);
            } else {
              setIsProUser(false);
            }
          } else {
            console.error("Failed to fetch subscription status:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching subscription status:", error);
        }
      }
    };

    fetchSubscriptionStatus();
  }, [isAuthenticated, user, getAccessTokenSilently]);
  
  const navigate = useNavigate();

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const [isModalOpen, setIsModalOpen] = useState(false);

  const freeTier = {
    title: "Basic",
    price: "$0/month",
    description: "Ideal for individuals who want to verify claims",
    features: [
      { text: "15 credits (3 fact-checks) renew daily", available: true },
      { text: "Fact check against web sources (includes summary, truth label, explanation, sources, disambiguation, bias)", available: true },
      { text: "Long query check (more than 250 characters - Factual content is broken into claims and checked one by one)", available: true },
      { text: "Video fact checks (YouTube, TikTok, Instagram reels links - Factual content is broken into claims and checked one by one)", available: true },
      { text: (
        <>
          <Link href="https://app.facticity.ai/api" target="_blank" rel="noopener noreferrer">
            API access
          </Link> 
          {" (100 Facticity AI tokens)"}
        </>
      ), available: true },
    ],
  };

  const proTier = {
    title: "Essential",
    price: "$9.99/month",
    description: "Ideal for professionals who need higher usage and more tools to ensure accuracy",
    features: [
      { text: "5000 credits (1000 checks) renew daily", available: true },
      { text: "Fact check against web sources only (includes summary, truth label, explanation, sources, disambiguation, bias)", available: true },
      { text: "Long query check (more than 250 characters - Factual content is broken into claims and checked one by one)", available: true },
      { text: "Video fact checks (YouTube, TikTok, Instagram reels links - Factual content is broken into claims and checked one by one)", available: true },
      { text: (
        <>
          <Link href="https://app.facticity.ai/api" target="_blank" rel="noopener noreferrer">
            API access
          </Link> 
          {" (100 Facticity AI tokens)"}
        </>
      ), available: true },
      { text: "Early access to new features", available: true },
    ],
  };

  const entTier = {
    title: "Enterprise",
    price: "Custom",
    description: "Ideal for organizations with custom fact-checking workflows or integration. (Features listed below for Enterprise are under development, subject to change based on client feedback)",
    features: [
      { text: "Everything in Essential", available: true },
      { text: "Custom Integration & API access", available: true },
      { text: "Unlimited Data Integration", available: true },
      { text: "CMS Integration - WordPress", available: true },
      { text: "Brand Protection Bot", available: true },
      { text: "Custom Source Whitelisting & Advanced Filters", available: true },
      { text: "Live fact-check support for events", available: true },
    ],
  };

  const renderFeatures = (features) => (
    <List sx={{ padding: 0 }}>
      {features.map((feature, index) => (
        <ListItem key={index} sx={{ padding: '4px 0', alignItems: 'flex-start' }}>
          <ListItemIcon sx={{ minWidth: '30px', marginTop: '2px' }}>
            {feature.available ? (
              <CheckCircleIcon sx={{ color: '#4caf50', fontSize: '18px' }} />
            ) : (
              <CancelIcon sx={{ color: '#f44336', fontSize: '18px' }} />
            )}
          </ListItemIcon>
          <ListItemText 
            primary={feature.text}
            primaryTypographyProps={{
              fontSize: '14px',
              lineHeight: '1.4',
              color: '#333'
            }}
          />
        </ListItem>
      ))}
    </List>
  );

  const handleSubscribeClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      date: new Date().toLocaleString("en-SG", { timeZone: "Asia/Singapore" })
    };

    fetch(backendUrl+"/submit-contact-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSnackbarMessage("Form submitted successfully, thank you for contacting us, we will get back soon!");
          setSnackbarSeverity("success");
          setShowOverlay(false)        
        } else {
          setSnackbarMessage("Something went wrong. Please try again.");
          setSnackbarSeverity("error");
        }
        setSnackbarOpen(true);
      })
      .catch(() => {
        setSnackbarMessage("Error submitting form. Please check your connection.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleCheckout = async () => {
    if (!user?.email) {
      alert("Kindly Sign in before checkout.");
      return;
    }
  
    try {
      const response = await fetch(`${backendUrl}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" , 'Authorization': `Bearer ${accessToken}`},
        body: JSON.stringify({ user_email: user.email }),
      });
  
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error creating checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <>
      <Grid
        container
        item
        xs={12}
        sx={{
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingY: { xs: 1, sm: 2 },
          paddingX: { xs: 1, sm: 2 },
          backgroundColor: 'transparent',
          position: 'relative',
          borderBottom: isMdUp ? '2px solid #0066FF' : '1px solid #0066FF',
        }}
      >
        <a href="https://facticity.ai" style={{ textDecoration: 'none' }}>
          <img
            src="/facticityailogo-02.png"
            alt="Facticity.AI"
            style={{
              paddingTop: isMdUp ? '2px' : '3px',
              width: 'auto',
              height: isMdUp ? '32px' : '26px',
            }}
          />
        </a>

        {(!isAuthenticated || isMdUp) ? (
          <Box sx={{ position: 'absolute', right: 15 }}>
            <ThirdColumn />
          </Box>
        ) : (
          <div></div>
        )}
      </Grid>

      <Container maxWidth="xl" sx={{ padding: { xs: 2, sm: 3, md: 4 }, minHeight: '100vh' }}>
        <Box mb={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{
              color: '#0066FF',
              borderColor: '#0066FF',
              padding: '8px 16px',
              margin: '8px 0',
              '&:hover': {
                borderColor: '#0052CC',
                backgroundColor: 'rgba(0, 102, 255, 0.04)'
              }
            }}
          >
            Back
          </Button>
        </Box>

        <Typography
          variant="h3"
          component="h1"
          sx={{
            textAlign: 'center',
            marginBottom: 4,
            color: '#333',
            fontWeight: 'bold',
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
          }}
        >
          Choose Your Facticity.AI Plan
        </Typography>

        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex' }}>
            <Card
              sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '2px solid #e0e0e0',
                borderRadius: 2,
                minHeight: '600px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, padding: 3 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    textAlign: 'center',
                    marginBottom: 1,
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '1.5rem'
                  }}
                >
                  {freeTier.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: 'center',
                    marginBottom: 2,
                    color: '#0066FF',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}
                >
                  {freeTier.price}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'center',
                    marginBottom: 3,
                    color: '#666',
                    fontSize: '0.9rem',
                    lineHeight: 1.5
                  }}
                >
                  {freeTier.description}
                </Typography>
                {renderFeatures(freeTier.features)}

              </CardContent>
              <Box sx={{ marginTop: 'auto', padding: '16px' }}>
                  <Button
                    fullWidth
                    variant={isProUser ? "outlined" : "contained"}
                    disabled={!isProUser}
                    sx={{
                      padding: '12px 24px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      backgroundColor: isProUser ? 'transparent' : '#4caf50',
                      color: isProUser ? '#4caf50' : 'white',
                      borderColor: '#4caf50',
                      borderRadius: '8px',
                      margin: '8px 0',
                      '&:hover': {
                        backgroundColor: isProUser ? 'rgba(76, 175, 80, 0.04)' : '#45a049',
                        borderColor: '#45a049'
                      },
                      '&.Mui-disabled': {
                        backgroundColor: '#e0e0e0',
                        color: '#999'
                      }
                    }}
                  >
                    {isProUser ? "Free" : "Current Plan"}
                  </Button>
                </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex' }}>
            <Card
              sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '2px solid #0066FF',
                borderRadius: 2,
                minHeight: '600px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 102, 255, 0.25)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, padding: 3 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    textAlign: 'center',
                    marginBottom: 1,
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '1.5rem'
                  }}
                >
                  {proTier.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: 'center',
                    marginBottom: 2,
                    color: '#0066FF',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}
                >
                  {proTier.price}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'center',
                    marginBottom: 3,
                    color: '#666',
                    fontSize: '0.9rem',
                    lineHeight: 1.5
                  }}
                >
                  {proTier.description}
                </Typography>
                {renderFeatures(proTier.features)}

              </CardContent>
              <Box sx={{ marginTop: 'auto', padding: '16px' }}>
                  {isProUser === null ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                      <Typography>Loading...</Typography>
                    </Box>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        if (isProUser) {
                          window.location.href = "https://billing.stripe.com/p/login/fZe5oh2o32NhdNu3cc";
                        } else {
                          if (!user?.email) {
                            alert("Kindly Sign in before checkout.");
                            return;
                          } else {
                            handleCheckout();
                          }
                        }
                      }}
                      sx={{
                        padding: '12px 24px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        backgroundColor: isProUser ? '#ff9800' : '#0066FF',
                        borderRadius: '8px',
                        margin: '8px 0',
                        '&:hover': {
                          backgroundColor: isProUser ? '#f57c00' : '#0052CC'
                        }
                      }}
                    >
                      {isProUser ? "Manage Subscription" : "Start 7-day free trial"}
                    </Button>
                  )}
                </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex' }}>
            <Card
              sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '2px solid #e0e0e0',
                borderRadius: 2,
                minHeight: '600px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, padding: 3 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    textAlign: 'center',
                    marginBottom: 1,
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '1.5rem'
                  }}
                >
                  {entTier.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: 'center',
                    marginBottom: 2,
                    color: '#0066FF',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}
                >
                  {entTier.price}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'center',
                    marginBottom: 3,
                    color: '#666',
                    fontSize: '0.9rem',
                    lineHeight: 1.5
                  }}
                >
                  {entTier.description}
                </Typography>
                {renderFeatures(entTier.features)}

              </CardContent>
              <Box sx={{ marginTop: 'auto', padding: '16px' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => setShowOverlay(true)}
                    sx={{
                      padding: '12px 24px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      backgroundColor: '#0066FF',
                      borderRadius: '8px',
                      margin: '8px 0',
                      '&:hover': {
                        backgroundColor: '#0052CC'
                      }
                    }}
                  >
                    Book an Intro
                  </Button>
                </Box>
            </Card>
          </Grid>
        </Grid>

        <Modal
          open={showOverlay}
          onClose={() => setShowOverlay(false)}
          aria-labelledby="contact-modal"
          aria-describedby="contact-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: '500px' },
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
              p: 4,
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <IconButton
              onClick={() => setShowOverlay(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: '#666'
              }}
            >
              <CloseIcon />
            </IconButton>

            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                marginBottom: 2,
                color: '#333'
              }}
            >
              Email us at{' '}
              <Link href="mailto:enquiries@aiseer.co" color="primary">
                enquiries@aiseer.co
              </Link>
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                marginBottom: 2,
                color: '#333'
              }}
            >
              Set up a meeting at{' '}
              <Link
                href="https://www.calendly.com/aiseer.co"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                Calendly
              </Link>
            </Typography>

            <Divider sx={{ my: 2 }} />

            {success ? (
              <Typography
                variant="body1"
                sx={{
                  textAlign: 'center',
                  color: '#4caf50',
                  fontWeight: 'bold'
                }}
              >
                Your message has been sent!
              </Typography>
            ) : (
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    mt: 2,
                    padding: '12px 24px',
                    margin: '16px 0',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    backgroundColor: '#0066FF',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: '#0052CC'
                    }
                  }}
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </Button>
              </Box>
            )}
          </Box>
        </Modal>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="coming-soon-modal"
          aria-describedby="coming-soon-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: '400px' },
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
              p: 4
            }}
          >
            <Typography
              variant="h5"
              component="h3"
              sx={{
                textAlign: 'center',
                marginBottom: 2,
                color: '#333',
                fontWeight: 'bold'
              }}
            >
              Coming Soon
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                marginBottom: 2,
                color: '#666'
              }}
            >
              Our payment gateway is currently being integrated and will be available soon.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                marginBottom: 3,
                color: '#666'
              }}
            >
              Stay tuned! In the meantime, enjoy your Pro Subscription Free Trial.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={handleCloseModal}
              sx={{
                backgroundColor: '#0066FF',
                padding: '12px 24px',
                margin: '16px 0',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#0052CC'
                }
              }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default Subscription;