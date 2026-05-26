import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  migrateGlobalDataToGuestScope, 
  importGuestDataToActiveUser 
} from '../lib/storage/scopeMigration';
import { setActiveStorageScope } from '../lib/storage/storageScope';
import { getJson, setJson } from '../lib/storage/localStorageClient';

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

describe('scopeMigration', () => {
  beforeEach(() => {
    global.localStorage.clear();
    setActiveStorageScope({ type: 'guest', uid: null });
  });

  it('should migrate global keys to guest keys correctly', () => {
    // 1. Setup global data
    const globalKey = 'modalin:v1:ingredients';
    global.localStorage.setItem(globalKey, JSON.stringify([{ id: 'ing1', name: 'Global Ingredient' }]));

    // 2. Run migration
    const res = migrateGlobalDataToGuestScope();
    expect(res).toBe(true);

    // 3. Verify guest scope has the data
    const guestKey = 'modalin:v1:guest:ingredients';
    const guestData = JSON.parse(global.localStorage.getItem(guestKey));
    expect(guestData).toHaveLength(1);
    expect(guestData[0].name).toBe('Global Ingredient');

    // 4. Verify global key is still there (not deleted)
    expect(global.localStorage.getItem(globalKey)).not.toBeNull();
  });

  it('should not overwrite guest keys if guest keys already have data', () => {
    const globalKey = 'modalin:v1:ingredients';
    global.localStorage.setItem(globalKey, JSON.stringify([{ id: 'ing1', name: 'Global Ingredient' }]));

    const guestKey = 'modalin:v1:guest:ingredients';
    global.localStorage.setItem(guestKey, JSON.stringify([{ id: 'ing2', name: 'Existing Guest Ingredient' }]));

    migrateGlobalDataToGuestScope();

    // Guest should still have the original existing ingredient and not the global one
    const guestData = JSON.parse(global.localStorage.getItem(guestKey));
    expect(guestData).toHaveLength(1);
    expect(guestData[0].name).toBe('Existing Guest Ingredient');
  });

  it('should merge guest data to active user scope, resolving conflicts by updatedAt', () => {
    // Setup guest ingredients
    const guestKey = 'modalin:v1:guest:ingredients';
    global.localStorage.setItem(guestKey, JSON.stringify([
      { id: '1', name: 'Ingredient 1 (Guest Newer)', updatedAt: '2026-05-26T12:00:00Z' },
      { id: '2', name: 'Ingredient 2 (Guest Older)', updatedAt: '2026-05-26T10:00:00Z' },
      { id: '3', name: 'Ingredient 3 (Guest Only)' }
    ]));

    // Setup active user scope
    setActiveStorageScope({ type: 'user', uid: 'user_123' });
    const userKey = 'modalin:v1:user:user_123:ingredients';
    global.localStorage.setItem(userKey, JSON.stringify([
      { id: '1', name: 'Ingredient 1 (User Older)', updatedAt: '2026-05-26T11:00:00Z' },
      { id: '2', name: 'Ingredient 2 (User Newer)', updatedAt: '2026-05-26T10:30:00Z' }
    ]));

    // Run import
    const summary = importGuestDataToActiveUser();
    expect(summary.success).toBe(true);
    expect(summary.importedCounts.ingredients).toBe(2); // ID 1 (guest newer) and ID 3 (guest only)
    expect(summary.skippedCounts.ingredients).toBe(1); // ID 2 (user is newer)

    // Verify user data matches expectations
    const finalUserData = JSON.parse(global.localStorage.getItem(userKey));
    expect(finalUserData).toHaveLength(3);

    const item1 = finalUserData.find(i => i.id === '1');
    expect(item1.name).toBe('Ingredient 1 (Guest Newer)');

    const item2 = finalUserData.find(i => i.id === '2');
    expect(item2.name).toBe('Ingredient 2 (User Newer)');

    const item3 = finalUserData.find(i => i.id === '3');
    expect(item3.name).toBe('Ingredient 3 (Guest Only)');

    // Guest data must still exist (not deleted)
    expect(global.localStorage.getItem(guestKey)).not.toBeNull();
  });

  it('should merge settings shallowly where user settings take priority', () => {
    const guestSettingsKey = 'modalin:v1:guest:settings';
    global.localStorage.setItem(guestSettingsKey, JSON.stringify({
      language: 'en',
      currency: 'USD',
      roundingStep: 100
    }));

    setActiveStorageScope({ type: 'user', uid: 'user_123' });
    const userSettingsKey = 'modalin:v1:user:user_123:settings';
    global.localStorage.setItem(userSettingsKey, JSON.stringify({
      language: 'id',
      currency: 'IDR'
    }));

    const summary = importGuestDataToActiveUser();
    expect(summary.success).toBe(true);

    const mergedSettings = JSON.parse(global.localStorage.getItem(userSettingsKey));
    expect(mergedSettings.language).toBe('id'); // user priority
    expect(mergedSettings.currency).toBe('IDR'); // user priority
    expect(mergedSettings.roundingStep).toBe(100); // from guest
  });

  it('should fail import if active storage scope is guest', () => {
    setActiveStorageScope({ type: 'guest', uid: null });
    const summary = importGuestDataToActiveUser();
    expect(summary.success).toBe(false);
  });
});
