// Base Sepolia testnet configuration
export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const BASE_MAINNET_CHAIN_ID = 8453;

// Contract addresses on Base Sepolia
export const CONTRACTS = {
    CLAIM_VAULT: '0x34d443a85E24C3294e05Ff49D4eA299E161c106e',
    STAKING_VAULT: '0xEE3A52F09269Ac634A5f2b806C4F5e7d9c050D8d', // Replace with actual address
    VIRTUALS_STAKING: '0x0bf72f32F51f004Bb92bD234bb49e5F30f78ffe8', // Base Mainnet - Virtuals Staking
    FACY_TOKEN: '0xFAC77f01957ed1B3DD1cbEa992199B8f85B6E886', // FACY token on Base Mainnet
};

// ERC20 ABI for FACY token interactions
export const ERC20_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "from", "type": "address"}, {"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "transferFrom",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {"internalType": "address", "name": "spender", "type": "address"}],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Helper function to format token amounts
export const formatTokenAmount = (amount, decimals = 18) => {
  if (!amount) return '0';
  const divisor = BigInt(10 ** decimals);
  const quotient = amount / divisor;
  const remainder = amount % divisor;
  
  if (remainder === 0n) {
    return quotient.toString();
  }
  
  const remainderStr = remainder.toString().padStart(decimals, '0');
  const trimmedRemainder = remainderStr.replace(/0+$/, '');
  
  if (trimmedRemainder === '') {
    return quotient.toString();
  }
  
  return `${quotient}.${trimmedRemainder}`;
};

// Helper function to parse token amounts
export const parseTokenAmount = (amount, decimals = 18) => {
  if (!amount || amount === '0') return 0n;
  
  const [whole, fraction = ''] = amount.toString().split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  
  return BigInt(whole + paddedFraction);
};