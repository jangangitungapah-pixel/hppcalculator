export const UNIT_TYPES = {
  WEIGHT: 'weight',
  VOLUME: 'volume',
  COUNT: 'count',
};

export const WEIGHT_UNITS = {
  GRAM: 'gram',
  KG: 'kg',
  OZ: 'oz',
};

export const VOLUME_UNITS = {
  ML: 'ml',
  LITER: 'liter',
  TBSP: 'tbsp',
  TSP: 'tsp',
  CUP: 'cup',
  FL_OZ: 'fl_oz',
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
  { value: WEIGHT_UNITS.OZ, type: UNIT_TYPES.WEIGHT, labelId: 'units.oz' },
  { value: VOLUME_UNITS.ML, type: UNIT_TYPES.VOLUME, labelId: 'units.ml' },
  { value: VOLUME_UNITS.LITER, type: UNIT_TYPES.VOLUME, labelId: 'units.liter' },
  { value: VOLUME_UNITS.TBSP, type: UNIT_TYPES.VOLUME, labelId: 'units.tbsp' },
  { value: VOLUME_UNITS.TSP, type: UNIT_TYPES.VOLUME, labelId: 'units.tsp' },
  { value: VOLUME_UNITS.CUP, type: UNIT_TYPES.VOLUME, labelId: 'units.cup' },
  { value: VOLUME_UNITS.FL_OZ, type: UNIT_TYPES.VOLUME, labelId: 'units.fl_oz' },
  { value: COUNT_UNITS.PCS, type: UNIT_TYPES.COUNT, labelId: 'units.pcs' },
  { value: COUNT_UNITS.UNIT, type: UNIT_TYPES.COUNT, labelId: 'units.unit' },
];
