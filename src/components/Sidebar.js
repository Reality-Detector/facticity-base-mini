import React from 'react';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';

const Sidebar = ({ isOpen }) => {
  const sidebarWidth = 250; // Full width of the sidebar
  const visibleClosedWidth = 40; // Width of the visible portion when closed

  const sidebarStyle = {
    position: 'absolute',
    top: 0,
    left: isOpen ? '0' : `-${sidebarWidth - visibleClosedWidth}px`, // Show small portion when closed
    width: `${sidebarWidth}px`,
    height: '100%',
    backgroundColor: '#FFF',
    boxShadow: '1px 0px 1px rgba(0,0,0,0.5)',
    transition: 'left 0.3s ease',
    zIndex: 900,
    borderRadius: '20px',
  };

  return (
    <div style={sidebarStyle}>
        <div style = {{marginTop: '50px'}}>
      <List>
        <ListItemButton >
          <ListItemText primary="Menu Item 1" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Menu Item 2" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Menu Item 3" />
        </ListItemButton>
      </List>
      </div>
    </div>
  );
};

export default Sidebar;
