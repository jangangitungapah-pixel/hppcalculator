import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getSuppliers, 
  saveSupplier, 
  updateSupplier, 
  deleteSupplier, 
  getSupplierById, 
  searchSuppliers, 
  getFavoriteSuppliers,
  getSupplierPurchaseSummary
} from '../lib/storage/suppliersStorage';
import { setActiveStorageScope } from '../lib/storage/storageScope';
import { getScopedJson } from '../lib/storage/localStorageClient';
import { STORAGE_KEYS } from '../lib/storage/storageKeys';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: vi.fn(key => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; })
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock, writable: true });
Object.defineProperty(global, 'window', { value: { localStorage: localStorageMock }, writable: true });

describe('suppliersStorage', () => {
  beforeEach(() => {
    global.localStorage.clear();
    setActiveStorageScope({ type: 'guest', uid: null });
  });

  it('saves, updates, and deletes suppliers in scoped storage', () => {
    // Save
    const sup = saveSupplier({ name: 'Toko Segar', type: 'market' });
    expect(sup.id).toBeDefined();
    expect(sup.name).toBe('Toko Segar');
    expect(sup.type).toBe('market');
    expect(sup.createdAt).toBeDefined();
    
    // Retrieve by ID
    const retrieved = getSupplierById(sup.id);
    expect(retrieved.name).toBe('Toko Segar');

    // List all
    const list = getSuppliers();
    expect(list.length).toBe(1);

    // Update
    const updated = updateSupplier(sup.id, { name: 'Toko Sangat Segar' });
    expect(updated.name).toBe('Toko Sangat Segar');
    expect(getSupplierById(sup.id).name).toBe('Toko Sangat Segar');

    // Delete
    deleteSupplier(sup.id);
    expect(getSuppliers().length).toBe(0);
  });

  it('supports searching, favorites, and sorting favorite-first', () => {
    saveSupplier({ name: 'Distributor Tepung', isFavorite: false, type: 'distributor' });
    saveSupplier({ name: 'Pasar Tradisional', isFavorite: true, type: 'market' });
    saveSupplier({ name: 'Distributor Gula', isFavorite: false, type: 'distributor' });

    // Favorite-first, then alphabetical
    const sorted = getSuppliers();
    expect(sorted[0].name).toBe('Pasar Tradisional');
    expect(sorted[1].name).toBe('Distributor Gula');
    expect(sorted[2].name).toBe('Distributor Tepung');

    // Search
    const searchResult = searchSuppliers('Distributor');
    expect(searchResult.length).toBe(2);

    // Favorites filter
    const favorites = getFavoriteSuppliers();
    expect(favorites.length).toBe(1);
    expect(favorites[0].name).toBe('Pasar Tradisional');
  });

  it('isolates guest and user data scopes', () => {
    // Guest
    setActiveStorageScope({ type: 'guest', uid: null });
    saveSupplier({ name: 'Guest Supplier' });

    // User A
    setActiveStorageScope({ type: 'user', uid: 'user_A' });
    saveSupplier({ name: 'User A Supplier' });

    // Verify Guest
    setActiveStorageScope({ type: 'guest', uid: null });
    const guestList = getSuppliers();
    expect(guestList.length).toBe(1);
    expect(guestList[0].name).toBe('Guest Supplier');

    // Verify User A
    setActiveStorageScope({ type: 'user', uid: 'user_A' });
    const userAList = getSuppliers();
    expect(userAList.length).toBe(1);
    expect(userAList[0].name).toBe('User A Supplier');
  });
});
