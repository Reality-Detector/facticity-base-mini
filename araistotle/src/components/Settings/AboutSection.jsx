import React from 'react';
import { ListItem, ListItemText, Collapse, Card, CardContent } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const AboutSection = ({ open, onToggle }) => {
  return (
    <>
      <ListItem button onClick={onToggle}>
        <ListItemText primary="About" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Card variant="outlined" sx={{ mt: 1, mb: 1 }}>
          <CardContent>
            <ListItem button>
              <ListItemText primary="FAQ" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Terms of Use" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Privacy Policy" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Company" />
            </ListItem>
          </CardContent>
        </Card>
      </Collapse>
    </>
  );
};

export default AboutSection;
