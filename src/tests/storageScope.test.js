import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getActiveStorageScope, 
  setActiveStorageScope, 
  getScopedStorageKey,
  clearActiveStorageScope
} from '../lib/storage/storageScope';

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

describe('storageScope', () => {
  beforeEach(() => {
    global.localStorage.clear();
  });

  it('should default to guest scope', () => {
    const scope = getActiveStorageScope();
    expect(scope.type).toBe('guest');
    expect(scope.uid).toBeNull();
  });

  it('should allow setting user scope', () => {
    setActiveStorageScope({ type: 'user', uid: 'user_123' });
    const scope = getActiveStorageScope();
    expect(scope.type).toBe('user');
    expect(scope.uid).toBe('user_123');
  });

  it('should format guest keys correctly', () => {
    clearActiveStorageScope(); // ensure guest
    const baseKey = 'modalin:v1:ingredients';
    const scoped = getScopedStorageKey(baseKey);
    expect(scoped).toBe('modalin:v1:guest:ingredients');
  });

  it('should format user keys correctly', () => {
    setActiveStorageScope({ type: 'user', uid: 'user_123' });
    const baseKey = 'modalin:v1:ingredients';
    const scoped = getScopedStorageKey(baseKey);
    expect(scoped).toBe('modalin:v1:user:user_123:ingredients');
  });

  it('should format keys differently for user A and user B', () => {
    const baseKey = 'modalin:v1:ingredients';
    const keyA = getScopedStorageKey(baseKey, { type: 'user', uid: 'user_A' });
    const keyB = getScopedStorageKey(baseKey, { type: 'user', uid: 'user_B' });
    expect(keyA).not.toBe(keyB);
    expect(keyA).toBe('modalin:v1:user:user_A:ingredients');
    expect(keyB).toBe('modalin:v1:user:user_B:ingredients');
  });

  it('should not double scope keys', () => {
    const alreadyGuestScoped = 'modalin:v1:guest:ingredients';
    const scoped1 = getScopedStorageKey(alreadyGuestScoped);
    expect(scoped1).toBe(alreadyGuestScoped);

    const alreadyUserScoped = 'modalin:v1:user:user_123:ingredients';
    const scoped2 = getScopedStorageKey(alreadyUserScoped);
    expect(scoped2).toBe(alreadyUserScoped);
  });
});
