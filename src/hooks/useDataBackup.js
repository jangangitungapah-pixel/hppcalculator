import { useState, useCallback, useEffect } from 'react';
import { useAppData } from './useAppData';
import { useToast } from './useToast';
import { useLanguage } from './useLanguage';
import {
  getBackupMeta,
  getStorageHealth,
  exportModalinBackup,
  validateBackupFile,
  importModalinBackup,
  exportModuleToCsv,
  resetAllBusinessData,
  resetModule,
  resetCalculatorDraft,
  readJsonFile
} from '../lib/dataPortability';

export const useDataBackup = () => {
  const appData = useAppData();
  const { addToast } = useToast();
  const { t } = useLanguage();
  
  const [backupMeta, setBackupMeta] = useState(getBackupMeta());
  const [storageHealth, setStorageHealth] = useState(getStorageHealth(appData));
  
  const refreshBackupState = useCallback(() => {
    setBackupMeta(getBackupMeta());
    setStorageHealth(getStorageHealth(appData));
  }, [appData]);

  // Sync state if appData changes (e.g. from other actions)
  useEffect(() => {
    refreshBackupState();
  }, [appData, refreshBackupState]);

  const exportBackup = useCallback(() => {
    try {
      exportModalinBackup(appData);
      refreshBackupState();
      addToast({
        title: t('backupExportedTitle', 'Backup Berhasil'),
        message: t('backupExportedMessage', 'Data Anda berhasil diekspor ke format JSON.'),
        type: 'success'
      });
      return true;
    } catch (err) {
      addToast({
        title: 'Error',
        message: err.message || 'Failed to export backup.',
        type: 'error'
      });
      return false;
    }
  }, [appData, refreshBackupState, addToast, t]);

  const previewImportFile = useCallback(async (file) => {
    try {
      const json = await readJsonFile(file);
      const validation = validateBackupFile(json);
      
      if (!validation.isValid) {
        addToast({
          title: t('fileInvalid', 'File Tidak Valid'),
          message: validation.errors.join(', '),
          type: 'error'
        });
        return null;
      }
      
      return { backup: json, validation };
    } catch (err) {
       addToast({
          title: t('fileInvalid', 'File Tidak Valid'),
          message: err.message,
          type: 'error'
        });
        return null;
    }
  }, [addToast, t]);

  const applyImport = useCallback((backup, options) => {
    try {
      const result = importModalinBackup(backup, appData, options);
      if (result.success) {
        // Refresh full app data!
        appData.refreshData();
        refreshBackupState();
        addToast({
          title: t('backupImportSuccessTitle', 'Import Berhasil'),
          message: t('backupImportSuccessMessage', 'Data berhasil di-restore.'),
          type: 'success'
        });
        return true;
      } else {
        addToast({
          title: t('backupImportFailedTitle', 'Import Gagal'),
          message: result.errors?.join(', ') || 'Unknown error',
          type: 'error'
        });
        return false;
      }
    } catch (err) {
      addToast({
          title: t('backupImportFailedTitle', 'Import Gagal'),
          message: err.message,
          type: 'error'
      });
      return false;
    }
  }, [appData, refreshBackupState, addToast, t]);

  const exportCsvModule = useCallback((moduleName) => {
    try {
      const data = appData[moduleName];
      const success = exportModuleToCsv(moduleName, data);
      if (success) {
        addToast({
          title: t('csvExportedTitle', 'CSV Diekspor'),
          message: t('csvExportedMessage', 'Data berhasil diekspor ke CSV.'),
          type: 'success'
        });
        return true;
      } else {
        addToast({
          title: 'Error',
          message: t('noDataToExport', 'Tidak ada data untuk diekspor.'),
          type: 'error'
        });
        return false;
      }
    } catch (err) {
      addToast({
        title: 'Error',
        message: err.message,
        type: 'error'
      });
      return false;
    }
  }, [appData, addToast, t]);

  const resetAllData = useCallback(() => {
    const success = resetAllBusinessData();
    if (success) {
      appData.refreshData();
      refreshBackupState();
      addToast({
        title: t('dataResetTitle', 'Data Direset'),
        message: t('dataResetMessage', 'Semua data bisnis telah dihapus.'),
        type: 'success'
      });
      return true;
    }
    return false;
  }, [appData, refreshBackupState, addToast, t]);

  const resetModuleData = useCallback((moduleName) => {
    const success = resetModule(moduleName);
    if (success) {
      appData.refreshData();
      refreshBackupState();
      addToast({
        title: t('moduleResetTitle', 'Modul Direset'),
        message: t('moduleResetMessage', 'Data modul telah dihapus.'),
        type: 'success'
      });
      return true;
    }
    return false;
  }, [appData, refreshBackupState, addToast, t]);

  const resetDraft = useCallback(() => {
    const success = resetCalculatorDraft();
    if (success) {
      appData.refreshData();
      addToast({
        title: t('moduleResetTitle', 'Draft Direset'),
        message: t('moduleResetMessage', 'Data draft kalkulator telah dihapus.'),
        type: 'success'
      });
      return true;
    }
    return false;
  }, [appData, addToast, t]);

  return {
    backupMeta,
    storageHealth,
    exportBackup,
    previewImportFile,
    applyImport,
    exportCsvModule,
    resetAllData,
    resetModuleData,
    resetDraft,
    refreshBackupState
  };
};
