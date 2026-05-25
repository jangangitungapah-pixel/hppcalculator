import { BACKUP_MODULES } from './backupTypes';
import { markBackupImported } from './dataBackupMeta';
import { STORAGE_KEYS } from '../storage';

export const mergeArrayById = (currentArray, incomingArray) => {
  if (!Array.isArray(currentArray)) currentArray = [];
  if (!Array.isArray(incomingArray)) incomingArray = [];
  
  const currentIds = new Set(currentArray.map(item => item.id).filter(Boolean));
  const newItems = incomingArray.filter(item => {
    if (!item.id) return false;
    return !currentIds.has(item.id);
  });
  
  return [...currentArray, ...newItems];
};

export const applyImportedData = (backupData, mode, includeSettings, currentData) => {
  const importedCounts = {};
  const skippedCounts = {};
  const replacedCounts = {};
  
  // Process Business Modules
  BACKUP_MODULES.forEach(module => {
    importedCounts[module] = 0;
    skippedCounts[module] = 0;
    replacedCounts[module] = 0;
    
    const incomingArray = backupData[module] || [];
    const storageKey = STORAGE_KEYS[module];
    
    if (!storageKey) return;
    
    if (mode === 'replace') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(incomingArray));
        replacedCounts[module] = incomingArray.length;
      } catch (err) {
        console.error(`Failed to replace ${module}`, err);
      }
    } else if (mode === 'merge') {
      const currentArray = currentData[module] || [];
      const currentIds = new Set(currentArray.map(item => item.id).filter(Boolean));
      
      const newItems = incomingArray.filter(item => item.id && !currentIds.has(item.id));
      const duplicateCount = incomingArray.length - newItems.length;
      
      if (newItems.length > 0) {
        const merged = [...currentArray, ...newItems];
        try {
          localStorage.setItem(storageKey, JSON.stringify(merged));
          importedCounts[module] = newItems.length;
          skippedCounts[module] = duplicateCount;
        } catch (err) {
          console.error(`Failed to merge ${module}`, err);
        }
      } else {
        skippedCounts[module] = duplicateCount;
      }
    }
  });
  
  // Process Settings
  if (includeSettings && backupData.settings) {
    const storageKey = STORAGE_KEYS.settings;
    if (storageKey) {
      if (mode === 'replace') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(backupData.settings));
          replacedCounts.settings = 1;
        } catch (err) {
           console.error("Failed to replace settings", err);
        }
      } else if (mode === 'merge') {
        const currentSettings = currentData.settings || {};
        const mergedSettings = { ...currentSettings, ...backupData.settings };
        try {
          localStorage.setItem(storageKey, JSON.stringify(mergedSettings));
          importedCounts.settings = 1;
        } catch (err) {
           console.error("Failed to merge settings", err);
        }
      }
    }
  }
  
  return { importedCounts, skippedCounts, replacedCounts };
};

export const importModalinBackup = (backup, currentData, options) => {
  const { mode = 'merge', includeSettings = false } = options;
  
  if (!backup || !backup.data) {
    return { success: false, errors: ['Invalid backup data object'] };
  }
  
  try {
    const resultStats = applyImportedData(backup.data, mode, includeSettings, currentData);
    markBackupImported();
    
    return {
      success: true,
      mode,
      ...resultStats,
      warnings: [],
      errors: []
    };
  } catch (error) {
    console.error("Import execution failed", error);
    return {
      success: false,
      errors: [error.message || 'Unknown import error']
    };
  }
};
