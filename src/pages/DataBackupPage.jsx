import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useDataBackup } from '../hooks/useDataBackup';
import { AppHeader } from '../components/layout/AppHeader';

import { BackupSummaryCard } from '../components/backup/BackupSummaryCard';
import { ExportBackupCard } from '../components/backup/ExportBackupCard';
import { ImportBackupCard } from '../components/backup/ImportBackupCard';
import { ImportPreviewPanel } from '../components/backup/ImportPreviewPanel';
import { ExportCsvCenter } from '../components/backup/ExportCsvCenter';
import { DataHealthPanel } from '../components/backup/DataHealthPanel';
import { ResetDataPanel } from '../components/backup/ResetDataPanel';
import { Database, Download, Upload, History, Info } from 'lucide-react';

export const DataBackupPage = () => {
  const { t, lang } = useLanguage();
  const { 
    backupMeta, 
    storageHealth, 
    exportBackup, 
    previewImportFile, 
    applyImport, 
    exportCsvModule, 
    resetAllData, 
    resetModuleData, 
    resetDraft 
  } = useDataBackup();

  const [previewData, setPreviewData] = useState(null);
  const [importMode, setImportMode] = useState('merge');
  const [includeSettings, setIncludeSettings] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const handleFilePreview = async (file) => {
    const preview = await previewImportFile(file);
    if (preview) {
      setPreviewData(preview);
      // Reset modes on new file
      setImportMode('merge');
      setIncludeSettings(false);
    }
  };

  const handleApplyImport = () => {
    if (previewData && previewData.backup) {
      const success = applyImport(previewData.backup, { 
        mode: importMode, 
        includeSettings 
      });
      if (success) {
        setPreviewData(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-cream pb-20 lg:pb-8">
      <AppHeader title={t('nav.dataBackup')} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-text-primary mb-1 tracking-tight">
            {t('dataBackup.dataBackupTitle', 'Kelola Data & Backup')}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-text-secondary">
            {t('dataBackup.dataBackupSubtitle', 'Amankan data Anda secara lokal, pindahkan antar perangkat, atau export untuk diolah lebih lanjut.')}
          </p>
        </div>

        <div className="mb-6 p-4 bg-sky-500/5 border border-sky-500/10 text-sky-800 rounded-2xl text-xs sm:text-sm leading-relaxed flex gap-3 items-start">
          <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-extrabold text-sky-950 block mb-0.5">Catatan Sinkronisasi</strong>
            Meskipun Anda mengaktifkan Cloud Sync, pencadangan manual dalam format JSON (Local Backup) tetap sangat disarankan sebagai cadangan tambahan yang aman.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <BackupSummaryCard 
            title={t('dataBackup.businessRecords', 'Total Data Bisnis')}
            value={storageHealth.backupReminder.totalBusinessRecords}
            icon={Database}
          />
          <BackupSummaryCard 
            title={t('dataBackup.lastBackup', 'Backup Terakhir')}
            value={formatDate(backupMeta.lastBackupAt) === '-' ? t('dataBackup.neverBackedUp', 'Belum Pernah') : formatDate(backupMeta.lastBackupAt).split(',')[0]}
            helper={formatDate(backupMeta.lastBackupAt) !== '-' ? formatDate(backupMeta.lastBackupAt).split(',')[1] : ''}
            icon={Download}
            tone={!backupMeta.lastBackupAt && storageHealth.backupReminder.totalBusinessRecords > 5 ? 'warning' : 'default'}
          />
          <BackupSummaryCard 
            title={t('dataBackup.lastImport', 'Import Terakhir')}
            value={formatDate(backupMeta.lastImportAt) === '-' ? t('dataBackup.neverImported', 'Belum Pernah') : formatDate(backupMeta.lastImportAt).split(',')[0]}
            helper={formatDate(backupMeta.lastImportAt) !== '-' ? formatDate(backupMeta.lastImportAt).split(',')[1] : ''}
            icon={Upload}
          />
          <BackupSummaryCard 
            title={t('dataBackup.localStorageHealth', 'Status Storage')}
            value={storageHealth.status === 'healthy' ? t('dataBackup.healthHealthy', 'Sehat') : storageHealth.status === 'warning' ? t('dataBackup.healthWarning', 'Peringatan') : t('dataBackup.healthDanger', 'Kritis')}
            helper={storageHealth.formattedSize}
            icon={History}
            tone={storageHealth.status}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-8">
            <ExportBackupCard 
              moduleCounts={storageHealth.modules}
              onExport={exportBackup}
            />
            
            {previewData ? (
              <ImportPreviewPanel 
                preview={previewData.validation.summary}
                mode={importMode}
                setMode={setImportMode}
                includeSettings={includeSettings}
                setIncludeSettings={setIncludeSettings}
                onApply={handleApplyImport}
                onCancel={() => setPreviewData(null)}
              />
            ) : (
              <ImportBackupCard onFilePreview={handleFilePreview} />
            )}
          </div>
          
          <div className="space-y-8">
            <ExportCsvCenter 
              modules={storageHealth.modules}
              onExportModule={exportCsvModule}
            />
            <DataHealthPanel health={storageHealth} />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ui-border">
          <ResetDataPanel 
            modules={storageHealth.modules}
            onResetModule={resetModuleData}
            onResetAll={resetAllData}
            onResetDraft={resetDraft}
          />
        </div>

      </main>
    </div>
  );
};
