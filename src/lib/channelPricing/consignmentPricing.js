import { getPricingStatus } from './channelTypes';

export const calculateConsignmentProfit = (input) => {
  const {
    hppPerUnit = 0,
    sellingPrice = 0,
    quantity = 1,
    consignmentFeePercent = 0,
    fixedChannelCost = 0
  } = input;

  const grossRevenue = sellingPrice * quantity;
  const storeFee = grossRevenue * (consignmentFeePercent / 100);
  
  const totalHpp = hppPerUnit * quantity;
  const totalCost = totalHpp + fixedChannelCost;
  
  const netRevenue = grossRevenue - storeFee;
  const profit = netRevenue - totalCost;
  
  const profitPerUnit = quantity > 0 ? profit / quantity : 0;
  const marginPercent = grossRevenue > 0 ? (profit / grossRevenue) * 100 : 0;

  return {
    grossRevenue,
    storeFee,
    netRevenue,
    totalHpp,
    totalCost,
    profit,
    profitPerUnit,
    marginPercent,
    status: getPricingStatus(marginPercent, profit)
  };
};

export const calculateConsignmentRecommendedPrice = (input) => {
  const {
    hppPerUnit = 0,
    quantity = 1,
    consignmentFeePercent = 0,
    fixedChannelCost = 0,
    targetMarginPercent = 0,
    roundingStep = 1000
  } = input;

  const feeRate = consignmentFeePercent / 100;
  const fixedPerUnit = quantity > 0 ? fixedChannelCost / quantity : 0;
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
