import { getJson, setJson, removeItem } from './localStorageClient';
import { STORAGE_KEYS, STORAGE_VERSION } from './storageKeys';

export const getCalculatorDraft = () => {
  return getJson(STORAGE_KEYS.calculatorDraft, null);
};

export const saveCalculatorDraft = (form) => {
  const draft = {
    version: STORAGE_VERSION,
    updatedAt: new Date().toISOString(),
    form
  };
  return setJson(STORAGE_KEYS.calculatorDraft, draft);
};

export const clearCalculatorDraft = () => {
  return removeItem(STORAGE_KEYS.calculatorDraft);
};

export const hasCalculatorDraft = () => {
  const draft = getCalculatorDraft();
  return draft !== null && draft.form !== undefined;
};
