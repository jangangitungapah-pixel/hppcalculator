export const ChannelTypes = {
  OFFLINE: 'offline',
  MARKETPLACE: 'marketplace',
  RESELLER: 'reseller',
  CONSIGNMENT: 'consignment',
  CUSTOM: 'custom'
};

export const SimulationTypes = {
  MARKETPLACE: 'marketplace',
  RESELLER: 'reseller',
  PROMO: 'promo',
  BUNDLE: 'bundle',
  CONSIGNMENT: 'consignment',
  OFFLINE: 'offline'
};

export const SourceTypes = {
  MANUAL: 'manual',
  CALCULATION: 'calculation',
  RECIPE: 'recipe',
  PRODUCT: 'product'
};

export const getPricingStatus = (marginPercent, profit) => {
  if (profit < 0 || marginPercent < 0) return 'loss';
  if (marginPercent < 15) return 'low';
  if (marginPercent < 25) return 'okay';
  if (marginPercent < 40) return 'good';
  return 'excellent';
};
