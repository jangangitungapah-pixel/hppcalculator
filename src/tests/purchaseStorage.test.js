import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getPurchaseLogs, 
  getPurchaseLogById, 
  savePurchaseLog, 
  deletePurchaseLog,
  getPurchaseItemsByLogId,
  getPurchaseDetail
} from '../lib/storage/purchaseStorage';
import { setActiveStorageScope } from '../lib/storage/storageScope';

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

// Mock stock movement and ingredient methods so we don't hit real database triggers
vi.mock('../lib/storage/inventoryStorage', () => ({
  saveStockMovement: vi.fn(() => ({ id: 'mock-mov-1' })),
  deleteStockMovement: vi.fn()
}));
vi.mock('../lib/storage/ingredientsStorage', () => ({
  getIngredientById: vi.fn(() => ({ id: 'ing-1', name: 'Mock Ingredient', purchaseUnit: 'kg', purchaseQuantity: 1 })),
  updateIngredient: vi.fn()
}));

describe('purchaseStorage', () => {
  beforeEach(() => {
    global.localStorage.clear();
    setActiveStorageScope({ type: 'guest', uid: null });
  });

  it('saves purchase log and calculates total amount and unit price correctly', () => {
    const itemsInput = [
      { ingredientId: 'ing-1', ingredientNameSnapshot: 'Tepung', quantity: 2, unit: 'kg', totalPrice: 30000, addToStock: false, updateIngredientPrice: false },
      { ingredientId: 'ing-2', ingredientNameSnapshot: 'Gula', quantity: 3, unit: 'kg', totalPrice: 45000, addToStock: false, updateIngredientPrice: false }
    ];

    const result = savePurchaseLog({ supplierId: 'sup-1', supplierNameSnapshot: 'Toko Segar', purchaseDate: '2026-05-29' }, itemsInput);
    expect(result.log.id).toBeDefined();
    expect(result.log.totalAmount).toBe(75000);
    expect(result.items.length).toBe(2);
    expect(result.items[0].unitPrice).toBe(15000);
    expect(result.items[1].unitPrice).toBe(15000);

    // Verify detail retrieval
    const detail = getPurchaseDetail(result.log.id);
    expect(detail.log.totalAmount).toBe(75000);
    expect(detail.items.length).toBe(2);
  });

  it('deletes purchase log and all associated items', () => {
    const itemsInput = [
      { ingredientId: 'ing-1', ingredientNameSnapshot: 'Tepung', quantity: 2, unit: 'kg', totalPrice: 30000, addToStock: false, updateIngredientPrice: false }
    ];
    const result = savePurchaseLog({ supplierId: 'sup-1', supplierNameSnapshot: 'Toko Segar', purchaseDate: '2026-05-29' }, itemsInput);
    
    // Log exists
    expect(getPurchaseLogs().length).toBe(1);
    expect(getPurchaseItemsByLogId(result.log.id).length).toBe(1);

    // Delete
    deletePurchaseLog(result.log.id);
    expect(getPurchaseLogs().length).toBe(0);
    expect(getPurchaseItemsByLogId(result.log.id).length).toBe(0);
  });

  it('isolates guest and user data scopes', () => {
    // Guest
    setActiveStorageScope({ type: 'guest', uid: null });
    savePurchaseLog({ purchaseDate: '2026-05-29' }, [{ ingredientId: 'ing-1', quantity: 1, unit: 'kg', totalPrice: 10000, addToStock: false, updateIngredientPrice: false }]);

    // User A
    setActiveStorageScope({ type: 'user', uid: 'user_A' });
    savePurchaseLog({ purchaseDate: '2026-05-29' }, [{ ingredientId: 'ing-1', quantity: 1, unit: 'kg', totalPrice: 20000, addToStock: false, updateIngredientPrice: false }]);

    // Verify Guest
    setActiveStorageScope({ type: 'guest', uid: null });
    const guestLogs = getPurchaseLogs();
    expect(guestLogs.length).toBe(1);
    expect(guestLogs[0].totalAmount).toBe(10000);

    // Verify User A
    setActiveStorageScope({ type: 'user', uid: 'user_A' });
    const userALogs = getPurchaseLogs();
    expect(userALogs.length).toBe(1);
    expect(userALogs[0].totalAmount).toBe(20000);
  });
});
