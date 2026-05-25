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
      <div className="flex items-center gap-3 px-2">
        <div className="p-2 bg-text-primary text-white rounded-lg">
          <Activity size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-text-primary">
            {t('localStorageHealth', 'Kesehatan Data')}
          </h3>
          <p className="text-sm text-text-secondary">
            {t('healthDesc', 'Pantau ukuran dan kualitas data lokal.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StorageUsageCard 
          sizeBytes={health.modalingSizeBytes}
          formattedSize={health.formattedSize}
          status={health.status}
        />

        <Card className="p-4">
          <h4 className="font-semibold text-text-primary text-sm mb-4">Issues & Warnings</h4>
          {health.issues && health.issues.length > 0 ? (
            <div className="space-y-2">
              {health.issues.map((issue, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center h-32">
              <ShieldCheck size={32} className="text-green-500 mb-2" />
              <p className="text-sm text-text-secondary font-medium">
                {t('noIssuesFound', 'Tidak ada masalah ditemukan.')}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
