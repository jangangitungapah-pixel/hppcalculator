const now = new Date().toISOString();
const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const demoInventorySettings = [
  { ingredientId: 'demo-ing-1', stockTrackingEnabled: true, stockUnit: 'kg', minimumStock: 3, reorderPoint: 5, notes: 'Restock saat sisa di bawah 5 kg.', source: 'demo', createdAt: now, updatedAt: now },
  { ingredientId: 'demo-ing-2', stockTrackingEnabled: true, stockUnit: 'kg', minimumStock: 2, reorderPoint: 4, notes: '', source: 'demo', createdAt: now, updatedAt: now },
  { ingredientId: 'demo-ing-6', stockTrackingEnabled: true, stockUnit: 'kg', minimumStock: 1, reorderPoint: 2, notes: 'Biji kopi utama untuk menu espresso.', source: 'demo', createdAt: now, updatedAt: now },
  { ingredientId: 'demo-ing-8', stockTrackingEnabled: true, stockUnit: 'pcs', minimumStock: 25, reorderPoint: 50, notes: 'Kemasan minuman dingin.', source: 'demo', createdAt: now, updatedAt: now }
];

export const demoStockMovements = [
  { id: 'demo-mov-1', ingredientId: 'demo-ing-1', type: 'opening_balance', quantity: 8, unit: 'kg', reason: 'Stok awal demo', referenceType: 'manual', movementDate: daysAgo(12), source: 'demo', createdAt: daysAgo(12), updatedAt: daysAgo(12) },
  { id: 'demo-mov-2', ingredientId: 'demo-ing-1', type: 'stock_out', quantity: 5.5, unit: 'kg', reason: 'Pemakaian produksi', referenceType: 'manual', movementDate: daysAgo(2), source: 'demo', createdAt: daysAgo(2), updatedAt: daysAgo(2) },
  { id: 'demo-mov-3', ingredientId: 'demo-ing-2', type: 'opening_balance', quantity: 6, unit: 'kg', reason: 'Stok awal demo', referenceType: 'manual', movementDate: daysAgo(10), source: 'demo', createdAt: daysAgo(10), updatedAt: daysAgo(10) },
  { id: 'demo-mov-4', ingredientId: 'demo-ing-2', type: 'waste', quantity: 1.2, unit: 'kg', reason: 'Tumpah/rusak', referenceType: 'manual', movementDate: daysAgo(1), source: 'demo', createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  { id: 'demo-mov-5', ingredientId: 'demo-ing-6', type: 'opening_balance', quantity: 1.5, unit: 'kg', reason: 'Stok awal demo', referenceType: 'manual', movementDate: daysAgo(7), source: 'demo', createdAt: daysAgo(7), updatedAt: daysAgo(7) },
  { id: 'demo-mov-6', ingredientId: 'demo-ing-8', type: 'opening_balance', quantity: 60, unit: 'pcs', reason: 'Stok awal demo', referenceType: 'manual', movementDate: daysAgo(9), source: 'demo', createdAt: daysAgo(9), updatedAt: daysAgo(9) },
  { id: 'demo-mov-7', ingredientId: 'demo-ing-8', type: 'stock_out', quantity: 42, unit: 'pcs', reason: 'Pemakaian harian', referenceType: 'manual', movementDate: daysAgo(1), source: 'demo', createdAt: daysAgo(1), updatedAt: daysAgo(1) }
];
