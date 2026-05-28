import { convertBetweenUnits, canConvertUnits } from '../units/unitConversion';
import { STOCK_MOVEMENT_TYPES } from './inventoryTypes';

export const sortMovementsByDate = (movements = []) => {
  return [...movements].sort((a, b) => {
    const aDate = new Date(a.movementDate || a.createdAt || 0).getTime();
    const bDate = new Date(b.movementDate || b.createdAt || 0).getTime();
    return aDate - bDate;
  });
};

export const normalizeMovementQuantity = (movement, inventorySetting) => {
  const quantity = Number(movement?.quantity) || 0;
  const movementUnit = movement?.unit;
  const stockUnit = inventorySetting?.stockUnit || movementUnit;

  if (!movementUnit || !stockUnit || movementUnit === stockUnit) {
    return { quantity, unit: stockUnit || movementUnit, warning: null };
  }

  try {
    if (canConvertUnits(movementUnit, stockUnit)) {
      return {
        quantity: convertBetweenUnits(quantity, movementUnit, stockUnit),
        unit: stockUnit,
        warning: null
      };
    }
  } catch {
    // Fall through to warning fallback.
  }

  return {
    quantity,
    unit: movementUnit,
    warning: `Tidak bisa konversi ${movementUnit} ke ${stockUnit}. Jumlah dipakai apa adanya.`
  };
};

export const getMovementDelta = (movement) => {
  const quantity = Number(movement?.normalizedQuantity ?? movement?.quantity) || 0;
  switch (movement?.type) {
    case STOCK_MOVEMENT_TYPES.OPENING_BALANCE:
    case STOCK_MOVEMENT_TYPES.STOCK_IN:
    case STOCK_MOVEMENT_TYPES.CORRECTION:
      return quantity;
    case STOCK_MOVEMENT_TYPES.STOCK_OUT:
    case STOCK_MOVEMENT_TYPES.WASTE:
      return -Math.abs(quantity);
    case STOCK_MOVEMENT_TYPES.ADJUSTMENT:
      return quantity;
    default:
      return 0;
  }
};

export const calculateStockFromMovements = (movements = [], inventorySetting = {}) => {
  return sortMovementsByDate(movements).reduce((sum, movement) => {
    const normalized = normalizeMovementQuantity(movement, inventorySetting);
    return sum + getMovementDelta({
      ...movement,
      normalizedQuantity: normalized.quantity,
      normalizedUnit: normalized.unit
    });
  }, 0);
};
