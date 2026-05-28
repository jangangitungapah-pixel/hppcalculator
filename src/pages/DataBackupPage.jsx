import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useDataBackup } from '../hooks/useDataBackup';
import { PageContainer } from '../components/layout/PageContainer';

import { BackupSummaryCard } from '../components/backup/BackupSummaryCard';
import { ExportBackupCard } from '../components/backup/ExportBackupCard';
import { ImportBackupCard } from '../components/backup/ImportBackupCard';
import { ImportPreviewPanel } from '../components/backup/ImportPreviewPanel';
import { ExportCsvCenter } from '../components/backup/ExportCsvCenter';
import { DataHealthPanel } from '../components/backup/DataHealthPanel';
import { ResetDataPanel } from '../components/backup/ResetDataPanel';
import { Database, Download, Upload, History, Info, ShieldCheck } from 'lucide-react';

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
    <PageContainer maxWidth="max-w-6xl" className="data-backup-page">
      <section className="app-page-hero data-backup-hero">
        <div className="app-page-hero-main">
          <div className="app-page-eyebrow">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            {t('nav.dataBackup')}
          </div>
          <h2 className="app-page-title">
            {t('dataBackup.dataBackupTitle', 'Kelola Data & Backup')}
          </h2>
          <p className="app-page-subtitle">
            {t('dataBackup.dataBackupSubtitle', 'Amankan data Anda secara lokal, pindahkan antar perangkat, atau export untuk diolah lebih lanjut.')}
          </p>
        </div>
        <div className="app-page-note">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <strong>Catatan Sinkronisasi</strong>
            <span>Meskipun Cloud Sync aktif, backup JSON manual tetap disarankan sebagai cadangan tambahan.</span>
          </div>
        </div>
      </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="space-y-5">
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
          
          <div className="space-y-5">
            <ExportCsvCenter 
              modules={storageHealth.modules}
              onExportModule={exportCsvModule}
            />
            <DataHealthPanel health={storageHealth} />
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-ui-border">
          <ResetDataPanel 
            modules={storageHealth.modules}
            onResetModule={resetModuleData}
            onResetAll={resetAllData}
            onResetDraft={resetDraft}
          />
        </div>
    </PageContainer>
  );
};
