export const downloadTextFile = (filename, content, mimeType = 'text/plain') => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (err) {
    console.error('Download failed:', err);
  }
};

export const downloadJsonFile = (filename, object) => {
  const content = JSON.stringify(object, null, 2);
  downloadTextFile(filename, content, 'application/json');
};

export const downloadCsvFile = (filename, csvString) => {
  // Use UTF-8 with BOM for Excel compatibility
  const bom = '\\uFEFF';
  downloadTextFile(filename, bom + csvString, 'text/csv;charset=utf-8;');
};
