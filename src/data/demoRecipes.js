import { calculateRecipeCost } from '../lib/recipe';
import { demoIngredients } from './demoIngredients';

const getIng = (id) => demoIngredients.find(i => i.id === id);

const createDemoRecipeIngredient = (ingId, usedQuantity, usedUnit) => {
  const ing = getIng(ingId);
  if (!ing) return null;
  
  let baseQuantity = usedQuantity;
  if (usedUnit === 'kg' || usedUnit === 'liter') baseQuantity = usedQuantity * 1000;
  
  const totalCost = baseQuantity * ing.costPerBaseUnit;
  
  return {
    id: crypto.randomUUID(),
    ingredientId: ing.id,
    ingredientNameSnapshot: ing.name,
    usedQuantity,
    usedUnit,
    baseQuantity,
    baseUnit: ing.baseUnit,
    costPerBaseUnitSnapshot: ing.costPerBaseUnit,
    totalCost
  };
};

const rawRecipes = [
  {
    id: 'demo-recipe-1',
    name: 'Donat Coklat',
    description: 'Resep donat empuk dengan topping coklat lumer',
    category: 'Makanan',
    outputQuantity: 24,
    outputUnit: 'pcs',
    failedQuantity: 2,
    wastePercent: 0,
    source: 'demo',
    ingredients: [
      createDemoRecipeIngredient('demo-ing-1', 500, 'gram'), // Terigu
      createDemoRecipeIngredient('demo-ing-2', 100, 'gram'), // Gula
      createDemoRecipeIngredient('demo-ing-3', 100, 'gram'), // Telur (asumsi 100g)
      createDemoRecipeIngredient('demo-ing-4', 75, 'gram'),  // Margarin
      createDemoRecipeIngredient('demo-ing-5', 200, 'ml'),   // Susu UHT
    ].filter(Boolean),
    extraCosts: [
      { id: crypto.randomUUID(), name: 'Plastik OPP', category: 'packaging', amount: 2400 },
      { id: crypto.randomUUID(), name: 'Gas & Listrik', category: 'operational', amount: 5000 },
      { id: crypto.randomUUID(), name: 'Tenaga Kerja', category: 'labor', amount: 15000 }
    ]
  },
  {
    id: 'demo-recipe-2',
    name: 'Es Kopi Susu Aren',
    description: 'Kopi susu kekinian pakai gula aren murni',
    category: 'Minuman',
    outputQuantity: 1,
    outputUnit: 'cup',
    failedQuantity: 0,
    wastePercent: 5, // 5% tumpah/sisa
    source: 'demo',
    ingredients: [
      createDemoRecipeIngredient('demo-ing-6', 18, 'gram'), // Kopi Espresso
      createDemoRecipeIngredient('demo-ing-5', 120, 'ml'),   // Susu UHT
      createDemoRecipeIngredient('demo-ing-7', 20, 'ml'),    // Gula Aren
      createDemoRecipeIngredient('demo-ing-8', 1, 'pcs'),    // Cup 16oz
    ].filter(Boolean),
    extraCosts: [
      { id: crypto.randomUUID(), name: 'Es Batu', category: 'other', amount: 500 },
      { id: crypto.randomUUID(), name: 'Stiker Logo', category: 'packaging', amount: 300 }
    ]
  },
  {
    id: 'demo-recipe-3',
    name: 'Rice Bowl Ayam Mentai',
    description: 'Nasi ayam fillet dengan saus mentai bakar',
    category: 'Makanan',
    outputQuantity: 10,
    outputUnit: 'porsi',
    failedQuantity: 0,
    wastePercent: 0,
    source: 'demo',
    ingredients: [
      createDemoRecipeIngredient('demo-ing-12', 1, 'kg'),    // Beras
      createDemoRecipeIngredient('demo-ing-9', 1, 'kg'),     // Ayam Fillet
      createDemoRecipeIngredient('demo-ing-11', 200, 'gram'),// Saus Mentai
      createDemoRecipeIngredient('demo-ing-10', 10, 'pcs'),  // Paper bowl
    ].filter(Boolean),
    extraCosts: [
      { id: crypto.randomUUID(), name: 'Gas Memasak', category: 'operational', amount: 10000 },
      { id: crypto.randomUUID(), name: 'Minyak Goreng', category: 'other', amount: 8000 },
      { id: crypto.randomUUID(), name: 'Sendok Plastik', category: 'packaging', amount: 1500 }
    ]
  }
];

export const demoRecipes = rawRecipes.map((recipe) => {
  const result = calculateRecipeCost(recipe, { roundingStep: 500 });
  return {
    ...recipe,
    version: 1,
    resultSnapshot: result,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
});
