import { STORAGE_KEYS } from './storageKeys';
import { getJson, setJson } from './localStorageClient';

export const getRecipes = () => {
  return getJson(STORAGE_KEYS.RECIPES, []);
};

export const getRecipeById = (id) => {
  const recipes = getRecipes();
  return recipes.find(r => r.id === id) || null;
};

export const saveRecipe = (recipeInput, result) => {
  const recipes = getRecipes();
  
  const newRecipe = {
    ...recipeInput,
    id: recipeInput.id || crypto.randomUUID(),
    version: 1,
    resultSnapshot: result,
    source: recipeInput.source || 'user',
    createdAt: recipeInput.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updatedRecipes = [newRecipe, ...recipes];
  setJson(STORAGE_KEYS.RECIPES, updatedRecipes);
  
  return newRecipe;
};

export const updateRecipe = (id, updates) => {
  const recipes = getRecipes();
  const index = recipes.findIndex(r => r.id === id);
  
  if (index === -1) return null;

  const updatedRecipe = {
    ...recipes[index],
    ...updates,
    id, // Ensure ID cannot be changed
    updatedAt: new Date().toISOString()
  };

  recipes[index] = updatedRecipe;
  setJson(STORAGE_KEYS.RECIPES, recipes);
  
  return updatedRecipe;
};

export const deleteRecipe = (id) => {
  const recipes = getRecipes();
  const updatedRecipes = recipes.filter(r => r.id !== id);
  setJson(STORAGE_KEYS.RECIPES, updatedRecipes);
};

export const deleteAllRecipes = () => {
  setJson(STORAGE_KEYS.RECIPES, []);
};

export const loadDemoRecipes = (demoRecipes, ingredients = []) => {
  const current = getRecipes();
  // Filter out existing demos to prevent duplicates
  const userRecipes = current.filter(r => r.source !== 'demo');
  const updated = [...demoRecipes, ...userRecipes];
  
  setJson(STORAGE_KEYS.RECIPES, updated);
  return updated;
};

export const hasRecipes = () => {
  return getRecipes().length > 0;
};
