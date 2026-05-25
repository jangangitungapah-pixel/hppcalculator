import { useContext } from 'react';
import { AppDataContext } from '../contexts/AppDataContext';

export const useRecipes = () => {
  const context = useContext(AppDataContext);
  
  if (!context) {
    throw new Error('useRecipes must be used within an AppDataProvider');
  }

  const {
    recipes,
    saveRecipe,
    updateRecipe,
    deleteRecipe,
    loadDemoRecipes
  } = context;

  const getRecipeById = (id) => recipes.find(r => r.id === id) || null;

  return {
    recipes,
    getRecipeById,
    saveRecipe,
    updateRecipe,
    deleteRecipe,
    loadDemoRecipes
  };
};
