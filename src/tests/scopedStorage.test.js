import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getScopedJson, setScopedJson, removeScopedItem } from '../lib/storage/localStorageClient';
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

describe('scopedStorage', () => {
  beforeEach(() => {
    global.localStorage.clear();
  });

  it('should isolate guest and user data', () => {
    // 1. Guest
    setActiveStorageScope({ type: 'guest', uid: null });
    setScopedJson('modalin:v1:test', { data: 'guest_data' });
    
    // 2. User A
    setActiveStorageScope({ type: 'user', uid: 'user_A' });
    setScopedJson('modalin:v1:test', { data: 'user_A_data' });

    // 3. User B
    setActiveStorageScope({ type: 'user', uid: 'user_B' });
    setScopedJson('modalin:v1:test', { data: 'user_B_data' });

    // Verify Guest
    setActiveStorageScope({ type: 'guest', uid: null });
    expect(getScopedJson('modalin:v1:test').data).toBe('guest_data');

    // Verify User A
    setActiveStorageScope({ type: 'user', uid: 'user_A' });
    expect(getScopedJson('modalin:v1:test').data).toBe('user_A_data');

    // Verify User B
    setActiveStorageScope({ type: 'user', uid: 'user_B' });
    expect(getScopedJson('modalin:v1:test').data).toBe('user_B_data');
  });

  it('should cleanly remove scoped item without affecting others', () => {
    setActiveStorageScope({ type: 'guest', uid: null });
    setScopedJson('modalin:v1:test', { data: 'guest_data' });

    setActiveStorageScope({ type: 'user', uid: 'user_A' });
    setScopedJson('modalin:v1:test', { data: 'user_A_data' });

    removeScopedItem('modalin:v1:test');
    expect(getScopedJson('modalin:v1:test')).toBeNull();

    // Guest should still have it
    setActiveStorageScope({ type: 'guest', uid: null });
    expect(getScopedJson('modalin:v1:test')).not.toBeNull();
  });
});
