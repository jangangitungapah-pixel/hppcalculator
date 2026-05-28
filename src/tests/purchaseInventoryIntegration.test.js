import { describe, it, expect, beforeEach, vi } from 'vitest';
import { savePurchaseLog } from '../lib/storage/purchaseStorage';
import { getStockMovements } from '../lib/storage/inventoryStorage';
import { getIngredients, saveIngredient } from '../lib/storage/ingredientsStorage';
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

describe('purchaseInventoryIntegration', () => {
  beforeEach(() => {
    global.localStorage.clear();
    setActiveStorageScope({ type: 'guest', uid: null });
  });

  it('automatically adds stock_in movement when addToStock is true', () => {
    const ing = saveIngredient({
      id: 'ing-test-stock',
      name: 'Bahan Test',
      purchasePrice: 10000,
      purchaseQuantity: 1,
      purchaseUnit: 'kg',
      baseUnit: 'gram',
      costPerBaseUnit: 10
    });

    const itemsInput = [{
      ingredientId: ing.id,
      ingredientNameSnapshot: ing.name,
      quantity: 5,
      unit: 'kg',
      totalPrice: 65000,
      addToStock: true,
      updateIngredientPrice: false
    }];

    // Before: no stock movements
    expect(getStockMovements().length).toBe(0);

    // Save purchase log
    savePurchaseLog({ purchaseDate: '2026-05-29' }, itemsInput);

    // After: stock_in movement created!
    const movements = getStockMovements();
    expect(movements.length).toBe(1);
    expect(movements[0].ingredientId).toBe(ing.id);
    expect(movements[0].type).toBe('stock_in');
    expect(movements[0].quantity).toBe(5);
    expect(movements[0].unit).toBe('kg');
  });

  it('updates ingredient price with unit conversion when updateIngredientPrice is true', () => {
    const ing = saveIngredient({
      id: 'ing-test-price',
      name: 'Tepung',
      purchasePrice: 10000,
      purchaseQuantity: 1,
      purchaseUnit: 'kg',
      baseUnit: 'gram',
      costPerBaseUnit: 10,
      density: 1.0
    });

    // 1. Identical Unit: Buy 2 kg for Rp 24.000 (meaning rate: 12.000 / kg)
    savePurchaseLog({ purchaseDate: '2026-05-29' }, [{
      ingredientId: ing.id,
      ingredientNameSnapshot: ing.name,
      quantity: 2,
      unit: 'kg',
      totalPrice: 24000,
      addToStock: false,
      updateIngredientPrice: true
    }]);

    // Price should update to 12.000
    const ingAfter1 = getIngredients().find(i => i.id === ing.id);
    expect(ingAfter1.purchasePrice).toBe(12000);
    expect(ingAfter1.costPerBaseUnit).toBe(12); // 12000 / 1000g

    // 2. Different but Compatible Unit: Buy 500 gram for Rp 8.000 (meaning rate: 16.000 / kg)
    savePurchaseLog({ purchaseDate: '2026-05-29' }, [{
      ingredientId: ing.id,
      ingredientNameSnapshot: ing.name,
      quantity: 500,
      unit: 'gram',
      totalPrice: 8000,
      addToStock: false,
      updateIngredientPrice: true
    }]);

    // Converted price should update to 16.000
    const ingAfter2 = getIngredients().find(i => i.id === ing.id);
    expect(ingAfter2.purchasePrice).toBe(16000);
  });

  it('generates warnings and skips update if purchase unit is incompatible with ingredient unit', () => {
    const ing = saveIngredient({
      id: 'ing-test-incompat',
      name: 'Telur',
      purchasePrice: 28000,
      purchaseQuantity: 1,
      purchaseUnit: 'kg',
      baseUnit: 'pcs',
      costPerBaseUnit: 28000
    });

    // Incompatible: Buy 10 pcs
    const result = savePurchaseLog({ purchaseDate: '2026-05-29' }, [{
      ingredientId: ing.id,
      ingredientNameSnapshot: ing.name,
      quantity: 10,
      unit: 'pcs',
      totalPrice: 20000,
      addToStock: false,
      updateIngredientPrice: true
    }]);

    // Price remains unchanged (28.000)
    const currentIng = getIngredients().find(i => i.id === ing.id);
    expect(currentIng.purchasePrice).toBe(28000);

    // Warning is returned
    expect(result.warnings.length).toBe(1);
    expect(result.warnings[0]).toContain('Satuan pembelian berbeda dan belum bisa dikonversi otomatis');
  });
});
