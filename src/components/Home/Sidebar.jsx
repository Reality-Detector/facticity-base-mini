// Sidebar.jsx
import PropTypes from 'prop-types';
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Chat as ChatIcon,
  Explore as ExploreIcon,
  Api as ApiIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  ArrowBackOutlined,
} from '@mui/icons-material';
import Subscription from '@mui/icons-material/AddCard';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../AppProvider';
import ConversationItem from './conversationComponent';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import React, { useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import WebsiteIcon from '@mui/icons-material/Language';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ArticleIcon from '@mui/icons-material/Newspaper';
import PublicIcon from '@mui/icons-material/Public';
import HistoryIcon from "@mui/icons-material/History";
import Redeem from '@mui/icons-material/Redeem';
import { ArrowBack } from '@mui/icons-material';
import { useTheme } from "@mui/material/styles";

const Sidebar = ({
  isOpen,
  handleCloseSidebar,
  toggleSidebar,
  menuFontSize = '16px',
  conversationFontSize = '10px',
  createConversation,
  isMdUp
}) => {
  const {
    version,
    setVersion,
    currentConversation,
    conversations,
    setConversations,
    setCurrentConversation,
    queries,
    setQueries,
    ids,
    setIds,
    idHistory,
    setIdHistory,
    setMode,
    setLink,
    errorDisplay,
    setErrorDisplay,
    setIsSearchMoved,
    setNewSearch,
  } = useAppContext();

  const handleConversationSelect = (conversation) => {
    setErrorDisplay("");
    toggleSidebar()
    setNewSearch(false);
    if (currentConversation !== conversation.id) {
      setQueries([]); // Reset queries or any other state related to conversations if needed
      setIds([]);
      setIdHistory({});
      setCurrentConversation(conversation.id);
    }
  };

  const [showHistory, setShowHistory] = useState(false); 
  const theme = useTheme();

  // Colors, shadows, and gradients for modern look
  const bgGradient = "linear-gradient(135deg, #F4F7FE 0%, #EAF1FB 100%)";
  const sidebarBorder = "1px solid #e1e8f0";
  const accent = "rgba(56, 121, 240, 0.08)";
  const activeColor = "#1451f2";

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={handleCloseSidebar}
      variant='temporary'
      ModalProps={{ keepMounted: true }}
      sx={{
        zIndex: 200000,
        "& .MuiDrawer-paper": {
          width: isMdUp ? 264 : 240,
          background: bgGradient,
          boxShadow: "0 6px 24px 0 rgba(22,43,84,0.07), 0 1.5px 4px 0 rgba(22,43,84,0.05)",
          borderRight: sidebarBorder,
          p: 0,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflowY: "auto",
        },
      }}
    >
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        px: 1.5,
        pt: 1.5,
      }}>
        {/* Top Row: Logo + Collapse */}
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          mb: 1.5,
          minHeight: 54, 
        }}>
          <Box sx={{ flex: 1, pl: 0.5 }}>
            <a href="https://facticity.ai" style={{ textDecoration: "none" }}>
              <img
                src="/facticityailogo-03.png"
                alt="Facticity.AI"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#fff",
                  boxShadow: "0 0 0 3px #e8eef7",
                  transition: "box-shadow 0.2s",
                }}
              />
            </a>
          </Box>
          <IconButton
            onClick={toggleSidebar}
            size="small"
            sx={{
              ml: 0.5,
              color: activeColor,
              background: accent,
              borderRadius: "12px",
              boxShadow: "none",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "#d2e3fa",
                transform: "scale(1.05)",
                boxShadow: "0 2px 8px rgba(20,81,242,0.2)",
              }
            }}
          >
            <ArrowBack />
          </IconButton>
        </Box>

        {/* Section Divider */}
        <Divider sx={{ mb: 1, opacity: 0.45 }} />

        {/* Main Menu or History */}
        {!showHistory ? (
          <>
            <List disablePadding>
              <Box 
                sx={{ 
                  mb: 0.5,
                  "&:hover .description-text": {
                    opacity: 1,
                    maxHeight: '20px',
                    marginTop: '4px'
                  },
                  "&:hover .menu-button": {
                    transform: "translateY(-2px)"
                  }
                }}
              >
                <ListItemButton 
                  className="menu-button"
                  component={Link} 
                  to="https://facticity.ai" 
                  target="_blank"
                  sx={{
                    borderRadius: 2, 
                    my: 0,
                    transition: "all 0.2s ease",
                    "&:hover": { 
                      background: accent,
                      transform: "translateX(2px) translateY(-2px)",
                      boxShadow: "0 2px 8px rgba(56,121,240,0.1)",
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PublicIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Facticity.AI Main Page" 
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: menuFontSize
                    }}
                  />
                </ListItemButton>
                <Typography 
                  className="description-text"
                  sx={{ 
                    fontSize: '11px', 
                    color: 'grey.600', 
                    pl: 6, 
                    opacity: 0,
                    maxHeight: 0,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    pointerEvents: 'none',
                    fontStyle: 'italic',
                    marginTop: 0
                  }}
                >
                  Return to the main Facticity landing page
                </Typography>
              </Box>

              <Box 
                sx={{ 
                  mb: 0.5,
                  "&:hover .description-text": {
                    opacity: 1,
                    maxHeight: '20px',
                    marginTop: '4px'
                  },
                  "&:hover .menu-button": {
                    transform: "translateY(-2px)"
                  }
                }}
              >
                <ListItemButton 
                  className="menu-button"
                  disabled
                  sx={{
                    borderRadius: 2, 
                    my: 0,
                    opacity: 0.5,
                    cursor: 'not-allowed',
                    transition: "all 0.2s ease",
                    "&:hover": { 
                      background: 'transparent',
                      transform: "translateY(-2px)",
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ExploreIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Discover" primaryTypographyProps={{ fontWeight: 500, fontSize: menuFontSize }} />
                </ListItemButton>
                <Typography 
                  className="description-text"
                  sx={{ 
                    fontSize: '11px', 
                    color: 'grey.600', 
                    pl: 6, 
                    opacity: 0,
                    maxHeight: 0,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    pointerEvents: 'none',
                    fontStyle: 'italic',
                    marginTop: 0
                  }}
                >
                  Coming Soon - Stay tuned for new features!
                </Typography>
              </Box>

              <Box 
                sx={{ 
                  mb: 0.5,
                  "&:hover .description-text": {
                    opacity: 1,
                    maxHeight: '20px',
                    marginTop: '4px'
                  },
                  "&:hover .menu-button": {
                    transform: "translateY(-2px)"
                  }
                }}
              >
                <ListItemButton 
                  className="menu-button"
                  component={Link} 
                  to="/writer"
                  sx={{
                    borderRadius: 2, 
                    my: 0,
                    transition: "all 0.2s ease",
                    "&:hover": { 
                      background: accent,
                      transform: "translateX(2px) translateY(-2px)",
                      boxShadow: "0 2px 8px rgba(56,121,240,0.1)",
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <DescriptionIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Writer" primaryTypographyProps={{ fontWeight: 500, fontSize: menuFontSize }} />
                </ListItemButton>
                <Typography 
                  className="description-text"
                  sx={{ 
                    fontSize: '11px', 
                    color: 'grey.600', 
                    pl: 6, 
                    opacity: 0,
                    maxHeight: 0,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    pointerEvents: 'none',
                    fontStyle: 'italic',
                    marginTop: 0
                  }}
                >
                  Try our AI-powered writing assistant now!
                </Typography>
              </Box>

              <Box 
                sx={{ 
                  mb: 0.5,
                  "&:hover .description-text": {
                    opacity: 1,
                    maxHeight: '20px',
                    marginTop: '4px'
                  },
                  "&:hover .menu-button": {
                    transform: "translateY(-2px)"
                  }
                }}
              >
                <ListItemButton 
                  className="menu-button"
                  component={Link}
                  to="/rewards"
                  sx={{
                    borderRadius: 2, 
                    my: 0,
                    transition: "all 0.2s ease",
                    "&:hover": { 
                      background: accent,
                      transform: "translateX(2px) translateY(-2px)",
                      boxShadow: "0 2px 8px rgba(56,121,240,0.1)",
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Redeem fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Points Breakdown" primaryTypographyProps={{ fontWeight: 500, fontSize: menuFontSize }} />
                </ListItemButton>
                <Typography 
                  className="description-text"
                  sx={{ 
                    fontSize: '11px', 
                    color: 'grey.600', 
                    pl: 6, 
                    opacity: 0,
                    maxHeight: 0,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    pointerEvents: 'none',
                    fontStyle: 'italic',
                    marginTop: 0
                  }}
                >
                  View your points and rewards breakdown
                </Typography>
              </Box>

              <Box 
                sx={{ 
                  mb: 0.5,
                  "&:hover .description-text": {
                    opacity: 1,
                    maxHeight: '20px',
                    marginTop: '4px'
                  },
                  "&:hover .menu-button": {
                    transform: "translateY(-2px)"
                  }
                }}
              >
                <ListItemButton 
                  className="menu-button"
                  onClick={(e) => { e.stopPropagation(); createConversation(); }}
                  sx={{
                    borderRadius: 2, 
                    my: 0,
                    transition: "all 0.2s ease",
                    "&:hover": { 
                      background: accent,
                      transform: "translateX(2px) translateY(-2px)",
                      boxShadow: "0 2px 8px rgba(56,121,240,0.1)",
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <EditNoteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="New Chat" primaryTypographyProps={{ fontWeight: 500, fontSize: menuFontSize }} />
                </ListItemButton>
                <Typography 
                  className="description-text"
                  sx={{ 
                    fontSize: '11px', 
                    color: 'grey.600', 
                    pl: 6, 
                    opacity: 0,
                    maxHeight: 0,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    pointerEvents: 'none',
                    fontStyle: 'italic',
                    marginTop: 0
                  }}
                >
                  Start a new conversation
                </Typography>
              </Box>

              <Box 
                sx={{ 
                  mb: 0.5,
                  "&:hover .description-text": {
                    opacity: 1,
                    maxHeight: '20px',
                    marginTop: '4px'
                  },
                  "&:hover .menu-button": {
                    transform: "translateY(-2px)"
                  }
                }}
              >
                <ListItemButton
                  className="menu-button"
                  onClick={() => setShowHistory(true)}
                  sx={{
                    borderRadius: 2, 
                    my: 0,
                    transition: "all 0.2s ease",
                    "&:hover": { 
                      background: accent,
                      transform: "translateX(2px) translateY(-2px)",
                      boxShadow: "0 2px 8px rgba(56,121,240,0.1)",
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <HistoryIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="View History" primaryTypographyProps={{ fontWeight: 500, fontSize: menuFontSize }} />
                </ListItemButton>
                <Typography 
                  className="description-text"
                  sx={{ 
                    fontSize: '11px', 
                    color: 'grey.600', 
                    pl: 6, 
                    opacity: 0,
                    maxHeight: 0,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    pointerEvents: 'none',
                    fontStyle: 'italic',
                    marginTop: 0
                  }}
                >
                  Browse your conversation history
                </Typography>
              </Box>
            </List>
          </>
        ) : (
          <Box sx={{
            flexGrow: 1,
            overflowY: "auto",
            height: "calc(100vh - 120px)",
            pr: 0.5,
            pt: 1
          }}>
            <List sx={{ position: "sticky", top: 0, background: bgGradient, zIndex: 200001, mb: 1 }}>
              <ListItemButton
                onClick={() => setShowHistory(false)}
                sx={{
                  background: accent,
                  borderRadius: 2,
                  mb: 1,
                  transition: "all 0.2s ease",
                  "&:hover": { 
                    background: "#c9daf9",
                    transform: "translateX(-2px)",
                    boxShadow: "0 2px 8px rgba(56,121,240,0.15)",
                  },
                  pl: 2
                }}
              >
                <ListItemIcon>
                  <ArrowBackOutlined sx={{ color: activeColor, fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Close History"
                  primaryTypographyProps={{ fontWeight: 600, color: activeColor, fontSize: 14 }}
                />
              </ListItemButton>
            </List>
            <List sx={{ overflowY: "auto", maxHeight: "calc(100vh - 180px)", pr: 0.5 }}>
              {conversations.slice().reverse().map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  currentConversation={currentConversation}
                  handleConversationSelect={handleConversationSelect}
                  conversationItemStyle={{
                    fontSize: conversationFontSize,
                    paddingLeft: '24px',
                    wordBreak: 'break-all',
                    overflowWrap: 'break-word',
                    margin: '4px 0',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    transition: "all 0.2s ease",
                    '&.Mui-selected': {
                      backgroundColor: '#F1F3FE',
                      '&:hover': {
                        backgroundColor: '#F1F3FE',
                      },
                    },
                    '&:hover': {
                      transform: "translateX(2px)",
                      boxShadow: "0 2px 8px rgba(56,121,240,0.1)",
                    },
                  }}
                />
              ))}
            </List>
          </Box>
        )}

        {/* Spacer for sticky footer */}
        <Box sx={{ flex: 1 }} />

        {/* Footer: Settings and Socials */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mt: "auto",
            mb: 0.5,
            pb: 2,
            pt: 2,
            px: 0.5,
            background: "rgba(246,248,252,0.96)",
            borderRadius: 3,
            boxShadow: "0 0.5px 0 0 #e7eaf5",
          }}
        >
          <Box 
            sx={{ 
              mb: 0.5,
              "&:hover .description-text": {
                opacity: 1,
                maxHeight: '20px',
                marginTop: '4px'
              },
              "&:hover .menu-button": {
                transform: "translateY(-2px)"
              }
            }}
          >
            <ListItemButton
              className="menu-button"
              component={Link}
              to="/settings"
              sx={{
                borderRadius: 2,
                background: "rgba(20,81,242,0.04)",
                my: 0,
                transition: "all 0.2s ease",
                "&:hover": { 
                  background: accent,
                  transform: "translateX(2px) translateY(-2px)",
                  boxShadow: "0 2px 8px rgba(56,121,240,0.1)",
                },
                minHeight: 48,
                px: 2,
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <SettingsIcon sx={{ fontSize: 22, color: "#2059d1" }} />
              </ListItemIcon>
              <ListItemText 
                primary="Settings" 
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "1rem",
                }} 
              />
            </ListItemButton>
            <Typography 
              className="description-text"
              sx={{ 
                fontSize: '11px', 
                color: 'grey.600', 
                pl: 6, 
                opacity: 0,
                maxHeight: 0,
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                pointerEvents: 'none',
                fontStyle: 'italic',
                marginTop: 0
              }}
            >
              Manage your account settings and preferences
            </Typography>
          </Box>
          <Divider sx={{ my: 1, opacity: 0.18 }} />
          <Box sx={{
            textAlign: "center",
            mt: 0,
            [theme.breakpoints.down("sm")]: { mt: 0.5 },
          }}>
            <Typography sx={{ color: "grey.700", fontWeight: 600, fontSize: 13 }}>
              <a href="https://www.aiseer.co" target="_blank" style={{ color: "inherit", textDecoration: "none" }}>
                AI Seer
              </a>
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1.5,
                flexWrap: "wrap",
                mt: 1,
                [theme.breakpoints.down("sm")]: { gap: 1 },
              }}
            >
              <a href="https://www.aiseer.co" target="_blank" rel="noopener noreferrer">
                <WebsiteIcon sx={{ 
                  color: "grey.600", 
                  fontSize: 20,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: activeColor,
                    transform: "scale(1.1)",
                  }
                }} />
              </a>
              <a href="https://www.linkedin.com/company/aiseer" target="_blank" rel="noopener noreferrer">
                <LinkedInIcon sx={{ 
                  color: "grey.600", 
                  fontSize: 20,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: activeColor,
                    transform: "scale(1.1)",
                  }
                }} />
              </a>
              <a href="https://x.com/facticityai" target="_blank" rel="noopener noreferrer">
                <XIcon sx={{ 
                  color: "grey.600", 
                  fontSize: 20,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: activeColor,
                    transform: "scale(1.1)",
                  }
                }} />
              </a>
              <a href="https://www.instagram.com/facticity.ai/" target="_blank" rel="noopener noreferrer">
                <InstagramIcon sx={{ 
                  color: "grey.600", 
                  fontSize: 20,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: activeColor,
                    transform: "scale(1.1)",
                  }
                }} />
              </a>
              <a href="https://www.youtube.com/@facticityai" target="_blank" rel="noopener noreferrer">
                <YouTubeIcon sx={{ 
                  color: "grey.600", 
                  fontSize: 20,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: activeColor,
                    transform: "scale(1.1)",
                  }
                }} />
              </a>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleCloseSidebar: PropTypes.func.isRequired,
  menuFontSize: PropTypes.string,
  conversationFontSize: PropTypes.string,
  createConversation: PropTypes.func.isRequired,
};

export default Sidebar;
