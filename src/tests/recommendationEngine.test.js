import { describe, it, expect } from 'vitest';
import {
  generateRecommendations,
  prioritizeRecommendations
} from '../lib/reports/recommendationEngine';

describe('Recommendation Engine', () => {
  it('generates raise price recommendation for loss making items', () => {
    const items = [
      { id: 1, type: 'product', name: 'Es Teh', sellingPrice: 3000, hppPerUnit: 4000, marginPercent: -25 }
    ];
    
    const recs = generateRecommendations(items, {}, { roundingStep: 1000 });
    
    expect(recs.length).toBeGreaterThan(0);
    const lossRec = recs.find(r => r.type === 'price_increase');
    expect(lossRec).toBeDefined();
    expect(lossRec.severity).toBe('danger');
    expect(lossRec.priority).toBe(100);
  });

  it('generates promo warning for low margin items', () => {
    const items = [
      { id: 2, type: 'product', name: 'Kopi', sellingPrice: 10000, hppPerUnit: 8000, marginPercent: 20 }
    ];
    
    const recs = generateRecommendations(items, {}, {});
    
    const promoRec = recs.find(r => r.type === 'promo_warning');
    expect(promoRec).toBeDefined();
    expect(promoRec.severity).toBe('warning');
    expect(promoRec.priority).toBe(60);
  });

  it('generates reseller and marketplace opportunities for high margin items', () => {
    const items = [
      { id: 3, type: 'product', name: 'Kue', sellingPrice: 20000, hppPerUnit: 5000, marginPercent: 75 }
    ];
    
    const recs = generateRecommendations(items, {}, {});
    
    const resellerRec = recs.find(r => r.type === 'reseller_opportunity');
    const marketplaceRec = recs.find(r => r.type === 'marketplace_opportunity');
    
    expect(resellerRec).toBeDefined();
    expect(resellerRec.severity).toBe('success');
    expect(resellerRec.priority).toBe(40);
    
    expect(marketplaceRec).toBeDefined();
    expect(marketplaceRec.severity).toBe('success');
    expect(marketplaceRec.priority).toBe(50);
  });

  it('sorts recommendations by priority descending', () => {
    const recs = [
      { id: 1, priority: 40, itemName: 'A' },
      { id: 2, priority: 100, itemName: 'B' },
      { id: 3, priority: 60, itemName: 'C' },
    ];
    
    const sorted = prioritizeRecommendations(recs);
    expect(sorted[0].id).toBe(2);
    expect(sorted[1].id).toBe(3);
    expect(sorted[2].id).toBe(1);
  });
});
