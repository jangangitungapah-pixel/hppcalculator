import { STORAGE_KEYS } from './storageKeys';
import { getScopedJson, setScopedJson } from './localStorageClient';

export const getProducts = () => {
  return getScopedJson(STORAGE_KEYS.PRODUCTS, []);
};

export const getProductById = (id) => {
  const products = getProducts();
  return products.find(p => p.id === id) || null;
};

export const saveProduct = (productInput) => {
  const products = getProducts();
  
  const newProduct = {
    ...productInput,
    id: productInput.id || crypto.randomUUID(),
    version: 1,
    source: productInput.source || 'user',
    createdAt: productInput.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updatedProducts = [newProduct, ...products];
  setScopedJson(STORAGE_KEYS.PRODUCTS, updatedProducts);
  
  return newProduct;
};

export const updateProduct = (id, updates) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) return null;

  const updatedProduct = {
    ...products[index],
    ...updates,
    id, // Ensure ID cannot be changed
    updatedAt: new Date().toISOString()
  };

  products[index] = updatedProduct;
  setScopedJson(STORAGE_KEYS.PRODUCTS, products);
  
  return updatedProduct;
};

export const deleteProduct = (id) => {
  const products = getProducts();
  const updatedProducts = products.filter(p => p.id !== id);
  setScopedJson(STORAGE_KEYS.PRODUCTS, updatedProducts);
};

export const deleteAllProducts = () => {
  setScopedJson(STORAGE_KEYS.PRODUCTS, []);
};

export const loadDemoProducts = (demoProducts) => {
  const current = getProducts();
  // Filter out existing demos to prevent duplicates
  const userProducts = current.filter(p => p.source !== 'demo');
  const updated = [...demoProducts, ...userProducts];
  
  setScopedJson(STORAGE_KEYS.PRODUCTS, updated);
  return updated;
};

export const clearDemoProducts = () => {
  const current = getProducts();
  const userProducts = current.filter(p => p.source !== 'demo');
  setScopedJson(STORAGE_KEYS.PRODUCTS, userProducts);
  return userProducts;
};

export const hasProducts = () => {
  return getProducts().length > 0;
};
