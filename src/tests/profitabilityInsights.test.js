import { describe, it, expect } from 'vitest';
import {
  calculatePriceIncreaseNeeded,
  compareCurrentVsRecommendedPrice,
  findPriceIncreaseCandidates,
  rankByMargin
} from '../lib/reports/profitabilityInsights';

describe('Profitability Insights', () => {
  it('identifies price increase candidates', () => {
    const items = [
      { id: 1, sellingPrice: 10000, marginPercent: 10 }, // Yes
      { id: 2, sellingPrice: 10000, marginPercent: 30 }, // No, margin ok
      { id: 3, sellingPrice: null, marginPercent: null }, // No, no price
      { id: 4, sellingPrice: 10000, marginPercent: -5 }, // Yes, loss
    ];
    
    const candidates = findPriceIncreaseCandidates(items);
    expect(candidates.length).toBe(2);
    expect(candidates.map(c => c.id)).toEqual([1, 4]);
  });

  it('calculates required price increase correctly', () => {
    const item = { sellingPrice: 10000, hppPerUnit: 8000 };
    // Target 25% margin -> 8000 / (1 - 0.25) = 10666.66
    // Rounding step 1000 -> 11000
    
    const needed = calculatePriceIncreaseNeeded(item, 25, 1000);
    expect(needed.recommendedPrice).toBe(11000);
    expect(needed.priceGap).toBe(1000);
    expect(needed.percentageIncrease).toBe(10);
  });

  it('compares current vs recommended price', () => {
    const item = { sellingPrice: 10000, recommendedPrice: 12000 };
    const diff = compareCurrentVsRecommendedPrice(item);
    expect(diff.priceGap).toBe(2000);
    expect(diff.percentageIncrease).toBe(20);
  });

  it('ranks by margin descending', () => {
    const items = [
      { id: 1, marginPercent: 10 },
      { id: 2, marginPercent: 30 },
      { id: 3, marginPercent: -5 },
    ];
    const ranked = rankByMargin(items);
    expect(ranked[0].id).toBe(2);
    expect(ranked[1].id).toBe(1);
    expect(ranked[2].id).toBe(3);
  });
});
