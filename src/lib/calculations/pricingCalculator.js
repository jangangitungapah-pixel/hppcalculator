import { safeDivide, roundUpToStep } from './rounding.js';

export function calculateGrossRevenue(sellingPrice, sellableQuantity) {
  return sellingPrice * sellableQuantity;
}

export function calculateProfitPerUnit(sellingPrice, hppPerUnit) {
  return sellingPrice - hppPerUnit;
}

export function calculateTotalProfit(grossRevenue, totalProductionCost) {
  return grossRevenue - totalProductionCost;
}

export function calculateMarginPercent(profitPerUnit, sellingPrice) {
  if (sellingPrice <= 0) return 0;
  return (profitPerUnit / sellingPrice) * 100;
}

export function calculateMarkupPercent(profitPerUnit, hppPerUnit) {
  if (hppPerUnit <= 0) return 0;
  return (profitPerUnit / hppPerUnit) * 100;
}

export function calculateSuggestedPriceFromMargin(hppPerUnit, targetMarginPercent, roundingStep) {
  const decimalMargin = targetMarginPercent;
  if (decimalMargin >= 1) return hppPerUnit; // Invalid margin, cannot be 100% or more conceptually unless price is infinity
  
  const rawTargetPrice = safeDivide(hppPerUnit, 1 - decimalMargin, hppPerUnit);
  return roundUpToStep(rawTargetPrice, roundingStep);
}

export function calculateSuggestedPrices(hppPerUnit, targetMargins, roundingStep) {
  return {
    safe: {
      label: 'safe',
      targetMargin: targetMargins.safe,
      price: calculateSuggestedPriceFromMargin(hppPerUnit, targetMargins.safe, roundingStep)
    },
    ideal: {
      label: 'ideal',
      targetMargin: targetMargins.ideal,
      price: calculateSuggestedPriceFromMargin(hppPerUnit, targetMargins.ideal, roundingStep)
    },
    premium: {
      label: 'premium',
      targetMargin: targetMargins.premium,
      price: calculateSuggestedPriceFromMargin(hppPerUnit, targetMargins.premium, roundingStep)
    }
  };
}
