import { useContext } from 'react';
import { AppDataContext } from '../contexts/AppDataContext';
import { getSupplierPurchaseSummary as getSummary } from '../lib/storage';

export const useSuppliers = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useSuppliers must be used within an AppDataProvider');
  }

  const {
    suppliers,
    saveSupplier,
    updateSupplier,
    deleteSupplier
  } = context;

  const favoriteSuppliers = suppliers.filter(s => s.isFavorite);

  const getSupplierById = (id) => {
    return suppliers.find(s => s.id === id) || null;
  };

  const getSupplierPurchaseSummary = (id) => {
    return getSummary(id);
  };

  return {
    suppliers,
    favoriteSuppliers,
    saveSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierById,
    getSupplierPurchaseSummary
  };
};
