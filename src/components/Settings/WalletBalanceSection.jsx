'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  Chip
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  ContentCopy as CopyIcon,
  Subscriptions as SubscriptionIcon,
  Settings as ManageIcon
} from '@mui/icons-material';
import { useReadContract, useBalance, useWriteContract, useWaitForTransactionReceipt, useSendTransaction } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { useWallets } from '@privy-io/react-auth';
import { CONTRACTS, ERC20_ABI as CONFIG_ERC20_ABI } from '@/config/web3Config';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePaymentVault } from '@/hooks/usePaymentVault';

const FACY_TOKEN_ADDRESS = CONTRACTS.FACY_TOKEN;
const BASE_CHAIN_ID = 8453; // Base Mainnet

// ERC20 ABI for balance checking
const ERC20_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const WalletBalanceSection = ({ walletAddress }) => {
  const router = useRouter();
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [transferType, setTransferType] = useState(''); // 'facy' or 'eth'
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');

  // Subscription data
  const {
    userSubscription,
    hasActiveSubscription,
    planData,
    isLoading: subscriptionLoading
  } = usePaymentVault();

  // Wagmi hooks for contract interactions
  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  
  // ETH transfer hooks
  const { sendTransaction, data: ethHash, error: ethError, isPending: ethPending } = useSendTransaction();
  const { isLoading: ethConfirming, isSuccess: ethConfirmed } = useWaitForTransactionReceipt({
    hash: ethHash,
  });
  
  const { wallets } = useWallets();

  // Read FACY token balance
  const { data: facyBalance, refetch: refetchFacyBalance } = useReadContract({
    address: FACY_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [walletAddress],
    enabled: !!walletAddress,
    chainId: BASE_CHAIN_ID
  });

  // Read ETH balance
  const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
    address: walletAddress,
    chainId: BASE_CHAIN_ID,
    enabled: !!walletAddress
  });

  // Handle FACY transfer success
  useEffect(() => {
    if (isConfirmed && transferType === 'facy') {
      setTransferSuccess(`FACY transfer successful! Transaction: ${hash}`);
      setTransferLoading(false);
      
      // Reset form for FACY transfers
      setRecipientAddress('');
      setTransferAmount('');
      setTransferDialogOpen(false);
      
      // Refresh balances
      setTimeout(() => {
        refetchFacyBalance();
        refetchEthBalance();
      }, 2000);
    }
  }, [isConfirmed, hash, transferType, refetchFacyBalance, refetchEthBalance]);

  // Handle ETH transfer success
  useEffect(() => {
    if (ethConfirmed && transferType === 'eth') {
      setTransferSuccess(`ETH transfer successful! Transaction: ${ethHash}`);
      setTransferLoading(false);
      
      // Reset form for ETH transfers
      setRecipientAddress('');
      setTransferAmount('');
      setTransferDialogOpen(false);
      
      // Refresh balances
      setTimeout(() => {
        refetchFacyBalance();
        refetchEthBalance();
      }, 2000);
    }
  }, [ethConfirmed, ethHash, transferType, refetchFacyBalance, refetchEthBalance]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      setTransferError(writeError.message || 'Transaction failed');
      setTransferLoading(false);
    }
  }, [writeError]);

  // Handle ETH transfer errors
  useEffect(() => {
    if (ethError) {
      setTransferError(ethError.message || 'ETH transfer failed');
      setTransferLoading(false);
    }
  }, [ethError]);

  const handleTransfer = async () => {
    if (!recipientAddress || !transferAmount) {
      setTransferError('Please fill in all fields');
      return;
    }

    setTransferLoading(true);
    setTransferError('');

    try {
      if (transferType === 'eth') {
        // Transfer ETH using wagmi sendTransaction
        await sendTransaction({
          to: recipientAddress,
          value: parseEther(transferAmount),
          chainId: BASE_CHAIN_ID,
        });
      } else if (transferType === 'facy') {
        // Transfer FACY tokens using wagmi writeContract
        await writeContract({
          address: FACY_TOKEN_ADDRESS,
          abi: CONFIG_ERC20_ABI,
          functionName: 'transfer',
          args: [recipientAddress, parseEther(transferAmount)],
          chainId: BASE_CHAIN_ID,
        });
      }
      // Form will be reset in useEffect when transaction confirms
    } catch (error) {
      console.error('Transfer error:', error);
      setTransferError(error.message || 'Transfer failed');
    } finally {
      setTransferLoading(false);
    }
  };

  const openTransferDialog = (type) => {
    setTransferType(type);
    setTransferDialogOpen(true);
    setTransferError('');
    setTransferSuccess('');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  const refreshBalances = () => {
    refetchFacyBalance();
    refetchEthBalance();
  };

  // Helper function to format subscription status
  const getSubscriptionStatus = () => {
    // Get plan name - default to "Basic Plan" if no subscription
    const getPlanName = () => {
      if (!userSubscription) return 'Basic Plan';
      if (planData && planData.name) return planData.name;
      return 'Essential Plan'; // Default fallback for subscribed users
    };

    const planName = getPlanName();
    
    if (!userSubscription) {
      return { 
        status: 'No Subscription', 
        planName: planName,
        color: '#757575', 
        bgColor: 'rgba(117, 117, 117, 0.05)' 
      };
    }
    
    const now = Math.floor(Date.now() / 1000);
    const endTime = Number(userSubscription.endTime);
    const status = userSubscription.status ? Number(userSubscription.status) : 0;
    
    if (status === 3) {
      if (endTime > now) {
        return { 
          status: 'Cancelled (Active)', 
          planName: planName,
          color: '#ff9800', 
          bgColor: 'rgba(255, 152, 0, 0.05)' 
        };
      } else {
        return { 
          status: 'Expired', 
          planName: planName,
          color: '#f44336', 
          bgColor: 'rgba(244, 67, 54, 0.05)' 
        };
      }
    }
    
    if (hasActiveSubscription) {
      return { 
        status: 'Active', 
        planName: planName,
        color: '#4caf50', 
        bgColor: 'rgba(76, 175, 80, 0.05)' 
      };
    }
    
    return { 
      status: 'Inactive', 
      planName: planName,
      color: '#757575', 
      bgColor: 'rgba(117, 117, 117, 0.05)' 
    };
  };

  // Helper function to format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const subscriptionStatusData = getSubscriptionStatus();

  return (
    <>
      <Box sx={{ 
        p: 2, 
        border: 1, 
        borderColor: 'divider', 
        borderRadius: 2,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <WalletIcon sx={{ fontSize: 20, color: '#1976d2' }} />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Wallet Balances
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={refreshBalances}
              variant="outlined"
            >
              Refresh
            </Button>
            <Button
              size="small"
              startIcon={<CopyIcon />}
              onClick={copyAddress}
              variant="outlined"
            >
              Copy Address
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Subscription Status */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            bgcolor: subscriptionStatusData.bgColor,
            borderRadius: 1,
            border: `1px solid ${subscriptionStatusData.color}20`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SubscriptionIcon sx={{ color: subscriptionStatusData.color }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {subscriptionStatusData.planName}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: subscriptionStatusData.color }}>
                  {subscriptionStatusData.status}
                </Typography>
                {userSubscription && (
                  <Typography variant="caption" color="text.secondary">
                    {userSubscription.endTime ? `Expires: ${formatDate(userSubscription.endTime)}` : 'No expiry date'}
                  </Typography>
                )}
              </Box>
            </Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ManageIcon />}
              onClick={() => router.push('/subscriptions')}
              sx={{ 
                borderColor: subscriptionStatusData.color,
                color: subscriptionStatusData.color,
                '&:hover': {
                  borderColor: subscriptionStatusData.color,
                  bgcolor: subscriptionStatusData.bgColor
                }
              }}
            >
              Manage
            </Button>
          </Box>

          {/* ETH Balance */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            bgcolor: 'rgba(25, 118, 210, 0.05)',
            borderRadius: 1,
            border: '1px solid rgba(25, 118, 210, 0.1)'
          }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                ETH Balance
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {ethBalance?.value ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : '0.0000'} ETH
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<SendIcon />}
              onClick={() => openTransferDialog('eth')}
              disabled={!ethBalance?.value || ethBalance.value === 0n}
            >
              Transfer
            </Button>
          </Box>

          {/* FACY Balance */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            bgcolor: 'rgba(156, 39, 176, 0.05)',
            borderRadius: 1,
            border: '1px solid rgba(156, 39, 176, 0.1)'
          }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                FACY Balance
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                {facyBalance ? parseFloat(formatEther(facyBalance)).toFixed(2) : '0.00'} FACY
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<SendIcon />}
              onClick={() => openTransferDialog('facy')}
              disabled={!facyBalance || facyBalance === '0'}
              sx={{ bgcolor: '#9c27b0', '&:hover': { bgcolor: '#7b1fa2' } }}
            >
              Transfer
            </Button>
          </Box>
        </Box>

        {transferSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {transferSuccess}
          </Alert>
        )}
      </Box>

      {/* Transfer Dialog */}
      <Dialog open={transferDialogOpen} onClose={() => setTransferDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Send {transferType === 'eth' ? 'ETH' : 'FACY'} Tokens
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Recipient Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x..."
              fullWidth
              helperText="Enter the wallet address to send tokens to"
            />
            <TextField
              label="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              type="number"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Chip 
                      label={transferType === 'eth' ? 'ETH' : 'FACY'} 
                      size="small" 
                      color={transferType === 'eth' ? 'primary' : 'secondary'}
                    />
                  </InputAdornment>
                ),
              }}
              helperText={`Available: ${
                transferType === 'eth' 
                  ? (ethBalance ? parseFloat(formatEther(ethBalance)).toFixed(4) : '0.0000') + ' ETH'
                  : (facyBalance ? parseFloat(formatEther(facyBalance)).toFixed(2) : '0.00') + ' FACY'
              }`}
            />
            
            {transferError && (
              <Alert severity="error">
                {transferError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleTransfer} 
            variant="contained"
            disabled={transferLoading || !recipientAddress || !transferAmount}
            startIcon={transferLoading ? <CircularProgress size={16} /> : <SendIcon />}
          >
            {transferLoading ? 'Sending...' : `Send ${transferType === 'eth' ? 'ETH' : 'FACY'}`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WalletBalanceSection;