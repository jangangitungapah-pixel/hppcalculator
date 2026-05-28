export const PAYMENT_METHODS = {
  CASH: "cash",
  TRANSFER: "transfer",
  QRIS: "qris",
  EWALLET: "ewallet",
  DEBIT: "debit",
  CREDIT: "credit",
  OTHER: "other"
};

export const createPurchaseLog = (input = {}) => {
  const now = new Date().toISOString();
  return {
    id: input.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `pur_log_${Date.now()}_${Math.random().toString(16).slice(2)}`),
    supplierId: input.supplierId || undefined,
    supplierNameSnapshot: input.supplierNameSnapshot || '',
    purchaseDate: input.purchaseDate || now.split('T')[0],
    invoiceNumber: input.invoiceNumber || '',
    paymentMethod: input.paymentMethod || PAYMENT_METHODS.CASH,
    notes: input.notes || '',
    totalAmount: Number(input.totalAmount) || 0,
    source: input.source || 'user',
    createdAt: input.createdAt || now,
    updatedAt: now
  };
};

export const createPurchaseItem = (input = {}, purchaseLogId) => {
  const now = new Date().toISOString();
  const quantity = Number(input.quantity) || 0;
  const totalPrice = Number(input.totalPrice) || 0;
  const unitPrice = quantity > 0 ? totalPrice / quantity : 0;

  return {
    id: input.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `pur_item_${Date.now()}_${Math.random().toString(16).slice(2)}`),
    purchaseLogId: purchaseLogId || input.purchaseLogId || '',
    ingredientId: input.ingredientId || '',
    ingredientNameSnapshot: input.ingredientNameSnapshot || '',
    quantity,
    unit: input.unit || '',
    totalPrice,
    unitPrice,
    updateIngredientPrice: input.updateIngredientPrice !== undefined ? Boolean(input.updateIngredientPrice) : true,
    addToStock: input.addToStock !== undefined ? Boolean(input.addToStock) : true,
    stockMovementId: input.stockMovementId || undefined,
    source: input.source || 'user',
    createdAt: input.createdAt || now,
    updatedAt: now
  };
};
