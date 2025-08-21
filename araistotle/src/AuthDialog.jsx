import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const AuthDialog = ({ open, onClose, onLogin }) => (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Authentication Required</DialogTitle>
      <DialogContent>
        <Typography>Please sign in to continue.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onLogin} variant="contained" color="primary">Sign In</Button>
      </DialogActions>
    </Dialog>
  );

  export default AuthDialog;