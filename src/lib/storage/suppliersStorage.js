import { STORAGE_KEYS } from './storageKeys';
import { getScopedJson, setScopedJson } from './localStorageClient';
import { createSupplier } from '../suppliers/supplierTypes';

export const getSuppliers = () => {
  const list = getScopedJson(STORAGE_KEYS.SUPPLIERS, []);
  return list.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return a.name.localeCompare(b.name);
  });
};

export const getSupplierById = (id) => {
  const list = getSuppliers();
  return list.find(s => s.id === id) || null;
};

export const saveSupplier = (input) => {
  const list = getScopedJson(STORAGE_KEYS.SUPPLIERS, []);
  const supplier = createSupplier(input);

  // Check if exists (by ID) to update, otherwise insert
  const existsIndex = list.findIndex(s => s.id === supplier.id);
  let updatedList;
  if (existsIndex >= 0) {
    updatedList = list.map((s, idx) => idx === existsIndex ? supplier : s);
  } else {
    updatedList = [supplier, ...list];
  }

  setScopedJson(STORAGE_KEYS.SUPPLIERS, updatedList);
  return supplier;
};

export const updateSupplier = (id, patch) => {
  const list = getScopedJson(STORAGE_KEYS.SUPPLIERS, []);
  const index = list.findIndex(s => s.id === id);
  if (index === -1) return null;

  const updated = {
    ...list[index],
    ...patch,
    id, // ensure ID is not changed
    updatedAt: new Date().toISOString()
  };

  list[index] = updated;
  setScopedJson(STORAGE_KEYS.SUPPLIERS, list);
  return updated;
};

export const deleteSupplier = (id) => {
  const list = getScopedJson(STORAGE_KEYS.SUPPLIERS, []);
  const filtered = list.filter(s => s.id !== id);
  setScopedJson(STORAGE_KEYS.SUPPLIERS, filtered);
  return true;
};

export const searchSuppliers = (query) => {
  const suppliers = getSuppliers();
  if (!query) return suppliers;
  const q = query.toLowerCase().trim();
  return suppliers.filter(s => 
    s.name.toLowerCase().includes(q) || 
    (s.contactName && s.contactName.toLowerCase().includes(q)) ||
    (s.phone && s.phone.includes(q)) ||
    (s.email && s.email.toLowerCase().includes(q)) ||
    (s.address && s.address.toLowerCase().includes(q))
  );
};

export const getFavoriteSuppliers = () => {
  return getSuppliers().filter(s => s.isFavorite);
};

export const getSupplierPurchaseSummary = (supplierId) => {
  const logs = getScopedJson(STORAGE_KEYS.PURCHASE_LOGS, []);
  const supplierLogs = logs.filter(log => log.supplierId === supplierId);
  
  let totalSpend = 0;
  let lastPurchaseDate = null;
  
  supplierLogs.forEach(log => {
    totalSpend += Number(log.totalAmount) || 0;
    if (!lastPurchaseDate || new Date(log.purchaseDate) > new Date(lastPurchaseDate)) {
      lastPurchaseDate = log.purchaseDate;
    }
  });

  return {
    totalSpend,
    purchaseCount: supplierLogs.length,
    lastPurchaseDate
  };
};

export const loadDemoSuppliers = (demoSuppliers = []) => {
  const current = getScopedJson(STORAGE_KEYS.SUPPLIERS, []);
  const userSuppliers = current.filter(s => s.source !== 'demo');
  // Avoid duplicate demo ID
  const demoIds = new Set(demoSuppliers.map(s => s.id));
  const filteredUserSuppliers = userSuppliers.filter(s => !demoIds.has(s.id));
  
  const updated = [...demoSuppliers, ...filteredUserSuppliers];
  setScopedJson(STORAGE_KEYS.SUPPLIERS, updated);
  return updated;
};

export const clearDemoSuppliers = () => {
  const current = getScopedJson(STORAGE_KEYS.SUPPLIERS, []);
  const userSuppliers = current.filter(s => s.source !== 'demo');
  setScopedJson(STORAGE_KEYS.SUPPLIERS, userSuppliers);
  return userSuppliers;
};
