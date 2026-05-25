import { describe, it, expect } from 'vitest';
import { calculateQuickHpp } from '../lib/calculations/hppCalculator.js';

describe('Core Calculation Logic', () => {
  it('runs core calculation tests', () => {
    // 1. Normal profitable product
    const input1 = {
      productName: "Donat Coklat",
      costItems: [
        { id: "1", name: "Bahan", amount: 100000, category: "ingredient" },
        { id: "2", name: "Kemasan", amount: 20000, category: "packaging" },
        { id: "3", name: "Biaya Lain", amount: 30000, category: "other" }
      ],
      outputQuantity: 50,
      failedQuantity: 0,
      sellingUnit: "pcs",
      sellingPrice: 5000,
      roundingStep: 500
    };
    const res1 = calculateQuickHpp(input1);
    expect(res1.isValid).toBe(true);
    expect(res1.totalProductionCost).toBe(150000);
    expect(res1.sellableQuantity).toBe(50);
    expect(res1.hppPerUnit).toBe(3000);
    expect(res1.grossRevenue).toBe(250000);
    expect(res1.profitPerUnit).toBe(2000);
    expect(res1.totalProfit).toBe(100000);
    expect(res1.marginPercent).toBe(40);
    expect(res1.markupPercent).toBeCloseTo(66.666, 1);
    expect(res1.profitStatus.key).toBe('good');
    
    // Suggested prices given HPP=3000, Margins: 25%, 40%, 55%, step 500
    expect(res1.suggestedPrices.safe.price).toBe(4000); // 3000 / 0.75 = 4000
    expect(res1.suggestedPrices.ideal.price).toBe(5000); // 3000 / 0.6 = 5000
    expect(res1.suggestedPrices.premium.price).toBe(7000); // 3000 / 0.45 = 6666.66 -> 7000

    // 2. Product with failed output
    const input2 = { ...input1, failedQuantity: 5 };
    const res2 = calculateQuickHpp(input2);
    expect(res2.sellableQuantity).toBe(45);
    expect(res2.hppPerUnit).toBeCloseTo(3333.33, 1);
    expect(res2.profitPerUnit).toBeCloseTo(1666.66, 1);
    expect(res2.totalProfit).toBeCloseTo(75000, 1);
    expect(res2.marginPercent).toBeCloseTo(33.33, 1);
    expect(res2.profitStatus.key).toBe('good');

    // 3. Loss product
    const input3 = { ...input1, sellingPrice: 2500 };
    const res3 = calculateQuickHpp(input3);
    expect(res3.hppPerUnit).toBe(3000);
    expect(res3.profitPerUnit).toBe(-500);
    expect(res3.marginPercent).toBe(-20);
    expect(res3.profitStatus.key).toBe('loss');

    // 4. Zero profit product
    const input4 = { ...input1, sellingPrice: 3000 };
    const res4 = calculateQuickHpp(input4);
    expect(res4.profitPerUnit).toBe(0);
    expect(res4.marginPercent).toBe(0);
    expect(res4.profitStatus.key).toBe('low');
    const hasZeroProfitWarning = res4.warnings.some(w => w.code === 'ZERO_PROFIT');
    expect(hasZeroProfitWarning).toBe(true);

    // 5. Invalid output quantity 0
    const input5 = { ...input1, outputQuantity: 0 };
    const res5 = calculateQuickHpp(input5);
    expect(res5.isValid).toBe(false);
    const hasOutputQuantError = res5.errors.some(e => e.field === 'outputQuantity');
    expect(hasOutputQuantError).toBe(true);

    // 6. Invalid failed quantity equal to output quantity
    const input6 = { ...input1, outputQuantity: 50, failedQuantity: 50 };
    const res6 = calculateQuickHpp(input6);
    expect(res6.isValid).toBe(false);
    const hasFailedQuantError = res6.errors.some(e => e.field === 'failedQuantity' && e.code === 'TOO_LARGE');
    expect(hasFailedQuantError).toBe(true);

    // 7. Negative cost item
    const input7 = { ...input1, costItems: [{ name: "Bahan", amount: -10000, category: "ingredient" }] };
    const res7 = calculateQuickHpp(input7);
    expect(res7.isValid).toBe(false);

    // 8. Missing product name
    const input8 = { ...input1, productName: "" };
    const res8 = calculateQuickHpp(input8);
    expect(res8.isValid).toBe(false);

    // 10. Custom unit accepted
    const input10 = { ...input1, sellingUnit: "loyang" };
    const res10 = calculateQuickHpp(input10);
    expect(res10.isValid).toBe(true);
    expect(res10.sellingUnit).toBe("loyang");

  });
});
