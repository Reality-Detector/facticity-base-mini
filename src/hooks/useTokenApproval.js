import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther, maxUint256 } from 'viem';
import { BASE_SEPOLIA_CHAIN_ID } from '../config/web3Config';
import { useChainSwitching } from './useChainSwitching';

// Standard ERC20 ABI for approve and allowance functions
const ERC20_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export const useTokenApproval = (tokenAddress, spenderAddress) => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Chain switching functionality
  const { isWrongChain, isSwitching, ensureCorrectChain, currentChainId, targetChainId } = useChainSwitching();

  // Contract write hook
  const { writeContract, data: writeData, error: writeError, isPending } = useWriteContract();

  // Transaction receipt hook
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Read current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address, spenderAddress],
    enabled: !!address && !!tokenAddress && !!spenderAddress,
    chainId: BASE_SEPOLIA_CHAIN_ID
  });

  // Read token balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address && !!tokenAddress,
    chainId: BASE_SEPOLIA_CHAIN_ID
  });

  // Check if approval is needed
  const needsApproval = (requiredAmount) => {
    if (!allowance || !requiredAmount) return true;
    return BigInt(allowance) < parseEther(requiredAmount.toString());
  };

  // Check if user has sufficient balance
  const hasSufficientBalance = (requiredAmount) => {
    if (!balance || !requiredAmount) return false;
    return BigInt(balance) >= parseEther(requiredAmount.toString());
  };

  // Approve tokens
  const approve = async (amount) => {
    try {
      setIsLoading(true);
      setError(null);

      // Ensure user is on the correct chain before proceeding
      const chainSwitched = await ensureCorrectChain();
      if (!chainSwitched) {
        throw new Error('Please switch to Base Sepolia testnet to continue');
      }

      const approvalAmount = amount === 'max' ? maxUint256 : parseEther(amount.toString());

      const result = await writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spenderAddress, approvalAmount],
        chainId: BASE_SEPOLIA_CHAIN_ID
      });

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch data after transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      refetchAllowance();
      refetchBalance();
    }
  }, [isConfirmed, refetchAllowance, refetchBalance]);

  return {
    // State
    isLoading: isLoading || isPending || isConfirming,
    error: error || writeError?.message,
    txHash: writeData,
    isConfirmed,
    
    // Data
    allowance: allowance ? formatEther(allowance) : '0',
    balance: balance ? formatEther(balance) : '0',
    
    // Functions
    approve,
    needsApproval,
    hasSufficientBalance,
    
    // Chain switching
    isWrongChain,
    isSwitching,
    currentChainId,
    targetChainId,
    
    // Refetch functions
    refetchAllowance,
    refetchBalance,
  };
};

export default useTokenApproval;