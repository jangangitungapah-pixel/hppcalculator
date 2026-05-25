import { describe, it, expect } from 'vitest';
import { calculateDiscountedPrice, calculatePromoProfit, calculateBogoProfit } from '../lib/channelPricing/promoPricing';

describe('Promo Pricing Engine', () => {
  it('calculates discounted price correctly', () => {
    expect(calculateDiscountedPrice(10000, 20, 0)).toBe(8000); // 20% off
    expect(calculateDiscountedPrice(10000, 0, 3000)).toBe(7000); // 3000 off
    expect(calculateDiscountedPrice(10000, 10, 1000)).toBe(8000); // 10% + 1000 off = 2000 off
    expect(calculateDiscountedPrice(10000, 100, 5000)).toBe(0); // Cap at 0
  });

  it('calculates promo profit correctly', () => {
    const input = {
      hppPerUnit: 5000,
      normalSellingPrice: 15000,
      quantity: 2,
      discountPercent: 10, // 1500 off
      discountFixed: 500,  // 500 off -> 2000 total discount
      sellerVoucherSubsidy: 1000 // seller pays 1000 for voucher
    };

    const result = calculatePromoProfit(input);

    expect(result.finalPrice).toBe(13000); // 15000 - 2000
    expect(result.grossRevenue).toBe(26000); // 13000 * 2
    expect(result.totalHpp).toBe(10000); // 5000 * 2
    expect(result.totalVoucherSubsidy).toBe(2000); // 1000 * 2
    expect(result.totalCost).toBe(12000); // 10000 + 2000
    expect(result.profit).toBe(14000); // 26000 - 12000
  });

  it('calculates BOGO profit correctly', () => {
    const input = {
      hppPerUnit: 5000,
      normalSellingPrice: 15000,
      bogoPaidQty: 1,
      bogoFreeQty: 1
    };

    const result = calculateBogoProfit(input);

    expect(result.grossRevenue).toBe(15000); // customer pays for 1
    expect(result.totalQtyReceived).toBeUndefined(); // we didn't export this
    expect(result.effectiveRevenuePerUnit).toBe(7500); // 15000 / 2
    expect(result.totalCost).toBe(10000); // 2 * 5000
    expect(result.profit).toBe(5000); // 15000 - 10000
  });
});
