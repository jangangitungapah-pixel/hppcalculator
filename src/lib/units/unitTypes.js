export const UNIT_TYPES = {
  WEIGHT: 'weight',
  VOLUME: 'volume',
  COUNT: 'count',
};

export const WEIGHT_UNITS = {
  GRAM: 'gram',
  KG: 'kg',
};

export const VOLUME_UNITS = {
  ML: 'ml',
  LITER: 'liter',
};

export const COUNT_UNITS = {
  PCS: 'pcs',
  UNIT: 'unit',
};

export const BASE_UNITS = {
  [UNIT_TYPES.WEIGHT]: WEIGHT_UNITS.GRAM,
  [UNIT_TYPES.VOLUME]: VOLUME_UNITS.ML,
  [UNIT_TYPES.COUNT]: COUNT_UNITS.PCS,
};

export const UNIT_OPTIONS = [
  { value: WEIGHT_UNITS.GRAM, type: UNIT_TYPES.WEIGHT, labelId: 'units.gram' },
  { value: WEIGHT_UNITS.KG, type: UNIT_TYPES.WEIGHT, labelId: 'units.kg' },
  { value: VOLUME_UNITS.ML, type: UNIT_TYPES.VOLUME, labelId: 'units.ml' },
  { value: VOLUME_UNITS.LITER, type: UNIT_TYPES.VOLUME, labelId: 'units.liter' },
  { value: COUNT_UNITS.PCS, type: UNIT_TYPES.COUNT, labelId: 'units.pcs' },
  { value: COUNT_UNITS.UNIT, type: UNIT_TYPES.COUNT, labelId: 'units.unit' },
];
