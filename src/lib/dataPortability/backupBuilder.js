import { BACKUP_FORMAT_VERSION, BACKUP_APP_NAME, BACKUP_KIND, BACKUP_MODULES } from './backupTypes';
import { downloadJsonFile } from './fileDownload';
import { markBackupExported } from './dataBackupMeta';

export const getBackupModuleCounts = (data) => {
  const counts = {};
  BACKUP_MODULES.forEach(module => {
    counts[module] = Array.isArray(data[module]) ? data[module].length : 0;
  });
  return counts;
};

export const getBackupTotalRecords = (moduleCounts) => {
  return Object.values(moduleCounts).reduce((sum, count) => sum + count, 0);
};

export const sanitizeBackupData = (data) => {
  const sanitized = {};
  
  // Clean arrays
  BACKUP_MODULES.forEach(module => {
    sanitized[module] = Array.isArray(data[module]) ? data[module] : [];
  });
  
  // Clean settings
  sanitized.settings = data.settings || {};
  
  return sanitized;
};

export const buildModalinBackup = (appData) => {
  const exportedAt = new Date().toISOString();
  
  const sanitizedData = sanitizeBackupData(appData);
  const moduleCounts = getBackupModuleCounts(sanitizedData);
  const totalRecords = getBackupTotalRecords(moduleCounts);

  const backup = {
    kind: BACKUP_KIND,
    app: BACKUP_APP_NAME,
    version: BACKUP_FORMAT_VERSION,
    exportedAt,
    exportedBy: "local-browser",
    schema: {
      storageVersion: 1,
      appDataVersion: 1
    },
    metadata: {
      totalRecords,
      modules: moduleCounts,
      settingsIncluded: !!sanitizedData.settings,
      draftIncluded: false
    },
    data: sanitizedData
  };

  return backup;
};

export const createBackupFilename = (date = new Date()) => {
  const pad = (n) => n.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  
  return `modalin-backup-${yyyy}-${mm}-${dd}.json`;
};

export const exportModalinBackup = (appData) => {
  try {
    const backup = buildModalinBackup(appData);
    const filename = createBackupFilename(new Date());
    
    downloadJsonFile(filename, backup);
    markBackupExported();
    
    return backup;
  } catch (error) {
    console.error("Backup export failed:", error);
    throw error;
  }
};
