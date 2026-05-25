import { getJson, setJson } from './localStorageClient';
import { STORAGE_KEYS, STORAGE_VERSION } from './storageKeys';

export const getStorageMeta = () => {
  return getJson(STORAGE_KEYS.meta, null);
};

export const setStorageMeta = (meta) => {
  return setJson(STORAGE_KEYS.meta, meta);
};

export const initializeStorageMeta = () => {
  const meta = getStorageMeta();
  const now = new Date().toISOString();

  if (!meta) {
    return setStorageMeta({
      version: STORAGE_VERSION,
      initializedAt: now,
      lastOpenedAt: now,
      migrationHistory: []
    });
  }

  // Update lastOpenedAt
  return setStorageMeta({
    ...meta,
    lastOpenedAt: now
  });
};

export const runStorageMigrations = () => {
  // Simple foundation: If meta exists, we can check versions in the future
  initializeStorageMeta();
};
