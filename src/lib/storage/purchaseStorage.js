import { STORAGE_KEYS } from './storageKeys';
import { getScopedJson, setScopedJson } from './localStorageClient';
import { createPurchaseLog, createPurchaseItem } from '../suppliers/purchaseTypes';
import { saveStockMovement, deleteStockMovement } from './inventoryStorage';
import { getIngredientById, updateIngredient } from './ingredientsStorage';
import { canConvertUnits, convertBetweenUnits } from '../units';
import { calculateIngredientBaseData } from '../recipe';

// --- Purchase Logs ---

export const getPurchaseLogs = () => {
  const list = getScopedJson(STORAGE_KEYS.PURCHASE_LOGS, []);
  return list.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate) || b.createdAt.localeCompare(a.createdAt));
};

export const getPurchaseLogById = (id) => {
  const list = getPurchaseLogs();
  return list.find(log => log.id === id) || null;
};

export const savePurchaseLog = (input, itemsInput = []) => {
  const logs = getScopedJson(STORAGE_KEYS.PURCHASE_LOGS, []);
  const allItems = getScopedJson(STORAGE_KEYS.PURCHASE_ITEMS, []);
  
  // Calculate totalAmount from items
  const totalAmount = itemsInput.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0);
  
  const log = createPurchaseLog({ ...input, totalAmount });
  const warnings = [];
  
  // Save items
  const savedItems = itemsInput.map(itemInput => {
    let item = createPurchaseItem(itemInput, log.id);
    
    // 1. Stock Integration (addToStock)
    if (item.addToStock && item.ingredientId && item.quantity > 0) {
      try {
        const movement = saveStockMovement({
          ingredientId: item.ingredientId,
          type: 'stock_in',
          quantity: item.quantity,
          unit: item.unit,
          movementDate: log.purchaseDate,
          referenceType: 'purchase',
          referenceId: log.id,
          note: `Pembelian bahan - ${log.supplierNameSnapshot || 'Tanpa Supplier'}`
        });
        item.stockMovementId = movement.id;
      } catch (err) {
        console.warn(`[PurchaseStorage] Failed to create stock movement for ingredient ${item.ingredientId}:`, err);
      }
    }
    
    // 2. Price Integration (updateIngredientPrice)
    if (item.updateIngredientPrice && item.ingredientId && item.quantity > 0) {
      const ingredient = getIngredientById(item.ingredientId);
      if (ingredient) {
        if (item.unit === ingredient.purchaseUnit) {
          const priceRate = item.totalPrice / item.quantity;
          const newPurchasePrice = priceRate * ingredient.purchaseQuantity;
          const updatedIng = calculateIngredientBaseData({ ...ingredient, purchasePrice: newPurchasePrice });
          updateIngredient(ingredient.id, updatedIng);
        } else {
          const density = ingredient.density || 1.0;
          if (canConvertUnits(ingredient.purchaseUnit, item.unit, density)) {
            const priceRate = item.totalPrice / item.quantity;
            try {
              const convertedQty = convertBetweenUnits(ingredient.purchaseQuantity, ingredient.purchaseUnit, item.unit, density);
              const newPurchasePrice = priceRate * convertedQty;
              const updatedIng = calculateIngredientBaseData({ ...ingredient, purchasePrice: newPurchasePrice });
              updateIngredient(ingredient.id, updatedIng);
            } catch (err) {
              warnings.push(`Satuan pembelian berbeda dan gagal dikonversi untuk bahan: ${ingredient.name}`);
            }
          } else {
            warnings.push(`Satuan pembelian berbeda dan belum bisa dikonversi otomatis untuk bahan: ${ingredient.name}`);
          }
        }
      }
    }
    
    return item;
  });

  // Append new items, filter out existing items for this log to prevent duplicate saves on updates
  const otherItems = allItems.filter(item => item.purchaseLogId !== log.id);
  setScopedJson(STORAGE_KEYS.PURCHASE_ITEMS, [...savedItems, ...otherItems]);

  const existsIndex = logs.findIndex(l => l.id === log.id);
  let updatedLogs;
  if (existsIndex >= 0) {
    updatedLogs = logs.map((l, idx) => idx === existsIndex ? log : l);
  } else {
    updatedLogs = [log, ...logs];
  }
  setScopedJson(STORAGE_KEYS.PURCHASE_LOGS, updatedLogs);

  return { log, items: savedItems, warnings };
};

