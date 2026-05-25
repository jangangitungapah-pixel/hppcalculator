import { useContext } from 'react';
import { AppDataContext } from '../contexts/AppDataContext';

export const useIngredients = () => {
  const context = useContext(AppDataContext);
  
  if (!context) {
    throw new Error('useIngredients must be used within an AppDataProvider');
  }

  const {
    ingredients,
    saveIngredient,
    updateIngredient,
    deleteIngredient,
    loadDemoIngredients
  } = context;

  const getIngredientById = (id) => ingredients.find(ing => ing.id === id) || null;

  return {
    ingredients,
    getIngredientById,
    saveIngredient,
    updateIngredient,
    deleteIngredient,
    loadDemoIngredients
  };
};
