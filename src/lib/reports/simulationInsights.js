import { sortByDateDesc } from './dateFilters';

export const analyzePricingSimulations = (pricingSimulations) => {
  return {
    recent: getRecentSimulations(pricingSimulations, 5),
    lossMaking: pricingSimulations.filter(s => s.statusKey === 'loss'),
    highProfit: pricingSimulations.filter(s => s.statusKey === 'excellent' || s.statusKey === 'good'),
    marketplace: pricingSimulations.filter(s => s.channelType === 'marketplace'),
    reseller: pricingSimulations.filter(s => s.channelType === 'reseller'),
    promo: pricingSimulations.filter(s => s.channelType === 'promo'),
    consignment: pricingSimulations.filter(s => s.channelType === 'consignment')
  };
};

export const analyzeBundleSimulations = (bundleSimulations) => {
  return {
    recent: getRecentSimulations(bundleSimulations, 5),
    lossMaking: bundleSimulations.filter(s => s.statusKey === 'loss'),
    highProfit: bundleSimulations.filter(s => s.statusKey === 'excellent' || s.statusKey === 'good')
  };
};

export const getSimulationStatus = (simulation) => {
  return simulation?.statusKey || 'unknown';
};

export const getSimulationDisplayMetrics = (simulation) => {
  if (!simulation) return null;
  
  return {
    hpp: simulation.hppPerUnit,
    price: simulation.sellingPrice,
    profit: simulation.profitPerUnit,
    margin: simulation.marginPercent
  };
};

export const getRecentSimulations = (simulations, limit = 5) => {
  if (!simulations) return [];
  return sortByDateDesc(simulations).slice(0, limit);
};
