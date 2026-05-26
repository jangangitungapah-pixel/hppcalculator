import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadDemoCalculationsOnly,
  loadDemoBusinessLibrary,
  loadCompleteDemoWorkspace,
  clearDemoDataOnly,
  hasDemoData,
  getDemoDataSummary
} from '../lib/demo/demoDataService';
import * as storage from '../lib/storage';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: vi.fn(key => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; })
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock, writable: true });
Object.defineProperty(global, 'window', { value: { localStorage: localStorageMock }, writable: true });

describe('demoDataService', () => {
  beforeEach(() => {
    global.localStorage.clear();
  });

  it('should detect no demo data initially', () => {
    expect(hasDemoData()).toBe(false);
    const summary = getDemoDataSummary();
    expect(summary.total).toBe(0);
    expect(summary.calculations).toBe(0);
  });

  it('should load calculations only', () => {
    loadDemoCalculationsOnly();
    expect(hasDemoData()).toBe(true);
    
    const summary = getDemoDataSummary();
    expect(summary.calculations).toBeGreaterThan(0);
    expect(summary.ingredients).toBe(0);
    expect(summary.recipes).toBe(0);
    expect(summary.products).toBe(0);
  });

  it('should load business library only', () => {
    const { ingredients, recipes, products } = loadDemoBusinessLibrary();
    expect(ingredients.length).toBeGreaterThan(0);
    expect(recipes.length).toBeGreaterThan(0);
    expect(products.length).toBeGreaterThan(0);
    expect(hasDemoData()).toBe(true);

    const summary = getDemoDataSummary();
    expect(summary.calculations).toBe(0);
    expect(summary.ingredients).toBe(ingredients.length);
    expect(summary.recipes).toBe(recipes.length);
    expect(summary.products).toBe(products.length);
  });

  it('should load complete workspace', () => {
    loadCompleteDemoWorkspace();
    expect(hasDemoData()).toBe(true);

    const summary = getDemoDataSummary();
    expect(summary.calculations).toBeGreaterThan(0);
    expect(summary.ingredients).toBeGreaterThan(0);
    expect(summary.recipes).toBeGreaterThan(0);
    expect(summary.products).toBeGreaterThan(0);
    expect(summary.channelProfiles).toBeGreaterThan(0);
    expect(summary.pricingSimulations).toBeGreaterThan(0);
    expect(summary.total).toBeGreaterThan(0);
  });

  it('should clear demo data but preserve user data', () => {
    // 1. Seed complete demo data
    loadCompleteDemoWorkspace();
    
    // 2. Add some user-created data (source !== "demo")
    storage.saveCalculation({ productName: 'User Coffee' }, { hppPerUnit: 12000 }, { source: 'user' });
    storage.saveIngredient({ id: 'user-ing-1', name: 'User Milk', purchasePrice: 15000, purchaseQuantity: 1, purchaseUnit: 'L', baseUnit: 'ml', costPerBaseUnit: 15, source: 'user' });
    
    expect(hasDemoData()).toBe(true);
    let summary = getDemoDataSummary();
    expect(summary.calculations).toBeGreaterThan(0);
    expect(summary.ingredients).toBeGreaterThan(0);
    
    // Check that user data exists in getSavedCalculations
    const allCalculations = storage.getSavedCalculations();
    expect(allCalculations.some(c => c.source === 'user')).toBe(true);
    expect(allCalculations.some(c => c.source === 'demo')).toBe(true);

    // 3. Clear only demo data
    clearDemoDataOnly();

    // 4. Verify demo data is gone, but user data remains
    expect(hasDemoData()).toBe(false);
    summary = getDemoDataSummary();
    expect(summary.total).toBe(0);

    const postCalculations = storage.getSavedCalculations();
    expect(postCalculations.length).toBe(1);
    expect(postCalculations[0].source).toBe('user');

    const postIngredients = storage.getIngredients();
    expect(postIngredients.length).toBe(1);
    expect(postIngredients[0].source).toBe('user');
  });
});
