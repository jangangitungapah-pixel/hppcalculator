export const analyzeRecipeItems = (recipeItems, products = []) => {
  return {
    costRanking: getRecipeCostRanking(recipeItems),
    withoutProduct: getRecipesWithoutProduct(recipeItems, products),
    highHpp: getRecipesWithHighHpp(recipeItems)
  };
};

export const getRecipeCostRanking = (recipeItems) => {
  if (!recipeItems) return [];
  return [...recipeItems].sort((a, b) => b.hppPerUnit - a.hppPerUnit);
};

export const getRecipesWithoutProduct = (recipeItems, products) => {
  if (!recipeItems) return [];
  const productSourceIds = (products || []).map(p => p.raw?.sourceId).filter(Boolean);
  
  return recipeItems.filter(recipe => {
    // If a product has this recipe as its sourceId, it is linked
    return !productSourceIds.includes(recipe.id);
  });
};

export const getRecipesWithHighHpp = (recipeItems) => {
  if (!recipeItems || recipeItems.length === 0) return [];
  
  // High HPP based on top 25% cost among recipes
  const sorted = getRecipeCostRanking(recipeItems);
  const thresholdIndex = Math.floor(sorted.length * 0.25);
  
  // Return at least the most expensive one if there are few
  const cutoff = Math.max(1, thresholdIndex);
  
  return sorted.slice(0, cutoff);
};

export const getRecipeRecommendation = (recipeItem) => {
  if (!recipeItem) return null;
  // This will be expanded by the recommendation engine
  return {
    type: 'create_product',
    message: 'Buat produk/menu dari resep ini agar harga jual bisa dipantau.'
  };
};
