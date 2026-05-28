import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getRecipeDraft, 
  saveRecipeDraft, 
  clearRecipeDraft, 
  hasRecipeDraft 
} from '../lib/storage/draftStorage';
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

describe('Recipe Draft Storage & Scope Isolation', () => {
  beforeEach(() => {
    global.localStorage.clear();
    setActiveStorageScope({ type: 'guest', uid: null });
  });

  it('should save, read, and check draft existence correctly', () => {
    expect(hasRecipeDraft()).toBe(false);
    expect(getRecipeDraft()).toBeNull();

    const formState = { name: 'Roti Bakar', ingredients: [] };
    saveRecipeDraft('new', formState);

    expect(hasRecipeDraft()).toBe(true);
    
    const draft = getRecipeDraft();
    expect(draft).not.toBeNull();
    expect(draft.recipeId).toBe('new');
    expect(draft.form.name).toBe('Roti Bakar');

    clearRecipeDraft();
    expect(hasRecipeDraft()).toBe(false);
    expect(getRecipeDraft()).toBeNull();
  });

  it('should isolate drafts across different storage scopes', () => {
    // 1. Save draft in guest scope
    setActiveStorageScope({ type: 'guest', uid: null });
    saveRecipeDraft('new', { name: 'Guest Recipe' });

    // 2. Switch to user scope A
    setActiveStorageScope({ type: 'user', uid: 'user_A' });
    expect(hasRecipeDraft()).toBe(false);
    saveRecipeDraft('new', { name: 'User A Recipe' });
    expect(getRecipeDraft().form.name).toBe('User A Recipe');

    // 3. Switch to user scope B
    setActiveStorageScope({ type: 'user', uid: 'user_B' });
    expect(hasRecipeDraft()).toBe(false);

    // 4. Switch back to guest scope
    setActiveStorageScope({ type: 'guest', uid: null });
    expect(getRecipeDraft().form.name).toBe('Guest Recipe');
  });
});
