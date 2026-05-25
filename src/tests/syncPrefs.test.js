import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getSyncPrefs, 
  updateSyncPrefs, 
  shouldShowInitialSyncPrompt,
  markLocalUploadApproved,
  dismissInitialSyncPrompt
} from '../lib/sync/syncPrefs';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('syncPrefs', () => {
  beforeEach(() => {
    global.localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return default prefs if empty', () => {
    const prefs = getSyncPrefs();
    expect(prefs.autoSyncEnabled).toBe(true);
    expect(prefs.localUploadApprovedAt).toBeNull();
  });

  it('should update prefs', () => {
    updateSyncPrefs({ autoSyncEnabled: false });
    const prefs = getSyncPrefs();
    expect(prefs.autoSyncEnabled).toBe(false);
  });

  it('should show initial prompt if auth, has data, and not dismissed/approved', () => {
    const shouldShow = shouldShowInitialSyncPrompt({
      isAuthenticated: true,
      hasLocalData: true
    });
    expect(shouldShow).toBe(true);
  });

  it('should not show initial prompt if not authenticated', () => {
    const shouldShow = shouldShowInitialSyncPrompt({
      isAuthenticated: false,
      hasLocalData: true
    });
    expect(shouldShow).toBe(false);
  });

  it('should not show initial prompt if no local data', () => {
    const shouldShow = shouldShowInitialSyncPrompt({
      isAuthenticated: true,
      hasLocalData: false
    });
    expect(shouldShow).toBe(false);
  });

  it('should not show prompt after dismissed', () => {
    dismissInitialSyncPrompt();
    const shouldShow = shouldShowInitialSyncPrompt({
      isAuthenticated: true,
      hasLocalData: true
    });
    expect(shouldShow).toBe(false);
  });

  it('should not show prompt after approved', () => {
    markLocalUploadApproved();
    const shouldShow = shouldShowInitialSyncPrompt({
      isAuthenticated: true,
      hasLocalData: true
    });
    expect(shouldShow).toBe(false);
  });
});
