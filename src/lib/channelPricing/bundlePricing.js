import { getPricingStatus } from './channelTypes';

export const calculateBundleHpp = (items = []) => {
  return items.reduce((total, item) => {
    return total + (item.hppPerUnit * item.quantity);
  }, 0);
};

export const calculateBundleProfit = (input) => {
  const {
    items = [],
    bundleSellingPrice = 0,
    discountPercent = 0,
    discountFixed = 0
  } = input;

  const baseTotalHpp = calculateBundleHpp(items);
  
  const discountAmount = (bundleSellingPrice * (discountPercent / 100)) + discountFixed;
  const finalSellingPrice = Math.max(0, bundleSellingPrice - discountAmount);
  
  const profit = finalSellingPrice - baseTotalHpp;
  const marginPercent = finalSellingPrice > 0 ? (profit / finalSellingPrice) * 100 : 0;
  
  return {
    baseTotalHpp,
    discountAmount,
    finalSellingPrice,
    profit,
    marginPercent,
    status: getPricingStatus(marginPercent, profit)
  };
};

export const calculateBundleSuggestedPrices = (baseTotalHpp, targetMarginPercent = 40, roundingStep = 1000) => {
  const margin = targetMarginPercent / 100;
  if (margin >= 1) return 0;
  
  const rawPrice = baseTotalHpp / (1 - margin);
  return roundingStep > 0 ? Math.ceil(rawPrice / roundingStep) * roundingStep : rawPrice;
};

export const validateBundleInput = (input) => {
  const errors = {};
  if (!input.items || input.items.length === 0) errors.items = 'Bundle harus ada isinya';
  
  if (input.items) {
    const invalidItems = input.items.filter(i => !i.hppPerUnit || i.hppPerUnit <= 0 || !i.quantity || i.quantity <= 0);
    if (invalidItems.length > 0) errors.itemsInvalid = 'HPP dan Kuantitas item tidak valid';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};
