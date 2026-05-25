import { BACKUP_MODULES } from './backupTypes';
import { getBackupMeta } from './dataBackupMeta';

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const estimateLocalStorageSize = () => {
  let totalBytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    totalBytes += (key.length + (value ? value.length : 0)) * 2; // Roughly 2 bytes per char
  }
  return totalBytes;
};

export const estimateModalinStorageSize = () => {
  let totalBytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('modalin:')) {
      const value = localStorage.getItem(key);
      totalBytes += (key.length + (value ? value.length : 0)) * 2;
    }
  }
  return totalBytes;
};

export const getModuleHealth = (appData) => {
  const modules = {};
  let totalBusinessRecords = 0;
  let totalInvalidRecords = 0;

  BACKUP_MODULES.forEach(module => {
    const data = appData[module];
    if (Array.isArray(data)) {
      const count = data.length;
      // simplistic invalid check: records missing an id
      const invalidCount = data.filter(item => !item || typeof item !== 'object' || !item.id).length;
      
      modules[module] = { count, invalidCount };
      totalBusinessRecords += count;
      totalInvalidRecords += invalidCount;
    } else {
      modules[module] = { count: 0, invalidCount: 0 };
    }
  });

  return { modules, totalBusinessRecords, totalInvalidRecords };
};

export const getBackupReminderStatus = (totalBusinessRecords, backupMeta) => {
  const reminder = {
    shouldShow: false,
    reason: '',
    totalBusinessRecords,
    lastBackupAt: backupMeta.lastBackupAt
  };

  if (totalBusinessRecords >= 5 && !backupMeta.lastBackupAt) {
    reminder.shouldShow = true;
    reminder.reason = 'no_backup_yet';
  } else if (totalBusinessRecords >= 20 && backupMeta.lastBackupAt) {
    const last = new Date(backupMeta.lastBackupAt);
    const now = new Date();
    const daysSince = (now - last) / (1000 * 60 * 60 * 24);
    if (daysSince > 30) {
      reminder.shouldShow = true;
      reminder.reason = 'stale_backup';
    }
  }
  return reminder;
};

export const getStorageHealth = (appData) => {
  let totalSizeBytes = 0;
  let modalingSizeBytes = 0;
  let status = 'healthy';
  const issues = [];

  try {
    totalSizeBytes = estimateLocalStorageSize();
    modalingSizeBytes = estimateModalinStorageSize();
  } catch (err) {
    status = 'danger';
    issues.push('localStorage access error.');
  }

  const { modules, totalBusinessRecords, totalInvalidRecords } = getModuleHealth(appData);
  const backupMeta = getBackupMeta();

  if (totalInvalidRecords > 0) {
    status = 'warning';
    issues.push(`Found ${totalInvalidRecords} potentially invalid records.`);
  }
  
  if (totalSizeBytes > 4 * 1024 * 1024) { // roughly approaching 5MB limit
    status = 'danger';
    issues.push(`Approaching localStorage limit (approx ${formatBytes(totalSizeBytes)}).`);
  }

  const backupReminder = getBackupReminderStatus(totalBusinessRecords, backupMeta);

  return {
    totalSizeBytes,
    modalingSizeBytes,
    formattedSize: formatBytes(modalingSizeBytes),
    modules,
    issues,
    status,
    backupReminder
  };
};
