import { BACKUP_MODULES } from './backupTypes';
import { STORAGE_KEYS } from '../storage';

export const getResettableModules = () => {
  return [...BACKUP_MODULES, 'calculatorDraft'];
};

export const resetModule = (moduleName) => {
  const storageKey = STORAGE_KEYS[moduleName];
  if (!storageKey) return false;
  
  try {
    if (moduleName === 'calculatorDraft' || moduleName === 'settings') {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, JSON.stringify([]));
    }
    return true;
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
