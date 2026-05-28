import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Download, CheckCircle2, XCircle } from 'lucide-react';

export const ExportBackupCard = ({ moduleCounts, onExport }) => {
  const { t, lang } = useLanguage();

  const labels = {
    id: {
      calculations: "Kalkulasi",
      ingredients: "Bahan Baku",
      recipes: "Resep",
      products: "Produk/Menu",
      channelProfiles: "Profil Channel",
      pricingSimulations: "Simulasi Harga",
      bundleSimulations: "Paket Bundle",
      settings: "Pengaturan"
    },
    en: {
      calculations: "Calculations",
      ingredients: "Ingredients",
      recipes: "Recipes",
      products: "Products/Menu",
      channelProfiles: "Channel Profiles",
      pricingSimulations: "Pricing Simulations",
      bundleSimulations: "Bundle Simulations",
      settings: "Settings"
    }
  };

  const getLabel = (key) => labels[lang]?.[key] || labels['id'][key];

  return (
    <Card className="p-5 sm:p-6 border-border/80 rounded-3xl shadow-xs">
      <div className="flex items-center gap-3.5 mb-4 pb-3 border-b border-border-soft">
        <div className="p-2 bg-orange-500/10 text-brand-primary rounded-xl shrink-0 flex items-center justify-center">
          <Download className="w-5.5 h-5.5" />
        </div>
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-text-primary">
            {t('dataBackup.exportBackup', 'Export Backup')}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-text-secondary mt-0.5 leading-relaxed">
            {t('dataBackup.exportBackupDesc', 'Simpan semua data ke dalam file JSON.')}
          </p>
        </div>
      </div>

      <div className="bg-surface-cream rounded-2xl p-4.5 mb-5 border border-border-soft">
        <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mb-3">
          {t('dataBackup.backupIncludes', 'Yang Termasuk:')}
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-text-secondary">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">{getLabel('calculations')} ({moduleCounts.calculations?.count || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">{getLabel('ingredients')} ({moduleCounts.ingredients?.count || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">{getLabel('recipes')} ({moduleCounts.recipes?.count || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">{getLabel('products')} ({moduleCounts.products?.count || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">{getLabel('channelProfiles')} ({moduleCounts.channelProfiles?.count || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">{getLabel('pricingSimulations')} ({moduleCounts.pricingSimulations?.count || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">{getLabel('bundleSimulations')} ({moduleCounts.bundleSimulations?.count || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">{getLabel('settings')}</span>
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-border-soft flex items-start gap-2 text-xs font-semibold text-text-secondary leading-relaxed">
          <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span>{t('dataBackup.backupExcludesDraft', 'Draft kalkulator yang belum disimpan tidak termasuk.')}</span>
        </div>
      </div>

      <Button 
        onClick={onExport} 
        className="w-full sm:w-auto flex items-center justify-center gap-2 h-11 text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/10 transition-all"
      >
        <Download className="w-4.5 h-4.5" />
        {t('dataBackup.exportBackupJson', 'Download JSON Backup')}
      </Button>
    </Card>
  );
};
