export const formatStockQuantity = (quantity, unit = '') => {
  const numeric = Number(quantity) || 0;
  const formatted = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2
  }).format(numeric);
  return `${formatted}${unit ? ` ${unit}` : ''}`;
};

export const formatMovementType = (type) => {
  const labels = {
    opening_balance: 'Saldo Awal',
    stock_in: 'Stok Masuk',
    stock_out: 'Stok Keluar',
    adjustment: 'Penyesuaian',
    waste: 'Waste',
    correction: 'Koreksi'
  };
  return labels[type] || type || '-';
};

export const formatStockStatus = (status) => {
  const labels = {
    ok: 'Aman',
    low: 'Stok Rendah',
    out: 'Stok Habis',
    not_tracked: 'Tidak Dipantau'
  };
  return labels[status] || status || '-';
};

export const getStockStatusTone = (status) => {
  const tones = {
    ok: 'good',
    low: 'low',
    out: 'danger',
    not_tracked: 'neutral'
  };
  return tones[status] || 'neutral';
};
