const SCALE = 1000000; // 6 decimal places scale factor

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function preciseAdd(a, b) {
  return (Math.round(Number(a || 0) * SCALE) + Math.round(Number(b || 0) * SCALE)) / SCALE;
}

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function preciseSubtract(a, b) {
  return (Math.round(Number(a || 0) * SCALE) - Math.round(Number(b || 0) * SCALE)) / SCALE;
}

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function preciseMultiply(a, b) {
  return Math.round(Number(a || 0) * Number(b || 0) * SCALE) / SCALE;
}

/**
 * @param {number} numerator
 * @param {number} denominator
 * @param {number} fallback
 * @returns {number}
 */
export function preciseDivide(numerator, denominator, fallback = 0) {
  const num = Number(numerator || 0);
  const den = Number(denominator || 0);
  if (den === 0 || isNaN(den)) return fallback;
  return Math.round((num / den) * SCALE) / SCALE;
}

/**
 * @param {number} value
 * @param {number} step
 * @returns {number}
 */
export function roundUpToStep(value, step) {
  if (step <= 0) return value;
  return Math.ceil(preciseDivide(value, step) || 0) * step;
}

/**
 * @param {number} value
 * @param {number} decimals
 * @returns {number}
 */
export function roundToDecimal(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(preciseMultiply(value, factor) || 0) / factor;
}

/**
 * @param {number} numerator
 * @param {number} denominator
 * @param {number} fallback
 * @returns {number}
 */
export function safeDivide(numerator, denominator, fallback = 0) {
  return preciseDivide(numerator, denominator, fallback);
}