export const updatePurchaseLog = (id, patch) => {
  const logs = getScopedJson(STORAGE_KEYS.PURCHASE_LOGS, []);
  const idx = logs.findIndex(log => log.id === id);
  if (idx === -1) return null;

  const updated = {
    ...logs[idx],
    ...patch,
    id,
    updatedAt: new Date().toISOString()
  };

  logs[idx] = updated;
  setScopedJson(STORAGE_KEYS.PURCHASE_LOGS, logs);
  return updated;
};

export const deletePurchaseLog = (id) => {
  // 1. Delete associated items and their stock movements
  const items = getPurchaseItemsByLogId(id);
  items.forEach(item => {
    if (item.stockMovementId) {
      try {
        deleteStockMovement(item.stockMovementId);
      } catch (err) {
        console.warn(`[PurchaseStorage] Failed to delete stock movement ${item.stockMovementId}:`, err);
      }
    }
  });

  const allItems = getScopedJson(STORAGE_KEYS.PURCHASE_ITEMS, []);
  const remainingItems = allItems.filter(item => item.purchaseLogId !== id);
  setScopedJson(STORAGE_KEYS.PURCHASE_ITEMS, remainingItems);

  // 2. Delete log
  const logs = getScopedJson(STORAGE_KEYS.PURCHASE_LOGS, []);
  const remainingLogs = logs.filter(log => log.id !== id);
  setScopedJson(STORAGE_KEYS.PURCHASE_LOGS, remainingLogs);

  return true;
};

// --- Purchase Items ---

export const getPurchaseItems = () => {
  return getScopedJson(STORAGE_KEYS.PURCHASE_ITEMS, []);
};

export const getPurchaseItemsByLogId = (purchaseLogId) => {
  return getPurchaseItems().filter(item => item.purchaseLogId === purchaseLogId);
};

export const getPurchaseItemsByIngredientId = (ingredientId) => {
  return getPurchaseItems().filter(item => item.ingredientId === ingredientId);
};

export const savePurchaseItem = (input) => {
  const items = getScopedJson(STORAGE_KEYS.PURCHASE_ITEMS, []);
  const item = createPurchaseItem(input);

  const idx = items.findIndex(i => i.id === item.id);
  let updated;
  if (idx >= 0) {
    updated = items.map((i, index) => index === idx ? item : i);
  } else {
    updated = [item, ...items];
  }

  setScopedJson(STORAGE_KEYS.PURCHASE_ITEMS, updated);
  return item;
};

export const updatePurchaseItem = (id, patch) => {
  const items = getScopedJson(STORAGE_KEYS.PURCHASE_ITEMS, []);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;

  const updated = {
    ...items[idx],
    ...patch,
    id,
    updatedAt: new Date().toISOString()
  };

  items[idx] = updated;
  setScopedJson(STORAGE_KEYS.PURCHASE_ITEMS, items);
  return updated;
};

export const deletePurchaseItem = (id) => {
  const items = getScopedJson(STORAGE_KEYS.PURCHASE_ITEMS, []);
  const target = items.find(i => i.id === id);
  
  if (target && target.stockMovementId) {
    try {
      deleteStockMovement(target.stockMovementId);
    } catch (err) {
      console.warn(`[PurchaseStorage] Failed to delete stock movement ${target.stockMovementId}:`, err);
    }
  }

  const filtered = items.filter(i => i.id !== id);
  setScopedJson(STORAGE_KEYS.PURCHASE_ITEMS, filtered);
  return true;
};

