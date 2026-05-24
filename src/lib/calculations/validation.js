import { VALID_LANGUAGES } from './constants.js';

export function isNonNegativeNumber(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value) && value >= 0;
}

export function isPositiveNumber(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value) && value > 0;
}

export function normalizeNumber(value) {
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

export function sanitizeQuickCalculationInput(input) {
  const sanitized = { ...input };
  sanitized.outputQuantity = normalizeNumber(sanitized.outputQuantity);
  sanitized.failedQuantity = normalizeNumber(sanitized.failedQuantity || 0);
  sanitized.sellingPrice = normalizeNumber(sanitized.sellingPrice);
  sanitized.roundingStep = normalizeNumber(sanitized.roundingStep || 500);
  
  if (sanitized.costItems && Array.isArray(sanitized.costItems)) {
    sanitized.costItems = sanitized.costItems.map(item => ({
      ...item,
      amount: normalizeNumber(item.amount)
    }));
  }
  return sanitized;
}

export function validateQuickCalculationInput(input) {
  const errors = [];
  const warnings = [];

  const productName = input.productName ? input.productName.trim() : '';
  if (!productName) {
    errors.push({ field: 'productName', code: 'REQUIRED', messageId: 'Nama produk wajib diisi.', messageEn: 'Product name is required.' });
  } else if (productName.length > 80) {
    errors.push({ field: 'productName', code: 'MAX_LENGTH', messageId: 'Nama produk maksimal 80 karakter.', messageEn: 'Product name maximum 80 characters.' });
  }

  if (!input.costItems || !Array.isArray(input.costItems) || input.costItems.length === 0) {
    errors.push({ field: 'costItems', code: 'REQUIRED', messageId: 'Minimal satu biaya diperlukan.', messageEn: 'At least one cost item is required.' });
  } else {
    let hasPositiveCost = false;
    input.costItems.forEach((item, index) => {
      if (!item.name || !item.name.trim()) {
        errors.push({ field: `costItems[${index}].name`, code: 'REQUIRED', messageId: 'Nama biaya wajib diisi.', messageEn: 'Cost name is required.' });
      }
      if (!isNonNegativeNumber(item.amount)) {
        errors.push({ field: `costItems[${index}].amount`, code: 'INVALID', messageId: 'Jumlah biaya harus nol atau lebih besar.', messageEn: 'Cost amount must be zero or positive.' });
      } else if (item.amount > 0) {
        hasPositiveCost = true;
      }
    });
    if (!hasPositiveCost && input.costItems.length > 0) {
      errors.push({ field: 'costItems', code: 'TOTAL_ZERO', messageId: 'Total biaya produksi tidak boleh 0.', messageEn: 'Total production cost cannot be 0.' });
    }
  }

  if (!isPositiveNumber(input.outputQuantity)) {
    errors.push({ field: 'outputQuantity', code: 'INVALID', messageId: 'Jumlah hasil harus lebih dari 0.', messageEn: 'Output quantity must be greater than 0.' });
  }

  if (!isNonNegativeNumber(input.failedQuantity)) {
    errors.push({ field: 'failedQuantity', code: 'INVALID', messageId: 'Jumlah gagal harus nol atau lebih besar.', messageEn: 'Failed quantity must be zero or positive.' });
  } else if (isPositiveNumber(input.outputQuantity) && input.failedQuantity >= input.outputQuantity) {
    errors.push({ field: 'failedQuantity', code: 'TOO_LARGE', messageId: 'Jumlah gagal tidak boleh sama atau lebih dari jumlah hasil.', messageEn: 'Failed quantity cannot be greater than or equal to output quantity.' });
  } else if (isPositiveNumber(input.outputQuantity) && input.failedQuantity > (input.outputQuantity * 0.1)) {
    warnings.push({ field: 'failedQuantity', code: 'HIGH_REJECT', messageId: 'Jumlah produk gagal cukup tinggi. Ini bisa membuat HPP naik.', messageEn: 'Rejected output is quite high. This can increase your cost per unit.' });
  }

  if (!input.sellingUnit || !input.sellingUnit.trim()) {
    errors.push({ field: 'sellingUnit', code: 'REQUIRED', messageId: 'Satuan jual wajib diisi.', messageEn: 'Selling unit is required.' });
  }

  if (!isPositiveNumber(input.sellingPrice)) {
    errors.push({ field: 'sellingPrice', code: 'INVALID', messageId: 'Harga jual harus lebih dari 0.', messageEn: 'Selling price must be greater than 0.' });
  }

  if (input.roundingStep !== undefined && !isPositiveNumber(input.roundingStep)) {
    errors.push({ field: 'roundingStep', code: 'INVALID', messageId: 'Langkah pembulatan harus lebih dari 0.', messageEn: 'Rounding step must be greater than 0.' });
  }

  if (input.language && !VALID_LANGUAGES.includes(input.language)) {
    warnings.push({ field: 'language', code: 'INVALID', messageId: 'Bahasa tidak valid. Menggunakan bahasa bawaan.', messageEn: 'Invalid language. Falling back to default.' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
