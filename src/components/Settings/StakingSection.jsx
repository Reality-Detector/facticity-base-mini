import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  IconButton,
  Card
} from '@mui/material';
import {
  AccountBalanceWallet as StakeIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon
} from '@mui/icons-material';
import { useWaitForTransactionReceipt } from 'wagmi';
import { useStaking } from '@/hooks/useStaking';

const StakingSection = () => {
  const {
    facyBalance,
    stakedAmount,
    allowance,
    totalStaked,
    isStakingPaused,
    loading,
    error,
    userAddress,
    approveFacy,
    stakeFacy,
    unstakeFacy,
    unstakeAll,
    refreshData,
    isConnected,
    hasAllowance,
    canStake
  } = useStaking();

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [showStakeDialog, setShowStakeDialog] = useState(false);
  const [showUnstakeDialog, setShowUnstakeDialog] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState('');
  const [txSuccess, setTxSuccess] = useState('');
  const [stakingStep, setStakingStep] = useState('approve'); // 'approve' or 'stake'
  const [isApproved, setIsApproved] = useState(false);

  // Check if user has sufficient allowance for the entered amount
  const hasSufficientAllowance = (amount) => {
    if (!amount || parseFloat(amount) <= 0) return false;
    return hasAllowance(amount);
  };

  // Determine if we should skip approval step
  const shouldSkipApproval = (amount) => {
    return hasSufficientAllowance(amount);
  };

  const handleApprove = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setTxError('Please enter a valid amount to approve');
      return;
    }

    setTxLoading(true);
    setTxError('');
    setTxSuccess('');

    try {
      setTxSuccess('Approval transaction submitted...');
      await approveFacy(stakeAmount);
      setTxSuccess('Approval transaction submitted successfully!');
      
      // Reset state and refresh after 5 seconds
      setTimeout(() => {
        setTxLoading(false);
        setTxSuccess('');
        setIsApproved(true);
        setStakingStep('stake');
        if (refreshData) refreshData();
      }, 5000);
      
    } catch (err) {
      setTxError(err.message || 'Failed to approve tokens');
      setTxLoading(false);
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setTxError('Please enter a valid amount to stake');
      return;
    }

    if (parseFloat(stakeAmount) > parseFloat(facyBalance)) {
      setTxError('Insufficient FACY balance');
      return;
    }

    setTxLoading(true);
    setTxError('');
    setTxSuccess('');

    try {
      // Check if we need approval first
      if (!shouldSkipApproval(stakeAmount) && !isApproved) {
        setTxSuccess('Approving FACY tokens...');
        await approveFacy(stakeAmount);
        setTxSuccess('Approval confirmed! Now staking...');
      }

      // Proceed with staking
      setTxSuccess('Staking transaction submitted...');
      await stakeFacy(stakeAmount);
      setTxSuccess('Staking transaction submitted successfully!');
      
    } catch (err) {
      setTxError(err.message || 'Failed to stake tokens');
    }
    
    // Always reset loading state after 2 seconds regardless of success/failure
    setTimeout(() => {
      console.log('Resetting loading state after timeout');
      setTxLoading(false);
      setTxSuccess('');
      setTxError('');
      setStakeAmount('');
      setShowStakeDialog(false);
      setIsApproved(false);
      setStakingStep('approve');
      if (refreshData) refreshData();
    }, 5000);
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      setTxError('Please enter a valid amount to unstake');
      return;
    }

    if (parseFloat(unstakeAmount) > parseFloat(stakedAmount)) {
      setTxError('Insufficient staked balance');
      return;
    }

    setTxLoading(true);
    setTxError('');
    setTxSuccess('');

    try {
      setTxSuccess('Unstaking transaction submitted...');
      await unstakeFacy(unstakeAmount);
      setTxSuccess('Unstaking transaction submitted successfully!');
      
      // Reset state and refresh after 5 seconds
      setTimeout(() => {
        setTxLoading(false);
        setTxSuccess('');
        setUnstakeAmount('');
        setShowUnstakeDialog(false);
        if (refreshData) refreshData();
      }, 5000);
      
    } catch (err) {
      setTxError(err.message || 'Failed to unstake tokens');
      setTxLoading(false);
    }
  };

  const handleUnstakeAll = async () => {
    if (parseFloat(stakedAmount) <= 0) {
      setTxError('No tokens to unstake');
      return;
    }

    setTxLoading(true);
    setTxError('');
    setTxSuccess('');

    try {
      setTxSuccess('Unstaking all tokens...');
      await unstakeAll();
      setTxSuccess('Unstake all transaction submitted successfully!');
      
      // Reset state and refresh after 5 seconds
      setTimeout(() => {
        setTxLoading(false);
        setTxSuccess('');
        setShowUnstakeDialog(false);
        if (refreshData) refreshData();
      }, 5000);
      
    } catch (err) {
      setTxError(err.message || 'Failed to unstake all tokens');
      setTxLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Box sx={{ 
        p: 2, 
        background: 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)', 
        borderRadius: 2,
        border: '1px solid #ffcc80'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <StakeIcon sx={{ fontSize: 20, color: '#f57c00' }} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            FACY Token Staking
          </Typography>
        </Box>
        <Alert severity="info">
          Please connect your wallet to access staking features
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 2, 
      background: 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)', 
      borderRadius: 2,
      border: '1px solid #ffcc80'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <StakeIcon sx={{ fontSize: 20, color: '#f57c00' }} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            FACY Token Staking
          </Typography>
          {isStakingPaused && (
            <Chip 
              label="Paused" 
              size="small" 
              color="warning"
              icon={<LockIcon />}
            />
          )}
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
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 2,
        mb: 2
      }}>
        {/* Available Balance */}
        <Box sx={{ 
          p: 1.5, 
          backgroundColor: 'rgba(255, 255, 255, 0.7)', 
          borderRadius: 1,
          border: '1px solid rgba(245, 124, 0, 0.2)'
        }}>
          <Typography variant="caption" color="text.secondary">
            Available FACY
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
            {facyBalance || '0'}
          </Typography>
        </Box>

        {/* Staked Amount */}
        <Box sx={{ 
          p: 1.5, 
          backgroundColor: 'rgba(255, 255, 255, 0.7)', 
          borderRadius: 1,
          border: '1px solid rgba(245, 124, 0, 0.2)'
        }}>
          <Typography variant="caption" color="text.secondary">
            Your Staked FACY
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
            {stakedAmount || '0'}
          </Typography>
        </Box>
      </Box>

      {/* Total Staked Info */}
      <Box sx={{ 
        p: 1.5, 
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
        borderRadius: 1,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <TrendingUpIcon sx={{ fontSize: 16, color: '#f57c00' }} />
        <Typography variant="caption" color="text.secondary">
          Total Staked in Vault: <strong>{totalStaked} FACY</strong>
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1,
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <Button
          variant="contained"
          onClick={() => setShowStakeDialog(true)}
          disabled={!canStake || parseFloat(facyBalance) <= 0}
          sx={{ 
            flex: 1,
            background: 'linear-gradient(45deg, #f57c00 30%, #ff9800 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #ef6c00 30%, #f57c00 90%)',
            }
          }}
        >
          Stake FACY
        </Button>
        
        <Button
          variant="outlined"
          onClick={() => setShowUnstakeDialog(true)}
          disabled={parseFloat(stakedAmount) <= 0}
          sx={{ 
            flex: 1,
            borderColor: '#f57c00',
            color: '#f57c00',
            '&:hover': {
              borderColor: '#ef6c00',
              backgroundColor: 'rgba(245, 124, 0, 0.04)'
            }
          }}
        >
          Unstake FACY
        </Button>
      </Box>

      {/* Stake Dialog */}
      <Dialog open={showStakeDialog} onClose={() => setShowStakeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StakeIcon />
            Stake FACY Tokens
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Available balance: {facyBalance} FACY
            </Typography>
            
            <TextField
              fullWidth
              label="Amount to Stake"
              value={stakeAmount}
              onChange={(e) => {
                setStakeAmount(e.target.value);
                setIsApproved(false);
                setStakingStep('approve');
              }}
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button 
                      size="small" 
                      onClick={() => {
                        setStakeAmount(facyBalance);
                        setIsApproved(false);
                        setStakingStep('approve');
                      }}
                      disabled={parseFloat(facyBalance) <= 0}
                    >
                      MAX
                    </Button>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />

            {/* Step Indicator */}
            {!shouldSkipApproval(stakeAmount) && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Staking Process:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: stakingStep === 'approve' ? '#f57c00' : (isApproved ? '#4caf50' : '#999')
                  }}>
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      backgroundColor: isApproved ? '#4caf50' : (stakingStep === 'approve' ? '#f57c00' : '#e0e0e0'),
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {isApproved ? '✓' : '1'}
                    </Box>
                    <Typography variant="caption">Approve</Typography>
                  </Box>
                  <Box sx={{ width: 20, height: 2, backgroundColor: isApproved ? '#4caf50' : '#e0e0e0' }} />
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: stakingStep === 'stake' ? '#f57c00' : '#999'
                  }}>
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      backgroundColor: stakingStep === 'stake' ? '#f57c00' : '#e0e0e0',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      2
                    </Box>
                    <Typography variant="caption">Stake</Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {shouldSkipApproval(stakeAmount) && parseFloat(stakeAmount) > 0 && (
              <Alert severity="success" sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Sufficient allowance detected! You can stake directly without approval.
                </Box>
              </Alert>
            )}

            {!shouldSkipApproval(stakeAmount) && !isApproved && parseFloat(stakeAmount) > 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon fontSize="small" />
                  First approve FACY tokens, then stake them in the vault
                </Box>
              </Alert>
            )}

            {isApproved && (
              <Alert severity="success" sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon fontSize="small" />
                  Tokens approved! You can now stake {stakeAmount} FACY
                </Box>
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowStakeDialog(false);
            setIsApproved(false);
            setStakingStep('approve');
          }} disabled={txLoading}>
            Cancel
          </Button>
          {shouldSkipApproval(stakeAmount) ? (
            <Button 
              onClick={handleStake} 
              variant="contained"
              disabled={txLoading || !stakeAmount || parseFloat(stakeAmount) <= 0 || !canStake(stakeAmount)}
            >
              {txLoading ? <CircularProgress size={20} /> : 'Stake FACY'}
            </Button>
          ) : !isApproved ? (
            <Button 
              onClick={handleApprove} 
              variant="contained"
              disabled={txLoading || !stakeAmount || parseFloat(stakeAmount) <= 0}
            >
              {txLoading ? <CircularProgress size={20} /> : 'Approve FACY'}
            </Button>
          ) : (
            <Button 
              onClick={handleStake} 
              variant="contained"
              disabled={txLoading || !stakeAmount || parseFloat(stakeAmount) <= 0}
            >
              {txLoading ? <CircularProgress size={20} /> : 'Stake FACY'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Unstake Dialog */}
      <Dialog open={showUnstakeDialog} onClose={() => setShowUnstakeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <UnlockIcon />
            Unstake FACY Tokens
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Staked balance: {stakedAmount} FACY
            </Typography>
            
            <TextField
              fullWidth
              label="Amount to Unstake"
              value={unstakeAmount}
              onChange={(e) => setUnstakeAmount(e.target.value)}
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button 
                      size="small" 
                      onClick={() => setUnstakeAmount(stakedAmount)}
                      disabled={parseFloat(stakedAmount) <= 0}
                    >
                      MAX
                    </Button>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleUnstakeAll}
                disabled={txLoading || parseFloat(stakedAmount) <= 0}
                fullWidth
              >
                {txLoading ? <CircularProgress size={20} /> : 'Unstake All'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUnstakeDialog(false)} disabled={txLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUnstake} 
            variant="contained"
            disabled={txLoading || !unstakeAmount || parseFloat(unstakeAmount) <= 0}
          >
            {txLoading ? <CircularProgress size={20} /> : 'Unstake'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StakingSection;