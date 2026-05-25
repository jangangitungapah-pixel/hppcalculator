/**
 * Maps the UI form shape + settings into a flat input shape ready for calculations.
 */
export const createCalculationInputFromForm = (form, settings) => {
  return {
    productName: form.productName,
    costItems: form.costItems.map(item => ({
      ...item,
      amount: parseFloat(item.amount) || 0
    })),
    outputQuantity: parseFloat(form.outputQuantity) || 0,
    failedQuantity: parseFloat(form.failedQuantity) || 0,
    sellingUnit: form.sellingUnit,
    sellingPrice: parseFloat(form.sellingPrice) || 0,
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
  return {
    productName: input.productName,
    costItems: input.costItems,
    outputQuantity: input.outputQuantity,
    failedQuantity: input.failedQuantity,
    sellingUnit: input.sellingUnit,
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
