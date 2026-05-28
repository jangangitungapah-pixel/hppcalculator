export const SUPPLIER_TYPES = {
  MARKET: "market",
  GROCERY: "grocery",
  DISTRIBUTOR: "distributor",
  ONLINE: "online",
  FARMER: "farmer",
  OTHER: "other"
};

export const createSupplier = (input = {}) => {
  const now = new Date().toISOString();
  return {
    id: input.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `supplier_${Date.now()}_${Math.random().toString(16).slice(2)}`),
    name: input.name || '',
    type: input.type || SUPPLIER_TYPES.OTHER,
    contactName: input.contactName || '',
    phone: input.phone || '',
    email: input.email || '',
    address: input.address || '',
    notes: input.notes || '',
    isFavorite: Boolean(input.isFavorite),
    source: input.source || 'user',
    createdAt: input.createdAt || now,
    updatedAt: now
  };
};
