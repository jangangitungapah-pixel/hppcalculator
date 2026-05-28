import { STOCK_MOVEMENT_TYPES } from './inventoryTypes';

const movementTypes = new Set(Object.values(STOCK_MOVEMENT_TYPES));

export const validateInventorySetting = (input = {}) => {
  const errors = [];
  if (!input.ingredientId) errors.push('ingredientId wajib diisi');
  if (input.minimumStock !== undefined && Number(input.minimumStock) < 0) {
    errors.push('minimumStock tidak boleh negatif');
  }
  if (input.stockTrackingEnabled && !input.stockUnit) {
    errors.push('stockUnit wajib diisi saat tracking aktif');
  }
  return { isValid: errors.length === 0, errors };
};

export const validateStockMovement = (input = {}) => {
  const errors = [];
  if (!input.ingredientId) errors.push('ingredientId wajib diisi');
  if (!movementTypes.has(input.type)) errors.push('type movement tidak valid');
  if (input.type !== STOCK_MOVEMENT_TYPES.ADJUSTMENT && Number(input.quantity) < 0) {
    errors.push('quantity negatif hanya boleh untuk adjustment delta');
  }
  if (!Number.isFinite(Number(input.quantity))) errors.push('quantity harus angka');
  if (!input.unit) errors.push('unit wajib diisi');
  return { isValid: errors.length === 0, errors };
};
