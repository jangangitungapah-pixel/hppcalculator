import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Download, CheckCircle2, XCircle } from 'lucide-react';

export const ExportBackupCard = ({ moduleCounts, onExport }) => {
  const { t } = useLanguage();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg">
          <Download size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-text-primary">
            {t('exportBackup', 'Export Backup')}
          </h3>
          <p className="text-sm text-text-secondary">
            {t('exportBackupDesc', 'Simpan semua data ke dalam file JSON.')}
          </p>
        </div>
      </div>

      <div className="bg-ui-surface rounded-lg p-4 mb-6 border border-ui-border">
        <p className="text-sm font-semibold text-text-primary mb-3">
          {t('backupIncludes', 'Yang Termasuk:')}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-500" />
            <span>{t('calculations', 'Kalkulasi')} ({moduleCounts.calculations || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-500" />
            <span>{t('ingredients', 'Bahan')} ({moduleCounts.ingredients || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-500" />
            <span>{t('recipes', 'Resep')} ({moduleCounts.recipes || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-500" />
            <span>{t('products', 'Produk')} ({moduleCounts.products || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-500" />
            <span>{t('channelProfiles', 'Profil Channel')} ({moduleCounts.channelProfiles || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-500" />
            <span>{t('pricingSimulations', 'Simulasi Harga')} ({moduleCounts.pricingSimulations || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-500" />
            <span>{t('bundleSimulations', 'Paket Bundle')} ({moduleCounts.bundleSimulations || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-500" />
            <span>{t('settings', 'Pengaturan')}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-ui-border flex items-center gap-2 text-sm text-text-tertiary">
          <XCircle size={14} className="text-red-400" />
          <span>{t('backupExcludesDraft', 'Draft kalkulator yang belum disimpan tidak termasuk.')}</span>
        </div>
      </div>

      <Button onClick={onExport} className="w-full sm:w-auto flex items-center justify-center gap-2">
        <Download size={18} />
        {t('exportBackupJson', 'Download JSON Backup')}
      </Button>
    </Card>
  );
};
