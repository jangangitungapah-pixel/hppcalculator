import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSyncPrefs, updateSyncPrefs, markLocalUploadApproved } from '../lib/sync/syncPrefs';
import { setActiveStorageScope } from '../lib/storage/storageScope';

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

describe('syncPrefsScoped', () => {
  beforeEach(() => {
    global.localStorage.clear();
  });

  it('should keep sync prefs isolated per scope', () => {
    // Guest
    setActiveStorageScope({ type: 'guest', uid: null });
    let prefs = getSyncPrefs();
    expect(prefs.autoSyncEnabled).toBe(true); // default
    
    // User A modifies prefs
    setActiveStorageScope({ type: 'user', uid: 'user_A' });
    updateSyncPrefs({ autoSyncEnabled: false });
    markLocalUploadApproved();
    
    prefs = getSyncPrefs();
    expect(prefs.autoSyncEnabled).toBe(false);
    expect(prefs.localUploadApprovedAt).not.toBeNull();

    // Back to Guest - should be untouched
    setActiveStorageScope({ type: 'guest', uid: null });
    prefs = getSyncPrefs();
    expect(prefs.autoSyncEnabled).toBe(true);
    expect(prefs.localUploadApprovedAt).toBeNull();
  });
});
