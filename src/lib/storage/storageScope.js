import { isLocalStorageAvailable } from './localStorageClient';

const ACTIVE_SCOPE_KEY = 'modalin:v1:activeStorageScope';

const DEFAULT_SCOPE = {
  type: 'guest',
  uid: null
};

/**
 * Get current active storage scope.
 * @returns {{ type: 'guest' | 'user', uid: string | null }}
 */
export const getActiveStorageScope = () => {
  if (!isLocalStorageAvailable()) return DEFAULT_SCOPE;
  try {
    const raw = window.localStorage.getItem(ACTIVE_SCOPE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SCOPE;
  } catch (error) {
    console.warn('[StorageScope] Failed to read active scope', error);
    return DEFAULT_SCOPE;
  }
};

/**
 * Set current active storage scope.
 * @param {{ type: 'guest' | 'user', uid: string | null }} scope 
 */
export const setActiveStorageScope = (scope) => {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.setItem(ACTIVE_SCOPE_KEY, JSON.stringify(scope));
    if (import.meta.env.DEV) {
      console.debug(`[StorageScope] Active scope changed to: ${scope.type} ${scope.uid || ''}`);
    }
  } catch (error) {
    console.warn('[StorageScope] Failed to set active scope', error);
  }
};

export const getGuestStorageScope = () => ({ type: 'guest', uid: null });

export const getUserStorageScope = (uid) => ({ type: 'user', uid });

export const getCurrentUserScopedPrefix = () => {
  const scope = getActiveStorageScope();
  if (scope.type === 'user' && scope.uid) {
    return `user:${scope.uid}`;
  }
  return 'guest';
};

/**
 * Convert a base key (e.g. "modalin:v1:ingredients") to a scoped key.
 * If the key already has scope injected, it will be returned as is.
 * @param {string} baseKey 
 * @param {object} scope Optional override scope
 */
export const getScopedStorageKey = (baseKey, scope = null) => {
  const targetScope = scope || getActiveStorageScope();
  const prefix = targetScope.type === 'user' && targetScope.uid ? `user:${targetScope.uid}` : 'guest';
  
  // Example baseKey: "modalin:v1:ingredients"
  // Target: "modalin:v1:guest:ingredients" or "modalin:v1:user:{uid}:ingredients"
  
  // Prevent double scoping
  if (baseKey.includes(`:guest:`) || baseKey.includes(`:user:`)) {
    return baseKey;
  }

  // Insert scope prefix right after "modalin:v1"
  return baseKey.replace('modalin:v1:', `modalin:v1:${prefix}:`);
};

export const clearActiveStorageScope = () => {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.removeItem(ACTIVE_SCOPE_KEY);
  } catch (e) {
    console.warn('[StorageScope] Failed to clear active scope', e);
  }
};
