import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../ui/Card';
import { Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { StorageUsageCard } from './StorageUsageCard';

export const DataHealthPanel = ({ health }) => {
  const { t } = useLanguage();

  if (!health) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3.5 px-2 pb-3 border-b border-border-soft/60 mb-4">
        <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl shrink-0 flex items-center justify-center">
          <Activity className="w-5.5 h-5.5" />
        </div>
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-text-primary leading-tight">
            {t('dataBackup.localStorageHealth', 'Kesehatan Data')}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-text-secondary mt-0.5">
            {t('dataBackup.healthDesc', 'Pantau ukuran dan kualitas data lokal.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StorageUsageCard 
          sizeBytes={health.modalingSizeBytes}
          formattedSize={health.formattedSize}
          status={health.status}
        />

        <Card className="p-5 border-border/80 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mb-4 pb-2 border-b border-border-soft">Issues & Warnings</h4>
            {health.issues && health.issues.length > 0 ? (
              <div className="space-y-2">
                {health.issues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-xs sm:text-sm text-amber-800 font-semibold leading-relaxed">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center h-32">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-full mb-3 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <p className="text-xs sm:text-sm text-text-secondary font-bold">
                  {t('dataBackup.noIssuesFound', 'Tidak ada masalah ditemukan.')}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
