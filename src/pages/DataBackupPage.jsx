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
import { Database, Download, Upload, History } from 'lucide-react';

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
    <div className="min-h-screen bg-ui-surface pb-20 lg:pb-8">
      <AppHeader title={t('dataBackup', 'Data & Backup')} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {t('dataBackupTitle', 'Kelola Data & Backup')}
          </h2>
          <p className="text-text-secondary">
            {t('dataBackupSubtitle', 'Amankan data Anda secara lokal, pindahkan antar perangkat, atau export untuk diolah lebih lanjut.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <BackupSummaryCard 
            title={t('businessRecords', 'Total Data Bisnis')}
            value={storageHealth.backupReminder.totalBusinessRecords}
            icon={Database}
          />
          <BackupSummaryCard 
            title={t('lastBackup', 'Backup Terakhir')}
            value={formatDate(backupMeta.lastBackupAt) === '-' ? 'Belum Pernah' : formatDate(backupMeta.lastBackupAt).split(',')[0]}
            helper={formatDate(backupMeta.lastBackupAt) !== '-' ? formatDate(backupMeta.lastBackupAt).split(',')[1] : ''}
            icon={Download}
            tone={!backupMeta.lastBackupAt && storageHealth.backupReminder.totalBusinessRecords > 5 ? 'warning' : 'default'}
          />
          <BackupSummaryCard 
            title={t('lastImport', 'Import Terakhir')}
            value={formatDate(backupMeta.lastImportAt) === '-' ? 'Belum Pernah' : formatDate(backupMeta.lastImportAt).split(',')[0]}
            helper={formatDate(backupMeta.lastImportAt) !== '-' ? formatDate(backupMeta.lastImportAt).split(',')[1] : ''}
            icon={Upload}
          />
          <BackupSummaryCard 
            title={t('localStorageHealth', 'Status Storage')}
            value={storageHealth.status === 'healthy' ? 'Sehat' : storageHealth.status === 'warning' ? 'Peringatan' : 'Kritis'}
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
