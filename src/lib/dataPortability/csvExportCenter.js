import { downloadCsvFile } from './fileDownload';

export const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const rowsToCsv = (rows) => {
  if (!rows || rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map(row => headers.map(header => escapeCsvValue(row[header])).join(','))
  ];
  return csvRows.join('\n');
};

export const buildCalculationsCsvRows = (calculations) => {
  return calculations.map(calc => ({
    id: calc.id,
    productName: calc.productName,
    createdAt: calc.createdAt,
    hppPerUnit: calc.result?.hppPerUnit || 0,
    sellingPrice: calc.result?.sellingPrice || 0,
    profitPerUnit: calc.result?.profitPerUnit || 0,
    totalProfit: calc.result?.totalProfit || 0,
    marginPercent: calc.result?.marginPercent || 0,
    status: calc.result?.status || 'Unknown'
  }));
};

export const buildIngredientsCsvRows = (ingredients) => {
  return ingredients.map(ing => ({
    id: ing.id,
    name: ing.name,
    category: ing.category,
    purchasePrice: ing.purchasePrice,
    purchaseQuantity: ing.purchaseQuantity,
    purchaseUnit: ing.purchaseUnit,
    baseUnit: ing.baseUnit,
    costPerBaseUnit: ing.costPerBaseUnit,
    supplier: ing.supplier || '',
    createdAt: ing.createdAt
  }));
};

export const buildRecipesCsvRows = (recipes) => {
  return recipes.map(recipe => ({
    id: recipe.id,
    name: recipe.name,
    category: recipe.category,
    outputQuantity: recipe.outputQuantity,
    outputUnit: recipe.outputUnit,
    totalIngredientCost: recipe.resultSnapshot?.totalIngredientCost || 0,
    totalExtraCost: recipe.resultSnapshot?.totalExtraCost || 0,
    totalRecipeCost: recipe.resultSnapshot?.totalRecipeCost || 0,
    hppPerUnit: recipe.resultSnapshot?.hppPerUnit || 0,
    createdAt: recipe.createdAt
  }));
};

export const buildProductsCsvRows = (products) => {
  return products.map(prod => ({
    id: prod.id,
    name: prod.name,
    recipeNameSnapshot: prod.recipeNameSnapshot || '',
    hppPerUnitSnapshot: prod.hppPerUnitSnapshot || 0,
    targetSellingPrice: prod.targetSellingPrice || 0,
    createdAt: prod.createdAt
  }));
};

export const buildChannelProfilesCsvRows = (profiles) => {
  return profiles.map(p => ({
    id: p.id,
    name: p.name,
    platform: p.platform,
    feePercent: p.feePercent || 0,
    feeFixed: p.feeFixed || 0,
    isCustom: p.isCustom ? 'Yes' : 'No',
    createdAt: p.createdAt
  }));
};

export const buildPricingSimulationsCsvRows = (simulations) => {
  return simulations.map(sim => ({
    id: sim.id,
    name: sim.name,
    type: sim.type,
    sourceNameSnapshot: sim.sourceNameSnapshot || '',
    baseHpp: sim.baseHpp || 0,
    baseSellingPrice: sim.baseSellingPrice || 0,
    profit: sim.results?.profit || 0,
    marginPercent: sim.results?.marginPercent || 0,
    createdAt: sim.createdAt
  }));
};

export const buildBundleSimulationsCsvRows = (bundles) => {
  return bundles.map(bundle => ({
    id: bundle.id,
    name: bundle.name,
    baseTotalHpp: bundle.baseTotalHpp || 0,
    finalSellingPrice: bundle.finalSellingPrice || 0,
    profit: bundle.results?.profit || 0,
    marginPercent: bundle.results?.marginPercent || 0,
    createdAt: bundle.createdAt
  }));
};

export const buildInventorySettingsCsvRows = (settings) => {
  return settings.map(setting => ({
    ingredientId: setting.ingredientId,
    stockTrackingEnabled: setting.stockTrackingEnabled ? 'Yes' : 'No',
    stockUnit: setting.stockUnit,
    minimumStock: setting.minimumStock,
    reorderPoint: setting.reorderPoint || '',
    notes: setting.notes || '',
    updatedAt: setting.updatedAt
  }));
};

export const buildStockMovementsCsvRows = (movements) => {
  return movements.map(movement => ({
    id: movement.id,
    ingredientId: movement.ingredientId,
    type: movement.type,
    quantity: movement.quantity,
    unit: movement.unit,
    reason: movement.reason || '',
    note: movement.note || '',
    movementDate: movement.movementDate,
    referenceType: movement.referenceType || '',
    referenceId: movement.referenceId || '',
    createdAt: movement.createdAt
  }));
};

export const buildSuppliersCsvRows = (suppliers) => {
  return suppliers.map(s => ({
    id: s.id,
    name: s.name,
    type: s.type || '',
    contactName: s.contactName || '',
    phone: s.phone || '',
    email: s.email || '',
    address: s.address || '',
    notes: s.notes || '',
    isFavorite: s.isFavorite ? 'Yes' : 'No',
    createdAt: s.createdAt
  }));
};

export const buildPurchaseLogsCsvRows = (logs) => {
  return logs.map(l => ({
    id: l.id,
    supplierId: l.supplierId || '',
    supplierNameSnapshot: l.supplierNameSnapshot || '',
    purchaseDate: l.purchaseDate,
    invoiceNumber: l.invoiceNumber || '',
    paymentMethod: l.paymentMethod || '',
    totalAmount: l.totalAmount,
    notes: l.notes || '',
    createdAt: l.createdAt
  }));
};

export const buildPurchaseItemsCsvRows = (items) => {
  return items.map(item => ({
    id: item.id,
    purchaseLogId: item.purchaseLogId,
    ingredientId: item.ingredientId,
    ingredientNameSnapshot: item.ingredientNameSnapshot,
    quantity: item.quantity,
    unit: item.unit,
    totalPrice: item.totalPrice,
    unitPrice: item.unitPrice,
    addToStock: item.addToStock ? 'Yes' : 'No',
    updateIngredientPrice: item.updateIngredientPrice ? 'Yes' : 'No',
    createdAt: item.createdAt
  }));
};

export const exportModuleToCsv = (moduleName, data) => {
  if (!Array.isArray(data) || data.length === 0) return false;
  
  let rows = [];
  switch (moduleName) {
    case 'calculations': rows = buildCalculationsCsvRows(data); break;
    case 'ingredients': rows = buildIngredientsCsvRows(data); break;
    case 'recipes': rows = buildRecipesCsvRows(data); break;
    case 'products': rows = buildProductsCsvRows(data); break;
    case 'channelProfiles': rows = buildChannelProfilesCsvRows(data); break;
    case 'pricingSimulations': rows = buildPricingSimulationsCsvRows(data); break;
    case 'bundleSimulations': rows = buildBundleSimulationsCsvRows(data); break;
    case 'inventorySettings': rows = buildInventorySettingsCsvRows(data); break;
    case 'stockMovements': rows = buildStockMovementsCsvRows(data); break;
    case 'suppliers': rows = buildSuppliersCsvRows(data); break;
    case 'purchaseLogs': rows = buildPurchaseLogsCsvRows(data); break;
    case 'purchaseItems': rows = buildPurchaseItemsCsvRows(data); break;
    default: return false;
  }
  
  if (rows.length === 0) return false;
  
  const csvString = rowsToCsv(rows);
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `modalin-${moduleName}-${dateStr}.csv`;
  
  downloadCsvFile(filename, csvString);
  return true;
};