// --- Computed Functions ---

export const getPurchaseDetail = (purchaseLogId) => {
  const log = getPurchaseLogById(purchaseLogId);
  if (!log) return null;
  const items = getPurchaseItemsByLogId(purchaseLogId);
  return { log, items };
};

export const getRecentPurchases = (limit = 5) => {
  return getPurchaseLogs().slice(0, limit);
};

export const getIngredientLastPurchase = (ingredientId) => {
  const items = getPurchaseItemsByIngredientId(ingredientId);
  if (items.length === 0) return null;
  
  // Sort by associated log's purchaseDate desc, then item's createdAt desc
  const logs = getScopedJson(STORAGE_KEYS.PURCHASE_LOGS, []);
  const logMap = new Map(logs.map(log => [log.id, log]));
  
  const sorted = [...items].sort((a, b) => {
    const logA = logMap.get(a.purchaseLogId);
    const logB = logMap.get(b.purchaseLogId);
    const dateA = logA ? logA.purchaseDate : '';
    const dateB = logB ? logB.purchaseDate : '';
    
    return dateB.localeCompare(dateA) || b.createdAt.localeCompare(a.createdAt);
  });
  
  return sorted[0];
};

export const getIngredientAveragePurchasePrice = (ingredientId) => {
  const items = getPurchaseItemsByIngredientId(ingredientId);
  if (items.length === 0) return 0;
  
  const total = items.reduce((sum, item) => sum + item.unitPrice, 0);
  return total / items.length;
};

export const getSupplierPurchaseHistory = (supplierId) => {
  const logs = getPurchaseLogs().filter(log => log.supplierId === supplierId);
  return logs.map(log => ({
    ...log,
    items: getPurchaseItemsByLogId(log.id)
  }));
};

export const getMonthlyPurchaseTotal = (month) => {
  const logs = getPurchaseLogs();
  return logs
    .filter(log => log.purchaseDate && log.purchaseDate.startsWith(month))
    .reduce((sum, log) => sum + (Number(log.totalAmount) || 0), 0);
};

// --- Demo Loading ---

export const loadDemoPurchases = (demoLogs = [], demoItems = []) => {
  // Logs
  const currentLogs = getScopedJson(STORAGE_KEYS.PURCHASE_LOGS, []);
  const userLogs = currentLogs.filter(l => l.source !== 'demo');
  const demoLogIds = new Set(demoLogs.map(l => l.id));
  const filteredUserLogs = userLogs.filter(l => !demoLogIds.has(l.id));
  const updatedLogs = [...demoLogs, ...filteredUserLogs];
  setScopedJson(STORAGE_KEYS.PURCHASE_LOGS, updatedLogs);

  // Items
  const currentItems = getScopedJson(STORAGE_KEYS.PURCHASE_ITEMS, []);
  const userItems = currentItems.filter(i => i.source !== 'demo');
  const demoItemIds = new Set(demoItems.map(i => i.id));
  const filteredUserItems = userItems.filter(i => !demoItemIds.has(i.id));
  const updatedItems = [...demoItems, ...filteredUserItems];
  setScopedJson(STORAGE_KEYS.PURCHASE_ITEMS, updatedItems);

  return { logs: updatedLogs, items: updatedItems };
};

export const clearDemoPurchases = () => {
  // Logs
  const currentLogs = getScopedJson(STORAGE_KEYS.PURCHASE_LOGS, []);
  const userLogs = currentLogs.filter(l => l.source !== 'demo');
  setScopedJson(STORAGE_KEYS.PURCHASE_LOGS, userLogs);

  // Items
  const currentItems = getScopedJson(STORAGE_KEYS.PURCHASE_ITEMS, []);
  const userItems = currentItems.filter(i => i.source !== 'demo');
  setScopedJson(STORAGE_KEYS.PURCHASE_ITEMS, userItems);

  return { logs: userLogs, items: userItems };
};
