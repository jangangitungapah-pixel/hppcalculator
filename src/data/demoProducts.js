import { demoRecipes } from './demoRecipes';
import { createProductFromRecipe } from '../lib/recipe';

export const demoProducts = demoRecipes.map(recipe => {
  // Let's set a target selling price based on the ideal suggested price, rounded nicely
  const idealPrice = recipe.resultSnapshot.suggestedPrices?.ideal?.price || 0;
  // Round to nearest 1000
  const targetSellingPrice = Math.round(idealPrice / 1000) * 1000;
  
  return createProductFromRecipe(recipe, { 
    id: `demo-product-${recipe.id}`,
    targetSellingPrice 
  });
}).filter(Boolean);
