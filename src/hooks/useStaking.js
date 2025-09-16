import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACTS, BASE_SEPOLIA_CHAIN_ID, ERC20_ABI, parseTokenAmount, formatTokenAmount, BASE_MAINNET_CHAIN_ID } from '../config/web3Config';
import StakingVaultABI from '../contracts/StakingVault.json';

export const useStaking = () => {
  const { address: userAddress, isConnected, chain } = useAccount();
  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  const { switchChain } = useSwitchChain();
  const [error, setError] = useState(null);

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Helper function to ensure we're on the correct chain
  const ensureCorrectChain = async () => {
    if (chain?.id !== BASE_MAINNET_CHAIN_ID) {
      try {
        await switchChain({ chainId: BASE_MAINNET_CHAIN_ID });
      } catch (err) {
        throw new Error('Please switch to Base Mainnet to continue');
      }
    }
  };

  // Read contract hooks for fetching data
  const { data: facyBalance, refetch: refetchFacyBalance } = useReadContract({
    address: CONTRACTS.FACY_TOKEN,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [userAddress],
    chainId: BASE_MAINNET_CHAIN_ID,
    query: { enabled: !!userAddress }
  });

  const { data: stakedAmount, refetch: refetchStakedAmount } = useReadContract({
    address: CONTRACTS.STAKING_VAULT,
    abi: StakingVaultABI.abi,
    functionName: 'getUserStake',
    args: [userAddress],
    chainId: BASE_MAINNET_CHAIN_ID,
    query: { enabled: !!userAddress }
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.FACY_TOKEN,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [userAddress, CONTRACTS.STAKING_VAULT],
    chainId: BASE_MAINNET_CHAIN_ID,
    query: { enabled: !!userAddress }
  });

  const { data: totalStaked, refetch: refetchTotalStaked } = useReadContract({
    address: CONTRACTS.STAKING_VAULT,
    abi: StakingVaultABI.abi,
    functionName: 'getTotalStaked',
    chainId: BASE_MAINNET_CHAIN_ID
  });

  const { data: isStakingPaused, refetch: refetchStakingStatus } = useReadContract({
    address: CONTRACTS.STAKING_VAULT,
    abi: StakingVaultABI.abi,
    functionName: 'isStakingPaused',
    chainId: BASE_MAINNET_CHAIN_ID
  });

  // Refresh all data
  const refreshData = useCallback(async () => {
    if (!userAddress) return;
    
    try {
      await Promise.all([
        refetchFacyBalance(),
        refetchStakedAmount(),
        refetchAllowance(),
        refetchTotalStaked(),
        refetchStakingStatus()
      ]);
    } catch (err) {
      console.error('Error refreshing staking data:', err);
      setError('Failed to refresh data');
    }
  }, [userAddress, refetchFacyBalance, refetchStakedAmount, refetchAllowance, refetchTotalStaked, refetchStakingStatus]);

  // Approve FACY tokens for staking
  const approveFacy = async (amount) => {
    if (!isConnected) throw new Error('Wallet not connected');
    
    // Ensure we're on Base Sepolia
    await ensureCorrectChain();
    
    setError(null);
    
    try {
      const amountBigInt = parseTokenAmount(amount);
      
      const result = await writeContract({
        address: CONTRACTS.FACY_TOKEN,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACTS.STAKING_VAULT, amountBigInt],
        chainId: BASE_MAINNET_CHAIN_ID
      });
      
      // Return the transaction hash from writeContract result
      return result;
    } catch (err) {
      console.error('Error approving FACY:', err);
      setError('Failed to approve FACY tokens');
      throw err;
    }
  };

  // Stake FACY tokens
  const stakeFacy = async (amount) => {
    if (!isConnected) throw new Error('Wallet not connected');
    
    // Ensure we're on Base Sepolia
    await ensureCorrectChain();
    
    setError(null);
    
    try {
      const amountBigInt = parseTokenAmount(amount);
      
      // Pre-flight checks
      if (amountBigInt <= 0n) {
        throw new Error('Amount must be greater than 0');
      }
      
      // Check if staking is paused
      if (isStakingPaused) {
        throw new Error('Staking is currently paused');
      }
      
      // Check user balance
      const userBalance = facyBalance ? parseTokenAmount(facyBalance) : 0n;
      if (amountBigInt > userBalance) {
        throw new Error(`Insufficient FACY balance. You have ${facyBalance} FACY`);
      }
      
      // Check allowance
      const currentAllowance = allowance ? parseTokenAmount(allowance) : 0n;
      if (amountBigInt > currentAllowance) {
        throw new Error(`Insufficient allowance. Please approve ${amount} FACY tokens first`);
      }
      
      // Stake tokens
      await writeContract({
        address: CONTRACTS.STAKING_VAULT,
        abi: StakingVaultABI.abi,
        functionName: 'stake',
        args: [amountBigInt],
        chainId: BASE_MAINNET_CHAIN_ID
      });
      
      // Return a promise that resolves when the transaction is submitted
      return new Promise((resolve, reject) => {
        // Set up a timeout to prevent infinite waiting
        const timeout = setTimeout(() => {
          reject(new Error('Transaction submission timeout'));
        }, 30000); // 30 second timeout

        const checkHash = () => {
          if (hash) {
            console.log('Hash available:', hash);
            clearTimeout(timeout);
            resolve(hash);
          } else {
            setTimeout(checkHash, 50); // Check more frequently
          }
        };
        
        // Start checking immediately
        setTimeout(checkHash, 50);
      });
    } catch (err) {
      console.error('Error staking FACY:', err);
      
      // Parse specific contract errors
      let errorMessage = 'Failed to stake FACY tokens';
      if (err.message.includes('ZeroAmount')) {
        errorMessage = 'Amount cannot be zero';
      } else if (err.message.includes('StakingPaused')) {
        errorMessage = 'Staking is currently paused';
      } else if (err.message.includes('InsufficientBalance')) {
        errorMessage = 'Insufficient FACY balance';
      } else if (err.message.includes('allowance')) {
        errorMessage = 'Please approve FACY tokens first';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Unstake FACY tokens
  const unstakeFacy = async (amount) => {
    if (!isConnected) throw new Error('Wallet not connected');
    
    // Ensure we're on Base Sepolia
    await ensureCorrectChain();
    
    setError(null);
    
    try {
      const amountBigInt = parseTokenAmount(amount);
      
      const result = await writeContract({
        address: CONTRACTS.STAKING_VAULT,
        abi: StakingVaultABI.abi,
        functionName: 'unstake',
        args: [amountBigInt],
        chainId: BASE_MAINNET_CHAIN_ID
      });
      
      return result;
    } catch (err) {
      console.error('Error unstaking FACY:', err);
      setError('Failed to unstake FACY tokens');
      throw err;
    }
  };

  // Unstake all FACY tokens
  const unstakeAll = async () => {
    if (!isConnected) throw new Error('Wallet not connected');
    
    // Ensure we're on Base Sepolia
    await ensureCorrectChain();
    
    setError(null);
    
    try {
      const result = await writeContract({
        address: CONTRACTS.STAKING_VAULT,
        abi: StakingVaultABI.abi,
        functionName: 'unstakeAll',
        chainId: BASE_MAINNET_CHAIN_ID
      });
      
      return result;
    } catch (err) {
      console.error('Error unstaking all FACY:', err);
      setError('Failed to unstake all FACY tokens');
      throw err;
    }
  };

  // Auto-refresh data after successful transactions
  useEffect(() => {
    if (isConfirmed) {
      refreshData();
    }
  }, [isConfirmed, refreshData]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      setError(writeError.message || 'Transaction failed');
    }
  }, [writeError]);

  return {
    // State
    facyBalance: facyBalance ? formatTokenAmount(facyBalance) : '0',
    stakedAmount: stakedAmount ? formatTokenAmount(stakedAmount) : '0',
    allowance: allowance ? formatTokenAmount(allowance) : '0',
    totalStaked: totalStaked ? formatTokenAmount(totalStaked) : '0',
    isStakingPaused: isStakingPaused || false,
    loading: false, // Remove global loading state that interferes with local txLoading
    error,
    userAddress,
    
    // Actions
    approveFacy,
    stakeFacy,
    unstakeFacy,
    unstakeAll,
    refreshData,
    
    // Utilities
    isConnected,
    hasAllowance: (amount) => {
      const allowanceNum = allowance ? parseFloat(formatTokenAmount(allowance)) : 0;
      return allowanceNum >= parseFloat(amount || '0');
    },
    canStake: (amount) => {
      if (!isConnected || isStakingPaused) return false;
      if (!amount || parseFloat(amount) <= 0) return false;
      const balance = facyBalance ? parseFloat(formatTokenAmount(facyBalance)) : 0;
      return parseFloat(amount) <= balance;
    }
  };
};