import { calculateQuickHpp } from '../calculations/index';

/**
 * Re-runs the calculation logic on a saved input.
 * Useful if formulas change or settings change in the future.
 */
export const recalculateSavedCalculation = (savedCalculation, currentSettings) => {
  if (!savedCalculation || !savedCalculation.input) return savedCalculation;

  const { input } = savedCalculation;
  
  // Create a payload that uses the updated settings (e.g., if rounding step changed)
  const payloadForCalculation = {
    ...input,
    roundingStep: currentSettings ? currentSettings.roundingStep : input.roundingStep
  };

  try {
    const newResult = calculateQuickHpp(payloadForCalculation, payloadForCalculation.roundingStep);
    
    // Return updated object (does NOT save to localStorage automatically)
    return {
      ...savedCalculation,
      result: newResult,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Recalculation failed for", savedCalculation.id, error);
    return savedCalculation; // Fallback to original
  }
};

/**
 * Simple check to ensure we have the data needed to recalculate.
 */
export const canRecalculate = (savedCalculation) => {
  return savedCalculation && savedCalculation.input && savedCalculation.result;
};
