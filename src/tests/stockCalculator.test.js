import { describe, expect, it } from 'vitest';
import { calculateStockFromMovements, getMovementDelta } from '../lib/inventory/stockCalculator';

describe('stockCalculator', () => {
  const setting = { stockUnit: 'kg', stockTrackingEnabled: true, minimumStock: 1 };

  it('stock_in menambah stok', () => {
    const stock = calculateStockFromMovements([{ type: 'stock_in', quantity: 5, unit: 'kg' }], setting);
    expect(stock).toBe(5);
  });

  it('stock_out mengurangi stok', () => {
    const stock = calculateStockFromMovements([
      { type: 'opening_balance', quantity: 5, unit: 'kg' },
      { type: 'stock_out', quantity: 2, unit: 'kg' }
    ], setting);
    expect(stock).toBe(3);
  });

  it('waste mengurangi stok', () => {
    const stock = calculateStockFromMovements([
      { type: 'opening_balance', quantity: 5, unit: 'kg' },
      { type: 'waste', quantity: 1.5, unit: 'kg' }
    ], setting);
    expect(stock).toBe(3.5);
  });

  it('adjustment delta plus/minus bekerja', () => {
    expect(getMovementDelta({ type: 'adjustment', quantity: 4 })).toBe(4);
    expect(getMovementDelta({ type: 'adjustment', quantity: -3 })).toBe(-3);
  });
});
