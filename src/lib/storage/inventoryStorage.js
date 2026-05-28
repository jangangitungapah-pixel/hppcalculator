import { STORAGE_KEYS } from './storageKeys';
import { getScopedJson, setScopedJson } from './localStorageClient';
import { calculateStockFromMovements } from '../inventory/stockCalculator';
import { getStockStatus } from '../inventory/stockStatus';
import { validateInventorySetting, validateStockMovement } from '../inventory/stockValidation';

const now = () => new Date().toISOString();
const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `stock_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const getInventorySettings = () => getScopedJson(STORAGE_KEYS.INVENTORY_SETTINGS, []);

export const getInventorySettingByIngredientId = (ingredientId) => {
  return getInventorySettings().find(setting => setting.ingredientId === ingredientId) || null;
};

export const saveInventorySetting = (input) => {
  const validation = validateInventorySetting(input);
  if (!validation.isValid) throw new Error(validation.errors.join(', '));

  const settings = getInventorySettings();
  const existingIndex = settings.findIndex(setting => setting.ingredientId === input.ingredientId);
  const timestamp = now();
  const nextSetting = {
    ingredientId: input.ingredientId,
    stockTrackingEnabled: Boolean(input.stockTrackingEnabled),
    stockUnit: input.stockUnit || '',
    minimumStock: Number(input.minimumStock) || 0,
    reorderPoint: input.reorderPoint === undefined || input.reorderPoint === '' ? undefined : Number(input.reorderPoint),
    notes: input.notes || '',
    createdAt: input.createdAt || settings[existingIndex]?.createdAt || timestamp,
    updatedAt: timestamp
  };

  const updated = existingIndex >= 0
    ? settings.map((setting, index) => index === existingIndex ? nextSetting : setting)
    : [nextSetting, ...settings];

  setScopedJson(STORAGE_KEYS.INVENTORY_SETTINGS, updated);
  return nextSetting;
};

export const updateInventorySetting = (ingredientId, patch) => {
  const existing = getInventorySettingByIngredientId(ingredientId);
  return saveInventorySetting({ ...(existing || { ingredientId }), ...patch, ingredientId });
};

export const deleteInventorySetting = (ingredientId) => {
  setScopedJson(
    STORAGE_KEYS.INVENTORY_SETTINGS,
    getInventorySettings().filter(setting => setting.ingredientId !== ingredientId)
  );
};

export const loadDemoInventorySettings = (demoSettings = []) => {
  const userSettings = getInventorySettings().filter(setting => setting.source !== 'demo');
  const updated = [...demoSettings, ...userSettings];
  setScopedJson(STORAGE_KEYS.INVENTORY_SETTINGS, updated);
  return updated;
};

export const clearDemoInventorySettings = () => {
  setScopedJson(STORAGE_KEYS.INVENTORY_SETTINGS, getInventorySettings().filter(setting => setting.source !== 'demo'));
};

export const getStockMovements = () => getScopedJson(STORAGE_KEYS.STOCK_MOVEMENTS, []);

export const getStockMovementsByIngredientId = (ingredientId) => {
  return getStockMovements().filter(movement => movement.ingredientId === ingredientId);
};

export const getStockMovementById = (id) => getStockMovements().find(movement => movement.id === id) || null;

export const saveStockMovement = (input) => {
  const validation = validateStockMovement(input);
  if (!validation.isValid) throw new Error(validation.errors.join(', '));

  const movements = getStockMovements();
  const timestamp = now();
  const movement = {
    ...input,
    id: input.id || createId(),
    quantity: Number(input.quantity),
    referenceType: input.referenceType || 'manual',
    movementDate: input.movementDate || timestamp,
    createdAt: input.createdAt || timestamp,
    updatedAt: timestamp,
    source: input.source || 'user'
  };

  setScopedJson(STORAGE_KEYS.STOCK_MOVEMENTS, [movement, ...movements.filter(item => item.id !== movement.id)]);
  return movement;
};

export const updateStockMovement = (id, patch) => {
  const current = getStockMovementById(id);
  if (!current) return null;
  const updated = { ...current, ...patch, id, quantity: Number(patch.quantity ?? current.quantity), updatedAt: now() };
  const validation = validateStockMovement(updated);
  if (!validation.isValid) throw new Error(validation.errors.join(', '));
  setScopedJson(STORAGE_KEYS.STOCK_MOVEMENTS, getStockMovements().map(item => item.id === id ? updated : item));
  return updated;
};

export const deleteStockMovement = (id) => {
  setScopedJson(STORAGE_KEYS.STOCK_MOVEMENTS, getStockMovements().filter(item => item.id !== id));
};

export const loadDemoStockMovements = (demoMovements = []) => {
  const userMovements = getStockMovements().filter(movement => movement.source !== 'demo');
  const updated = [...demoMovements, ...userMovements];
  setScopedJson(STORAGE_KEYS.STOCK_MOVEMENTS, updated);
  return updated;
};

export const clearDemoStockMovements = () => {
  setScopedJson(STORAGE_KEYS.STOCK_MOVEMENTS, getStockMovements().filter(movement => movement.source !== 'demo'));
};

export const calculateCurrentStock = (ingredientId) => {
  const setting = getInventorySettingByIngredientId(ingredientId);
  return calculateStockFromMovements(getStockMovementsByIngredientId(ingredientId), setting || {});
};

export const calculateStockStatus = (snapshot) => getStockStatus({
  currentStock: snapshot.currentStock,
  minimumStock: snapshot.minimumStock,
  stockTrackingEnabled: snapshot.stockTrackingEnabled ?? snapshot.stockStatus !== 'not_tracked'
});

export const getInventorySnapshotByIngredientId = (ingredientId) => {
  const setting = getInventorySettingByIngredientId(ingredientId);
  if (!setting || !setting.stockTrackingEnabled) {
    return {
      ingredientId,
      currentStock: 0,
      stockUnit: setting?.stockUnit || '',
      minimumStock: setting?.minimumStock || 0,
      stockStatus: 'not_tracked',
      lastMovementAt: undefined
    };
  }

  const movements = getStockMovementsByIngredientId(ingredientId);
  const currentStock = calculateStockFromMovements(movements, setting);
  const lastMovementAt = movements
    .map(movement => movement.movementDate || movement.createdAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  return {
    ingredientId,
    currentStock,
    stockUnit: setting.stockUnit,
    minimumStock: Number(setting.minimumStock) || 0,
    stockStatus: getStockStatus({ currentStock, minimumStock: setting.minimumStock, stockTrackingEnabled: true }),
    lastMovementAt
  };
};

export const getInventorySnapshots = () => {
  const ingredientIds = new Set([
    ...getInventorySettings().map(setting => setting.ingredientId),
    ...getStockMovements().map(movement => movement.ingredientId)
  ]);
  return Array.from(ingredientIds).map(getInventorySnapshotByIngredientId);
};

export const getLowStockIngredients = () => getInventorySnapshots().filter(snapshot => snapshot.stockStatus === 'low');

export const getOutOfStockIngredients = () => getInventorySnapshots().filter(snapshot => snapshot.stockStatus === 'out');
