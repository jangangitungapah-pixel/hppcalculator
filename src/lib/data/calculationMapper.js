/**
 * Maps the UI form shape + settings into a flat input shape ready for calculations.
 */
export const parseLocalizedNumber = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (value === null || value === undefined) return 0;

  const raw = String(value).trim();
  if (!raw) return 0;

  const cleaned = raw.replace(/\s/g, '');
  const hasComma = cleaned.includes(',');
  const hasDot = cleaned.includes('.');

  let normalized = cleaned;
  if (hasComma && hasDot) {
    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');
    normalized = lastComma > lastDot
      ? cleaned.replace(/\./g, '').replace(',', '.')
      : cleaned.replace(/,/g, '');
  } else if (hasComma) {
    normalized = cleaned.replace(',', '.');
  } else if (hasDot) {
    const parts = cleaned.split('.');
    const lastPart = parts[parts.length - 1];
    if (parts.length > 2 || lastPart.length === 3) {
      normalized = cleaned.replace(/\./g, '');
    }
  }

  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getSellingUnitFromForm = (form) => {
  if (form.sellingUnit === 'custom') {
    return form.customSellingUnit?.trim() || '';
  }
  return form.sellingUnit;
};

export const createCalculationInputFromForm = (form, settings) => {
  return {
    productName: form.productName,
    costItems: form.costItems.map(item => ({
      ...item,
      amount: parseLocalizedNumber(item.amount)
    })),
    outputQuantity: parseLocalizedNumber(form.outputQuantity),
    failedQuantity: parseLocalizedNumber(form.failedQuantity),
    sellingUnit: getSellingUnitFromForm(form),
    sellingPrice: parseLocalizedNumber(form.sellingPrice),
    language: settings.language,
    currency: settings.currency,
    roundingStep: settings.roundingStep
  };
};

/**
 * Creates the form state from a saved calculation.
 * Used for "Use Again" functionality.
 */
export const createFormFromSavedCalculation = (savedCalculation) => {
  if (!savedCalculation || !savedCalculation.input) return null;
  
  const { input } = savedCalculation;
  const knownUnits = ['pcs', 'porsi', 'cup', 'box'];
  const isKnownUnit = knownUnits.includes(input.sellingUnit);

  return {
    productName: input.productName,
    costItems: input.costItems,
    outputQuantity: input.outputQuantity,
    failedQuantity: input.failedQuantity,
    sellingUnit: isKnownUnit ? input.sellingUnit : 'custom',
    customSellingUnit: isKnownUnit ? '' : input.sellingUnit || '',
    sellingPrice: input.sellingPrice
  };
};

/**
 * Convenience mapper in case we need to build the object manually before save.
 */
export const createSavedCalculationFromResult = (input, result) => {
  return {
    input,
    result
  };
};

/**
 * Maps legacy mock calculation data to the new SavedCalculation shape.
 * Mainly used when loading demo data.
 */
export const mapMockCalculationToSavedCalculation = (mockItem) => {
  // Logic is implemented within loadDemoCalculations in calculationsStorage.js
  // But exposed here if needed elsewhere.
  return mockItem;
};
