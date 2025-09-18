'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  Divider,
  Link,
  CircularProgress,
  Chip,
  Avatar,
  IconButton
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Launch as LaunchIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useAccount } from 'wagmi';
import facticityLogo from '@/assets/facticity-logo.png';

const SubscriptionConfirmation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address } = useAccount();
  
  const [webhookStatus, setWebhookStatus] = useState('pending'); // pending, success, error
  const [isProcessing, setIsProcessing] = useState(true);

  // Extract data from navigation state
  const txHash = searchParams.get('txHash');
  const plan = searchParams.get('plan');
  const amount = searchParams.get('amount');
  const usdAmount = searchParams.get('usdAmount');

  // Redirect if no transaction data
  useEffect(() => {
    if (!txHash || !plan) {
      router.push('/subscriptions');
    }
  }, [txHash, plan, router]);

  // Trigger backend webhook
  useEffect(() => {
    const triggerWebhook = async () => {
      if (!txHash || !address) return;

      try {
        setIsProcessing(true);
        
        // Call backend webhook to assign subscriber role
        const response = await fetch('/api/subscription/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            txHash,
            userAddress: address,
            planType: plan,
            tokenAmount: amount,
            usdAmount,
            timestamp: Date.now()
          }),
        });

        if (response.ok) {
          setWebhookStatus('success');
        } else {
          setWebhookStatus('error');
        }
      } catch (error) {
        console.error('Webhook error:', error);
        setWebhookStatus('error');
      } finally {
        setIsProcessing(false);
      }
    };

    // Delay webhook call to ensure transaction is confirmed
    const timer = setTimeout(triggerWebhook, 3000);
    return () => clearTimeout(timer);
  }, [txHash, address, plan, amount, usdAmount]);

  const getExplorerUrl = (hash) => {
    // Update with correct explorer URL for your network
    return `https://sepolia.basescan.org/tx/${hash}`;
  };

  const getPlanDisplayName = (planId) => {
    switch (planId) {
      case 'essential':
        return 'Essential Plan';
      case 'enterprise':
        return 'Enterprise Plan';
      default:
        return 'Subscription Plan';
    }
  };

  const generateReceiptNumber = () => {
    const timestamp = Date.now().toString();
    return `${timestamp.slice(-4)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  };

  const generateInvoiceNumber = () => {
    const prefix = 'FAC';
    const timestamp = Date.now().toString();
    return `${prefix}${timestamp.slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  };

  if (!txHash || !plan) {
    return null; // Will redirect in useEffect
  }

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Box>
        {/* Company Header */}
        <Box display="flex" alignItems="left" gap={2} mb={4}>
          <img 
            src={facticityLogo} 
            alt="Facticity"
            style={{ 
              width: 250, 
              height: 48,
              objectFit: 'cover'
            }}
          />
        </Box>

        {/* Receipt Card */}
        <Card 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Receipt Header */}
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Receipt from Facticity
            </Typography>
            
            {/* Amount */}
            <Typography 
              variant="h3" 
              fontWeight="700" 
              color="#333" 
              sx={{ mb: 1 }}
            >
              ${usdAmount?.toFixed(2)}
            </Typography>
            
            {/* Date */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Paid {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Download Options */}
            {/* <Box display="flex" gap={3} mb={4}>
              <Button
                variant="text"
                startIcon={<DownloadIcon />}
                sx={{ 
                  color: '#666',
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 400
                }}
              >
                Download invoice
              </Button>
              <Button
                variant="text"
                startIcon={<ReceiptIcon />}
                sx={{ 
                  color: '#666',
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 400
                }}
              >
                Download receipt
              </Button>
            </Box> */}

            {/* Receipt Details */}
            <Box sx={{ '& > *': { mb: 2 } }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Amount
                </Typography>
                <Typography variant="body2" fontWeight="500">
                  {amount?.toFixed(2)}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Payment method
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight="500">
                    FACY Token
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Plan
                </Typography>
                <Typography variant="body2" fontWeight="500">
                  {plan.toUpperCase()}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Chain
                </Typography>
                <Typography variant="body2" fontWeight="500">
                  Base Sepolia
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body2" fontWeight="500">
                  {address.slice(0, 6) + '...' + address.slice(-4)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Success Status */}
        {webhookStatus === 'success' && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 4,
              borderRadius: 2,
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <CheckIcon />
              <Box>
                <Typography variant="body2" fontWeight="500">
                  Subscription Activated Successfully
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You now have access to all {getPlanDisplayName(plan)} features
                </Typography>
              </Box>
            </Box>
          </Alert>
        )}

        {isProcessing && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 4,
              borderRadius: 2,
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <CircularProgress size={20} />
              <Typography variant="body2">
                Activating your subscription features...
              </Typography>
            </Box>
          </Alert>
        )}

        {webhookStatus === 'error' && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 4,
              borderRadius: 2,
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Typography variant="body2">
              Payment confirmed. If features aren't available in 10 minutes, contact support.
            </Typography>
          </Alert>
        )}

        {/* Transaction Hash */}
        <Box 
          sx={{ 
            p: 3, 
            bgcolor: '#f8f9fa', 
            borderRadius: 2, 
            mb: 4,
            border: '1px solid #e9ecef'
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Payment Transaction Hash
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography 
              variant="body2" 
              fontFamily="monospace" 
              sx={{ wordBreak: 'break-all' }}
            >
              {txHash}
            </Typography>
            <IconButton
              size="small"
              href={getExplorerUrl(txHash)}
              target="_blank"
              rel="noopener"
              component="a"
            >
              <LaunchIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => router.push('/')}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              px: 4,
              bgcolor: '#0066FF',
              '&:hover': {
                bgcolor: '#0052CC'
              }
            }}
          >
            Start Using Facticity
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => router.push('/manage-subscription')}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              px: 4,
              borderColor: '#0066FF',
              color: '#0066FF',
              '&:hover': {
                borderColor: '#0052CC',
                color: '#0052CC',
                bgcolor: 'rgba(0, 102, 255, 0.04)'
              }
            }}
          >
            Manage Subscription
          </Button>
        </Box>

        {/* Support Note */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          textAlign="center"
          sx={{ mt: 4 }}
        >
          Need help?{' '}
          <Link 
            href="mailto:support@facticity.com"
            sx={{ textDecoration: 'none', fontWeight: 500 }}
          >
            Contact Support
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default SubscriptionConfirmation;