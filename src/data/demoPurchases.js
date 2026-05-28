export const demoPurchaseLogs = [
  {
    id: 'demo-pur-log-1',
    supplierId: 'demo-sup-1',
    supplierNameSnapshot: 'Toko Sembako Maju',
    purchaseDate: '2026-05-15',
    invoiceNumber: 'INV/SM/88210',
    paymentMethod: 'cash',
    notes: 'Belanja stok mingguan tepung dan gula',
    totalAmount: 220000,
    source: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo-pur-log-2',
    supplierId: 'demo-sup-2',
    supplierNameSnapshot: 'Pasar Pagi',
    purchaseDate: '2026-05-20',
    invoiceNumber: 'NOTA-991',
    paymentMethod: 'cash',
    notes: 'Telur ayam curah kualitas premium',
    totalAmount: 140000,
    source: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo-pur-log-3',
    supplierId: 'demo-sup-4',
    supplierNameSnapshot: 'Golden Roastery Kopi',
    purchaseDate: '2026-05-25',
    invoiceNumber: 'GRK-2026-05-992',
    paymentMethod: 'transfer',
    notes: 'Biji kopi espresso roastery fresh roast',
    totalAmount: 300000,
    source: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const demoPurchaseItems = [
  {
    id: 'demo-pur-item-1',
    purchaseLogId: 'demo-pur-log-1',
    ingredientId: 'demo-ing-1',
    ingredientNameSnapshot: 'Tepung Terigu Segitiga Biru',
    quantity: 10,
    unit: 'kg',
    totalPrice: 135000,
    unitPrice: 13500,
    updateIngredientPrice: true,
    addToStock: true,
    stockMovementId: 'demo-mov-pur-1',
    source: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo-pur-item-2',
    purchaseLogId: 'demo-pur-log-1',
    ingredientId: 'demo-ing-2',
    ingredientNameSnapshot: 'Gula Pasir',
    quantity: 5,
    unit: 'kg',
    totalPrice: 85000,
    unitPrice: 17000,
    updateIngredientPrice: true,
    addToStock: true,
    stockMovementId: 'demo-mov-pur-2',
    source: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo-pur-item-3',
    purchaseLogId: 'demo-pur-log-2',
    ingredientId: 'demo-ing-3',
    ingredientNameSnapshot: 'Telur Ayam',
    quantity: 5,
    unit: 'kg',
    totalPrice: 140000,
    unitPrice: 28000,
    updateIngredientPrice: true,
    addToStock: true,
    stockMovementId: 'demo-mov-pur-3',
    source: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo-pur-item-4',
    purchaseLogId: 'demo-pur-log-3',
    ingredientId: 'demo-ing-6',
    ingredientNameSnapshot: 'Kopi Espresso Blend',
    quantity: 2,
    unit: 'kg',
    totalPrice: 300000,
    unitPrice: 150000,
    updateIngredientPrice: true,
    addToStock: true,
    stockMovementId: 'demo-mov-pur-4',
    source: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
