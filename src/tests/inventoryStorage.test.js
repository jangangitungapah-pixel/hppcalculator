import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setActiveStorageScope } from '../lib/storage/storageScope';
import {
  getInventorySettings,
  getStockMovements,
  loadDemoInventorySettings,
  saveInventorySetting,
  saveStockMovement
} from '../lib/storage/inventoryStorage';
import { demoInventorySettings } from '../data/demoInventory';

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

describe('inventoryStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    setActiveStorageScope({ type: 'guest', uid: null });
  });

  it('inventory setting scoped per guest/user', () => {
    saveInventorySetting({ ingredientId: 'ing-1', stockTrackingEnabled: true, stockUnit: 'kg', minimumStock: 2 });
    expect(getInventorySettings()).toHaveLength(1);

    setActiveStorageScope({ type: 'user', uid: 'u1' });
    expect(getInventorySettings()).toHaveLength(0);

    saveInventorySetting({ ingredientId: 'ing-1', stockTrackingEnabled: true, stockUnit: 'kg', minimumStock: 5 });
    expect(getInventorySettings()[0].minimumStock).toBe(5);
  });

  it('stock movements scoped per guest/user', () => {
    saveStockMovement({ ingredientId: 'ing-1', type: 'stock_in', quantity: 3, unit: 'kg' });
    expect(getStockMovements()).toHaveLength(1);

    setActiveStorageScope({ type: 'user', uid: 'u1' });
    expect(getStockMovements()).toHaveLength(0);
  });

  it('demo inventory tidak duplicate', () => {
    loadDemoInventorySettings(demoInventorySettings);
    loadDemoInventorySettings(demoInventorySettings);
    expect(getInventorySettings().filter(item => item.source === 'demo')).toHaveLength(demoInventorySettings.length);
  });
});
