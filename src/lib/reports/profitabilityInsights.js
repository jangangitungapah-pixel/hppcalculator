export const analyzeProfitability = (items) => {
  return {
    rankedByMargin: rankByMargin(items),
    rankedByProfit: rankByProfit(items),
    priceIncreaseCandidates: findPriceIncreaseCandidates(items)
  };
};

export const rankByMargin = (items) => {
  if (!items) return [];
  const valid = items.filter(i => i.marginPercent !== null && !isNaN(i.marginPercent));
  return valid.sort((a, b) => b.marginPercent - a.marginPercent);
};

export const rankByProfit = (items) => {
  if (!items) return [];
  const valid = items.filter(i => i.profitPerUnit !== null && !isNaN(i.profitPerUnit));
  return valid.sort((a, b) => b.profitPerUnit - a.profitPerUnit);
};

export const findPriceIncreaseCandidates = (items) => {
  if (!items) return [];
  return items.filter(item => {
    // Has a selling price
    if (!item.sellingPrice) return false;
    // Low or loss margin
    if (item.marginPercent === null || item.marginPercent >= 15) return false;
    return true;
  });
};

export const calculatePriceIncreaseNeeded = (item, targetMarginPercent = 25, roundingStep = 1000) => {
  if (!item || !item.sellingPrice || !item.hppPerUnit) return null;
  
  const targetMarginDecimal = targetMarginPercent / 100;
  if (targetMarginDecimal >= 1) return null; // Impossible
  
  const rawRecommendedPrice = item.hppPerUnit / (1 - targetMarginDecimal);
  
  let recommendedPrice = rawRecommendedPrice;
  if (roundingStep > 0) {
    recommendedPrice = Math.ceil(rawRecommendedPrice / roundingStep) * roundingStep;
  }
  
  const priceGap = recommendedPrice - item.sellingPrice;
  const percentageIncrease = (priceGap / item.sellingPrice) * 100;
  
  return {
    currentPrice: item.sellingPrice,
    recommendedPrice,
    priceGap,
    percentageIncrease,
    targetMarginPercent
  };
};

export const compareCurrentVsRecommendedPrice = (item) => {
  if (!item || !item.sellingPrice || !item.recommendedPrice) return null;
  
  const priceGap = item.recommendedPrice - item.sellingPrice;
  const percentageIncrease = (priceGap / item.sellingPrice) * 100;
  
  return {
    currentPrice: item.sellingPrice,
    recommendedPrice: item.recommendedPrice,
    priceGap,
    percentageIncrease
  };
};
