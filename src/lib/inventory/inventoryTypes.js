export const STOCK_MOVEMENT_TYPES = {
  OPENING_BALANCE: 'opening_balance',
  STOCK_IN: 'stock_in',
  STOCK_OUT: 'stock_out',
  ADJUSTMENT: 'adjustment',
  WASTE: 'waste',
  CORRECTION: 'correction'
};

export const STOCK_STATUSES = {
  OK: 'ok',
  LOW: 'low',
  OUT: 'out',
  NOT_TRACKED: 'not_tracked'
};

export const STOCK_MOVEMENT_SOURCES = {
  USER: 'user',
  DEMO: 'demo'
};

export const STOCK_REFERENCE_TYPES = {
  MANUAL: 'manual',
  RECIPE: 'recipe',
  PRODUCT: 'product',
  BATCH: 'batch',
  IMPORT: 'import'
};

export const createInventorySettingShape = () => ({
  ingredientId: '',
  stockTrackingEnabled: false,
  stockUnit: '',
  minimumStock: 0,
  reorderPoint: undefined,
  notes: '',
  createdAt: '',
  updatedAt: ''
});

export const createStockMovementShape = () => ({
  id: '',
  ingredientId: '',
  type: STOCK_MOVEMENT_TYPES.STOCK_IN,
  quantity: 0,
  unit: '',
  normalizedQuantity: undefined,
  normalizedUnit: undefined,
  reason: '',
  referenceType: STOCK_REFERENCE_TYPES.MANUAL,
  referenceId: '',
  note: '',
  movementDate: '',
  createdAt: '',
  updatedAt: '',
  source: STOCK_MOVEMENT_SOURCES.USER
});

export const createInventorySnapshotShape = () => ({
  ingredientId: '',
  currentStock: 0,
  stockUnit: '',
  minimumStock: 0,
  stockStatus: STOCK_STATUSES.NOT_TRACKED,
  lastMovementAt: undefined
});
