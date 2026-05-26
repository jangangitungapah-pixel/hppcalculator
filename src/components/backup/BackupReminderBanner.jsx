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
        <Button 
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="absolute top-2 right-2 p-2 text-text-secondary hover:text-text-primary transition-colors w-8 h-8 rounded-full"
          aria-label="Tutup"
        >
          <X size={16} />
        </Button>
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="p-3 bg-white rounded-full text-brand-primary shrink-0">
          <AlertCircle size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-brand-primary mb-1">
            {t('dataBackup.backupReminderTitle', 'Jangan Lupa Backup!')}
          </h4>
          <p className="text-sm text-text-secondary">
            {reminder.reason === 'no_backup_yet' 
              ? t('dataBackup.backupReminderBodyNoBackup', 'Anda memiliki banyak data penting tapi belum pernah melakukan backup.')
              : t('dataBackup.backupReminderBodyStale', 'Sudah lama sejak backup terakhir Anda. Jaga data Anda tetap aman.')}
          </p>
        </div>
        <div className="shrink-0 w-full sm:w-auto">
          <Button 
            onClick={onExport} 
            className="w-full sm:w-auto"
            leftIcon={<Download className="w-5 h-5" />}
          >
            {t('dataBackup.backupNow', 'Backup Sekarang')}
          </Button>
        </div>
      </div>
    </div>
  );
};
