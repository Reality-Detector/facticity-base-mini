'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
  Grid,
  Switch,
  FormControlLabel,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Launch as LaunchIcon,
  Add as AddIcon,
  CreditCard as CreditCardIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { usePrivy } from '@privy-io/react-auth';
import { usePaymentVault } from '@/hooks/usePaymentVault';
import { useBillingHistory } from '@/hooks/useBillingHistory';
import facticityLogo from '@/assets/facticity-logo.png';
import facyIcon from '@/assets/facy-logo.jpeg';

const ManageSubscription = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { authenticated, user } = usePrivy();
  const {
    userSubscription,
    hasActiveSubscription,
    planData,
    isLoading,
    error,
    txHash,
    isConfirmed,
    cancelSubscription,
    toggleAutoRenew,
    isWrongChain,
    refetchSubscription,
    refetchActiveStatus
  } = usePaymentVault();

  const {
    billingHistory,
    isLoading: billingLoading,
    error: billingError,
    getExplorerUrl: getBillingExplorerUrl
  } = useBillingHistory();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Check if subscription is cancelled but still within active period
  const isSubscriptionStillValid = () => {
    if (!userSubscription || !userSubscription.endTime) return false;
    
    const now = Math.floor(Date.now() / 1000);
    const endTime = Number(userSubscription.endTime);
    const status = userSubscription.status ? Number(userSubscription.status) : 0;
    
    // Status 3 means cancelled, but if endTime > now, it's still active
    if (status === 3 && endTime > now) {
      return true; // Cancelled but still in active period
    }
    
    return hasActiveSubscription;
  };
  
  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && txHash) {
      setActionLoading(false);
      setActionSuccess('Transaction confirmed successfully!');
      setCancelDialogOpen(false);
      setRenewDialogOpen(false);
      // Refetch data
      setTimeout(() => {
        refetchSubscription();
        refetchActiveStatus();
      }, 1000);
    }
  }, [isConfirmed, txHash, refetchSubscription, refetchActiveStatus]);

  const handleCancelSubscription = async () => {
    try {
      setActionLoading(true);
      setActionError(null);
      await cancelSubscription();
    } catch (error) {
      setActionLoading(false);
      setActionError(error.message);
    }
  };

  const handleToggleAutoRenew = async () => {
    try {
      setActionLoading(true);
      setActionError(null);
      await toggleAutoRenew();
    } catch (error) {
      setActionLoading(false);
      setActionError(error.message);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSubscriptionStatus = () => {
    if (!userSubscription || !userSubscription.endTime) return 'No Subscription';
    
    const now = Math.floor(Date.now() / 1000);
    const endTime = Number(userSubscription.endTime);
    const status = userSubscription.status ? Number(userSubscription.status) : 0;
    
    // Status 3 means cancelled
    if (status === 3) {
      if (endTime > now) {
        return 'Cancelled (Active until end date)';
      } else {
        return 'Cancelled';
      }
    }
    
    if (endTime > now) {
      return 'Active';
    } else {
      return 'Expired';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Cancelled (Active until end date)': return 'warning';
      case 'Cancelled': return 'error';
      case 'Expired': return 'error';
      default: return 'default';
    }
  };

  const getExplorerUrl = (hash) => {
    return `https://sepolia.basescan.org/tx/${hash}`;
  };

  if (!authenticated) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Left Sidebar */}
      <Box
        sx={{
          width: 300,
          bgcolor: '#fff',
          color: '#0066ff',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Back Button */}
        <IconButton
          onClick={() => router.push('/')}
          sx={{
            color: '#0066ff',
            position: 'absolute',
            top: 16,
            left: 16,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
          size="small"
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Logo */}
        <Box sx={{ mt: 0, mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
          <img 
            src={facticityLogo} 
            alt="Facticity"
            style={{ 
              width: 240, 
              height: 240,
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 'auto', pt: 4 }}>
          <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
            Powered by Facticity
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.7, 
                cursor: 'pointer',
                '&:hover': { opacity: 1 }
              }}
            >
              Terms
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.7, 
                cursor: 'pointer',
                '&:hover': { opacity: 1 }
              }}
            >
              Privacy
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right Content Area */}
      <Box sx={{ flex: 1, p: 4, ml: 4, mr: 4 }}>
        <Typography variant="h4" fontWeight="600" sx={{ mb: 4 }}>
          Manage Subscription
        </Typography>

        {/* Alerts */}
        {isWrongChain && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            Please switch to Base Sepolia testnet to manage your subscription.
          </Alert>
        )}

        {actionSuccess && (
          <Alert 
            severity="success" 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setActionSuccess(null)}
          >
            {actionSuccess}
          </Alert>
        )}

        {actionError && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setActionError(null)}
          >
            {actionError}
          </Alert>
        )}

        {/* Current Plan Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
            CURRENT PLAN
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                {userSubscription?.planId == 1 ? 'Facticity Essential' : 'Facticity Enterprise'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ${userSubscription?.planId == 1 ? '7.99' : '19.99'} per month
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userSubscription ? 'Your plan ends on ' + formatDate(userSubscription?.endTime) : ''}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {getSubscriptionStatus() === 'Active' && (
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  sx={{ textTransform: 'none' }}
                  onClick={() => setCancelDialogOpen(true)}
                >
                  Cancel Plan
                </Button>
              )}
              {getSubscriptionStatus().includes('Cancelled') && (
                <Typography variant="body2" color="warning.main" sx={{ fontStyle: 'italic' }}>
                  Plan cancelled - You can enjoy benefits until {formatDate(userSubscription?.endTime)}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Payment Method Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
            PAYMENT METHOD
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <img src={facyIcon} alt="Facy Logo" style={{ width: '2rem', height: '2rem', borderRadius: '50%' }} />
              <Box>
                <Typography variant="body1">
                  $FACY
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {"0xFAC77f01957ed1B3DD1cbEa992199B8f85B6E886".slice(0, 6) + "..." + "0xFAC77f01957ed1B3DD1cbEa992199B8f85B6E886".slice(-4)}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {formatDate(userSubscription?.endTime)}
            </Typography>
          </Box>
          
        </Box>

        {/* Billing History Section */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
            BILLING HISTORY
          </Typography>
          
          {billingError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              Error loading billing history: {billingError}
            </Alert>
          )}
          
          {billingLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
              <Table sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ border: 'none', py: 2, fontWeight: 600, color: 'text.secondary', width: '25%' }}>
                      Plan
                    </TableCell>
                    <TableCell sx={{ border: 'none', py: 2, fontWeight: 600, color: 'text.secondary', textAlign: 'right', width: '20%' }}>
                      Amount
                    </TableCell>
                    <TableCell sx={{ border: 'none', py: 2, fontWeight: 600, color: 'text.secondary', textAlign: 'right', width: '25%' }}>
                      Payment Date
                    </TableCell>
                    <TableCell sx={{ border: 'none', py: 2, fontWeight: 600, color: 'text.secondary', textAlign: 'right', width: '20%' }}>
                      Event Date
                    </TableCell>
                    <TableCell sx={{ border: 'none', py: 2, fontWeight: 600, color: 'text.secondary', textAlign: 'right', width: '10%' }}>
                      Transaction
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billingHistory.length > 0 ? (
                    billingHistory.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ border: 'none', py: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {transaction.planName}
                            {transaction.type === 'cancellation' && (
                              <Chip 
                                label="Cancelled" 
                                size="small" 
                                color="error" 
                                sx={{ fontSize: '0.75rem' }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ border: 'none', py: 2, textAlign: 'right' }}>
                          {transaction.type === 'cancellation' 
                            ? '-' 
                            : `${parseFloat(transaction.amountFormatted).toFixed(2)} FACY`
                          }
                        </TableCell>
                        <TableCell sx={{ border: 'none', py: 2, textAlign: 'right' }}>
                          {transaction.type === 'cancellation' 
                            ? '-' 
                            : transaction.paymentDate
                          }
                        </TableCell>
                        <TableCell sx={{ border: 'none', py: 2, textAlign: 'right' }}>
                          {transaction.type === 'cancellation' 
                            ? transaction.cancellationDate 
                            : transaction.subscriptionDate
                          }
                        </TableCell>
                        <TableCell sx={{ border: 'none', py: 2, textAlign: 'right' }}>
                          <IconButton 
                            size="small"
                            href={getBillingExplorerUrl(transaction.transactionHash)}
                            target="_blank"
                            rel="noopener"
                            component="a"
                          >
                            <LaunchIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ border: 'none', py: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          No billing history found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>

      {/* Cancel Subscription Dialog */}
      <Dialog 
        open={cancelDialogOpen} 
        onClose={() => setCancelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Cancel Subscription
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" mb={2}>
            Are you sure you want to cancel your subscription? This action cannot be undone.
          </Typography>
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            <Typography variant="body2">
              • You will lose access to premium features immediately
              <br />
              • No refund will be provided for the remaining subscription period
              <br />
              • You can resubscribe at any time
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setCancelDialogOpen(false)}
            disabled={actionLoading}
          >
            Keep Subscription
          </Button>
          <Button 
            onClick={handleCancelSubscription}
            color="error"
            variant="contained"
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={16} /> : null}
          >
            {actionLoading ? 'Canceling...' : 'Cancel Subscription'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageSubscription;