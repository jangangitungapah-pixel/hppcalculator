export const isLocalStorageAvailable = () => {
  try {
    const testKey = '__modalin_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

export const getJson = (key, fallback = null) => {
  if (!isLocalStorageAvailable()) return fallback;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`[Modalin Storage] Error parsing key "${key}":`, e);
    return fallback;
  }
};

export const setJson = (key, value) => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`[Modalin Storage] Error setting key "${key}":`, e);
    return false;
  }
};

export const removeItem = (key) => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error(`[Modalin Storage] Error removing key "${key}":`, e);
    return false;
  }
};

export const clearModalinStorage = () => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const keys = Object.keys(window.localStorage);
    keys.forEach(key => {
      if (key.startsWith('modalin:')) {
        window.localStorage.removeItem(key);
      }
    });
    return true;
  } catch (e) {
    console.error(`[Modalin Storage] Error clearing Modalin storage:`, e);
    return false;
  }
};

export const getStorageErrorMessage = (error) => {
  if (error?.name === 'QuotaExceededError') {
    return "Penyimpanan perangkat penuh. Hapus beberapa data untuk menyimpan.";
  }
  return "Terjadi kesalahan saat menyimpan data.";
};

// --- Scoped Storage API ---
import { getScopedStorageKey } from './storageScope';

export const getScopedKey = (baseKey) => {
  const scoped = getScopedStorageKey(baseKey);
  if (import.meta.env.DEV) {
    // Enable this for deep debugging if needed
    // console.debug(`[LocalStorageClient] Mapping ${baseKey} -> ${scoped}`);
  }
  return scoped;
};

export const getScopedJson = (baseKey, fallback = null) => {
  return getJson(getScopedKey(baseKey), fallback);
};

export const setScopedJson = (baseKey, value) => {
  return setJson(getScopedKey(baseKey), value);
};

export const removeScopedItem = (baseKey) => {
  return removeItem(getScopedKey(baseKey));
};

