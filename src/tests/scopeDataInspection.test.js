import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getBusinessDataCountsForScope,
  hasBusinessDataForScope,
  getGuestBusinessDataCounts,
  hasGuestBusinessData,
  getActiveScopeBusinessDataCounts,
  hasActiveScopeBusinessData
} from '../lib/storage/scopeDataInspection';
import { setActiveStorageScope, getGuestStorageScope, getUserStorageScope } from '../lib/storage/storageScope';
import { STORAGE_KEYS } from '../lib/storage/storageKeys';

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

describe('scopeDataInspection', () => {
  beforeEach(() => {
    global.localStorage.clear();
    setActiveStorageScope({ type: 'guest', uid: null });
  });

  it('should count guest data correctly', () => {
    // 1. Guest calculations
    const guestCalcKey = 'modalin:v1:guest:calculations';
    global.localStorage.setItem(guestCalcKey, JSON.stringify([{ id: 'calc1' }]));

    const counts = getGuestBusinessDataCounts();
    expect(counts.calculations).toBe(1);
    expect(counts.total).toBe(1);
    expect(hasGuestBusinessData()).toBe(true);
  });

  it('should return true for hasGuestBusinessData if guest has calculations only', () => {
    const guestCalcKey = 'modalin:v1:guest:calculations';
    global.localStorage.setItem(guestCalcKey, JSON.stringify([{ id: 'calc1' }, { id: 'calc2' }]));
    
    expect(hasGuestBusinessData()).toBe(true);
    const counts = getGuestBusinessDataCounts();
    expect(counts.calculations).toBe(2);
    expect(counts.ingredients).toBe(0);
    expect(counts.total).toBe(2);
  });

  it('should return true for hasGuestBusinessData if guest has recipes only', () => {
    const guestRecipeKey = 'modalin:v1:guest:recipes';
    global.localStorage.setItem(guestRecipeKey, JSON.stringify([{ id: 'recipe1' }]));
    
    expect(hasGuestBusinessData()).toBe(true);
    const counts = getGuestBusinessDataCounts();
    expect(counts.recipes).toBe(1);
    expect(counts.total).toBe(1);
  });

  it('should return true for hasGuestBusinessData if guest has pricingSimulations only', () => {
    const guestPricingKey = 'modalin:v1:guest:pricingSimulations';
    global.localStorage.setItem(guestPricingKey, JSON.stringify([{ id: 'sim1' }]));
    
    expect(hasGuestBusinessData()).toBe(true);
    const counts = getGuestBusinessDataCounts();
    expect(counts.pricingSimulations).toBe(1);
    expect(counts.total).toBe(1);
  });

  it('should return false for hasGuestBusinessData if guest has settings only', () => {
    // settings is not counted as business data
    const guestSettingsKey = 'modalin:v1:guest:settings';
    global.localStorage.setItem(guestSettingsKey, JSON.stringify({ language: 'id' }));
    
    expect(hasGuestBusinessData()).toBe(false);
  });

  it('should isolate active scope data counts from other user scopes', () => {
    // User A data
    const userACalcKey = 'modalin:v1:user:user_A:calculations';
    global.localStorage.setItem(userACalcKey, JSON.stringify([{ id: 'calcA' }]));

    // User B data
    const userBCalcKey = 'modalin:v1:user:user_B:calculations';
    global.localStorage.setItem(userBCalcKey, JSON.stringify([{ id: 'calcB1' }, { id: 'calcB2' }]));

    // Switch to User A
    setActiveStorageScope({ type: 'user', uid: 'user_A' });
    expect(hasActiveScopeBusinessData()).toBe(true);
    expect(getActiveScopeBusinessDataCounts().calculations).toBe(1);

    // Switch to User B
    setActiveStorageScope({ type: 'user', uid: 'user_B' });
    expect(hasActiveScopeBusinessData()).toBe(true);
    expect(getActiveScopeBusinessDataCounts().calculations).toBe(2);

    // Guest should have 0
    setActiveStorageScope({ type: 'guest', uid: null });
    expect(hasActiveScopeBusinessData()).toBe(false);
    expect(getActiveScopeBusinessDataCounts().calculations).toBe(0);
  });
});
