import { describe, expect, it } from 'vitest';
import { getStockStatus } from '../lib/inventory/stockStatus';

describe('stockStatus', () => {
  it('menghasilkan status ok/low/out/not_tracked benar', () => {
    expect(getStockStatus({ currentStock: 10, minimumStock: 3, stockTrackingEnabled: true })).toBe('ok');
    expect(getStockStatus({ currentStock: 3, minimumStock: 3, stockTrackingEnabled: true })).toBe('low');
    expect(getStockStatus({ currentStock: 0, minimumStock: 3, stockTrackingEnabled: true })).toBe('out');
    expect(getStockStatus({ currentStock: 10, minimumStock: 3, stockTrackingEnabled: false })).toBe('not_tracked');
  });
});
