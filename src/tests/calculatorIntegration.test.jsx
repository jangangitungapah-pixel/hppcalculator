import { describe, it, expect } from 'vitest';
import { calculateQuickHpp } from '../lib/calculations';
import { createCalculationInputFromForm, createFormFromSavedCalculation, parseLocalizedNumber } from '../lib/data/calculationMapper';

// This is a minimal integration test to ensure the calculation logic
// remains healthy when integrated with the frontend payload structures.
describe('Calculator Integration Payload Test', () => {
  it('should accept typical frontend payload and calculate correctly', () => {
    const mockFrontendPayload = {
      productName: 'Donat Coklat',
      costItems: [
        { id: '1', name: 'Tepung', category: 'Bahan', amount: 50000 },
        { id: '2', name: 'Coklat', category: 'Bahan', amount: 30000 },
        { id: '3', name: 'Plastik', category: 'Kemasan', amount: 20000 },
      ],
      outputQuantity: 100,
      failedQuantity: 0,
      sellingUnit: 'pcs',
      sellingPrice: 5000
    };

    const result = calculateQuickHpp(mockFrontendPayload);

    expect(result.totalProductionCost).toBe(100000);
    expect(result.hppPerUnit).toBe(1000); // 100k / 100
    expect(result.profitPerUnit).toBe(4000); // 5000 - 1000
    expect(result.marginPercent).toBe(80); // 4000 / 5000 = 80%
    expect(result.profitStatus.key).toBe('excellent');
  });

  it('should handle string inputs safely by parsing them if they leak from UI', () => {
    // In actual implementation we parse at the component level, 
    // but this ensures the engine works as expected.
    const mockPayload = {
      productName: 'Kopi',
      costItems: [{ id: '1', name: 'Biji', category: 'Bahan', amount: "50000" }],
      outputQuantity: "10",
      failedQuantity: "0",
      sellingUnit: 'cup',
      sellingPrice: "10000"
    };

    // calculateQuickHpp expects numbers, we simulate the parse step the UI does
    const parsedPayload = {
      ...mockPayload,
      costItems: mockPayload.costItems.map(c => ({...c, amount: Number(c.amount)})),
      outputQuantity: Number(mockPayload.outputQuantity),
      failedQuantity: Number(mockPayload.failedQuantity),
      sellingPrice: Number(mockPayload.sellingPrice),
    };

    const result = calculateQuickHpp(parsedPayload);
    expect(result.hppPerUnit).toBe(5000);
  });

  it('maps localized number strings and custom units from calculator form', () => {
    const form = {
      productName: 'Brownies',
      costItems: [{ id: '1', name: 'Coklat', category: 'Bahan', amount: '12.500,75' }],
      outputQuantity: '10,5',
      failedQuantity: '0,5',
      sellingUnit: 'custom',
      customSellingUnit: 'loyang',
      sellingPrice: '25.000'
    };

    const payload = createCalculationInputFromForm(form, {
      language: 'id',
      currency: 'IDR',
      roundingStep: 500
    });

    expect(parseLocalizedNumber('1,5')).toBe(1.5);
    expect(payload.costItems[0].amount).toBe(12500.75);
    expect(payload.outputQuantity).toBe(10.5);
    expect(payload.failedQuantity).toBe(0.5);
    expect(payload.sellingUnit).toBe('loyang');
    expect(payload.sellingPrice).toBe(25000);
  });

  it('restores saved custom units into the custom-unit form state', () => {
    const restored = createFormFromSavedCalculation({
      input: {
        productName: 'Cake',
        costItems: [],
        outputQuantity: 2,
        failedQuantity: 0,
        sellingUnit: 'loyang',
        sellingPrice: 100000
      }
    });

    expect(restored.sellingUnit).toBe('custom');
    expect(restored.customSellingUnit).toBe('loyang');
  });
});
