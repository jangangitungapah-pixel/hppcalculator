import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AlertTriangle, Info, Check } from 'lucide-react';

export const ImportPreviewPanel = ({ 
  preview, 
  mode, 
  setMode, 
  includeSettings, 
  setIncludeSettings, 
  onApply,
  onCancel
}) => {
  const { t, lang } = useLanguage();

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Unknown') return 'Unknown';
    try {
      return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const hasConflicts = Object.values(preview.conflicts).some(v => v > 0);

  return (
    <Card className="p-6 border-brand-primary ring-2 ring-brand-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-text-primary">
          {t('previewBeforeImport', 'Preview Import')}
        </h3>
        <span className="text-xs bg-ui-surface px-2 py-1 rounded-full text-text-secondary border">
          {t('backupVersion', 'Versi')}: {preview.version}
        </span>
      </div>

      <div className="bg-ui-surface p-4 rounded-lg mb-6 text-sm">
        <div className="flex justify-between mb-2">
          <span className="text-text-secondary">{t('exportedAt', 'Tanggal Export')}:</span>
          <span className="font-medium">{formatDate(preview.exportedAt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">{t('totalRecords', 'Total Data')}:</span>
          <span className="font-medium">{preview.totalRecords}</span>
        </div>
      </div>

      {hasConflicts && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-6 flex gap-3 text-sm text-yellow-800">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <p>{t('conflictsFound', 'Ditemukan data duplikat dengan ID yang sama di perangkat ini. Pilih mode import di bawah.')}</p>
        </div>
      )}

      <div className="mb-6">
        <p className="font-semibold text-text-primary mb-3">
          {t('chooseImportMode', 'Pilih Mode Import')}
        </p>
        
        <div className="space-y-3">
          <label className={`flex p-4 border rounded-xl cursor-pointer transition-colors ${mode === 'merge' ? 'border-brand-primary bg-brand-primary/5' : 'border-ui-border hover:border-text-tertiary'}`}>
            <input 
              type="radio" 
              name="importMode" 
              value="merge" 
              checked={mode === 'merge'} 
              onChange={() => setMode('merge')}
              className="mt-1"
            />
            <div className="ml-3">
              <p className="font-semibold text-text-primary">{t('mergeMode', 'Merge (Gabung Data)')}</p>
              <p className="text-sm text-text-secondary mt-1">
                {t('importWillMerge', 'Data baru akan ditambahkan. Data yang sudah ada tidak akan diubah atau dihapus.')}
              </p>
            </div>
          </label>

          <label className={`flex p-4 border rounded-xl cursor-pointer transition-colors ${mode === 'replace' ? 'border-red-500 bg-red-50' : 'border-ui-border hover:border-text-tertiary'}`}>
            <input 
              type="radio" 
              name="importMode" 
              value="replace" 
              checked={mode === 'replace'} 
              onChange={() => setMode('replace')}
              className="mt-1"
            />
            <div className="ml-3">
              <p className="font-semibold text-text-primary">{t('replaceMode', 'Replace (Timpa Semua Data)')}</p>
              <p className="text-sm text-red-600 mt-1">
                {t('importWillReplace', 'PERHATIAN: Semua data bisnis di perangkat ini akan DITIMPA dengan data dari backup ini.')}
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-3 p-3 bg-ui-surface rounded-lg border border-ui-border cursor-pointer">
          <input 
            type="checkbox" 
            checked={includeSettings} 
            onChange={(e) => setIncludeSettings(e.target.checked)}
            className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
          />
          <div>
            <p className="font-medium text-text-primary text-sm">{t('includeSettings', 'Sertakan Pengaturan')}</p>
            <p className="text-xs text-text-secondary">{t('includeSettingsDesc', 'Timpa pengaturan bahasa, pembulatan, dll dengan versi backup.')}</p>
          </div>
        </label>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-ui-border">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>
          {t('cancel', 'Batal')}
        </Button>
        <Button 
          variant={mode === 'replace' ? 'danger' : 'primary'} 
          className="flex-1 flex justify-center items-center gap-2" 
          onClick={onApply}
        >
          <Check size={18} />
          {t('applyImport', 'Terapkan Import')}
        </Button>
      </div>
    </Card>
  );
};
