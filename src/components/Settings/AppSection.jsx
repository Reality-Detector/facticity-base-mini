import React, { useState } from 'react';
import { ListItem, ListItemText, Collapse, Card, CardContent, Typography, FormControlLabel, ThemeProvider, Button, Box } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Android12Switch from '../Switches/AndroidSwitch';
import { useAppContext } from '../../AppProvider';
import { createTheme } from '@mui/material/styles';

const AppSection = ({ open, onToggle}) => {
  const [openColorScheme, setOpenColorScheme] = useState(false);
  const { 
    skipDisambiguation, 
    setSkipDisambiguation, 
    showRewardPopup, 
    setShowRewardPopup,
    resetRewardPopupPreference
  } = useAppContext();
  
  const handleToggleColorScheme = () => {
    setOpenColorScheme((prevOpen) => !prevOpen);
  };

  const handleToggleSkipDisambiguation = (event) => {
    setSkipDisambiguation(event.target.checked);
  };

  const handleToggleShowRewardPopup = (event) => {
    setShowRewardPopup(event.target.checked);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2', // Customize as desired
      },
    },
  });


  return (
    <>
      <ListItem button onClick={onToggle}>
        <ListItemText primary="App" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Card variant="outlined" sx={{ mt: 1, mb: 1 }}>
          <CardContent>
            {/* <ListItem button>
              <ListItemText primary="Language" />
            </ListItem>
            <ListItem button onClick={handleToggleColorScheme}>
              <ListItemText primary="Colour Scheme" />
              {openColorScheme ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openColorScheme} timeout="auto" unmountOnExit>
              <Card variant="outlined" sx={{ mt: 1, mb: 1 }}>
                <CardContent>
                  <Typography>Light</Typography>
                  <Typography>Dark</Typography>
                  <Typography>System</Typography>
                </CardContent>
              </Card>
            </Collapse> */}
            
            {/* Add the Android12Switch to control skipDisambiguation */}
            <ThemeProvider theme={theme}>
              <FormControlLabel
                control={
                  <Android12Switch 
                    checked={skipDisambiguation}
                    onChange={handleToggleSkipDisambiguation}
                  />
                }
                label={"Skip disambiguation"}
              />
              
              {/* Add the Android12Switch to control showRewardPopup */}
              <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                <FormControlLabel
                  control={
                    <Android12Switch 
                      checked={showRewardPopup}
                      onChange={handleToggleShowRewardPopup}
                    />
                  }
                  label={
                    <div>
                      <Typography variant="body2">Show reward popup after fact checks</Typography>
                      <Typography variant="caption" style={{ color: '#666' }}>
                        Note: If you've clicked "Don't Show Again" on the popup, this toggle won't re-enable it
                      </Typography>
                    </div>
                  }
                />
                <Button 
                  size="small" 
                  onClick={resetRewardPopupPreference}
                  sx={{ 
                    alignSelf: 'flex-start', 
                    ml: 4, 
                    mt: 0.5,
                    color: 'primary.main', 
                    textTransform: 'none' 
                  }}
                >
                  Reset "Don't Show Again" preference
                </Button>
              </Box>
            </ThemeProvider>
          </CardContent>
        </Card>
      </Collapse>
    </>
  );
};

export default AppSection;
