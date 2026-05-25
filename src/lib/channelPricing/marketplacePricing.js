import { getPricingStatus } from './channelTypes';

export const calculateMarketplaceProfit = (input) => {
  const {
    hppPerUnit = 0,
    sellingPrice = 0,
    quantity = 1,
    commissionPercent = 0,
    paymentFeePercent = 0,
    paymentFeeFixed = 0,
    additionalPackagingCost = 0,
    sellerPromoPercent = 0,
    sellerPromoFixed = 0
  } = input;

  const grossRevenue = sellingPrice * quantity;
  
  const platformCommission = grossRevenue * (commissionPercent / 100);
  const paymentFee = (grossRevenue * (paymentFeePercent / 100)) + (paymentFeeFixed * quantity);
  const sellerPromo = (grossRevenue * (sellerPromoPercent / 100)) + (sellerPromoFixed * quantity);
  
  const totalFees = platformCommission + paymentFee + sellerPromo;
  const netRevenue = grossRevenue - totalFees;
  
  const totalHpp = hppPerUnit * quantity;
  const totalAdditionalPackaging = additionalPackagingCost * quantity;
  
  const totalCost = totalHpp + totalAdditionalPackaging;
  
  const profit = netRevenue - totalCost;
  const profitPerUnit = quantity > 0 ? profit / quantity : 0;
  const marginPercent = grossRevenue > 0 ? (profit / grossRevenue) * 100 : 0;
  
  return {
    grossRevenue,
    platformCommission,
    paymentFee,
    sellerPromo,
    totalFees,
    netRevenue,
    totalHpp,
    totalAdditionalPackaging,
    totalCost,
    profit,
    profitPerUnit,
    marginPercent,
    status: getPricingStatus(marginPercent, profit)
  };
};

export const calculateMarketplaceRecommendedPrice = (input) => {
  const {
    hppPerUnit = 0,
    commissionPercent = 0,
    paymentFeePercent = 0,
    paymentFeeFixed = 0,
    additionalPackagingCost = 0,
    sellerPromoPercent = 0,
    sellerPromoFixed = 0,
    targetMarginPercent = 0,
    roundingStep = 1000
  } = input;

  const feeRate = (commissionPercent + paymentFeePercent + sellerPromoPercent) / 100;
  const fixedPerUnit = paymentFeeFixed + sellerPromoFixed + additionalPackagingCost;
  const targetMargin = targetMarginPercent / 100;
  
  const cost = hppPerUnit + fixedPerUnit;
  const denominator = 1 - feeRate - targetMargin;
  
  if (denominator <= 0) {
    return {
      success: false,
      recommendedPrice: 0,
      error: 'Target margin terlalu tinggi untuk fee channel ini.'
    };
  }
  
  const rawPrice = cost / denominator;
  
  const recommendedPrice = roundingStep > 0 
    ? Math.ceil(rawPrice / roundingStep) * roundingStep 
    : rawPrice;
    
  return {
    success: true,
    recommendedPrice,
    rawPrice
  };
};

export const simulateMarketplacePricePoints = (input) => {
  const breakEvenInput = { ...input, targetMarginPercent: 0 };
  const breakEven = calculateMarketplaceRecommendedPrice(breakEvenInput);
  
  const safeInput = { ...input, targetMarginPercent: 25 };
  const safe = calculateMarketplaceRecommendedPrice(safeInput);
  
  const idealInput = { ...input, targetMarginPercent: 40 };
  const ideal = calculateMarketplaceRecommendedPrice(idealInput);
  
  const premiumInput = { ...input, targetMarginPercent: 55 };
  const premium = calculateMarketplaceRecommendedPrice(premiumInput);

  return {
    breakEven: breakEven.success ? breakEven.recommendedPrice : 0,
    safe: safe.success ? safe.recommendedPrice : 0,
    ideal: ideal.success ? ideal.recommendedPrice : 0,
    premium: premium.success ? premium.recommendedPrice : 0
  };
};

export const calculateMarketplaceBreakEvenPrice = (input) => {
  const result = calculateMarketplaceRecommendedPrice({ ...input, targetMarginPercent: 0 });
  return result.success ? result.recommendedPrice : 0;
};
