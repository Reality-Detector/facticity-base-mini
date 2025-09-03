import React from 'react';
import { Grid, Typography } from '@mui/material';

const DetailItem = ({ title, detail }) => (
  <Grid item xs={12} sx={{ pb: 1 }}>
    <Typography variant="body1" color="textSecondary" component="span">{title}: </Typography>
    <Typography variant="body1" component="span">{detail}</Typography>
  </Grid>
);

export default DetailItem;
