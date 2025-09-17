import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { CONTRACTS, BASE_MAINNET_CHAIN_ID, ERC20_ABI, formatTokenAmount } from '../config/web3Config';
import StakedTokenABI from '../contracts/StakedToken.json';

export const useVirtualsStaking = () => {
  const { address: userAddress, isConnected, chain } = useAccount();
  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  const { switchChain } = useSwitchChain();
  const [error, setError] = useState(null);
  const [stakingPositions, setStakingPositions] = useState([]);
  const [totalStakedAmount, setTotalStakedAmount] = useState('0');

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
  const { data: baseToken, refetch: refetchBaseToken } = useReadContract({
    address: CONTRACTS.VIRTUALS_STAKING,
    abi: StakedTokenABI.abi,
    functionName: 'baseToken',
    chainId: BASE_MAINNET_CHAIN_ID,
    query: { enabled: !!userAddress }
  });

  const { data: userStakedAmount, refetch: refetchUserStakedAmount } = useReadContract({
    address: CONTRACTS.VIRTUALS_STAKING,
    abi: StakedTokenABI.abi,
    functionName: 'stakedAmountOf',
    args: [userAddress],
    chainId: BASE_MAINNET_CHAIN_ID,
    query: { enabled: !!userAddress }
  });

  const { data: numPositions, refetch: refetchNumPositions } = useReadContract({
    address: CONTRACTS.VIRTUALS_STAKING,
    abi: StakedTokenABI.abi,
    functionName: 'numPositions',
    args: [userAddress],
    chainId: BASE_MAINNET_CHAIN_ID,
    query: { enabled: !!userAddress }
  });

  // Get user positions using contract hook
  const { data: userPositions, refetch: refetchPositions } = useReadContract({
    address: CONTRACTS.VIRTUALS_STAKING,
    abi: StakedTokenABI.abi,
    functionName: 'getPositions',
    args: [userAddress, 0n, numPositions || 0n],
    chainId: BASE_MAINNET_CHAIN_ID,
    query: { enabled: !!userAddress && !!numPositions }
  });

  // Process positions data
  const processPositionsData = useCallback(() => {
    if (!userPositions || !Array.isArray(userPositions)) {
      return { positions: [], totalStaked: '0' };
    }
    
    const activePositions = [];
    let totalStaked = 0n;
    
    userPositions.forEach((position) => {
      // Position structure: { amount, start, end, numWeeks, autoRenew, id }
      const netAmount = position.amount;
      
      if (netAmount > 0n) {
        activePositions.push({
          idParam: position.id.toString(),
          stakedAmount: formatTokenAmount(position.amount),
          withdrawnAmount: '0', // Contract doesn't track withdrawn amount separately
          netAmount: formatTokenAmount(netAmount),
          startTime: Number(position.start),
          endTime: Number(position.end),
          numWeeks: Number(position.numWeeks),
          autoRenew: position.autoRenew
        });
        totalStaked += netAmount;
      }
    });
    
    // Sort by id descending (most recent first)
    activePositions.sort((a, b) => parseInt(b.idParam) - parseInt(a.idParam));
    
    return {
      positions: activePositions,
      totalStaked: formatTokenAmount(totalStaked)
    };
  }, [userPositions]);

  // Update staking data when positions change
  useEffect(() => {
    const { positions, totalStaked } = processPositionsData();
    setStakingPositions(positions);
    setTotalStakedAmount(totalStaked);
  }, [processPositionsData]);

  // Stake tokens
  const stakeTokens = async (amount) => {
    if (!isConnected) throw new Error('Wallet not connected');
    
    // Ensure we're on Base mainnet
    await ensureCorrectChain();
    
    setError(null);
    
    try {
      const result = await writeContract({
        address: CONTRACTS.VIRTUALS_STAKING,
        abi: StakedTokenABI.abi,
        functionName: 'stake',
        args: [BigInt(amount)],
        chainId: BASE_MAINNET_CHAIN_ID
      });
      
      return result;
    } catch (err) {
      console.error('Error staking tokens:', err);
      setError('Failed to stake tokens');
      throw err;
    }
  };

  // Withdraw tokens from a specific position
  const withdrawFromPosition = async (idParam) => {
    if (!isConnected) throw new Error('Wallet not connected');
    
    // Ensure we're on Base mainnet
    await ensureCorrectChain();
    
    setError(null);
    
    try {
      const result = await writeContract({
        address: CONTRACTS.VIRTUALS_STAKING,
        abi: StakedTokenABI.abi,
        functionName: 'withdraw',
        args: [BigInt(idParam)],
        chainId: BASE_MAINNET_CHAIN_ID
      });
      
      return result;
    } catch (err) {
      console.error('Error withdrawing from position:', err);
      setError('Failed to withdraw from position');
      throw err;
    }
  };

  // Refresh all data
  const refreshData = useCallback(async () => {
    try {
      await Promise.all([
        refetchBaseToken(),
        refetchNumPositions(),
        refetchPositions()
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  }, [refetchBaseToken, refetchNumPositions, refetchPositions]);

  // Auto-refresh data when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      refreshData();
    }
  }, [isConfirmed, refreshData]);

  return {
    // State
    stakingPositions,
    totalStakedAmount,
    userStakedAmount: userStakedAmount ? formatTokenAmount(userStakedAmount) : '0',
    numPositions: numPositions ? Number(numPositions) : 0,
    baseToken,
    loading: false,
    error,
    userAddress,
    
    // Transaction states
    isPending,
    isConfirming,
    isConfirmed,
    
    // Actions
    stakeTokens,
    withdrawFromPosition,
    refreshData,
    
    // Utilities
    isConnected,
    hasStakedTokens: () => {
      return parseFloat(totalStakedAmount) > 0;
    },
    canStake: () => {
      return isConnected && chain?.id === BASE_MAINNET_CHAIN_ID;
    }
  };
};