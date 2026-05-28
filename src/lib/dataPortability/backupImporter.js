import { BACKUP_MODULES, BACKUP_MODULE_STORAGE_KEYS } from './backupTypes';
import { markBackupImported } from './dataBackupMeta';
import { STORAGE_KEYS } from '../storage';
import { getScopedJson, setScopedJson } from '../storage/localStorageClient';

const getModuleRecordId = (module, item) => {
  if (!item) return null;
  if (module === 'inventorySettings') return item.ingredientId || null;
  return item.id || null;
};

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
    const storageKey = BACKUP_MODULE_STORAGE_KEYS[module];
    
    if (!storageKey) return;
    
    if (mode === 'replace') {
      const success = setScopedJson(storageKey, incomingArray);
      if (success) {
        replacedCounts[module] = incomingArray.length;
      } else {
        console.error(`Failed to replace ${module}`);
      }
    } else if (mode === 'merge') {
      const currentArray = Array.isArray(currentData[module])
        ? currentData[module]
        : getScopedJson(storageKey, []);
      const currentIds = new Set(currentArray.map(item => getModuleRecordId(module, item)).filter(Boolean));
      
      const newItems = incomingArray.filter(item => {
        const itemId = getModuleRecordId(module, item);
        return itemId && !currentIds.has(itemId);
      });
      const duplicateCount = incomingArray.length - newItems.length;
      
      if (newItems.length > 0) {
        const merged = [...currentArray, ...newItems];
        const success = setScopedJson(storageKey, merged);
        if (success) {
          importedCounts[module] = newItems.length;
          skippedCounts[module] = duplicateCount;
        } else {
          console.error(`Failed to merge ${module}`);
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
        const success = setScopedJson(storageKey, backupData.settings);
        if (success) {
          replacedCounts.settings = 1;
        } else {
           console.error("Failed to replace settings");
        }
      } else if (mode === 'merge') {
        const currentSettings = currentData.settings || {};
        const mergedSettings = { ...currentSettings, ...backupData.settings };
        const success = setScopedJson(storageKey, mergedSettings);
        if (success) {
          importedCounts.settings = 1;
        } else {
           console.error("Failed to merge settings");
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
