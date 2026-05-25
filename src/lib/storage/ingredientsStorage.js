import { STORAGE_KEYS } from './storageKeys';
import { getScopedJson, setScopedJson } from './localStorageClient';

export const getIngredients = () => {
  return getScopedJson(STORAGE_KEYS.INGREDIENTS, []);
};

export const getIngredientById = (id) => {
  const ingredients = getIngredients();
  return ingredients.find(ing => ing.id === id) || null;
};

export const saveIngredient = (ingredientInput) => {
  const ingredients = getIngredients();
  
  const newIngredient = {
    ...ingredientInput,
    id: ingredientInput.id || crypto.randomUUID(),
    version: 1,
    source: ingredientInput.source || 'user',
    createdAt: ingredientInput.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updatedIngredients = [newIngredient, ...ingredients];
  setScopedJson(STORAGE_KEYS.INGREDIENTS, updatedIngredients);
  
  return newIngredient;
};

export const updateIngredient = (id, updates) => {
  const ingredients = getIngredients();
  const index = ingredients.findIndex(ing => ing.id === id);
  
  if (index === -1) return null;

  const updatedIngredient = {
    ...ingredients[index],
    ...updates,
    id, // Ensure ID cannot be changed
    updatedAt: new Date().toISOString()
  };

  ingredients[index] = updatedIngredient;
  setScopedJson(STORAGE_KEYS.INGREDIENTS, ingredients);
  
  return updatedIngredient;
};

export const deleteIngredient = (id) => {
  const ingredients = getIngredients();
  const updatedIngredients = ingredients.filter(ing => ing.id !== id);
  setScopedJson(STORAGE_KEYS.INGREDIENTS, updatedIngredients);
};

export const deleteAllIngredients = () => {
  setScopedJson(STORAGE_KEYS.INGREDIENTS, []);
};

export const loadDemoIngredients = (demoIngredients) => {
  const current = getIngredients();
  // Filter out existing demos to prevent duplicates
  const userIngredients = current.filter(ing => ing.source !== 'demo');
  const updated = [...demoIngredients, ...userIngredients];
  
  setScopedJson(STORAGE_KEYS.INGREDIENTS, updated);
  return updated;
};

export const hasIngredients = () => {
  return getIngredients().length > 0;
};
