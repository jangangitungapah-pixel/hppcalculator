import { useMemo } from 'react';
import { useAppData } from './useAppData';
import {
  formatMovementType,
  formatStockQuantity,
  formatStockStatus,
  getStockStatusTone
} from '../lib/inventory';

export const useInventory = () => {
  const appData = useAppData();
  const {
    ingredients = [],
    inventorySettings = [],
    stockMovements = [],
    inventorySnapshots = []
  } = appData;

  const settingsByIngredientId = useMemo(() => {
    return new Map(inventorySettings.map((setting) => [setting.ingredientId, setting]));
  }, [inventorySettings]);

  const snapshotsByIngredientId = useMemo(() => {
    return new Map(inventorySnapshots.map((snapshot) => [snapshot.ingredientId, snapshot]));
  }, [inventorySnapshots]);

  const movementsByIngredientId = useMemo(() => {
    return stockMovements.reduce((acc, movement) => {
      if (!acc.has(movement.ingredientId)) acc.set(movement.ingredientId, []);
      acc.get(movement.ingredientId).push(movement);
      return acc;
    }, new Map());
  }, [stockMovements]);

  const lowStockIngredients = useMemo(() => {
    return ingredients.filter((ingredient) => snapshotsByIngredientId.get(ingredient.id)?.stockStatus === 'low');
  }, [ingredients, snapshotsByIngredientId]);

  const outOfStockIngredients = useMemo(() => {
    return ingredients.filter((ingredient) => snapshotsByIngredientId.get(ingredient.id)?.stockStatus === 'out');
  }, [ingredients, snapshotsByIngredientId]);

  const getSnapshotByIngredientId = (ingredientId) => {
    return snapshotsByIngredientId.get(ingredientId) || appData.getInventorySnapshotByIngredientId?.(ingredientId);
  };

  const getMovementsByIngredientId = (ingredientId) => {
    return movementsByIngredientId.get(ingredientId) || [];
  };

  return {
    inventorySettings,
    stockMovements,
    inventorySnapshots,
    settingsByIngredientId,
    lowStockIngredients,
    outOfStockIngredients,
    getSnapshotByIngredientId,
    getMovementsByIngredientId,
    saveInventorySetting: appData.saveInventorySetting,
    updateInventorySetting: appData.updateInventorySetting,
    deleteInventorySetting: appData.deleteInventorySetting,
    saveStockMovement: appData.saveStockMovement,
    updateStockMovement: appData.updateStockMovement,
    deleteStockMovement: appData.deleteStockMovement,
    formatMovementType,
    formatStockQuantity,
    formatStockStatus,
    getStockStatusTone
  };
};
