import { rankByMargin } from './profitabilityInsights';

export const analyzeProductItems = (productItems) => {
  return {
    bestProducts: getBestProducts(productItems),
    worstProducts: getWorstProducts(productItems),
    promoCandidates: getProductsSuitableForPromo(productItems),
    resellerCandidates: getProductsSuitableForReseller(productItems),
    marketplaceCandidates: getProductsSuitableForMarketplace(productItems),
    needsReview: getProductsNeedingPriceReview(productItems)
  };
};

export const getBestProducts = (productItems, limit = 5) => {
  if (!productItems) return [];
  return rankByMargin(productItems).slice(0, limit);
};

export const getWorstProducts = (productItems, limit = 5) => {
  if (!productItems) return [];
  const valid = productItems.filter(i => i.marginPercent !== null && !isNaN(i.marginPercent));
  return valid.sort((a, b) => a.marginPercent - b.marginPercent).slice(0, limit);
};

export const getProductsSuitableForPromo = (productItems) => {
  if (!productItems) return [];
  return productItems.filter(p => {
    // Healthy margin cushion for promos
    return p.marginPercent >= 40 && p.profitPerUnit > 0;
  });
};

export const getProductsSuitableForReseller = (productItems) => {
  if (!productItems) return [];
  return productItems.filter(p => {
    // Need room for wholesale discount
    return (p.marginPercent >= 35 || p.markupPercent >= 50) && p.hppPerUnit > 0;
  });
};

export const getProductsSuitableForMarketplace = (productItems) => {
  if (!productItems) return [];
  return productItems.filter(p => {
    // High margin needed to absorb platform fees (~20%)
    return p.marginPercent >= 45;
  });
};

export const getProductsNeedingPriceReview = (productItems) => {
  if (!productItems) return [];
  return productItems.filter(p => {
    if (!p.sellingPrice) return true; // Has cost but no price set
    if (p.marginPercent < 15) return true;
    if (p.profitPerUnit <= 0) return true;
    if (p.recommendedPrice && p.sellingPrice < p.recommendedPrice) return true;
    return false;
  });
};
