import { useState, useEffect } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { BASE_SEPOLIA_CHAIN_ID } from '../config/web3Config';

export const useChainSwitching = () => {
  const { chain } = useAccount();
  const { switchChain, isPending: isSwitching, error: switchError } = useSwitchChain();
  const [isWrongChain, setIsWrongChain] = useState(false);

  // Check if user is on the correct chain
  useEffect(() => {
    if (chain) {
      setIsWrongChain(chain.id !== BASE_SEPOLIA_CHAIN_ID);
    }
  }, [chain]);

  // Switch to Base Sepolia
  const switchToBaseSepolia = async () => {
    try {
      await switchChain({ chainId: BASE_SEPOLIA_CHAIN_ID });
      return true;
    } catch (error) {
      console.error('Failed to switch chain:', error);
      return false;
    }
  };

  // Auto-switch when needed
  const ensureCorrectChain = async () => {
    if (isWrongChain) {
      return await switchToBaseSepolia();
    }
    return true;
  };

  return {
    isWrongChain,
    isSwitching,
    switchError,
    currentChainId: chain?.id,
    targetChainId: BASE_SEPOLIA_CHAIN_ID,
    switchToBaseSepolia,
    ensureCorrectChain
  };
};