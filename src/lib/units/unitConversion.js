import { UNIT_TYPES, WEIGHT_UNITS, VOLUME_UNITS, COUNT_UNITS, BASE_UNITS, UNIT_OPTIONS } from './unitTypes';

export const getUnitType = (unit) => {
  const option = UNIT_OPTIONS.find(o => o.value === unit);
  return option ? option.type : null;
};

export const getBaseUnit = (unit) => {
  const type = getUnitType(unit);
  return type ? BASE_UNITS[type] : null;
};

export const convertToBaseUnit = (quantity, unit) => {
  const numQuantity = Number(quantity);
  if (isNaN(numQuantity)) return 0;

  switch (unit) {
    case WEIGHT_UNITS.KG:
      return numQuantity * 1000;
    case VOLUME_UNITS.LITER:
      return numQuantity * 1000;
    case WEIGHT_UNITS.GRAM:
    case VOLUME_UNITS.ML:
    case COUNT_UNITS.PCS:
    case COUNT_UNITS.UNIT:
      return numQuantity;
    default:
      return numQuantity;
  }
};

export const canConvertUnits = (fromUnit, toUnit) => {
  const fromType = getUnitType(fromUnit);
  const toType = getUnitType(toUnit);
  return fromType === toType && fromType !== null;
};

export const convertBetweenUnits = (quantity, fromUnit, toUnit) => {
  if (!canConvertUnits(fromUnit, toUnit)) {
    throw new Error(`Cannot convert between ${fromUnit} and ${toUnit}`);
  }

  if (fromUnit === toUnit) {
    return Number(quantity);
  }

  // Convert to base unit first
  const baseQuantity = convertToBaseUnit(quantity, fromUnit);

  // Convert from base unit to target unit
  switch (toUnit) {
    case WEIGHT_UNITS.KG:
      return baseQuantity / 1000;
    case VOLUME_UNITS.LITER:
      return baseQuantity / 1000;
    case WEIGHT_UNITS.GRAM:
    case VOLUME_UNITS.ML:
    case COUNT_UNITS.PCS:
    case COUNT_UNITS.UNIT:
      return baseQuantity;
    default:
      return baseQuantity;
  }
};

export const normalizePurchaseUnit = ({ quantity, unit }) => {
  const baseQuantity = convertToBaseUnit(quantity, unit);
  const baseUnit = getBaseUnit(unit);
  return { baseQuantity, baseUnit };
};

export const calculateCostPerBaseUnit = ({ purchasePrice, purchaseQuantity, purchaseUnit }) => {
  const numPrice = Number(purchasePrice);
  const numQuantity = Number(purchaseQuantity);
  
  if (isNaN(numPrice) || isNaN(numQuantity) || numQuantity <= 0) {
    return 0;
  }

  const { baseQuantity } = normalizePurchaseUnit({ quantity: numQuantity, unit: purchaseUnit });
  
  if (baseQuantity <= 0) return 0;
  
  return numPrice / baseQuantity;
};
