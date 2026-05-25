const BACKUP_META_KEY = 'modalin:v1:backupMeta';

const DEFAULT_META = {
  version: 1,
  lastBackupAt: null,
  lastImportAt: null,
  backupCount: 0,
  importCount: 0,
  updatedAt: new Date().toISOString()
};

export const getBackupMeta = () => {
  try {
    const data = localStorage.getItem(BACKUP_META_KEY);
    if (!data) return DEFAULT_META;
    return { ...DEFAULT_META, ...JSON.parse(data) };
  } catch (err) {
    console.error('Failed to parse backup meta', err);
    return DEFAULT_META;
  }
};

export const updateBackupMeta = (partial) => {
  try {
    const current = getBackupMeta();
    const updated = { 
      ...current, 
      ...partial, 
      updatedAt: new Date().toISOString() 
    };
    localStorage.setItem(BACKUP_META_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to update backup meta', err);
    return null;
  }
};

export const markBackupExported = () => {
  const current = getBackupMeta();
  return updateBackupMeta({
    lastBackupAt: new Date().toISOString(),
    backupCount: current.backupCount + 1
  });
};

export const markBackupImported = () => {
  const current = getBackupMeta();
  return updateBackupMeta({
    lastImportAt: new Date().toISOString(),
    importCount: current.importCount + 1
  });
};

export const resetBackupMeta = () => {
  try {
    localStorage.setItem(BACKUP_META_KEY, JSON.stringify(DEFAULT_META));
  } catch (err) {
    // Ignore
  }
};
