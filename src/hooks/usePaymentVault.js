import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import PaymentVaultABI from '../contracts/PaymentVault.json';
import { BASE_SEPOLIA_CHAIN_ID } from '../config/web3Config';
import { useChainSwitching } from './useChainSwitching';

// Contract configuration
const PAYMENT_VAULT_ADDRESS = '0x3E0911d6C0fa146C3006a2bc186c815fcF566243'; // Base Sepolia testnet
const FACY_TOKEN_ADDRESS = '0xd87ea5f46615e1175c909610766e853faa5f94be'; // FACY token address

export const usePaymentVault = () => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  
  // Chain switching functionality
  const { isWrongChain, isSwitching, ensureCorrectChain, currentChainId, targetChainId } = useChainSwitching();

  // Contract write hook
  const { writeContract, data: writeData, error: writeError, isPending } = useWriteContract();

  // Transaction receipt hook
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Read contract hooks
  const { data: paymentToken } = useReadContract({
    address: PAYMENT_VAULT_ADDRESS,
    abi: PaymentVaultABI.abi,
    functionName: 'paymentToken',
    chainId: BASE_SEPOLIA_CHAIN_ID
  });

  const { data: userSubscription, refetch: refetchSubscription } = useReadContract({
    address: PAYMENT_VAULT_ADDRESS,
    abi: PaymentVaultABI.abi,
    functionName: 'getSubscription',
    args: [address],
    enabled: !!address,
    chainId: BASE_SEPOLIA_CHAIN_ID
  });

  const { data: hasActiveSubscription, refetch: refetchActiveStatus } = useReadContract({
    address: PAYMENT_VAULT_ADDRESS,
    abi: PaymentVaultABI.abi,
    functionName: 'hasActiveSubscription',
    args: [address],
    enabled: !!address,
    chainId: BASE_SEPOLIA_CHAIN_ID
  });

  // Get plan details - using useReadContract hook instead
  const { data: planData } = useReadContract({
    address: PAYMENT_VAULT_ADDRESS,
    abi: PaymentVaultABI.abi,
    functionName: 'getPlan',
    args: [1], // Essential plan ID
    chainId: BASE_SEPOLIA_CHAIN_ID
  });

  // Subscribe to a plan
  const subscribe = async (planId, tokenAmount, autoRenew = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Ensure user is on the correct chain before proceeding
      const chainSwitched = await ensureCorrectChain();
      if (!chainSwitched) {
        throw new Error('Please switch to Base Sepolia testnet to continue');
      }

      const result = await writeContract({
        address: PAYMENT_VAULT_ADDRESS,
        abi: PaymentVaultABI.abi,
        functionName: 'subscribe',
        args: [planId, parseEther(tokenAmount.toString()), autoRenew],
        chainId: BASE_SEPOLIA_CHAIN_ID
      });

      setTxHash(result);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Ensure user is on the correct chain before proceeding
      const chainSwitched = await ensureCorrectChain();
      if (!chainSwitched) {
        throw new Error('Please switch to Base Sepolia testnet to continue');
      }

      const result = await writeContract({
        address: PAYMENT_VAULT_ADDRESS,
        abi: PaymentVaultABI.abi,
        functionName: 'cancelSubscription',
        chainId: BASE_SEPOLIA_CHAIN_ID
      });

      setTxHash(result);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle auto-renew
  const toggleAutoRenew = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Ensure user is on the correct chain before proceeding
      const chainSwitched = await ensureCorrectChain();
      if (!chainSwitched) {
        throw new Error('Please switch to Base Sepolia testnet to continue');
      }

      const result = await writeContract({
        address: PAYMENT_VAULT_ADDRESS,
        abi: PaymentVaultABI.abi,
        functionName: 'toggleAutoRenew',
        chainId: BASE_SEPOLIA_CHAIN_ID
      });

      setTxHash(result);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Price caching state
  const [cachedPrice, setCachedPrice] = useState(null);
  const [lastPriceUpdate, setLastPriceUpdate] = useState(null);
  const [priceUpdateInterval, setPriceUpdateInterval] = useState(5 * 60 * 1000); // 5 minutes in ms

  // Fetch token price from Virtuals API
  const fetchTokenPrice = async (forceRefresh = false) => {
    try {
      // Check if we have cached price and it's still valid
      const now = Date.now();
      if (!forceRefresh && cachedPrice && lastPriceUpdate && (now - lastPriceUpdate) < priceUpdateInterval) {
        return cachedPrice;
      }

      const response = await fetch('https://api2.virtuals.io/api/virtuals/35498/trade-data');
      const data = await response.json();
      const price = parseFloat(data.data.base_token_price_usd) || 0.031; // Fallback price
      
      // Cache the price
      setCachedPrice(price);
      setLastPriceUpdate(now);
      
      return price;
    } catch (error) {
      console.error('Error fetching token price:', error);
      return cachedPrice || 0.031; // Return cached price or fallback
    }
  };

  // Calculate required tokens for USD amount
  const calculateRequiredTokens = async (usdAmount, forceRefresh = false) => {
    const tokenPrice = await fetchTokenPrice(forceRefresh);
    return usdAmount / tokenPrice;
  };

  // Set custom price update interval
  const setPriceRefreshInterval = (intervalMinutes) => {
    setPriceUpdateInterval(intervalMinutes * 60 * 1000);
  };

  // Force price refresh
  const refreshPrice = async () => {
    return await fetchTokenPrice(true);
  };

  // Refetch data after transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      refetchSubscription();
      refetchActiveStatus();
    }
  }, [isConfirmed, refetchSubscription, refetchActiveStatus]);

  return {
    // State
    isLoading: isLoading || isPending || isConfirming,
    error: error || writeError?.message,
    txHash: writeData || txHash,
    isConfirmed,
    
    // Data
    paymentToken,
    userSubscription,
    hasActiveSubscription,
    planData,
    
    // Functions
    subscribe,
    cancelSubscription,
    toggleAutoRenew,
    fetchTokenPrice,
    calculateRequiredTokens,
    setPriceRefreshInterval,
    refreshPrice,
    
    // Price data
    cachedPrice,
    lastPriceUpdate,
    priceUpdateInterval,
    
    // Chain switching
    isWrongChain,
    isSwitching,
    currentChainId,
    targetChainId,
    
    // Refetch functions
    refetchSubscription,
    refetchActiveStatus,
  };
};

export default usePaymentVault;