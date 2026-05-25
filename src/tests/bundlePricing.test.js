import { describe, it, expect } from 'vitest';
import { calculateBundleHpp, calculateBundleProfit, calculateBundleSuggestedPrices } from '../lib/channelPricing/bundlePricing';

describe('Bundle Pricing Engine', () => {
  it('calculates bundle HPP correctly', () => {
    const items = [
      { hppPerUnit: 5000, quantity: 2 },
      { hppPerUnit: 10000, quantity: 1 }
    ];
    expect(calculateBundleHpp(items)).toBe(20000);
  });

  it('calculates bundle profit correctly', () => {
    const items = [
      { hppPerUnit: 5000, quantity: 2 }, // 10000
      { hppPerUnit: 10000, quantity: 1 } // 10000
    ]; // total hpp = 20000

    const input = {
      items,
      bundleSellingPrice: 40000,
      discountPercent: 10, // 4000 off
      discountFixed: 1000  // 1000 off -> 5000 total discount
    };

    const result = calculateBundleProfit(input);

    expect(result.baseTotalHpp).toBe(20000);
    expect(result.discountAmount).toBe(5000);
    expect(result.finalSellingPrice).toBe(35000);
    expect(result.profit).toBe(15000); // 35000 - 20000
  });

  it('calculates bundle suggested prices correctly', () => {
    const baseHpp = 20000;
    const targetMargin = 40; // 40%

    // Raw = 20000 / (1 - 0.4) = 33333.33
    // Rounded to nearest 1000 = 34000
    expect(calculateBundleSuggestedPrices(baseHpp, targetMargin, 1000)).toBe(34000);
  });
});
