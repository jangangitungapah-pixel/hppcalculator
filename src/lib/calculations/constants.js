export const DEFAULT_LANGUAGE = 'id';
export const DEFAULT_CURRENCY = 'IDR';
export const DEFAULT_ROUNDING_STEP = 500;

export const DEFAULT_TARGET_MARGINS = {
  safe: 0.25,
  ideal: 0.40,
  premium: 0.55
};

export const DEFAULT_PROFIT_STATUS_THRESHOLDS = {
  loss: 0,
  low: 15,
  okay: 30,
  good: 50
};

export const COST_CATEGORIES = [
  { value: 'ingredient', labelId: 'Bahan', labelEn: 'Ingredient', descriptionId: 'Bahan baku utama', descriptionEn: 'Main raw materials' },
  { value: 'packaging', labelId: 'Kemasan', labelEn: 'Packaging', descriptionId: 'Biaya wadah atau plastik', descriptionEn: 'Containers or plastic costs' },
  { value: 'labor', labelId: 'Tenaga Kerja', labelEn: 'Labor', descriptionId: 'Gaji karyawan atau tukang masak', descriptionEn: 'Staff or cook wages' },
  { value: 'operational', labelId: 'Operasional', labelEn: 'Operational', descriptionId: 'Gas, listrik, air', descriptionEn: 'Gas, electricity, water' },
  { value: 'sales', labelId: 'Penjualan', labelEn: 'Sales', descriptionId: 'Biaya marketing atau diskon', descriptionEn: 'Marketing or discount costs' },
  { value: 'other', labelId: 'Lainnya', labelEn: 'Other', descriptionId: 'Biaya lainnya', descriptionEn: 'Other costs' }
];

export const SELLING_UNITS = [
  { value: 'pcs', labelId: 'Pcs', labelEn: 'Pcs' },
  { value: 'porsi', labelId: 'Porsi', labelEn: 'Portion' },
  { value: 'cup', labelId: 'Cup', labelEn: 'Cup' },
  { value: 'botol', labelId: 'Botol', labelEn: 'Bottle' },
  { value: 'box', labelId: 'Box', labelEn: 'Box' },
  { value: 'pack', labelId: 'Pack', labelEn: 'Pack' },
  { value: 'tray', labelId: 'Tray', labelEn: 'Tray' },
  { value: 'slice', labelId: 'Slice', labelEn: 'Slice' },
  { value: 'jar', labelId: 'Jar', labelEn: 'Jar' },
  { value: 'liter', labelId: 'Liter', labelEn: 'Liter' },
  { value: 'ml', labelId: 'mL', labelEn: 'mL' },
  { value: 'gram', labelId: 'Gram', labelEn: 'Gram' },
  { value: 'kg', labelId: 'Kg', labelEn: 'Kg' },
  { value: 'custom', labelId: 'Kustom', labelEn: 'Custom' }
];

export const VALID_LANGUAGES = ['id', 'en'];
