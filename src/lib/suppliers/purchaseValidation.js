import { SUPPLIER_TYPES } from './supplierTypes';

export const validateSupplier = (input = {}) => {
  const errors = [];
  if (!input.name || input.name.trim() === '') {
    errors.push('Nama supplier wajib diisi');
  }

  if (input.email && input.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      errors.push('Format email tidak valid');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePurchaseLog = (input = {}) => {
  const errors = [];
  if (!input.purchaseDate || input.purchaseDate.trim() === '') {
    errors.push('Tanggal pembelian wajib diisi');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePurchaseItem = (input = {}) => {
  const errors = [];
  if (!input.ingredientId || input.ingredientId.trim() === '') {
    errors.push('Bahan wajib dipilih');
  }
  if (Number(input.quantity) <= 0) {
    errors.push('Jumlah pembelian harus lebih dari 0');
  }
  if (Number(input.totalPrice) < 0) {
    errors.push('Total harga pembelian tidak boleh negatif');
  }
  if (!input.unit || input.unit.trim() === '') {
    errors.push('Satuan pembelian wajib diisi');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};
