// Tier configuration for $FACY token holders
export const TIER_CONFIG = {
  None: {
    name: 'None',
    minBalance: 0,
    creditsPerDay: 5,
    description: 'Basic tier for users with no $FACY tokens'
  },
  Bronze: {
    name: 'Bronze',
    minBalance: 50000,
    creditsPerDay: 25,
    description: 'Bronze tier for users with ≥ 50,000 $FACY tokens'
  },
  Silver: {
    name: 'Silver',
    minBalance: 100000,
    creditsPerDay: 50,
    description: 'Silver tier for users with ≥ 100,000 $FACY tokens'
  },
  Gold: {
    name: 'Gold',
    minBalance: 150000,
    creditsPerDay: 250,
    description: 'Gold tier for users with ≥ 150,000 $FACY tokens'
  },
  Platinum: {
    name: 'Platinum',
    minBalance: 100000000,
    creditsPerDay: 5000,
    description: 'Platinum tier for users with ≥ 100,000,000 $FACY tokens'
  }
};

// Helper function to get tier info by tier name
export const getTierInfo = (tierName) => {
  const tier = TIER_CONFIG[tierName];
  return tier || TIER_CONFIG.None;
};

// Helper function to get tier info by balance
export const getTierByBalance = (balance) => {
  const tiers = Object.values(TIER_CONFIG).sort((a, b) => b.minBalance - a.minBalance);
  
  for (const tier of tiers) {
    if (balance >= tier.minBalance) {
      return tier;
    }
  }
  
  return TIER_CONFIG.None;
};

// Helper function to get all tiers for display
export const getAllTiers = () => {
  return Object.values(TIER_CONFIG).sort((a, b) => a.minBalance - b.minBalance);
};
