import { formatCurrency } from '../calculations';

export const formatIngredientPurchasePrice = (ingredient, lang = 'id', currency = 'IDR') => {
  if (!ingredient) return '';
  const price = formatCurrency(ingredient.purchasePrice || 0, lang, currency);
  const qty = ingredient.purchaseQuantity || 1;
  const unit = ingredient.purchaseUnit || 'pcs';
  return `${price} / ${qty} ${unit}`;
};

export const formatIngredientUsagePrice = (ingredient, lang = 'id', currency = 'IDR') => {
  if (!ingredient) return '';
  const cost = formatCurrency(ingredient.costPerBaseUnit || 0, lang, currency);
  const baseUnit = ingredient.baseUnit || 'pcs';
  return `${cost} / ${baseUnit}`;
};

export const formatIngredientUnitInfo = (ingredient) => {
  if (!ingredient) return '';
  const pUnit = ingredient.purchaseUnit;
  const bUnit = ingredient.baseUnit;
  if (pUnit === bUnit) return `1 ${pUnit}`;
  if (pUnit === 'kg' && bUnit === 'gram') return `1 kg = 1.000 gram`;
  if (pUnit === 'liter' && bUnit === 'ml') return `1 L = 1.000 ml`;
  return `1 ${pUnit} = ${bUnit}`;
};

export const getIngredientCompletenessStatus = (ingredient) => {
  if (!ingredient) return { isComplete: false, score: 0 };
  let score = 0;
  if (ingredient.name) score += 40;
  if (ingredient.purchasePrice > 0) score += 30;
  if (ingredient.category && ingredient.category !== 'other' && ingredient.category !== 'other_category') score += 10;
  if (ingredient.supplier) score += 10;
  if (ingredient.notes) score += 10;
  return {
    isComplete: score >= 80,
    score
  };
};
