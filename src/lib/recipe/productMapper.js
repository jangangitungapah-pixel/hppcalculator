export const createProductFromRecipe = (recipe, options = {}) => {
  if (!recipe || !recipe.resultSnapshot) return null;

  return {
    id: options.id || crypto.randomUUID(),
    version: 1,
    name: recipe.name,
    recipeId: recipe.id,
    recipeNameSnapshot: recipe.name,
    sellingUnit: recipe.outputUnit || 'pcs',
    hppPerUnitSnapshot: recipe.resultSnapshot.hppPerUnit,
    suggestedPricesSnapshot: recipe.resultSnapshot.suggestedPrices,
    targetSellingPrice: options.targetSellingPrice || 0,
    notes: recipe.description || '',
    source: recipe.source || 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const createQuickCalculatorInputFromRecipe = (recipe, sellingPrice = 0, settings = {}) => {
  if (!recipe || !recipe.resultSnapshot) return null;

  const costItems = [];
  
  if (recipe.resultSnapshot.totalIngredientCost > 0) {
    costItems.push({
      id: crypto.randomUUID(),
      name: 'Total Bahan Baku (Resep)',
      amount: recipe.resultSnapshot.totalIngredientCost,
      category: 'ingredients'
    });
  }
  
  if (recipe.resultSnapshot.totalExtraCost > 0) {
    costItems.push({
      id: crypto.randomUUID(),
      name: 'Total Biaya Tambahan (Resep)',
      amount: recipe.resultSnapshot.totalExtraCost,
      category: 'other'
    });
  }

  return {
    productName: recipe.name,
    costItems,
    outputQuantity: recipe.outputQuantity,
    failedQuantity: recipe.failedQuantity || 0,
    sellingUnit: recipe.outputUnit || 'pcs',
    sellingPrice: sellingPrice || 0
  };
};
