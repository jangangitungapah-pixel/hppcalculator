import { getJson, setJson } from './localStorageClient';
import { STORAGE_KEYS, STORAGE_VERSION } from './storageKeys';

export const DEFAULT_SETTINGS = {
  version: STORAGE_VERSION,
  language: "id",
  currency: "IDR",
  roundingStep: 500,
  updatedAt: new Date().toISOString()
};

export const getSettings = () => {
  const stored = getJson(STORAGE_KEYS.settings);
  if (!stored) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...stored };
};

export const saveSettings = (settings) => {
  const newSettings = {
    ...settings,
    version: STORAGE_VERSION,
    updatedAt: new Date().toISOString()
  };
  setJson(STORAGE_KEYS.settings, newSettings);
  return newSettings;
};

export const updateSettings = (partialSettings) => {
  const current = getSettings();
  const updated = { ...current, ...partialSettings };
  return saveSettings(updated);
};

export const resetSettings = () => {
  return saveSettings(DEFAULT_SETTINGS);
};
