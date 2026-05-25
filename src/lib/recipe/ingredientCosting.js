import { 
  getBaseUnit, 
  convertToBaseUnit, 
  calculateCostPerBaseUnit,
  canConvertUnits
} from '../units';

export const calculateIngredientBaseData = (ingredientInput) => {
  const { purchasePrice, purchaseQuantity, purchaseUnit } = ingredientInput;
  
  const baseUnit = getBaseUnit(purchaseUnit);
  const costPerBaseUnit = calculateCostPerBaseUnit({
    purchasePrice,
    purchaseQuantity,
    purchaseUnit
  });

  return {
    ...ingredientInput,
    baseUnit,
    costPerBaseUnit
  };
};

export const calculateIngredientUsageCost = (ingredient, usedQuantity, usedUnit) => {
  if (!ingredient || !ingredient.costPerBaseUnit) return 0;
  
  const baseQuantity = convertToBaseUnit(usedQuantity, usedUnit);
  return baseQuantity * ingredient.costPerBaseUnit;
};

export const validateIngredientInput = (input) => {
  const errors = {};
  
  if (!input.name || input.name.trim() === '') {
    errors.name = 'required';
  }
  
  if (!input.purchasePrice || Number(input.purchasePrice) <= 0) {
    errors.purchasePrice = 'invalid';
  }
  
  if (!input.purchaseQuantity || Number(input.purchaseQuantity) <= 0) {
    errors.purchaseQuantity = 'invalid';
  }
  
  if (!input.purchaseUnit) {
    errors.purchaseUnit = 'required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateIngredientUsage = (ingredient, usedQuantity, usedUnit) => {
  const errors = {};
  
  if (!usedQuantity || Number(usedQuantity) <= 0) {
    errors.usedQuantity = 'invalid';
  }
  
  if (!usedUnit) {
    errors.usedUnit = 'required';
  } else if (ingredient && !canConvertUnits(ingredient.purchaseUnit, usedUnit)) {
    errors.usedUnit = 'incompatibleUnit';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
