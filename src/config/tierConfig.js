// Tier configuration for $FACY token holders
export const TIER_MULTIPLIERS = {
  "bronze": 1.0,
  "silver": 2.5,
  "gold": 5.0,
  "platinum": 7.5,
  "none": 0,
};

export const TIER_CONFIG = {
  None: {
    name: 'None',
    minBalance: 0,
    maxBalance: 499,
    creditsPerDay: 5,
    description: 'Basic tier for users with 0-499 $FACY tokens'
  },
  Bronze: {
    name: 'Bronze',
    minBalance: 500,
    maxBalance: 49999,
    creditsPerDay: 25,
    description: 'Bronze tier for users with 500-49,999 $FACY tokens'
  },
  Silver: {
    name: 'Silver',
    minBalance: 50000,
    maxBalance: 149999,
    creditsPerDay: 50,
    description: 'Silver tier for users with 50,000-149,999 $FACY tokens'
  },
  Gold: {
    name: 'Gold',
    minBalance: 150000,
    maxBalance: 399999,
    creditsPerDay: 250,
    description: 'Gold tier for users with 150,000-399,999 $FACY tokens'
  },
  Platinum: {
    name: 'Stakeholders Platinum',
    minBalance: 400000,
    maxBalance: null,
    creditsPerDay: 5000,
    description: 'Stakeholders Platinum tier for users with 400,000+ $FACY tokens'
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