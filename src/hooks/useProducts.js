import { useContext } from 'react';
import { AppDataContext } from '../contexts/AppDataContext';

export const useProducts = () => {
  const context = useContext(AppDataContext);
  
  if (!context) {
    throw new Error('useProducts must be used within an AppDataProvider');
  }

  const {
    products,
    saveProduct,
    updateProduct,
    deleteProduct,
    loadDemoProducts
  } = context;

  const getProductById = (id) => products.find(p => p.id === id) || null;

  return {
    products,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct,
    loadDemoProducts
  };
};
