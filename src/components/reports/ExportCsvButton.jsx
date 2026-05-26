import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import { Button } from '../ui/Button';

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
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={disabled}
      loading={isExporting}
      leftIcon={<Download className="w-4 h-4" />}
    >
      {t('reports.exportCsv')}
    </Button>
  );
};
