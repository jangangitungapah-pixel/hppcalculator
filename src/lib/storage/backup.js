import { getSavedCalculations } from './calculationsStorage';
import { getSettings } from './settingsStorage';
import { getCalculatorDraft } from './draftStorage';
import { STORAGE_VERSION } from './storageKeys';

export const exportModalinData = () => {
  try {
    const data = {
      version: STORAGE_VERSION,
      exportedAt: new Date().toISOString(),
      settings: getSettings(),
      calculations: getSavedCalculations(),
      calculatorDraft: getCalculatorDraft()
    };
    return JSON.stringify(data, null, 2);
  } catch (e) {
    console.error("Failed to export data", e);
    return null;
  }
};

export const validateImportData = (data) => {
  if (!data || typeof data !== 'object') return false;
  if (data.version === undefined) return false;
  if (!Array.isArray(data.calculations)) return false;
  if (typeof data.settings !== 'object') return false;
  return true;
};

export const importModalinData = (data, options = {}) => {
  // Stub for future UI.
  // Will parse data, validate, and write to localStorage.
  if (!validateImportData(data)) {
    throw new Error("Format data tidak valid.");
  }
  // If we were implementing it fully:
  // setJson(STORAGE_KEYS.calculations, data.calculations);
  // setJson(STORAGE_KEYS.settings, data.settings);
  return true;
};
