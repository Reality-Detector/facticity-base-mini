'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Grid
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  AccountBalanceWallet as WalletIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { usePrivy } from '@privy-io/react-auth';
import usePaymentVault from '@/hooks/usePaymentVault';
import useTokenApproval from '@/hooks/useTokenApproval';
import facticityLogo from '@/assets/facticity-logo.png';

const FACY_TOKEN_ADDRESS = '0x58Da810eB5d9C5a6E319cF8ca0667591B82E840E'; // FACY token address
const PAYMENT_VAULT_ADDRESS = '0x3E0911d6C0fa146C3006a2bc186c815fcF566243'; // Base Sepolia testnet
const ESSENTIAL_PLAN_ID = 1; // Assuming Essential plan has ID 1

const SubscriptionPayment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, authenticated, connectWallet, ready } = usePrivy();
  
  // Extract wallet address and connection status from Privy
  const address = user?.wallet?.address;
  const isConnected = authenticated && !!address;

  const [activeStep, setActiveStep] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0.1);
  const [requiredTokens, setRequiredTokens] = useState(0);
  const [isCalculating, setIsCalculating] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  const planPrice = 7.99; // Essential plan discounted price
  const originalPrice = 9.99;

  // Hooks
  const {
    isLoading: paymentLoading,
    error: paymentError,
    txHash: paymentTxHash,
    isConfirmed: paymentConfirmed,
    subscribe,
    fetchTokenPrice,
    calculateRequiredTokens,
    refreshPrice,
    setPriceRefreshInterval,
    cachedPrice,
    lastPriceUpdate,
    priceUpdateInterval,
    isWrongChain: paymentWrongChain,
    isSwitching: paymentSwitching,
    currentChainId,
    targetChainId
  } = usePaymentVault();

  const {
    isLoading: approvalLoading,
    error: approvalError,
    txHash: approvalTxHash,
    isConfirmed: approvalConfirmed,
    needsApproval,
    hasSufficientBalance,
    approve,
    balance,
    isWrongChain: approvalWrongChain,
    isSwitching: approvalSwitching
  } = useTokenApproval(FACY_TOKEN_ADDRESS, PAYMENT_VAULT_ADDRESS);

  // Calculate required tokens on component mount
  useEffect(() => {
    const calculateTokens = async () => {
      try {
        setIsCalculating(true);
        const price = await fetchTokenPrice();
        const tokens = await calculateRequiredTokens(planPrice);
        setTokenPrice(price);
        setRequiredTokens(tokens);
      } catch (error) {
        console.error('Error calculating tokens:', error);
        setRequiredTokens(planPrice / 0.031); // Fallback calculation
      } finally {
        setIsCalculating(false);
      }
    };

    calculateTokens();
  }, [planPrice]); // Remove function dependencies to prevent infinite loop

  // Auto-refresh price every interval
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setIsCalculating(true);
        const price = await refreshPrice();
        const tokens = await calculateRequiredTokens(planPrice, true);
        setTokenPrice(price);
        setRequiredTokens(tokens);
      } catch (error) {
        console.error('Error refreshing price:', error);
        // Set fallback values on error
        setTokenPrice(0.031);
        setRequiredTokens(planPrice / 0.031);
      } finally {
        setIsCalculating(false);
      }
    }, priceUpdateInterval);

    return () => clearInterval(interval);
  }, [priceUpdateInterval, planPrice]); // Remove function dependencies

  // Handle payment confirmation and navigation
  useEffect(() => {
    if (paymentConfirmed && paymentTxHash && paymentInitiated) {
      router.push(`/subscription/confirmation?txHash=${paymentTxHash}&plan=essential&amount=${requiredTokens}&usdAmount=${planPrice}`);
    }
  }, [paymentConfirmed, paymentTxHash, paymentInitiated, router, requiredTokens, planPrice]);

  // Update current time every second for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefreshPrice = async () => {
    try {
      setIsCalculating(true);
      const price = await refreshPrice();
      const tokens = await calculateRequiredTokens(planPrice, true);
      setTokenPrice(price);
      setRequiredTokens(tokens);
    } catch (error) {
      console.error('Error refreshing price:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const formatTimeRemaining = () => {
    if (!lastPriceUpdate) return 'Never updated';
    const elapsed = currentTime - lastPriceUpdate;
    const remaining = Math.max(0, priceUpdateInterval - elapsed);
    const minutes = Math.floor(remaining / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Move to next step when wallet is connected
  useEffect(() => {
    if (isConnected && activeStep === 0) {
      setActiveStep(1);
    }
  }, [isConnected, activeStep]);

  // Move to next step when approval is confirmed OR when no approval is needed
  useEffect(() => {
    if (activeStep === 1 && (approvalConfirmed || (!needsApproval(requiredTokens) && requiredTokens > 0))) {
      setActiveStep(2);
    }
  }, [approvalConfirmed, activeStep, needsApproval, requiredTokens]);

  const planFeatures = [
    '5000 credits (1000 checks) renew daily',
    'Fact check against web sources',
    'Long query check support',
    'Video fact checks',
    'API access (100 tokens)',
    'Early access to new features'
  ];

  const steps = [
    {
      label: 'Connect Wallet',
      description: 'Connect your wallet to proceed with payment'
    },
    {
      label: 'Approve Tokens',
      description: 'Approve FACY tokens for payment'
    },
    {
      label: 'Complete Payment',
      description: 'Subscribe to the Essential plan'
    }
  ];

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      // Step advancement will be handled by useEffect when isConnected changes
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleApproveTokens = async () => {
    try {
      await approve(requiredTokens);
    } catch (error) {
      console.error('Error approving tokens:', error);
    }
  };

  const handleSubscribe = async () => {
    try {
      setPaymentInitiated(true);
      const txHash = await subscribe(ESSENTIAL_PLAN_ID, requiredTokens, false);
      // Don't navigate immediately - wait for confirmation
    } catch (error) {
      console.error('Error subscribing:', error);
      setPaymentInitiated(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            {!isConnected ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<WalletIcon />}
                onClick={handleConnectWallet}
                fullWidth
                sx={{ mt: 2 }}
              >
                Connect Wallet
              </Button>
            ) : (
              <>
                <Alert severity="success" sx={{ mt: 2 }}>
                  Wallet connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                </Alert>
                {paymentWrongChain && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Wrong Network Detected
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      You're currently on chain {currentChainId}. Please switch to Base Sepolia testnet (chain {targetChainId}) to continue.
                    </Typography>
                    {paymentSwitching && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} />
                        <Typography variant="body2">Switching networks...</Typography>
                      </Box>
                    )}
                  </Alert>
                )}
              </>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            {isCalculating ? (
              <Box display="flex" alignItems="center" gap={2} my={2}>
                <CircularProgress size={20} />
                <Typography>Calculating required tokens...</Typography>
              </Box>
            ) : (
              <>
                {approvalWrongChain && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Wrong Network Detected
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Please switch to Base Sepolia testnet (chain {targetChainId}) to approve tokens.
                    </Typography>
                    {approvalSwitching && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} />
                        <Typography variant="body2">Switching networks...</Typography>
                      </Box>
                    )}
                  </Alert>
                )}
                
                <Box my={2}>
                  <Typography variant="body2" color="text.secondary">
                    Required FACY tokens: <strong>{requiredTokens.toFixed(2)} FACY</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your balance: <strong>{balance} FACY</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your address: <strong>{address}</strong>
                  </Typography>
                </Box>

                {!hasSufficientBalance(requiredTokens) ? (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Insufficient FACY token balance. You need {requiredTokens.toFixed(2)} FACY tokens.
                  </Alert>
                ) : needsApproval(requiredTokens) ? (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<SecurityIcon />}
                    onClick={handleApproveTokens}
                    disabled={approvalLoading || approvalWrongChain}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    {approvalLoading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Approving...
                      </>
                    ) : (
                      'Approve FACY Tokens'
                    )}
                  </Button>
                ) : (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Tokens approved! Ready for payment.
                  </Alert>
                )}

                {approvalError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {approvalError}
                  </Alert>
                )}
              </>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            {paymentWrongChain && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Wrong Network Detected
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Please switch to Base Sepolia testnet (chain {targetChainId}) to complete payment.
                </Typography>
                {paymentSwitching && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={16} />
                    <Typography variant="body2">Switching networks...</Typography>
                  </Box>
                )}
              </Alert>
            )}
            
            {paymentTxHash && paymentInitiated ? (
              <>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Transaction Submitted
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Transaction Hash: {paymentTxHash.slice(0, 10)}...{paymentTxHash.slice(-8)}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={16} />
                    <Typography variant="body2">
                      {paymentConfirmed ? 'Transaction Confirmed! Redirecting...' : 'Waiting for confirmation...'}
                    </Typography>
                  </Box>
                </Alert>
                
                {!paymentConfirmed && (
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      setPaymentInitiated(false);
                    }}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Try Again
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="contained"
                size="large"
                startIcon={<PaymentIcon />}
                onClick={handleSubscribe}
                disabled={paymentLoading || paymentWrongChain}
                fullWidth
                sx={{ mt: 2 }}
              >
                {paymentLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Processing Payment...
                  </>
                ) : (
                  'Complete Subscription'
                )}
              </Button>
            )}

            {paymentError && (
              <>
                <Alert severity="error" sx={{ mt: 2 }}>
                  {paymentError}
                </Alert>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    setPaymentInitiated(false);
                  }}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Retry Payment
                </Button>
              </>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f6f9fc', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          minHeight: '80vh', 
          maxWidth: '1200px', 
          mx: 'auto',
          flexDirection: { xs: 'column', md: 'row' }
        }}>
          {/* Left Side - Product Summary */}
          <Box sx={{ 
            bgcolor: 'white', 
            p: 4, 
            flex: '0 0 40%',
            borderRadius: { md: '8px 0 0 8px' },
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <Box mb={3}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  bgcolor: '#635bff', 
                  borderRadius: '2px' 
                }} />
                <Typography variant="body2" color="text.secondary">
                  Try Facticity AI Subscription
                </Typography>
              </Box>
              
              <Typography variant="h4" fontWeight="bold" mb={1}>
                7 days free
              </Typography>
              <Typography variant="body2" color="text.secondary">
                First 7 days on us. Starting September 20, 2025
              </Typography>
            </Box>

            {/* Product Logo/Icon */}
            <Box sx={{ 
              width: 240, 
              height: 'auto', 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              mx: 'auto',
              overflow: 'hidden'
            }}>
              <img 
                src={facticityLogo} 
                alt="Facticity Logo" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </Box>

            {/* Plan Details */}
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Essential Plan
              </Typography>
              
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Typography variant="h5" fontWeight="bold">
                  ${planPrice}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                >
                  ${originalPrice}
                </Typography>
                <Chip label="20% OFF" color="error" size="small" />
              </Box>

              <Typography variant="body2" color="text.secondary" mb={2}>
                per month
              </Typography>
            </Box>

            {/* Pricing Info */}
            {!isCalculating && (
              <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid #e3e8ee' }}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Payment: {requiredTokens.toFixed(2)} FACY tokens
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                  ≈ ${planPrice} USD (1 FACY = ${tokenPrice.toFixed(6)})
                </Typography>
                
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Price updates every {Math.floor(priceUpdateInterval / (60 * 1000))} minutes
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Next update in: {formatTimeRemaining()}
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={handleRefreshPrice}
                    disabled={isCalculating}
                    sx={{ mt: 1, fontSize: '0.7rem', textTransform: 'none' }}
                  >
                    Refresh Price
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* Right Side - Payment Form */}
          <Box sx={{ 
            bgcolor: 'white', 
            p: 4, 
            flex: '0 0 60%',
            borderRadius: { md: '0 8px 8px 0' },
            borderLeft: { md: '1px solid #e3e8ee' },
            display: 'flex',
            flexDirection: 'column'
          }}>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h6" fontWeight="600">
                  Complete your subscription
                </Typography>
              </Box>

              {/* Payment Method */}
              <Box mb={3}>
                <Typography variant="body2" fontWeight="500" mb={2}>
                  Payment method
                </Typography>
                
                {/* Wallet Connection Step */}
                {activeStep === 0 && (
                  <Box>
                    {!isConnected ? (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<WalletIcon />}
                        onClick={handleConnectWallet}
                        fullWidth
                        sx={{ 
                          py: 1.5,
                          bgcolor: '#635bff',
                          '&:hover': { bgcolor: '#5a52ff' },
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Connect Wallet
                      </Button>
                    ) : (
                      <Alert severity="success" sx={{ borderRadius: '6px' }}>
                        Wallet connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                      </Alert>
                    )}
                  </Box>
                )}

                {/* Token Approval Step */}
                {activeStep === 1 && (
                  <Box>
                    {isCalculating ? (
                      <Box display="flex" alignItems="center" gap={2} my={2}>
                        <CircularProgress size={20} />
                        <Typography>Calculating required tokens...</Typography>
                      </Box>
                    ) : (
                      <>
                        <Box mb={2} p={2} sx={{ bgcolor: '#f8f9fa', borderRadius: '6px' }}>
                          <Typography variant="body2" color="text.secondary">
                            Required FACY tokens: <strong>{requiredTokens.toFixed(2)} FACY</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Your balance: <strong>{balance} FACY</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Your address: <strong>{address}</strong>
                          </Typography>
                        </Box>

                        {!hasSufficientBalance(requiredTokens) ? (
                          <Alert severity="error" sx={{ borderRadius: '6px' }}>
                            Insufficient FACY token balance. You need {requiredTokens.toFixed(2)} FACY tokens.
                          </Alert>
                        ) : needsApproval(requiredTokens) ? (
                          <Button
                            variant="contained"
                            size="large"
                            startIcon={<SecurityIcon />}
                            onClick={handleApproveTokens}
                            disabled={approvalLoading}
                            fullWidth
                            sx={{ 
                              py: 1.5,
                              bgcolor: '#635bff',
                              '&:hover': { bgcolor: '#5a52ff' },
                              textTransform: 'none',
                              fontWeight: 600
                            }}
                          >
                            {approvalLoading ? (
                              <>
                                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                                Approving...
                              </>
                            ) : (
                              'Approve FACY Tokens'
                            )}
                          </Button>
                        ) : (
                          <Alert severity="success" sx={{ borderRadius: '6px' }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CheckIcon fontSize="small" />
                              <Typography variant="body2">
                                Tokens approved! Proceeding to payment...
                              </Typography>
                            </Box>
                          </Alert>
                        )}

                        {approvalError && (
                          <Alert severity="error" sx={{ mt: 2, borderRadius: '6px' }}>
                            {approvalError}
                          </Alert>
                        )}
                      </>
                    )}
                  </Box>
                )}

                {/* Payment Step */}
                {activeStep === 2 && (
                  <Box>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PaymentIcon />}
                      onClick={handleSubscribe}
                      disabled={paymentLoading}
                      fullWidth
                      sx={{ 
                        py: 1.5,
                        bgcolor: '#635bff',
                        '&:hover': { bgcolor: '#5a52ff' },
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      {paymentLoading ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                          Processing Payment...
                        </>
                      ) : (
                        'Complete Subscription'
                      )}
                    </Button>

                    {paymentError && (
                      <Alert severity="error" sx={{ mt: 2, borderRadius: '6px' }}>
                        {paymentError}
                      </Alert>
                    )}
                  </Box>
                )}
              </Box>

              {/* Terms */}
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>
                By subscribing, you authorize one time payment. You may cancel at any time. View our{' '}
                <Box component="span" sx={{ color: '#635bff', cursor: 'pointer' }}>Terms</Box> and{' '}
                <Box component="span" sx={{ color: '#635bff', cursor: 'pointer' }}>Privacy</Box>.
              </Typography>

            {/* Footer */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e3e8ee' }}>
              <Typography variant="caption" color="text.secondary">
                Powered by{' '}
                <Box component="span" sx={{ color: '#635bff', fontWeight: 600 }}>Facticity</Box>{' '}
                •{' '}
                <Box component="span" sx={{ color: '#635bff', cursor: 'pointer' }}>Terms</Box>{' '}
                •{' '}
                <Box component="span" sx={{ color: '#635bff', cursor: 'pointer' }}>Privacy</Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SubscriptionPayment;