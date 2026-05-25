export const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  // If value contains a comma, newline, or double quote, wrap it in double quotes and escape internal quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export const convertRowsToCsv = (rows) => {
  if (!rows || rows.length === 0) return '';
  return rows.map(row => row.map(escapeCsvValue).join(',')).join('\n');
};

export const downloadCsv = (filename, csvString) => {
  if (typeof window === 'undefined' || !window.document) return false;
  
  try {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
    
    return true;
  } catch (err) {
    console.error('Failed to download CSV', err);
    return false;
  }
};

export const buildProfitabilityCsvRows = (reportItems) => {
  if (!reportItems || reportItems.length === 0) return [];
  
  const headers = [
    'Tipe', 'Nama', 'Kategori/Channel', 'HPP (Rp)', 'Harga Jual (Rp)', 
    'Profit/Unit (Rp)', 'Margin (%)', 'Status', 'Tanggal Dibuat'
  ];
  
  const rows = reportItems.map(item => [
    item.type || '',
    item.name || '',
    item.category || item.channelType || '',
    item.hppPerUnit || 0,
    item.sellingPrice || '',
    item.profitPerUnit || '',
    item.marginPercent !== null ? item.marginPercent.toFixed(2) : '',
    item.statusKey || '',
    item.createdAt ? new Date(item.createdAt).toLocaleString() : ''
  ]);
  
  return [headers, ...rows];
};

export const buildRecommendationsCsvRows = (recommendations) => {
  if (!recommendations) return [];
  
  const headers = [
    'Item', 'Prioritas', 'Tipe', 'Pesan'
  ];
  
  const rows = recommendations.map(rec => [
    rec.itemName || '',
    rec.severity || '',
    rec.titleId || '',
    rec.messageId || ''
  ]);
  
  return [headers, ...rows];
};

export const exportReportToCsv = ({ reportItems, recommendations, period = 'all', prefix = 'modalin-report' }) => {
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `${prefix}-${period}-${dateStr}.csv`;
  
  let csvContent = "";
  
  if (reportItems && reportItems.length > 0) {
    csvContent += "=== DATA PRODUK & SIMULASI ===\n";
    csvContent += convertRowsToCsv(buildProfitabilityCsvRows(reportItems));
    csvContent += "\n\n";
  }
  
  if (recommendations && recommendations.length > 0) {
    csvContent += "=== REKOMENDASI BISNIS ===\n";
    csvContent += convertRowsToCsv(buildRecommendationsCsvRows(recommendations));
  }
  
  if (!csvContent) {
    csvContent = "Tidak ada data untuk diekspor.";
  }
  
  return downloadCsv(filename, csvContent);
};
