import { describe, it, expect } from 'vitest';
import { calculateMarketplaceProfit, calculateMarketplaceRecommendedPrice } from '../lib/channelPricing/marketplacePricing';

describe('Marketplace Pricing Engine', () => {
  it('calculates gofood profit correctly', () => {
    const input = {
      hppPerUnit: 6500,
      sellingPrice: 18000,
      quantity: 1,
      commissionPercent: 20,
      paymentFeePercent: 0,
      paymentFeeFixed: 0,
      additionalPackagingCost: 1500,
      sellerPromoPercent: 0,
      sellerPromoFixed: 0
    };

    const result = calculateMarketplaceProfit(input);

    expect(result.grossRevenue).toBe(18000);
    expect(result.platformCommission).toBe(3600); // 20% of 18000
    expect(result.totalFees).toBe(3600);
    expect(result.netRevenue).toBe(14400); // 18000 - 3600
    expect(result.totalHpp).toBe(6500);
    expect(result.totalAdditionalPackaging).toBe(1500);
    expect(result.totalCost).toBe(8000); // 6500 + 1500
    expect(result.profit).toBe(6400); // 14400 - 8000
  });

  it('calculates recommended price correctly', () => {
    const input = {
      hppPerUnit: 6500,
      commissionPercent: 20,
      paymentFeePercent: 0,
      paymentFeeFixed: 0,
      additionalPackagingCost: 1500,
      sellerPromoPercent: 0,
      sellerPromoFixed: 0,
      targetMarginPercent: 30,
      roundingStep: 1000
    };

    const result = calculateMarketplaceRecommendedPrice(input);

    expect(result.success).toBe(true);
    // Cost = 6500 + 1500 = 8000
    // Denom = 1 - 0.20 - 0.30 = 0.5
    // Raw Price = 8000 / 0.5 = 16000
    expect(result.rawPrice).toBe(16000);
    expect(result.recommendedPrice).toBe(16000);
  });
  
  it('fails safely if target margin + fees >= 100%', () => {
    const input = {
      hppPerUnit: 6500,
      commissionPercent: 20,
      paymentFeePercent: 0,
      paymentFeeFixed: 0,
      additionalPackagingCost: 1500,
      sellerPromoPercent: 0,
      sellerPromoFixed: 0,
      targetMarginPercent: 85, // 85 + 20 = 105%
      roundingStep: 1000
    };

    const result = calculateMarketplaceRecommendedPrice(input);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
