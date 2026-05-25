import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { AlertCircle, Download, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const BackupReminderBanner = ({ reminder, onExport, onDismiss }) => {
  const { t } = useLanguage();

  if (!reminder || !reminder.shouldShow) return null;

  return (
    <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-4 mb-6 relative">
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="absolute top-2 right-2 p-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <X size={16} />
        </button>
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="p-3 bg-white rounded-full text-brand-primary shrink-0">
          <AlertCircle size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-brand-primary mb-1">
            {t('backupReminderTitle', 'Jangan Lupa Backup!')}
          </h4>
          <p className="text-sm text-text-secondary">
            {reminder.reason === 'no_backup_yet' 
              ? t('backupReminderBodyNoBackup', 'Anda memiliki banyak data penting tapi belum pernah melakukan backup.')
              : t('backupReminderBodyStale', 'Sudah lama sejak backup terakhir Anda. Jaga data Anda tetap aman.')}
          </p>
        </div>
        <div className="shrink-0 w-full sm:w-auto">
          <Button onClick={onExport} className="w-full sm:w-auto flex items-center justify-center gap-2">
            <Download size={18} />
            {t('backupNow', 'Backup Sekarang')}
          </Button>
        </div>
      </div>
    </div>
  );
};
