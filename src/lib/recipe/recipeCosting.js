import { calculateIngredientUsageCost } from './ingredientCosting';
import { calculateSuggestedPrices } from '../calculations';
import { preciseAdd, preciseSubtract, preciseMultiply, preciseDivide } from '../calculations/rounding';

export const calculateTotalIngredientCost = (recipeIngredients) => {
  if (!recipeIngredients || recipeIngredients.length === 0) return 0;
  return recipeIngredients.reduce((total, ing) => {
    return preciseAdd(total, Number(ing.totalCost) || 0);
  }, 0);
};

export const calculateTotalExtraCost = (extraCosts) => {
  if (!extraCosts || extraCosts.length === 0) return 0;
  return extraCosts.reduce((total, cost) => {
    return preciseAdd(total, Number(cost.amount) || 0);
  }, 0);
};

export const calculateSellableQuantity = (outputQuantity, failedQuantity = 0, wastePercent = 0) => {
  const outQty = Number(outputQuantity) || 0;
  const failQty = Number(failedQuantity) || 0;
  const waste = Number(wastePercent) || 0;
  
  // Output quantity after removing failed/rejected items physically
  const goodOutput = Math.max(0, preciseSubtract(outQty, failQty));
  
  // Apply waste percentage
  const sellable = preciseSubtract(goodOutput, preciseMultiply(outQty, preciseDivide(waste, 100)));
  
  return Math.max(0, sellable);
};

export const calculateRecipeHppPerUnit = (totalRecipeCost, sellableQuantity) => {
  if (!sellableQuantity || sellableQuantity <= 0) return 0;
  return preciseDivide(totalRecipeCost, sellableQuantity);
};

export const calculateRecipeCost = (recipeInput, settings = {}) => {
  const {
    ingredients = [],
    extraCosts = [],
    outputQuantity = 0,
    failedQuantity = 0,
    wastePercent = 0
  } = recipeInput;

  const totalIngredientCost = calculateTotalIngredientCost(ingredients);
  const totalExtraCost = calculateTotalExtraCost(extraCosts);
  const totalRecipeCost = preciseAdd(totalIngredientCost, totalExtraCost);
  
  const sellableQuantity = calculateSellableQuantity(outputQuantity, failedQuantity, wastePercent);
  
  const hppPerUnit = calculateRecipeHppPerUnit(totalRecipeCost, sellableQuantity);
  
  const suggestedPrices = calculateSuggestedPrices(
    hppPerUnit,
    [
      { key: 'safe', margin: 15 },
      { key: 'ideal', margin: 30 },
      { key: 'premium', margin: 50 }
    ],
    settings.roundingStep || 500
  );

  return {
    totalIngredientCost,
    totalExtraCost,
    totalRecipeCost,
    sellableQuantity,
    hppPerUnit,
    suggestedPrices,
    calculatedAt: new Date().toISOString()
  };
};

export const validateRecipeInput = (recipeInput) => {
  const errors = {};
  
  if (!recipeInput.name || recipeInput.name.trim() === '') {
    errors.name = 'recipeNameRequired';
  }
  
  if (!recipeInput.outputQuantity || Number(recipeInput.outputQuantity) <= 0) {
    errors.outputQuantity = 'outputRequired';
  }
  
  if (!recipeInput.ingredients || recipeInput.ingredients.length === 0) {
    errors.ingredients = 'ingredientRequired';
  } else {
    // Check if any ingredient has valid cost
    const hasValidIngredient = recipeInput.ingredients.some(ing => Number(ing.totalCost) > 0);
    if (!hasValidIngredient) {
      errors.ingredients = 'ingredientRequired';
    }
  }

  const sellable = calculateSellableQuantity(
    recipeInput.outputQuantity, 
    recipeInput.failedQuantity, 
    recipeInput.wastePercent
  );

  if (sellable <= 0 && Number(recipeInput.outputQuantity) > 0) {
    errors.outputQuantity = 'sellableQuantityInvalid';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
