import { useContext } from 'react';
import { AppDataContext } from '../contexts/AppDataContext';
import { 
  getIngredientLastPurchase as getLast,
  getIngredientAveragePurchasePrice as getAvg,
  getRecentPurchases as getRecent
} from '../lib/storage';

export const usePurchases = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('usePurchases must be used within an AppDataProvider');
  }

  const {
    purchaseLogs,
    purchaseItems,
    savePurchaseLog,
    updatePurchaseLog,
    deletePurchaseLog,
    getPurchaseDetail
  } = context;

  const recentPurchases = getRecent();

  const getIngredientLastPurchase = (ingredientId) => {
    return getLast(ingredientId);
  };

  const getIngredientAveragePurchasePrice = (ingredientId) => {
    return getAvg(ingredientId);
  };

  return {
    purchaseLogs,
    purchaseItems,
    recentPurchases,
    savePurchaseLog,
    updatePurchaseLog,
    deletePurchaseLog,
    getPurchaseDetail,
    getIngredientLastPurchase,
    getIngredientAveragePurchasePrice
  };
};
