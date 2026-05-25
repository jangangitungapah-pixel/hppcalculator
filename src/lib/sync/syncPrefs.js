import { getScopedStorageKey } from '../storage/storageScope';

const BASE_SYNC_PREFS_KEY = 'modalin:v1:syncPrefs';

const defaultPrefs = {
  version: 1,
  initialSyncPromptDismissedAt: null,
  localUploadApprovedAt: null,
  autoSyncEnabled: true,
  lastLocalChangeAt: null,
  lastSyncAttemptAt: null
};

export function getSyncPrefs() {
  try {
    const key = getScopedStorageKey(BASE_SYNC_PREFS_KEY);
    const raw = localStorage.getItem(key);
    if (!raw) return { ...defaultPrefs };
    return { ...defaultPrefs, ...JSON.parse(raw) };
  } catch (error) {
    console.warn('Failed to read sync prefs:', error);
    return { ...defaultPrefs };
  }
}

export function updateSyncPrefs(partial) {
  try {
    const current = getSyncPrefs();
    const updated = { ...current, ...partial };
    const key = getScopedStorageKey(BASE_SYNC_PREFS_KEY);
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.warn('Failed to update sync prefs:', error);
  }
}

export function markLocalUploadApproved() {
  return updateSyncPrefs({ localUploadApprovedAt: new Date().toISOString() });
}

export function dismissInitialSyncPrompt() {
  return updateSyncPrefs({ initialSyncPromptDismissedAt: new Date().toISOString() });
}

export function shouldShowInitialSyncPrompt({ isAuthenticated, hasLocalData }) {
  if (!isAuthenticated || !hasLocalData) return false;
  const prefs = getSyncPrefs();
  if (prefs.localUploadApprovedAt) return false;
  if (prefs.initialSyncPromptDismissedAt) {
    // Optionally show again after some days, but for Phase 13 just once is enough
    return false;
  }
  return true;
}
