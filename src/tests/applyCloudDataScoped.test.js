import { describe, it, expect, beforeEach, vi } from 'vitest';
import { applyCloudRecordsToLocalStorage } from '../lib/sync/applyCloudData';
import { setActiveStorageScope } from '../lib/storage/storageScope';
import { SYNC_RECORD_TYPES } from '../lib/sync/syncTypes';

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

describe('applyCloudDataScoped', () => {
  beforeEach(() => {
    global.localStorage.clear();
    setActiveStorageScope({ type: 'guest', uid: null });
  });

  it('should write applied records only to the active user scope matching expectedUid', () => {
    setActiveStorageScope({ type: 'user', uid: 'user_A' });

    const records = [
      {
        recordType: SYNC_RECORD_TYPES.INGREDIENT,
        recordId: 'ingA',
        payload: { id: 'ingA', name: 'Cloud Ingredient A' },
        localUpdatedAt: '2026-05-26T12:00:00Z',
        deletedAt: null
      }
    ];

    // Try applying with mismatching UID - should fail/return false
    const failedResult = applyCloudRecordsToLocalStorage(records, { expectedUid: 'user_B' });
    expect(failedResult).toBe(false);

    // Verify it was NOT written to user A or guest or user B
    expect(global.localStorage.getItem('modalin:v1:user:user_A:ingredients')).toBeNull();
    expect(global.localStorage.getItem('modalin:v1:guest:ingredients')).toBeNull();

    // Now apply with correct UID - should succeed/return true
    const successResult = applyCloudRecordsToLocalStorage(records, { expectedUid: 'user_A' });
    expect(successResult).toBe(true);

    // Verify it was written to user A scope
    const appliedData = JSON.parse(global.localStorage.getItem('modalin:v1:user:user_A:ingredients'));
    expect(appliedData).toHaveLength(1);
    expect(appliedData[0].name).toBe('Cloud Ingredient A');

    // Guest and user B should remain untouched
    expect(global.localStorage.getItem('modalin:v1:guest:ingredients')).toBeNull();
    expect(global.localStorage.getItem('modalin:v1:user:user_B:ingredients')).toBeNull();
  });

  it('should abort if active storage scope type is guest', () => {
    setActiveStorageScope({ type: 'guest', uid: null });

    const records = [
      {
        recordType: SYNC_RECORD_TYPES.INGREDIENT,
        recordId: 'ingG',
        payload: { id: 'ingG', name: 'Cloud Guest' }
      }
    ];

    const result = applyCloudRecordsToLocalStorage(records, { expectedUid: 'user_A' });
    expect(result).toBe(false);
    expect(global.localStorage.getItem('modalin:v1:guest:ingredients')).toBeNull();
  });
});
