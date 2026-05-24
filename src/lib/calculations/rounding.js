/**
 * @param {number} value
 * @param {number} step
 * @returns {number}
 */
export function roundUpToStep(value, step) {
  if (step <= 0) return value;
  return Math.ceil(value / step) * step;
}

/**
 * @param {number} value
 * @param {number} decimals
 * @returns {number}
 */
export function roundToDecimal(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * @param {number} numerator
 * @param {number} denominator
 * @param {number} fallback
 * @returns {number}
 */
export function safeDivide(numerator, denominator, fallback = 0) {
  if (denominator === 0 || isNaN(denominator)) return fallback;
  const result = numerator / denominator;
  return isFinite(result) ? result : fallback;
}
