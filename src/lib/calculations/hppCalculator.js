import { calculateGrossRevenue, calculateProfitPerUnit, calculateTotalProfit, calculateMarginPercent, calculateMarkupPercent, calculateSuggestedPrices } from './pricingCalculator.js';
import { getProfitStatus } from './profitStatus.js';
import { validateQuickCalculationInput, sanitizeQuickCalculationInput } from './validation.js';
import { DEFAULT_TARGET_MARGINS, DEFAULT_ROUNDING_STEP } from './constants.js';
import { safeDivide } from './rounding.js';

export function calculateTotalCost(costItems) {
  return costItems.reduce((sum, item) => sum + (item.amount || 0), 0);
}

export function calculateSellableQuantity(outputQuantity, failedQuantity) {
  return outputQuantity - failedQuantity;
}

export function calculateHppPerUnit(totalProductionCost, sellableQuantity) {
  return safeDivide(totalProductionCost, sellableQuantity, 0);
}

export function calculateQuickHpp(rawInput) {
  const input = sanitizeQuickCalculationInput(rawInput);
  const validationResult = validateQuickCalculationInput(input);
  
  if (!validationResult.isValid) {
    return {
      isValid: false,
      errors: validationResult.errors,
      warnings: validationResult.warnings
    };
  }

  const totalProductionCost = calculateTotalCost(input.costItems);
  const sellableQuantity = calculateSellableQuantity(input.outputQuantity, input.failedQuantity);
  const hppPerUnit = calculateHppPerUnit(totalProductionCost, sellableQuantity);
  
  const grossRevenue = calculateGrossRevenue(input.sellingPrice, sellableQuantity);
  const profitPerUnit = calculateProfitPerUnit(input.sellingPrice, hppPerUnit);
  const totalProfit = calculateTotalProfit(grossRevenue, totalProductionCost);
  
  const marginPercent = calculateMarginPercent(profitPerUnit, input.sellingPrice);
  const markupPercent = calculateMarkupPercent(profitPerUnit, hppPerUnit);
  
  const warnings = [...validationResult.warnings];
  
  if (marginPercent >= 0 && marginPercent < 15) {
    warnings.push({ field: 'marginPercent', code: 'LOW_MARGIN', messageId: 'Margin di bawah 15%.', messageEn: 'Margin is below 15%.' });
  }
  if (input.sellingPrice < hppPerUnit) {
    warnings.push({ field: 'sellingPrice', code: 'PRICE_BELOW_COST', messageId: 'Harga jual lebih rendah dari HPP.', messageEn: 'Selling price is lower than cost per unit.' });
  } else if (input.sellingPrice === hppPerUnit) {
    warnings.push({ field: 'sellingPrice', code: 'ZERO_PROFIT', messageId: 'Keuntungan nol (0). Harga jual sama dengan HPP.', messageEn: 'Zero profit. Selling price is equal to cost per unit.' });
  }

  const profitStatus = getProfitStatus({
    profitPerUnit,
    marginPercent,
    thresholds: input.profitStatusThresholds
  });

  const targetMargins = input.targetMargins || DEFAULT_TARGET_MARGINS;
  const roundingStep = input.roundingStep || DEFAULT_ROUNDING_STEP;
  
  const suggestedPrices = calculateSuggestedPrices(hppPerUnit, targetMargins, roundingStep);

  return {
    isValid: true,
    productName: input.productName,
    costItems: input.costItems,
    totalProductionCost,
    outputQuantity: input.outputQuantity,
    failedQuantity: input.failedQuantity,
    sellableQuantity,
    sellingUnit: input.sellingUnit,
    sellingPrice: input.sellingPrice,
    grossRevenue,
    hppPerUnit,
    profitPerUnit,
    totalProfit,
    marginPercent,
    markupPercent,
    profitStatus,
    suggestedPrices,
    warnings,
    isProfitable: profitPerUnit > 0,
    calculatedAt: new Date().toISOString()
  };
}
