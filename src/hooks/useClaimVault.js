import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { CONTRACTS, BASE_MAINNET_CHAIN_ID, formatTokenAmount } from '../config/web3Config';
import ClaimVaultABI from '../contracts/ClaimVault.json';

export const useClaimVault = () => {
  const { address: userAddress, isConnected, chain } = useAccount();
  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  const { switchChain } = useSwitchChain();
  const [error, setError] = useState(null);

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Helper function to ensure we're on the correct chain (Base testnet for ClaimVault)
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
  const { data: totalClaimableData, refetch: refetchTotalClaimable } = useReadContract({
    address: CONTRACTS.CLAIM_VAULT,
    abi: ClaimVaultABI.abi,
    functionName: 'getTotalClaimableAmount',
    args: [userAddress],
    chainId: BASE_MAINNET_CHAIN_ID,
    query: { enabled: !!userAddress }
  });

  const { data: shortestRemainingTime, refetch: refetchRemainingTime } = useReadContract({
    address: CONTRACTS.CLAIM_VAULT,
    abi: ClaimVaultABI.abi,
    functionName: 'getShortestRemainingClaimTime',
    chainId: BASE_MAINNET_CHAIN_ID
  });

  const { data: activeClaimPeriods, refetch: refetchActiveperiods } = useReadContract({
    address: CONTRACTS.CLAIM_VAULT,
    abi: ClaimVaultABI.abi,
    functionName: 'getActiveClaimPeriods',
    chainId: BASE_MAINNET_CHAIN_ID
  });

  const { data: currentPeriodId, refetch: refetchCurrentPeriod } = useReadContract({
    address: CONTRACTS.CLAIM_VAULT,
    abi: ClaimVaultABI.abi,
    functionName: 'currentPeriodId',
    chainId: BASE_MAINNET_CHAIN_ID
  });

  const { data: userClaimHistory, refetch: refetchClaimHistory } = useReadContract({
    address: CONTRACTS.CLAIM_VAULT,
    abi: ClaimVaultABI.abi,
    functionName: 'getUserClaimHistory',
    args: [userAddress],
    chainId: BASE_MAINNET_CHAIN_ID,
    query: { enabled: !!userAddress }
  });

  // Refresh all data
  const refreshData = useCallback(async () => {
    if (!userAddress) return;
    
    try {
      await Promise.all([
        refetchTotalClaimable(),
        refetchRemainingTime(),
        refetchActiveperiods(),
        refetchCurrentPeriod(),
        refetchClaimHistory()
      ]);
    } catch (err) {
      console.error('Error refreshing claim vault data:', err);
      setError('Failed to refresh data');
    }
  }, [userAddress, refetchTotalClaimable, refetchRemainingTime, refetchActiveperiods, refetchCurrentPeriod, refetchClaimHistory]);

  // Claim tokens from all available periods
  const claimTokens = async () => {
    if (!isConnected) throw new Error('Wallet not connected');
    
    // Ensure we're on Base mainnet
    await ensureCorrectChain();
    
    setError(null);
    
    try {
      // Check if there are tokens to claim
      if (!totalClaimableData || totalClaimableData[0] === 0n) {
        throw new Error('No tokens available to claim');
      }

      const result = await writeContract({
        address: CONTRACTS.CLAIM_VAULT,
        abi: ClaimVaultABI.abi,
        functionName: 'claimTokens',
        chainId: BASE_MAINNET_CHAIN_ID
      });
      
      return result;
    } catch (err) {
      console.error('Error claiming tokens:', err);
      
      // Parse specific contract errors
      let errorMessage = 'Failed to claim tokens';
      if (err.message.includes('NoAllocation')) {
        errorMessage = 'No tokens allocated for claiming';
      } else if (err.message.includes('AlreadyClaimed')) {
        errorMessage = 'Tokens already claimed for this period';
      } else if (err.message.includes('ClaimExpired')) {
        errorMessage = 'Claim period has expired';
      } else if (err.message.includes('PeriodNotActive')) {
        errorMessage = 'Claim period is not active';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Fetch user claim data from GraphQL subgraph
  const fetchUserClaimData = useCallback(async () => {
    if (!userAddress) return { claimHistory: [], totalClaimed: '0' };
    
    try {
      const query = `
        query GetUserClaims($user: String!) {
          tokensClaimeds(where: {user: $user}) {
            amount
            periodId
          }
        }
      `;
      
      const response = await fetch('https://api.goldsky.com/api/public/project_cmfezfldaja1j01vo2vbzc30c/subgraphs/claim-vault-base-mainnet/1.0.0/gn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            user: userAddress.toLowerCase()
          }
        })
      });
      
      const data = await response.json();
      
      if (data.errors) {
        console.error('GraphQL errors:', data.errors);
        return { claimHistory: [], totalClaimed: '0' };
      }
      
      const tokensClaimeds = data.data?.tokensClaimeds || [];
      
      // Extract unique period IDs and convert to BigInt
      const claimHistory = [...new Set(tokensClaimeds.map(claim => BigInt(claim.periodId)))];
      
      // Calculate total claimed amount
      let totalClaimed = 0n;
      tokensClaimeds.forEach(claim => {
        totalClaimed += BigInt(claim.amount);
      });
      
      return {
        claimHistory,
        totalClaimed: formatTokenAmount(totalClaimed)
      };
    } catch (err) {
      console.error('Error fetching claim data from GraphQL:', err);
      return { claimHistory: [], totalClaimed: '0' };
    }
  }, [userAddress]);

  // Get user's claim history (periods they've claimed from)
  const getUserClaimHistory = useCallback(async () => {
    const { claimHistory } = await fetchUserClaimData();
    return claimHistory;
  }, [fetchUserClaimData]);

  // Calculate total claimed tokens
  const calculateTotalClaimedTokens = useCallback(async () => {
    const { totalClaimed } = await fetchUserClaimData();
    return totalClaimed;
  }, [fetchUserClaimData]);

  // Claim tokens from a specific period
  const claimTokensFromPeriod = async (periodId) => {
    if (!isConnected) throw new Error('Wallet not connected');
    
    // Ensure we're on Base mainnet
    await ensureCorrectChain();
    
    setError(null);
    
    try {
      const claimedPeriods = await getUserClaimHistory();
      if (claimedPeriods.includes(BigInt(periodId))) {
        throw new Error('Tokens already claimed for this period');
      }

      const result = await writeContract({
        address: CONTRACTS.CLAIM_VAULT,
        abi: ClaimVaultABI.abi,
        functionName: 'claimTokensFromPeriod',
        args: [BigInt(periodId)],
        chainId: BASE_MAINNET_CHAIN_ID
      });
      
      return result;
    } catch (err) {
      console.error('Error claiming tokens from period:', err);
      setError('Failed to claim tokens from period');
      throw err;
    }
  };

  // Get claimable amount for a specific period
  const getClaimableAmountForPeriod = useCallback(async (periodId) => {
    if (!userAddress) return null;
    
    try {
      // This would need to be called directly since it's not in our read hooks
      // For now, we'll return null and implement if needed
      return null;
    } catch (err) {
      console.error('Error getting claimable amount for period:', err);
      return null;
    }
  }, [userAddress]);

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

  // Format time remaining in a human-readable format
  const formatTimeRemaining = (timeInSeconds) => {
    if (!timeInSeconds || timeInSeconds === 0n) return 'Expired';
    
    const seconds = Number(timeInSeconds);
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };

  return {
    // State
    totalClaimableAmount: totalClaimableData ? formatTokenAmount(totalClaimableData[0]) : '0',
    activePeriods: totalClaimableData ? totalClaimableData[1] : [],
    claimableAmounts: totalClaimableData ? totalClaimableData[2] : [],
    shortestRemainingTime: shortestRemainingTime || 0n,
    shortestRemainingTimeFormatted: formatTimeRemaining(shortestRemainingTime),
    activeClaimPeriods: activeClaimPeriods || [[], [], []], // [periodIds, startTimes, endTimes]
    currentPeriodId: currentPeriodId || 0n,
    userClaimHistory: userClaimHistory || [],
    claimedPeriodsCount: userClaimHistory ? userClaimHistory.length : 0,
    loading: false,
    error,
    userAddress,
    
    // Transaction states
    isPending,
    isConfirming,
    isConfirmed,
    
    // Actions
    claimTokens,
    claimTokensFromPeriod,
    refreshData,
    getClaimableAmountForPeriod,
    calculateTotalClaimedTokens,
    
    // Utilities
    isConnected,
    hasClaimableTokens: () => {
      return totalClaimableData && totalClaimableData[0] > 0n;
    },
    canClaim: () => {
      return isConnected && totalClaimableData && totalClaimableData[0] > 0n && shortestRemainingTime > 0n;
    },
    formatTimeRemaining
  };
};