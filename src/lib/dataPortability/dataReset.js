import { BACKUP_MODULES, BACKUP_MODULE_STORAGE_KEYS } from './backupTypes';
import { STORAGE_KEYS } from '../storage';
import { removeItem, setScopedJson, removeScopedItem } from '../storage/localStorageClient';

export const getResettableModules = () => {
  return [...BACKUP_MODULES, 'calculatorDraft'];
};

export const resetModule = (moduleName) => {
  const storageKey = moduleName === 'calculatorDraft'
    ? STORAGE_KEYS.calculatorDraft
    : BACKUP_MODULE_STORAGE_KEYS[moduleName] || STORAGE_KEYS[moduleName];
  if (!storageKey) return false;
  
  try {
    if (moduleName === 'calculatorDraft') {
      return removeItem(storageKey);
    }

    if (moduleName === 'settings') {
      return removeScopedItem(storageKey);
    }

    if (BACKUP_MODULE_STORAGE_KEYS[moduleName]) {
      return setScopedJson(storageKey, []);
    } else {
      return false;
    }
  } catch (err) {
    console.error(`Failed to reset module ${moduleName}`, err);
    return false;
  }
};

export const resetCalculatorDraft = () => {
  return resetModule('calculatorDraft');
};

export const resetAllBusinessData = () => {
  let success = true;
  BACKUP_MODULES.forEach(module => {
    const res = resetModule(module);
    if (!res) success = false;
  });
  // Note: settings and meta remain intact
  return success;
};
