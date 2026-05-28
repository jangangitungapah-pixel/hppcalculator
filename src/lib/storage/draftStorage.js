import { getJson, setJson, removeItem, getScopedJson, setScopedJson, removeScopedItem } from './localStorageClient';
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

// Recipe Draft Storage API
export const getRecipeDraft = () => {
  return getScopedJson(STORAGE_KEYS.recipeDraft, null);
};

export const saveRecipeDraft = (recipeId, form) => {
  const draft = {
    version: STORAGE_VERSION,
    updatedAt: new Date().toISOString(),
    recipeId,
    form
  };
  return setScopedJson(STORAGE_KEYS.recipeDraft, draft);
};

export const clearRecipeDraft = () => {
  return removeScopedItem(STORAGE_KEYS.recipeDraft);
};

export const hasRecipeDraft = () => {
  const draft = getRecipeDraft();
  return draft !== null && draft.form !== undefined;
};
