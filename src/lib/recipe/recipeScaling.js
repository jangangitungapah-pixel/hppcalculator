export const calculateScaleFactor = (currentOutputQuantity, targetOutputQuantity) => {
  const current = Number(currentOutputQuantity);
  const target = Number(targetOutputQuantity);
  
  if (isNaN(current) || isNaN(target) || current <= 0 || target <= 0) {
    return 1;
  }
  
  return target / current;
};

export const scaleRecipeIngredients = (recipeIngredients, scaleFactor) => {
  if (!recipeIngredients) return [];
  
  return recipeIngredients.map(ing => {
    const scaledQuantity = (Number(ing.usedQuantity) || 0) * scaleFactor;
    const scaledTotalCost = (Number(ing.totalCost) || 0) * scaleFactor;
    const scaledBaseQuantity = (Number(ing.baseQuantity) || 0) * scaleFactor;
    
    return {
      ...ing,
      usedQuantity: Number(scaledQuantity.toFixed(4)),
      totalCost: Number(scaledTotalCost.toFixed(2)),
      baseQuantity: Number(scaledBaseQuantity.toFixed(4))
    };
  });
};

export const scaleRecipeExtraCosts = (extraCosts, scaleFactor, options = { scaleAll: true }) => {
  if (!extraCosts) return [];
  
  return extraCosts.map(cost => {
    // For now, simple scaling applies to all extra costs.
    // In the future, we might have fixed costs (e.g. rent) vs variable costs.
    const scaledAmount = options.scaleAll 
      ? (Number(cost.amount) || 0) * scaleFactor
      : (Number(cost.amount) || 0);
      
    return {
      ...cost,
      amount: Number(scaledAmount.toFixed(2))
    };
  });
};

export const scaleRecipeToTargetOutput = (recipe, targetOutputQuantity) => {
  if (!recipe) return null;
  
  const scaleFactor = calculateScaleFactor(recipe.outputQuantity, targetOutputQuantity);
  
  if (scaleFactor === 1) return { ...recipe };
  
  const scaledIngredients = scaleRecipeIngredients(recipe.ingredients, scaleFactor);
  const scaledExtraCosts = scaleRecipeExtraCosts(recipe.extraCosts, scaleFactor);
  
  const scaledFailedQuantity = (Number(recipe.failedQuantity) || 0) * scaleFactor;
  
  return {
    ...recipe,
    outputQuantity: Number(targetOutputQuantity),
    failedQuantity: Number(Math.round(scaledFailedQuantity)),
    ingredients: scaledIngredients,
    extraCosts: scaledExtraCosts
  };
};
