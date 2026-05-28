import { describe, it, expect } from 'vitest';
import {
  calculatePurchaseTotal,
  calculatePurchaseUnitPrice,
  summarizePurchaseItems,
  calculateMonthlyPurchaseTotal,
  getIngredientPurchaseStats
} from '../lib/suppliers/purchaseCalculator';

describe('purchaseCalculator', () => {
  it('calculates grand total and individual unit price', () => {
    const items = [
      { totalPrice: 10000, quantity: 2 },
      { totalPrice: 15000, quantity: 3 }
    ];
    expect(calculatePurchaseTotal(items)).toBe(25000);
    expect(calculatePurchaseUnitPrice({ totalPrice: 10000, quantity: 2 })).toBe(5000);
    expect(calculatePurchaseUnitPrice({ totalPrice: 10000, quantity: 0 })).toBe(0);
  });

  it('generates a readable summary text of purchased ingredients', () => {
    expect(summarizePurchaseItems([])).toBe('');
    
    expect(summarizePurchaseItems([
      { ingredientNameSnapshot: 'Terigu' }
    ])).toBe('Terigu');

    expect(summarizePurchaseItems([
      { ingredientNameSnapshot: 'Terigu' },
      { ingredientNameSnapshot: 'Gula' }
    ])).toBe('Terigu, Gula');

    expect(summarizePurchaseItems([
      { ingredientNameSnapshot: 'Terigu' },
      { ingredientNameSnapshot: 'Gula' },
      { ingredientNameSnapshot: 'Mentega' }
    ])).toBe('Terigu, Gula + 1 lainnya');
  });

  it('aggregates total spend per month', () => {
    const logs = [
      { purchaseDate: '2026-05-15', totalAmount: 10000 },
      { purchaseDate: '2026-05-20', totalAmount: 15000 },
      { purchaseDate: '2026-06-01', totalAmount: 20000 }
    ];

    expect(calculateMonthlyPurchaseTotal(logs, '2026-05')).toBe(25000);
    expect(calculateMonthlyPurchaseTotal(logs, '2026-06')).toBe(20000);
    expect(calculateMonthlyPurchaseTotal(logs, '2026-07')).toBe(0);
  });

  it('computes metrics and history statistics for a specific ingredient', () => {
    const items = [
      { ingredientId: 'ing-1', unitPrice: 5000, createdAt: '2026-05-01T10:00:00Z' },
      { ingredientId: 'ing-1', unitPrice: 6000, createdAt: '2026-05-10T10:00:00Z' },
      { ingredientId: 'ing-2', unitPrice: 9000, createdAt: '2026-05-01T10:00:00Z' }
    ];

    const stats = getIngredientPurchaseStats('ing-1', items);
    expect(stats.count).toBe(2);
    expect(stats.averagePrice).toBe(5500);
    expect(stats.minPrice).toBe(5000);
    expect(stats.maxPrice).toBe(6000);
    expect(stats.lastPrice).toBe(6000); // newest by createdAt
  });
});
