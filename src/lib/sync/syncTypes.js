export const SYNC_RECORD_TYPES = {
  CALCULATION: 'calculation',
  INGREDIENT: 'ingredient',
  RECIPE: 'recipe',
  PRODUCT: 'product',
  CHANNEL_PROFILE: 'channelProfile',
  PRICING_SIMULATION: 'pricingSimulation',
  BUNDLE_SIMULATION: 'bundleSimulation',
  INVENTORY_SETTING: 'inventorySetting',
  STOCK_MOVEMENT: 'stockMovement',
  SETTINGS: 'settings',
  SUPPLIER: 'supplier',
  PURCHASE_LOG: 'purchaseLog',
  PURCHASE_ITEM: 'purchaseItem'
};

export const LOCAL_MODULE_MAP = {
  calculations: SYNC_RECORD_TYPES.CALCULATION,
  ingredients: SYNC_RECORD_TYPES.INGREDIENT,
  recipes: SYNC_RECORD_TYPES.RECIPE,
  products: SYNC_RECORD_TYPES.PRODUCT,
  channelProfiles: SYNC_RECORD_TYPES.CHANNEL_PROFILE,
  pricingSimulations: SYNC_RECORD_TYPES.PRICING_SIMULATION,
  bundleSimulations: SYNC_RECORD_TYPES.BUNDLE_SIMULATION,
  inventorySettings: SYNC_RECORD_TYPES.INVENTORY_SETTING,
  stockMovements: SYNC_RECORD_TYPES.STOCK_MOVEMENT,
  settings: SYNC_RECORD_TYPES.SETTINGS,
  suppliers: SYNC_RECORD_TYPES.SUPPLIER,
  purchaseLogs: SYNC_RECORD_TYPES.PURCHASE_LOG,
  purchaseItems: SYNC_RECORD_TYPES.PURCHASE_ITEM
};

export const SYNC_RECORD_TYPES_TO_MODULE = Object.entries(LOCAL_MODULE_MAP).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});
