import { UNIT_TYPES, WEIGHT_UNITS, VOLUME_UNITS, COUNT_UNITS, BASE_UNITS, UNIT_OPTIONS } from './unitTypes';
import { preciseMultiply, preciseDivide, safeDivide } from '../calculations/rounding';

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
      return preciseMultiply(numQuantity, 1000);
    case WEIGHT_UNITS.OZ:
      return preciseMultiply(numQuantity, 28.3495);
    case VOLUME_UNITS.LITER:
      return preciseMultiply(numQuantity, 1000);
    case VOLUME_UNITS.TBSP:
      return preciseMultiply(numQuantity, 15);
    case VOLUME_UNITS.TSP:
      return preciseMultiply(numQuantity, 5);
    case VOLUME_UNITS.CUP:
      return preciseMultiply(numQuantity, 240);
    case VOLUME_UNITS.FL_OZ:
      return preciseMultiply(numQuantity, 29.5735);
    case WEIGHT_UNITS.GRAM:
    case VOLUME_UNITS.ML:
    case COUNT_UNITS.PCS:
    case COUNT_UNITS.UNIT:
      return numQuantity;
    default:
      return numQuantity;
  }
};

export const canConvertUnits = (fromUnit, toUnit, density = null) => {
  const fromType = getUnitType(fromUnit);
  const toType = getUnitType(toUnit);
  if (!fromType || !toType) return false;
  if (fromType === toType) return true;

  // Cross conversion between weight and volume is possible if density is provided
  const hasDensity = density !== null && Number.isFinite(Number(density)) && Number(density) > 0;
  if (hasDensity) {
    const isWeightOrVolume = (t) => t === UNIT_TYPES.WEIGHT || t === UNIT_TYPES.VOLUME;
    return isWeightOrVolume(fromType) && isWeightOrVolume(toType);
  }

  return false;
};

export const convertBetweenUnits = (quantity, fromUnit, toUnit, density = 1.0) => {
  const safeDensity = density !== null && Number.isFinite(Number(density)) && Number(density) > 0 ? Number(density) : 1.0;

  if (!canConvertUnits(fromUnit, toUnit, safeDensity)) {
    throw new Error(`Cannot convert between ${fromUnit} and ${toUnit} with density ${safeDensity}`);
  }

  if (fromUnit === toUnit) {
    return Number(quantity);
  }

  const fromType = getUnitType(fromUnit);
  const toType = getUnitType(toUnit);

  // 1. Convert to base unit of original type first
  let baseQuantity = convertToBaseUnit(quantity, fromUnit);

  // 2. Perform cross-type conversion (weight <-> volume) using density if types differ
  if (fromType !== toType) {
    if (fromType === UNIT_TYPES.WEIGHT && toType === UNIT_TYPES.VOLUME) {
      // grams to ml: volume = mass / density
      baseQuantity = preciseDivide(baseQuantity, safeDensity);
    } else if (fromType === UNIT_TYPES.VOLUME && toType === UNIT_TYPES.WEIGHT) {
      // ml to grams: mass = volume * density
      baseQuantity = preciseMultiply(baseQuantity, safeDensity);
    }
  }

  // 3. Convert from base unit of target type to target unit
  switch (toUnit) {
    case WEIGHT_UNITS.KG:
      return preciseDivide(baseQuantity, 1000);
    case WEIGHT_UNITS.OZ:
      return preciseDivide(baseQuantity, 28.3495);
    case VOLUME_UNITS.LITER:
      return preciseDivide(baseQuantity, 1000);
    case VOLUME_UNITS.TBSP:
      return preciseDivide(baseQuantity, 15);
    case VOLUME_UNITS.TSP:
      return preciseDivide(baseQuantity, 5);
    case VOLUME_UNITS.CUP:
      return preciseDivide(baseQuantity, 240);
    case VOLUME_UNITS.FL_OZ:
      return preciseDivide(baseQuantity, 29.5735);
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
  
  return preciseDivide(numPrice, baseQuantity);
};
