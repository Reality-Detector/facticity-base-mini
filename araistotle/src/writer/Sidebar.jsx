// Sidebar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Explore as ExploreIcon,
  Api as ApiIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import Subscription from '@mui/icons-material/AddCard';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, handleCloseSidebar }) => {
  const sidebarWidth = 250; // Sidebar width

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={handleCloseSidebar}
      sx={{
        '& .MuiDrawer-paper': {
          width: sidebarWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* Menu Items */}
        <List>
          <ListItemButton component={Link} to="/discover">
            <ListItemIcon>
              <ExploreIcon />
            </ListItemIcon>
            <ListItemText primary="Discover" />
          </ListItemButton>

          <ListItemButton component={Link} to="/word-addin">
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="MS Word Add-in" />
          </ListItemButton>

          <ListItemButton component={Link} to="/api">
            <ListItemIcon>
              <ApiIcon />
            </ListItemIcon>
            <ListItemText primary="API" />
          </ListItemButton>

          <ListItemButton component={Link} to="/subscription">
            <ListItemIcon>
              <Subscription />
            </ListItemIcon>
            <ListItemText primary="Subscription" />
          </ListItemButton>

          <ListItemButton component={Link} to="/settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleCloseSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
