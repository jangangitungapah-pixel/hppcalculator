import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../ui/Card';
import { Database, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export const StorageUsageCard = ({ sizeBytes, formattedSize, status }) => {
  const { t } = useLanguage();

  const getStatusConfig = () => {
    switch (status) {
      case 'danger': return { bg: 'bg-red-500/5', text: 'text-red-700', icon: ShieldAlert, border: 'border-red-500/10' };
      case 'warning': return { bg: 'bg-amber-500/5', text: 'text-amber-700', icon: AlertTriangle, border: 'border-amber-500/10' };
      case 'healthy':
      default: return { bg: 'bg-emerald-500/5', text: 'text-emerald-700', icon: CheckCircle, border: 'border-emerald-500/10' };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const maxBytes = 5 * 1024 * 1024; // approx 5MB max for most browsers
  const percentage = Math.min(100, Math.max(0, (sizeBytes / maxBytes) * 100));

  return (
    <Card className="p-5 border-border/80 rounded-3xl shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-text-secondary" />
          <h4 className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">{t('dataBackup.storageSize', 'Ukuran Storage')}</h4>
        </div>
        
        <div className="mb-4">
          <p className="text-2xl sm:text-3xl font-black text-text-primary mb-0.5 tracking-tight">{formattedSize}</p>
          <p className="text-xs font-semibold text-text-secondary mb-4">~5MB LocalStorage Limit</p>
          
          <div className="w-full h-2.5 bg-surface-cream rounded-full overflow-hidden border border-border-soft">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                status === 'danger' 
                  ? 'bg-red-500' 
                  : status === 'warning' 
                    ? 'bg-amber-500' 
                    : 'bg-gradient-to-r from-orange-500 to-amber-400'
              }`} 
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className={`mt-2 p-3.5 rounded-2xl border flex items-center gap-2 text-xs sm:text-sm font-bold ${config.bg} ${config.text} ${config.border}`}>
        <Icon className="w-4.5 h-4.5 shrink-0" />
        <span>
          {status === 'healthy' && t('dataBackup.healthHealthy', 'Penyimpanan Sehat')}
          {status === 'warning' && t('dataBackup.healthWarning', 'Peringatan Penyimpanan')}
          {status === 'danger' && t('dataBackup.healthDanger', 'Penyimpanan Kritis')}
        </span>
      </div>
    </Card>
  );
};
