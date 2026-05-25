import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';

export const ExportCsvButton = ({ onExport, disabled }) => {
  const { t } = useLanguage();
  const toast = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (disabled || isExporting) return;
    setIsExporting(true);
    
    try {
      await onExport();
      toast.success(t('reports.exportSuccess'));
    } catch (err) {
      toast.error('Gagal export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || isExporting}
      className={`
        flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors
        ${disabled || isExporting
          ? 'bg-surface-muted text-text-tertiary cursor-not-allowed'
          : 'bg-white border border-border text-text-secondary hover:text-brand-primary hover:border-brand-primary/30 shadow-sm'}
      `}
    >
      <Download className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
      <span>{isExporting ? '...' : t('reports.exportCsv')}</span>
    </button>
  );
};
