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
    <Card className="p-5 sm:p-6 border-brand-primary/30 ring-4 ring-brand-primary/10 rounded-3xl shadow-xs">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-border-soft">
        <h3 className="font-extrabold text-base sm:text-lg text-text-primary">
          {t('dataBackup.previewBeforeImport', 'Preview Import')}
        </h3>
        <span className="text-[10px] uppercase font-black bg-surface px-2.5 py-0.5 rounded-full text-text-secondary border border-border-soft shrink-0 tracking-wider">
          {t('dataBackup.backupVersion', 'Versi')}: {preview.version}
        </span>
      </div>

      <div className="bg-surface-cream p-4 rounded-2xl mb-5 border border-border-soft text-xs sm:text-sm font-semibold text-text-secondary">
        <div className="flex justify-between mb-2.5">
          <span>{t('dataBackup.exportedAt', 'Tanggal Export')}:</span>
          <span className="font-bold text-text-primary">{formatDate(preview.exportedAt)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('dataBackup.totalRecords', 'Total Data')}:</span>
          <span className="font-bold text-text-primary">{preview.totalRecords}</span>
        </div>
      </div>

      {hasConflicts && (
        <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl mb-5 flex gap-3 text-xs sm:text-sm text-amber-800 leading-relaxed font-semibold">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>{t('dataBackup.conflictsFound', 'Ditemukan data duplikat dengan ID yang sama di perangkat ini. Pilih mode import di bawah.')}</p>
        </div>
      )}

      <div className="mb-5">
        <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mb-3">
          {t('dataBackup.chooseImportMode', 'Pilih Mode Import')}
        </p>
        
        <div className="space-y-3">
          <label className={`flex p-4 border rounded-2xl cursor-pointer transition-all ${mode === 'merge' ? 'border-brand-primary bg-orange-500/5 shadow-xs' : 'border-border-soft bg-surface hover:border-border'}`}>
            <input 
              type="radio" 
              name="importMode" 
              value="merge" 
              checked={mode === 'merge'} 
              onChange={() => setMode('merge')}
              className="mt-1 text-brand-primary focus:ring-brand-primary shrink-0"
            />
            <div className="ml-3">
              <p className="font-bold text-sm text-text-primary">{t('dataBackup.mergeMode', 'Merge (Gabung Data)')}</p>
              <p className="text-xs font-semibold text-text-secondary mt-1 leading-relaxed">
                {t('dataBackup.importWillMerge', 'Data baru akan ditambahkan. Data yang sudah ada tidak akan diubah atau dihapus.')}
              </p>
            </div>
          </label>

          <label className={`flex p-4 border rounded-2xl cursor-pointer transition-all ${mode === 'replace' ? 'border-red-500/30 bg-red-500/5 shadow-xs' : 'border-border-soft bg-surface hover:border-border'}`}>
            <input 
              type="radio" 
              name="importMode" 
              value="replace" 
              checked={mode === 'replace'} 
              onChange={() => setMode('replace')}
              className="mt-1 text-red-600 focus:ring-red-500 shrink-0"
            />
            <div className="ml-3">
              <p className="font-bold text-sm text-text-primary">{t('dataBackup.replaceMode', 'Replace (Timpa Semua Data)')}</p>
              <p className="text-xs font-semibold text-red-700 mt-1 leading-relaxed">
                {t('dataBackup.importWillReplace', 'PERHATIAN: Semua data bisnis di perangkat ini akan DITIMPA dengan data dari backup ini.')}
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="mb-5">
        <label className="flex items-start gap-3 p-4 bg-surface-cream rounded-2xl border border-border-soft cursor-pointer transition-all hover:border-border">
          <input 
            type="checkbox" 
            checked={includeSettings} 
            onChange={(e) => setIncludeSettings(e.target.checked)}
            className="w-4.5 h-4.5 text-brand-primary border-border-soft rounded focus:ring-brand-primary/20 shrink-0 mt-0.5"
          />
          <div>
            <p className="font-bold text-text-primary text-sm">{t('dataBackup.includeSettings', 'Sertakan Pengaturan')}</p>
            <p className="text-xs font-semibold text-text-secondary mt-0.5 leading-relaxed">{t('dataBackup.includeSettingsDesc', 'Timpa pengaturan bahasa, pembulatan, dll dengan versi backup.')}</p>
          </div>
        </label>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border-soft">
        <Button 
          variant="secondary" 
          className="flex-1 h-11 text-xs sm:text-sm font-bold border border-border bg-surface-cream text-text-secondary hover:bg-border/20 rounded-xl" 
          onClick={onCancel}
        >
          {t('cancel', 'Batal')}
        </Button>
        <Button 
          variant={mode === 'replace' ? 'danger' : 'primary'} 
          className={`flex-1 flex justify-center items-center gap-2 h-11 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all ${
            mode === 'replace' ? 'shadow-red-500/10' : 'shadow-orange-500/10'
          }`} 
          onClick={onApply}
        >
          <Check className="w-4.5 h-4.5" />
          {t('dataBackup.applyImport', 'Terapkan Import')}
        </Button>
      </div>
    </Card>
  );
};
