'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
  IconButton
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Star as StarIcon,
  Business as BusinessIcon,
  AccountCircle as FreeIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const SubscriptionPlans = () => {
  const router = useRouter();

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$0',
      originalPrice: null,
      tagline: 'Ideal for individuals who want to verify claims',
      icon: <FreeIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
      features: [
        '15 credits (3 fact-checks) renew daily',
        'Fact check against web sources (includes summary, truth label, explanation, sources, disambiguation, bias)',
        'Long query check (more than 250 characters - Factual content is broken into claims and checked one by one)',
        'Video fact checks (YouTube, TikTok, Instagram reels links - Factual content is broken into claims and checked one by one)',
        'API access (100 Facticity AI tokens)'
      ],
      buttonText: 'CURRENT PLAN',
      buttonColor: 'inherit',
      popular: false,
      current: true,
      action: () => {}
    },
    {
      id: 'essential',
      name: 'Essential',
      price: '$9.99',
      originalPrice: null,
      tagline: 'Ideal for professionals who need higher usage and more tools to ensure accuracy',
      icon: <StarIcon sx={{ fontSize: 40, color: '#FF9800' }} />,
      features: [
        '5000 credits (1000 checks) renew daily',
        'Fact check against web sources only (includes summary, truth label, explanation, sources, disambiguation, bias)',
        'Long query check (more than 250 characters - Factual content is broken into claims and checked one by one)',
        'Video fact checks (YouTube, TikTok, Instagram reels links - Factual content is broken into claims and checked one by one)',
        'API access (100 Facticity AI tokens)',
        'Early access to new features'
      ],
      buttonText: 'BUY WITH $FACY (20% DISCOUNT)',
      buttonColor: 'primary',
      popular: true,
      current: false,
      action: () => router.push('/subscription/payment?plan=essential')
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      originalPrice: null,
      tagline: 'Ideal for organizations with custom fact-checking workflows or integration. (Features listed below for Enterprise are under development, subject to change based on client feedback)',
      icon: <BusinessIcon sx={{ fontSize: 40, color: '#9C27B0' }} />,
      features: [
        'Everything in Essential',
        'Custom Integration & API access',
        'Unlimited Data Integration',
        'CMS Integration - WordPress',
        'Brand Protection Bot',
        'Custom Source Whitelisting & Advanced Filters',
        'Live fact-check support for events'
      ],
      buttonText: 'BOOK AN INTRO',
      buttonColor: 'primary',
      popular: false,
      current: false,
      action: () => window.open('mailto:sales@facticity.com?subject=Enterprise Plan Inquiry', '_blank')
    }
  ];

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box mb={4}>
          <IconButton 
            onClick={() => router.back()}
            sx={{ mb: 2, color: '#1976d2', p: 0 }}
          >
            <ArrowBackIcon sx={{ mr: 1 }} />
            <Typography variant="body2" sx={{ color: '#1976d2' }}>
              BACK
            </Typography>
          </IconButton>
          
          <Typography 
            variant="h4" 
            component="h1" 
            textAlign="center" 
            fontWeight="600"
            color="#333"
            mb={4}
          >
            Choose Your Facticity.AI Plan
          </Typography>
        </Box>

        {/* Plans Grid */}
        <Grid container spacing={3} justifyContent="center" maxWidth="1400px" sx={{ mx: 'auto' }}>
          {plans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: plan.popular ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  borderRadius: 2,
                  boxShadow: plan.popular ? '0 4px 20px rgba(25, 118, 210, 0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
                  maxWidth: '420px',
                  mx: 'auto',
                  minHeight: '600px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: plan.popular ? '0 8px 30px rgba(25, 118, 210, 0.25)' : '0 8px 25px rgba(0,0,0,0.15)',
                    border: plan.popular ? '2px solid #1976d2' : '2px solid #1976d2'
                  }
                }}
              >
                {/* Popular Badge */}
                {/* {plan.popular && (
                  <Chip
                    label="Most Popular"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }}
                  />
                )} */}

                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4, pb: 3, px: 4 }}>
                  {/* Plan Icon */}
                  {/* <Box mb={2}>
                    {plan.icon}
                  </Box> */}

                  {/* Plan Name */}
                  <Typography variant="h6" component="h2" gutterBottom fontWeight="600" color="#333" sx={{ mb: 1 }}>
                    {plan.name}
                  </Typography>

                  {/* Pricing */}
                  <Box mb={2}>
                    <Typography variant="h6" component="span" fontWeight="bold" color="#0066FF">
                      {plan.price}{plan.price !== 'Custom' && '/month'}
                    </Typography>
                  </Box>

                  {/* Plan Tagline */}
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    mb={4}
                    sx={{ fontStyle: 'italic', minHeight: '50px', fontSize: '0.9rem' }}
                  >
                    {plan.tagline}
                  </Typography>

                  {/* Features List */}
                  <List dense sx={{ textAlign: 'left', p: 0 }}>
                    {plan.features.map((feature, index) => (
                      <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <CheckIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{ 
                            variant: 'body2',
                            sx: { fontSize: '0.9rem', lineHeight: 1.4 }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>

                {/* Action Button */}
                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button
                    fullWidth
                    variant={plan.current ? 'outlined' : 'contained'}
                    color={plan.buttonColor}
                    size="large"
                    onClick={plan.action}
                    disabled={plan.current}
                    sx={{
                      py: 1.5,
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      borderRadius: 1,
                      ...(plan.current && {
                        bgcolor: '#e0e0e0',
                        color: '#666',
                        border: '1px solid #e0e0e0',
                        '&:hover': {
                          bgcolor: '#e0e0e0',
                          border: '1px solid #e0e0e0'
                        }
                      }),
                      ...(!plan.current && {
                        bgcolor: '#0066FF',
                        color: 'white',
                        border: '1px solid #0066FF',
                        '&:hover': {
                          bgcolor: '#0052CC',
                          border: '1px solid #0052CC'
                        }
                      })
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Additional Info */}
        {/* <Paper sx={{ mt: 4, p: 3, textAlign: 'center', bgcolor: 'white', maxWidth: '600px', mx: 'auto' }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>
            All plans include
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            • 30-day money-back guarantee • Cancel anytime • Secure payments with FACY tokens
          </Typography>
        </Paper> */}
      </Container>
    </Box>
  );
};

export default SubscriptionPlans;