'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  InputAdornment,
  Divider,
  Grid,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Lock as StakeIcon, 
  LockOpen as UnstakeIcon,
  GetApp as WithdrawIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon
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
    unstakeRequests,
    totalUnstakeAmount,
    availableUnstakeAmount,
    lockPeriod,
    approveFacy,
    stakeFacy,
    requestUnstake,
    requestUnstakeAll,
    withdrawUnstake,
    withdrawAllUnstake,
    cancelUnstake,
    refreshData,
    isConnected,
    hasAllowance,
    canStake
  } = useStaking();

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [showStakeDialog, setShowStakeDialog] = useState(false);
  const [showUnstakeDialog, setShowUnstakeDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelAmount, setCancelAmount] = useState('');
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

  const handleRequestUnstake = async () => {
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
      setTxSuccess('Requesting unstake...');
      await requestUnstake(unstakeAmount);
      setTxSuccess('Unstake request submitted successfully!');
      
      setTimeout(() => {
        setTxLoading(false);
        setTxSuccess('');
        setUnstakeAmount('');
        setShowUnstakeDialog(false);
        if (refreshData) refreshData();
      }, 5000);
      
    } catch (err) {
      setTxError(err.message || 'Failed to request unstake');
      setTxLoading(false);
    }
  };

  const handleRequestUnstakeAll = async () => {
    if (parseFloat(stakedAmount) <= 0) {
      setTxError('No tokens to unstake');
      return;
    }

    setTxLoading(true);
    setTxError('');
    setTxSuccess('');

    try {
      setTxSuccess('Requesting unstake all...');
      await requestUnstakeAll();
      setTxSuccess('Unstake all request submitted successfully!');
      
      setTimeout(() => {
        setTxLoading(false);
        setTxSuccess('');
        setShowUnstakeDialog(false);
        if (refreshData) refreshData();
      }, 5000);
      
    } catch (err) {
      setTxError(err.message || 'Failed to request unstake all');
      setTxLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setTxError('Please enter a valid amount to withdraw');
      return;
    }

    if (parseFloat(withdrawAmount) > parseFloat(availableUnstakeAmount)) {
      setTxError('Insufficient available unstake amount');
      return;
    }

    setTxLoading(true);
    setTxError('');
    setTxSuccess('');

    try {
      setTxSuccess('Withdrawing unstaked tokens...');
      await withdrawUnstake(withdrawAmount);
      setTxSuccess('Withdrawal completed successfully!');
      
      setTimeout(() => {
        setTxLoading(false);
        setTxSuccess('');
        setWithdrawAmount('');
        setShowWithdrawDialog(false);
        if (refreshData) refreshData();
      }, 5000);
      
    } catch (err) {
      setTxError(err.message || 'Failed to withdraw tokens');
      setTxLoading(false);
    }
  };

  const handleWithdrawAll = async () => {
    if (parseFloat(availableUnstakeAmount) <= 0) {
      setTxError('No tokens available for withdrawal');
      return;
    }

    setTxLoading(true);
    setTxError('');
    setTxSuccess('');

    try {
      setTxSuccess('Withdrawing all available tokens...');
      await withdrawAllUnstake();
      setTxSuccess('All withdrawals completed successfully!');
      
      setTimeout(() => {
        setTxLoading(false);
        setTxSuccess('');
        setShowWithdrawDialog(false);
        if (refreshData) refreshData();
      }, 5000);
      
    } catch (err) {
      setTxError(err.message || 'Failed to withdraw all tokens');
      setTxLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelAmount || parseFloat(cancelAmount) <= 0) {
      setTxError('Please enter a valid amount to cancel');
      return;
    }

    if (parseFloat(cancelAmount) > parseFloat(totalUnstakeAmount)) {
      setTxError('Insufficient unstake requests to cancel');
      return;
    }

    setTxLoading(true);
    setTxError('');
    setTxSuccess('');

    try {
      setTxSuccess('Cancelling unstake requests...');
      await cancelUnstake(cancelAmount);
      setTxSuccess('Unstake requests cancelled successfully!');
      
      setTimeout(() => {
        setTxLoading(false);
        setTxSuccess('');
        setCancelAmount('');
        setShowCancelDialog(false);
        if (refreshData) refreshData();
      }, 5000);
      
    } catch (err) {
      setTxError(err.message || 'Failed to cancel unstake requests');
      setTxLoading(false);
    }
  };

  // Helper function to format lock period
  const formatLockPeriod = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}${hours > 0 ? ` ${hours}h` : ''}`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  // Check if user has any unstaking activity
  const hasUnstakingActivity = unstakeRequests.length > 0 || parseFloat(totalUnstakeAmount) > 0;

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


      {/* Main Content with Stats and Buttons */}
      <Box sx={{ 
        display: 'flex',
        gap: 2,
        mb: 2,
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        {/* Left Side - Staking Stats */}
        <Box sx={{ 
          flex: 1,
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2
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

          {/* Pending Unstake Amount */}
          {parseFloat(totalUnstakeAmount) > 0 && (
            <Box sx={{ 
              p: 1.5, 
              backgroundColor: 'rgba(255, 193, 7, 0.1)', 
              borderRadius: 1,
              border: '1px solid rgba(255, 193, 7, 0.3)'
            }}>
              <Typography variant="caption" color="text.secondary">
                Pending Unstake
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff8f00' }}>
                {totalUnstakeAmount}
              </Typography>
            </Box>
          )}

          {/* Available for Withdrawal */}
          {parseFloat(availableUnstakeAmount) > 0 && (
            <Box sx={{ 
              p: 1.5, 
              backgroundColor: 'rgba(76, 175, 80, 0.1)', 
              borderRadius: 1,
              border: '1px solid rgba(76, 175, 80, 0.3)'
            }}>
              <Typography variant="caption" color="text.secondary">
                Ready to Withdraw
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {availableUnstakeAmount}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Right Side - Action Buttons */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          minWidth: { md: '200px' },
          alignSelf: 'flex-start'
        }}>
          <Button
            variant="contained"
            onClick={() => setShowStakeDialog(true)}
            disabled={!canStake || parseFloat(facyBalance) <= 0}
            sx={{ 
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
              borderColor: '#f57c00',
              color: '#f57c00',
              '&:hover': {
                borderColor: '#ef6c00',
                backgroundColor: 'rgba(245, 124, 0, 0.04)'
              }
            }}
          >
            Request Unstake
          </Button>

          {parseFloat(availableUnstakeAmount) > 0 && (
            <Button
              variant="contained"
              onClick={() => setShowWithdrawDialog(true)}
              sx={{ 
                background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388e3c 30%, #4caf50 90%)',
                }
              }}
            >
              Withdraw
            </Button>
          )}

          {parseFloat(totalUnstakeAmount) > 0 && (
            <Button
              variant="outlined"
              onClick={() => setShowCancelDialog(true)}
              sx={{ 
                borderColor: '#ff5722',
                color: '#ff5722',
                '&:hover': {
                  borderColor: '#d32f2f',
                  backgroundColor: 'rgba(255, 87, 34, 0.04)'
                }
              }}
            >
              Cancel Unstake
            </Button>
          )}
        </Box>
      </Box>

      {/* Total Staked Info & Lock Period */}
      {/* <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 1,
        mb: 2
      }}>
        <Box sx={{ 
          p: 1.5, 
          backgroundColor: 'rgba(255, 255, 255, 0.5)', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <TrendingUpIcon sx={{ fontSize: 16, color: '#f57c00' }} />
          <Typography variant="caption" color="text.secondary">
            Total Staked: <strong>{totalStaked} FACY</strong>
          </Typography>
        </Box>
        
        <Box sx={{ 
          p: 1.5, 
          backgroundColor: 'rgba(255, 255, 255, 0.5)', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <ScheduleIcon sx={{ fontSize: 16, color: '#f57c00' }} />
          <Typography variant="caption" color="text.secondary">
            Lock Period: <strong>{lockPeriod ? formatLockPeriod(lockPeriod) : 'Loading...'}</strong>
          </Typography>
        </Box>
      </Box> */}


      {/* Unstaking Positions Section */}
      {hasUnstakingActivity && (
        <Box sx={{ 
          mt: 2,
          p: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 2,
          border: '1px solid rgba(245, 124, 0, 0.2)'
        }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon sx={{ fontSize: 18 }} />
            Unstaking Positions
          </Typography>
          
          {unstakeRequests.map((request, index) => {
            const unlockTime = (Number(request.timestamp) + lockPeriod) * 1000;
            const isUnlocked = Date.now() >= unlockTime;
            const timeRemaining = isUnlocked ? 0 : Math.ceil((unlockTime - Date.now()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card key={request.id} sx={{ mb: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {request.amount} FACY
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Request #{request.id}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    {isUnlocked ? (
                      <Chip 
                        label="Ready to Withdraw" 
                        color="success" 
                        size="small"
                        icon={<UnlockIcon />}
                      />
                    ) : (
                      <Chip 
                        label={`${timeRemaining} day${timeRemaining > 1 ? 's' : ''} left`}
                        color="warning" 
                        size="small"
                        icon={<LockIcon />}
                      />
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      {new Date(Number(request.timestamp) * 1000).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

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

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="caption">
                Unstaking has a {lockPeriod ? formatLockPeriod(lockPeriod) : 'loading...'} lock period. 
                You can withdraw tokens after the lock period expires.
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleRequestUnstakeAll}
                disabled={txLoading || parseFloat(stakedAmount) <= 0}
                fullWidth
              >
                {txLoading ? <CircularProgress size={20} /> : 'Request Unstake All'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUnstakeDialog(false)} disabled={txLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleRequestUnstake} 
            variant="contained"
            disabled={txLoading || !unstakeAmount || parseFloat(unstakeAmount) <= 0}
          >
            {txLoading ? <CircularProgress size={20} /> : 'Request Unstake'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdrawDialog} onClose={() => setShowWithdrawDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WithdrawIcon />
            Withdraw Unstaked Tokens
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Available for withdrawal: {availableUnstakeAmount} FACY
            </Typography>
            
            <TextField
              fullWidth
              label="Amount to Withdraw"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button 
                      size="small" 
                      onClick={() => setWithdrawAmount(availableUnstakeAmount)}
                      disabled={parseFloat(availableUnstakeAmount) <= 0}
                    >
                      MAX
                    </Button>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />

            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="caption">
                These tokens are ready for immediate withdrawal (lock period has expired).
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleWithdrawAll}
                disabled={txLoading || parseFloat(availableUnstakeAmount) <= 0}
                fullWidth
              >
                {txLoading ? <CircularProgress size={20} /> : 'Withdraw All Available'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWithdrawDialog(false)} disabled={txLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleWithdraw} 
            variant="contained"
            disabled={txLoading || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
          >
            {txLoading ? <CircularProgress size={20} /> : 'Withdraw'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Unstake Dialog */}
      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CancelIcon />
            Cancel Unstake Requests
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Total pending unstake: {totalUnstakeAmount} FACY
            </Typography>
            
            <TextField
              fullWidth
              label="Amount to Cancel"
              value={cancelAmount}
              onChange={(e) => setCancelAmount(e.target.value)}
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button 
                      size="small" 
                      onClick={() => setCancelAmount(totalUnstakeAmount)}
                      disabled={parseFloat(totalUnstakeAmount) <= 0}
                    >
                      MAX
                    </Button>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />

            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="caption">
                Cancelling will return tokens to your staked balance. Newest unstake requests are cancelled first (LIFO).
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelDialog(false)} disabled={txLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleCancel} 
            variant="contained"
            color="warning"
            disabled={txLoading || !cancelAmount || parseFloat(cancelAmount) <= 0}
          >
            {txLoading ? <CircularProgress size={20} /> : 'Cancel Unstake'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StakingSection;