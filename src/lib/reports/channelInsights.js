export const analyzeChannelSimulations = (simulations) => {
  return {
    highestFeeChannels: getHighestFeeChannels(simulations),
    mostProfitableChannels: getMostProfitableChannels(simulations),
    lossMakingSimulations: getLossMakingSimulations(simulations),
    highestRecommendedPriceSimulations: getHighestRecommendedPriceSimulations(simulations)
  };
};

export const getHighestFeeChannels = (simulations) => {
  if (!simulations) return [];
  const valid = simulations.filter(s => s.raw?.result?.totalFees > 0 || s.raw?.result?.storeFee > 0);
  return valid.sort((a, b) => {
    const feeA = a.raw?.result?.totalFees || a.raw?.result?.storeFee || 0;
    const feeB = b.raw?.result?.totalFees || b.raw?.result?.storeFee || 0;
    return feeB - feeA;
  });
};

export const getMostProfitableChannels = (simulations) => {
  if (!simulations) return [];
  const valid = simulations.filter(s => s.marginPercent !== null && !isNaN(s.marginPercent));
  return valid.sort((a, b) => b.marginPercent - a.marginPercent);
};

export const getLossMakingSimulations = (simulations) => {
  if (!simulations) return [];
  return simulations.filter(s => s.statusKey === 'loss' || s.marginPercent < 0);
};

export const getHighestRecommendedPriceSimulations = (simulations) => {
  if (!simulations) return [];
  const valid = simulations.filter(s => s.recommendedPrice > 0);
  return valid.sort((a, b) => b.recommendedPrice - a.recommendedPrice);
};

export const getChannelRecommendation = (simulation) => {
  if (!simulation) return null;
  
  if (simulation.statusKey === 'loss') {
    return {
      type: 'price_increase',
      message: 'Simulasi channel ini merugikan. Naikkan harga jual atau periksa kembali biaya channel.'
    };
  }
  
  if (simulation.statusKey === 'low') {
    return {
      type: 'cost_review',
      message: 'Margin di channel ini sangat tipis. Waspadai biaya tak terduga.'
    };
  }
  
  return null;
};
