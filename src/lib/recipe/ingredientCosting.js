import { 
  getBaseUnit, 
  convertToBaseUnit, 
  calculateCostPerBaseUnit,
  canConvertUnits,
  convertBetweenUnits
} from '../units';

export const calculateIngredientBaseData = (ingredientInput) => {
  const { purchasePrice, purchaseQuantity, purchaseUnit, density } = ingredientInput;
  
  const baseUnit = getBaseUnit(purchaseUnit);
  const costPerBaseUnit = calculateCostPerBaseUnit({
    purchasePrice,
    purchaseQuantity,
    purchaseUnit
  });

  const parsedDensity = density !== undefined && density !== '' && density !== null ? Number(density) : 1.0;

  return {
    ...ingredientInput,
    baseUnit,
    costPerBaseUnit,
    density: isNaN(parsedDensity) || parsedDensity <= 0 ? 1.0 : parsedDensity
  };
};

export const calculateIngredientUsageCost = (ingredient, usedQuantity, usedUnit) => {
  if (!ingredient || !ingredient.costPerBaseUnit) return 0;
  
  const baseQuantity = convertBetweenUnits(usedQuantity, usedUnit, ingredient.baseUnit, ingredient.density);
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

  if (input.density !== undefined && input.density !== '' && input.density !== null) {
    const numDensity = Number(input.density);
    if (isNaN(numDensity) || numDensity <= 0) {
      errors.density = 'invalid';
    }
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
  } else if (ingredient && !canConvertUnits(ingredient.purchaseUnit, usedUnit, ingredient.density)) {
    errors.usedUnit = 'incompatibleUnit';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
