// CorrectionOptions.jsx
import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';

const CorrectionOptions = ({ corrections, onSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (correction) => {
    // Extract the first value from the correction object
    const selectedCorrection = Object.values(correction)[0];
    onSelect(selectedCorrection);
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={handleClick}
        sx={{ mt: 1 }}
      >
        Correct
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {corrections.map((correction, index) => {
          const correctionText = Object.values(correction)[0]; // Get the first value
          return (
            <MenuItem
              key={index}
              onClick={() => handleSelect(correction)}
            >
              {correctionText}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default CorrectionOptions;
