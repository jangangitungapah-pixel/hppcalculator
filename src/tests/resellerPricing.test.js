import { describe, it, expect } from 'vitest';
import { calculateWholesalePrice, calculateResellerSuggestedPrice, calculateResellerProfitBreakdown, calculateResellerTierPricing } from '../lib/channelPricing/resellerPricing';

describe('Reseller Pricing Engine', () => {
  it('calculates wholesale price correctly', () => {
    const hpp = 3000;
    const margin = 30; // 30%
    const rawExpected = 3000 / (1 - 0.3); // 4285.71

    expect(calculateWholesalePrice(hpp, margin, 0)).toBeCloseTo(4285.71);
    expect(calculateWholesalePrice(hpp, margin, 1000)).toBe(5000);
  });

  it('calculates reseller profit breakdown correctly', () => {
    const input = {
      hppPerUnit: 3000,
      ownerTargetMarginPercent: 30,
      resellerTargetMarginPercent: 25,
      moq: 10,
      roundingStep: 0 // use exact for test
    };

    const result = calculateResellerProfitBreakdown(input);

    const wholesale = 3000 / 0.7; // 4285.71
    const suggested = wholesale / 0.75; // 5714.28

    expect(result.wholesalePrice).toBeCloseTo(wholesale);
    expect(result.resellerSuggestedPrice).toBeCloseTo(suggested);
    expect(result.ownerMarginPercent).toBeCloseTo(30);
    expect(result.resellerMarginPercent).toBeCloseTo(25);
  });

  it('calculates reseller tier pricing correctly for custom tiers', () => {
    const input = {
      hppPerUnit: 3000,
      tiers: [
        { minQty: 10, ownerTargetMarginPercent: 30, resellerTargetMarginPercent: 25 },
        { minQty: 50, ownerTargetMarginPercent: 20, resellerTargetMarginPercent: 30 }
      ],
      roundingStep: 0
    };

    const results = calculateResellerTierPricing(input);

    expect(results).toHaveLength(2);

    // Tier 1 (10 units)
    expect(results[0].minQty).toBe(10);
    expect(results[0].wholesalePrice).toBeCloseTo(3000 / 0.7);
    expect(results[0].resellerSuggestedPrice).toBeCloseTo((3000 / 0.7) / 0.75);

    // Tier 2 (50 units)
    expect(results[1].minQty).toBe(50);
    expect(results[1].wholesalePrice).toBeCloseTo(3000 / 0.8);
    expect(results[1].resellerSuggestedPrice).toBeCloseTo((3000 / 0.8) / 0.7);
  });
});
