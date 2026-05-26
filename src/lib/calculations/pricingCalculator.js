import { safeDivide, roundUpToStep, preciseSubtract, preciseMultiply, preciseDivide } from './rounding.js';

export function calculateGrossRevenue(sellingPrice, sellableQuantity) {
  return preciseMultiply(sellingPrice, sellableQuantity);
}

export function calculateProfitPerUnit(sellingPrice, hppPerUnit) {
  return preciseSubtract(sellingPrice, hppPerUnit);
}

export function calculateTotalProfit(grossRevenue, totalProductionCost) {
  return preciseSubtract(grossRevenue, totalProductionCost);
}

export function calculateMarginPercent(profitPerUnit, sellingPrice) {
  if (sellingPrice <= 0) return 0;
  return preciseMultiply(preciseDivide(profitPerUnit, sellingPrice), 100);
}

export function calculateMarkupPercent(profitPerUnit, hppPerUnit) {
  if (hppPerUnit <= 0) return 0;
  return preciseMultiply(preciseDivide(profitPerUnit, hppPerUnit), 100);
}

export function calculateSuggestedPriceFromMargin(hppPerUnit, targetMarginPercent, roundingStep) {
  const decimalMargin = targetMarginPercent;
  if (decimalMargin >= 1) return hppPerUnit; // Invalid margin, cannot be 100% or more conceptually unless price is infinity
  
  const rawTargetPrice = safeDivide(hppPerUnit, preciseSubtract(1, decimalMargin), hppPerUnit);
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
