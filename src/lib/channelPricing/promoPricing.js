import { getPricingStatus } from './channelTypes';

export const calculateDiscountedPrice = (normalSellingPrice, discountPercent, discountFixed) => {
  const discountAmount = (normalSellingPrice * (discountPercent / 100)) + discountFixed;
  return Math.max(0, normalSellingPrice - discountAmount);
};

export const calculatePromoProfit = (input) => {
  const {
    hppPerUnit = 0,
    normalSellingPrice = 0,
    quantity = 1,
    discountPercent = 0,
    discountFixed = 0,
    sellerVoucherSubsidy = 0
  } = input;

  const finalPrice = calculateDiscountedPrice(normalSellingPrice, discountPercent, discountFixed);
  const grossRevenue = finalPrice * quantity;
  
  const totalHpp = hppPerUnit * quantity;
  const totalVoucherSubsidy = sellerVoucherSubsidy * quantity;
  
  const totalCost = totalHpp + totalVoucherSubsidy;
  
  const profit = grossRevenue - totalCost;
  const profitPerUnit = quantity > 0 ? profit / quantity : 0;
  const marginPercent = grossRevenue > 0 ? (profit / grossRevenue) * 100 : 0;
  
  return {
    finalPrice,
    grossRevenue,
    totalHpp,
    totalVoucherSubsidy,
    totalCost,
    profit,
    profitPerUnit,
    marginPercent,
    status: getPricingStatus(marginPercent, profit)
  };
};

export const calculateBogoProfit = (input) => {
  const {
    hppPerUnit = 0,
    normalSellingPrice = 0,
    bogoPaidQty = 1,
    bogoFreeQty = 1
  } = input;

  // The customer pays for bogoPaidQty but receives total items
  const totalQtyReceived = bogoPaidQty + bogoFreeQty;
  const grossRevenue = normalSellingPrice * bogoPaidQty;
  
  const effectiveRevenuePerUnit = grossRevenue / totalQtyReceived;
  const totalHpp = hppPerUnit * totalQtyReceived;
  
  const profit = grossRevenue - totalHpp;
  const profitPerUnit = profit / totalQtyReceived;
  const marginPercent = grossRevenue > 0 ? (profit / grossRevenue) * 100 : 0;
  
  return {
    finalPrice: normalSellingPrice, // Price per paid unit doesn't change
    effectiveRevenuePerUnit,
    grossRevenue,
    totalHpp,
    totalCost: totalHpp, // Total cost is just the HPP of all items given
    profit,
    profitPerUnit,
    marginPercent,
    status: getPricingStatus(marginPercent, profit)
  };
};

export const calculatePromoBreakEven = (hppPerUnit, sellerVoucherSubsidy = 0) => {
  return hppPerUnit + sellerVoucherSubsidy;
};
