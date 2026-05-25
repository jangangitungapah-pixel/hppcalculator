import { describe, it, expect } from 'vitest';
import { calculateWholesalePrice, calculateResellerSuggestedPrice, calculateResellerProfitBreakdown } from '../lib/channelPricing/resellerPricing';

describe('Reseller Pricing Engine', () => {
  it('calculates wholesale price correctly', () => {
    const hpp = 3000;
    const margin = 30; // 30%
    const rawExpected = 3000 / (1 - 0.3); // 4285.71
    const roundedExpected = 4000; // if step is 1000, wait Math.ceil(4285.71/1000)*1000 = 5000

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
});
