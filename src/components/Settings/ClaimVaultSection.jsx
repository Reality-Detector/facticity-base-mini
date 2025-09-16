import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  IconButton,
  Card,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Redeem as ClaimIcon,
  Schedule as TimeIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  AccessTime as ClockIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { useClaimVault } from '../../hooks/useClaimVault';
import { formatTokenAmount } from '../../config/web3Config';
import { useAccount, useSwitchChain } from 'wagmi';

const ClaimVaultSection = () => {
  const {
    totalClaimableAmount,
    activePeriods,
    claimableAmounts,
    shortestRemainingTime,
    shortestRemainingTimeFormatted,
    activeClaimPeriods,
    currentPeriodId,
    userClaimHistory,
    claimedPeriodsCount,
    loading,
    error,
    userAddress,
    isPending,
    isConfirming,
    isConfirmed,
    claimTokens,
    claimTokensFromPeriod,
    refreshData,
    isConnected,
    hasClaimableTokens,
    canClaim,
    formatTimeRemaining,
    calculateTotalClaimedTokens
  } = useClaimVault();

  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const isOnCorrectChain = chain?.id === 8453; // Base Mainnet

  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState('');
  const [txSuccess, setTxSuccess] = useState('');
  const [totalClaimedTokens, setTotalClaimedTokens] = useState('0');

  const handleClaim = async () => {
    if (!hasClaimableTokens()) {
      setTxError('No tokens available to claim');
      return;
    }

    setTxLoading(true);
    setTxError('');
    setTxSuccess('');

    try {
      setTxSuccess('Claim transaction submitted...');
      await claimTokens();
      setTxSuccess('Claim transaction submitted successfully!');
      
      // Reset state and refresh after 5 seconds
      setTimeout(() => {
        setTxLoading(false);
        setTxSuccess('');
        setShowClaimDialog(false);
        if (refreshData) refreshData();
      }, 5000);
      
    } catch (err) {
      setTxError(err.message || 'Failed to claim tokens');
      setTxLoading(false);
    }
  };

  const handleClaimFromPeriod = async (periodId) => {
    setTxLoading(true);
    setTxError('');
    setTxSuccess('');

    try {
      setTxSuccess(`Claiming from period ${periodId}...`);
      await claimTokensFromPeriod(periodId);
      setTxSuccess('Claim transaction submitted successfully!');
      
      // Reset state and refresh after 5 seconds
      setTimeout(() => {
        setTxLoading(false);
        setTxSuccess('');
        if (refreshData) refreshData();
      }, 5000);
      
    } catch (err) {
      setTxError(err.message || 'Failed to claim tokens from period');
      setTxLoading(false);
    }
  };

  // Calculate total claimed tokens when claim history changes
  useEffect(() => {
    const fetchTotalClaimed = async () => {
      if (userClaimHistory && userClaimHistory.length > 0) {
        const total = await calculateTotalClaimedTokens();
        setTotalClaimedTokens(total);
      } else {
        setTotalClaimedTokens('0');
      }
    };
    
    fetchTotalClaimed();
  }, [userClaimHistory, calculateTotalClaimedTokens]);

  // Auto-refresh data when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      refreshData();
    }
  }, [isConfirmed, refreshData]);

  if (!isConnected) {
    return (
      <Box sx={{ 
        p: 2, 
        background: 'linear-gradient(135deg, #e8f5e8 0%, #f3e5f5 100%)', 
        borderRadius: 2,
        border: '1px solid #81c784'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <ClaimIcon sx={{ fontSize: 20, color: '#388e3c' }} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Token Claim Vault
          </Typography>
        </Box>
        <Alert severity="info">
          Please connect your wallet to access claim features
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 2, 
      background: 'linear-gradient(135deg, #e8f5e8 0%, #f3e5f5 100%)', 
      borderRadius: 2,
      border: '1px solid #81c784'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ClaimIcon sx={{ fontSize: 20, color: '#388e3c' }} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Token Claim Vault
          </Typography>
        </Box>
        <Tooltip title="Refresh claim data">
          <IconButton 
            onClick={refreshData} 
            disabled={loading}
            size="small"
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Transaction Status */}
      {txError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setTxError('')}>
          {txError}
        </Alert>
      )}
      {txSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setTxSuccess('')}>
          {txSuccess}
        </Alert>
      )}

      {/* Claim Stats */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
        gap: 2,
        mb: 2
      }}>
        {/* Total Claimable */}
        <Box sx={{ 
          p: 1.5, 
          backgroundColor: 'rgba(255, 255, 255, 0.7)', 
          borderRadius: 1,
          border: '1px solid rgba(56, 142, 60, 0.2)'
        }}>
          <Typography variant="caption" color="text.secondary">
            Total Claimable
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
            {totalClaimableAmount || '0'} FACY
          </Typography>
        </Box>

        {/* Total Claimed */}
        <Box sx={{ 
          p: 1.5, 
          backgroundColor: 'rgba(255, 255, 255, 0.7)', 
          borderRadius: 1,
          border: '1px solid rgba(56, 142, 60, 0.2)'
        }}>
          <Typography variant="caption" color="text.secondary">
            Total Claimed
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckIcon sx={{ fontSize: 16, color: '#388e3c' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
              {totalClaimedTokens} FACY
            </Typography>
          </Box>
        </Box>

        {/* Time Remaining */}
        <Box sx={{ 
          p: 1.5, 
          backgroundColor: 'rgba(255, 255, 255, 0.7)', 
          borderRadius: 1,
          border: '1px solid rgba(56, 142, 60, 0.2)'
        }}>
          <Typography variant="caption" color="text.secondary">
            Shortest Time Remaining
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ClockIcon sx={{ fontSize: 16, color: '#388e3c' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
              {shortestRemainingTimeFormatted}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Active Periods Info */}
      {activePeriods && activePeriods.length > 0 && (
        <Box sx={{ 
          p: 1.5, 
          backgroundColor: 'rgba(255, 255, 255, 0.5)', 
          borderRadius: 1,
          mb: 2
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon sx={{ fontSize: 16, color: '#388e3c' }} />
            Active Claim Periods ({activePeriods.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {activePeriods.map((periodId, index) => (
              <Chip
                key={periodId.toString()}
                label={`Period ${periodId.toString()}: ${claimableAmounts[index] ? formatTokenAmount(claimableAmounts[index]) : '0'} FACY`}
                size="small"
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Claim History */}
      {userClaimHistory && userClaimHistory.length > 0 && (
        <Box sx={{ 
          p: 1.5, 
          backgroundColor: 'rgba(76, 175, 80, 0.1)', 
          borderRadius: 1,
          mb: 2
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckIcon sx={{ fontSize: 16, color: '#388e3c' }} />
            Claim History ({claimedPeriodsCount} periods claimed)
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {userClaimHistory.map((periodId) => (
              <Chip
                key={periodId.toString()}
                label={`Period ${periodId.toString()}`}
                size="small"
                variant="filled"
                color="success"
                icon={<CheckIcon sx={{ fontSize: 14 }} />}
              />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Total claimed from {claimedPeriodsCount} periods: {totalClaimedTokens} FACY
          </Typography>
        </Box>
      )}

      {/* Wrong Network Warning */}
      {!isOnCorrectChain && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon fontSize="small" />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Wrong Network Detected
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Please switch to Base Mainnet to interact with ClaimVault
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              size="small"
              onClick={() => switchChain({ chainId: 84532 })}
              sx={{ 
                minWidth: 'auto',
                background: 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)',
              }}
            >
              Switch Network
            </Button>
          </Box>
        </Alert>
      )}

      {/* No Claims Available */}
      {isOnCorrectChain && !hasClaimableTokens() && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon fontSize="small" />
            No tokens available for claiming at this time
          </Box>
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1,
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <Button
          variant="contained"
          onClick={() => setShowClaimDialog(true)}
          disabled={!canClaim() || txLoading}
          sx={{ 
            flex: 1,
            background: 'linear-gradient(45deg, #388e3c 30%, #4caf50 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #2e7d32 30%, #388e3c 90%)',
            }
          }}
        >
          {txLoading ? <CircularProgress size={20} color="inherit" /> : 'Claim Tokens'}
        </Button>
        
        <Button
          variant="outlined"
          onClick={refreshData}
          disabled={loading}
          sx={{ 
            borderColor: '#388e3c',
            color: '#388e3c',
            '&:hover': {
              borderColor: '#2e7d32',
              backgroundColor: 'rgba(56, 142, 60, 0.04)'
            }
          }}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Claim Dialog */}
      <Dialog open={showClaimDialog} onClose={() => setShowClaimDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ClaimIcon />
            Claim Your Tokens
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              You can claim a total of {totalClaimableAmount} FACY tokens from {activePeriods?.length || 0} active periods.
            </Typography>
            
            {/* Claim Summary */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'rgba(56, 142, 60, 0.1)', 
              borderRadius: 1,
              mb: 2
            }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#388e3c' }}>
                Claim Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Total Amount:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                  {totalClaimableAmount} FACY
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Active Periods:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {activePeriods?.length || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Time Remaining:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {shortestRemainingTimeFormatted}
                </Typography>
              </Box>
            </Box>

            {/* Individual Periods */}
            {activePeriods && activePeriods.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Claimable by Period:
                </Typography>
                <List dense>
                  {activePeriods.map((periodId, index) => (
                    <ListItem key={periodId.toString()} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckIcon sx={{ color: '#388e3c', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Period ${periodId.toString()}`}
                        secondary={`${claimableAmounts[index] ? formatTokenAmount(claimableAmounts[index]) : '0'} FACY`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon fontSize="small" />
                This will claim tokens from all available periods in a single transaction
              </Box>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClaimDialog(false)} disabled={txLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleClaim} 
            variant="contained"
            disabled={txLoading || !canClaim()}
            sx={{
              background: 'linear-gradient(45deg, #388e3c 30%, #4caf50 90%)',
            }}
          >
            {txLoading ? <CircularProgress size={20} /> : `Claim ${totalClaimableAmount} FACY`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClaimVaultSection;
