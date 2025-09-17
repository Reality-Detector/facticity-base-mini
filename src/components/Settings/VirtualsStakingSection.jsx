import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  AccountBalanceWallet as StakeIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAccount, useSwitchChain } from 'wagmi';
import { useVirtualsStaking } from '../../hooks/useVirtualsStaking';

const VirtualsStakingSection = () => {
  const {
    stakingPositions,
    totalStakedAmount,
    userStakedAmount,
    numPositions,
    loading,
    error,
    userAddress,
    isPending,
    isConfirming,
    isConfirmed,
    stakeTokens,
    withdrawFromPosition,
    refreshData,
    isConnected,
    hasStakedTokens,
    canStake
  } = useVirtualsStaking();

  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const isOnCorrectChain = chain?.id === 8453; // Base Mainnet

  const [showStakeDialog, setShowStakeDialog] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState('');
  const [txSuccess, setTxSuccess] = useState('');
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setTxError('Please enter a valid amount');
      return;
    }

    setTxLoading(true);
    setTxError('');
    setTxSuccess('');

    try {
      await stakeTokens(stakeAmount);
      setTxSuccess('Staking transaction submitted successfully!');
      setStakeAmount('');
      setShowStakeDialog(false);
      
      // Auto-hide success message and refresh data
      setTimeout(() => {
        setTxSuccess('');
        if (refreshData) refreshData();
      }, 5000);
      
    } catch (err) {
      setTxError(err.message || 'Failed to stake tokens');
      setTxLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedPosition) {
      setTxError('No position selected');
      return;
    }

    setTxLoading(true);
    setTxError('');
    setTxSuccess('');

    try {
      await withdrawFromPosition(selectedPosition.idParam);
      setTxSuccess('Withdrawal transaction submitted successfully!');
      setShowWithdrawDialog(false);
      setSelectedPosition(null);
      
      // Auto-hide success message and refresh data
      setTimeout(() => {
        setTxSuccess('');
        if (refreshData) refreshData();
      }, 5000);
      
    } catch (err) {
      setTxError(err.message || 'Failed to withdraw from position');
      setTxLoading(false);
    }
  };

  const openWithdrawDialog = (position) => {
    setSelectedPosition(position);
    setShowWithdrawDialog(true);
  };

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
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', 
        borderRadius: 2,
        border: '1px solid #64b5f6'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <StakeIcon sx={{ fontSize: 20, color: '#1976d2' }} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Virtuals Staking
          </Typography>
        </Box>
        <Alert severity="info">
          Please connect your wallet to view your Virtuals staking positions.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 2, 
      background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', 
      borderRadius: 2,
      border: '1px solid #64b5f6'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <StakeIcon sx={{ fontSize: 20, color: '#1976d2' }} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Virtuals Staking
          </Typography>
        </Box>
        <Tooltip title="Refresh staking data">
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

      {/* Staking Stats */}
      {/* <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 2,
        mb: 2
      }}>
        {/* Total Staked */}
        {/* <Box sx={{
          p: 1.5, 
          backgroundColor: 'rgba(255, 255, 255, 0.7)', 
          borderRadius: 1,
          border: '1px solid rgba(25, 118, 210, 0.2)'
        }}>
          <Typography variant="caption" color="text.secondary">
            Total Staked
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            {totalStakedAmount || '0'} FACY
          </Typography>
        </Box> */}

        {/* Active Positions */}
        {/* <Box sx={{
          p: 1.5, 
          backgroundColor: 'rgba(255, 255, 255, 0.7)', 
          borderRadius: 1,
          border: '1px solid rgba(25, 118, 210, 0.2)'
        }}>
          <Typography variant="caption" color="text.secondary">
            Active Positions
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon sx={{ fontSize: 16, color: '#1976d2' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {stakingPositions.length}
            </Typography>
          </Box>
        </Box> */}
      {/* </Box> */}

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
                  Please switch to Base Mainnet to interact with Virtuals staking
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => switchChain({ chainId: 8453 })}
            >
              Switch Network
            </Button>
          </Box>
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

    {/* Total Staked Amount */}
    <Box sx={{ mb: 3 }}>
        {/* <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
          <TrendingUpIcon sx={{ fontSize: 18, color: '#1976d2' }} />
          Your Virtuals Staking
        </Typography> */}
        
        <Box sx={{ 
          p: 2, 
          backgroundColor: 'rgba(25, 118, 210, 0.08)', 
          border: '1px solid rgba(25, 118, 210, 0.2)',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <Typography variant="body" color="text.secondary" sx={{ mb: 0.5 }}>
              Total Staked Amount
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
              {totalStakedAmount} FACY
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            href="https://app.virtuals.io/profile"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              py: 1,
              px: 2,
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Manage on Virtuals.io
          </Button>
        </Box>
      </Box>
      
      {/* Stake Dialog */}
      {/* <Dialog open={showStakeDialog} onClose={() => setShowStakeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Stake FACY Tokens</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount to Stake"
            type="number"
            fullWidth
            variant="outlined"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            helperText="Enter the amount of FACY tokens to stake"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStakeDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleStake} 
            variant="contained"
            disabled={txLoading || !stakeAmount || parseFloat(stakeAmount) <= 0}
          >
            {txLoading ? 'Staking...' : 'Stake'}
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Withdraw Dialog */}
      <Dialog open={showWithdrawDialog} onClose={() => setShowWithdrawDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Withdraw from Position</DialogTitle>
        <DialogContent>
          {selectedPosition && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Are you sure you want to withdraw from Position #{selectedPosition.idParam}?
              </Typography>
              <Box sx={{ p: 2, backgroundColor: 'rgba(25, 118, 210, 0.1)', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Position ID: {selectedPosition.idParam}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Net Amount: {selectedPosition.netAmount} FACY
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lock End: {new Date(selectedPosition.endTime * 1000).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color={selectedPosition.endTime * 1000 > Date.now() ? "warning.main" : "success.main"}>
                  {selectedPosition.endTime * 1000 > Date.now() 
                    ? `Locked for ${Math.ceil((selectedPosition.endTime * 1000 - Date.now()) / (1000 * 60 * 60 * 24))} days`
                    : 'Unlocked - Ready to withdraw'
                  }
                </Typography>
                {selectedPosition.autoRenew && (
                  <Chip 
                    label="Auto-Renew" 
                    size="small" 
                    color="info" 
                    sx={{ mt: 1 }}
                  />
                )}
                {parseFloat(selectedPosition.withdrawnAmount) > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Previously Withdrawn: {selectedPosition.withdrawnAmount} FACY
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWithdrawDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleWithdraw} 
            variant="contained" 
            color="primary"
            disabled={
              txLoading || 
              isPending || 
              isConfirming || 
              (selectedPosition && selectedPosition.endTime * 1000 > Date.now())
            }
          >
            {selectedPosition && selectedPosition.endTime * 1000 > Date.now()
              ? 'Lock Not Expired'
              : txLoading || isPending ? 'Processing...' 
              : isConfirming ? 'Confirming...' 
              : 'Withdraw'
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VirtualsStakingSection;