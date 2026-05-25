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
