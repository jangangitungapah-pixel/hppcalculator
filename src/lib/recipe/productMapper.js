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
      id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(7),
      name: 'Total Bahan Baku (Resep)',
      amount: String(recipe.resultSnapshot.totalIngredientCost),
      category: 'Bahan'
    });
  }
  
  if (recipe.resultSnapshot.totalExtraCost > 0) {
    costItems.push({
      id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(7),
      name: 'Total Biaya Tambahan (Resep)',
      amount: String(recipe.resultSnapshot.totalExtraCost),
      category: 'Lainnya'
    });
  }

  // Handle custom selling units
  const knownUnits = ['pcs', 'porsi', 'cup', 'box'];
  const isKnownUnit = knownUnits.includes(recipe.outputUnit);

  return {
    productName: recipe.name,
    costItems: costItems.length > 0 ? costItems : [
      { id: '1', name: 'Biaya Bahan', category: 'Bahan', amount: '' }
    ],
    outputQuantity: String(recipe.outputQuantity || ''),
    failedQuantity: String(recipe.failedQuantity || '0'),
    sellingUnit: isKnownUnit ? recipe.outputUnit : 'custom',
    customSellingUnit: isKnownUnit ? '' : recipe.outputUnit || '',
    sellingPrice: String(sellingPrice || '')
  };
};

