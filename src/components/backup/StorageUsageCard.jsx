import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../ui/Card';
import { Database, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export const StorageUsageCard = ({ sizeBytes, formattedSize, status }) => {
  const { t } = useLanguage();

  const getStatusConfig = () => {
    switch (status) {
      case 'danger': return { bg: 'bg-red-100', text: 'text-red-700', icon: ShieldAlert, border: 'border-red-200' };
      case 'warning': return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertTriangle, border: 'border-yellow-200' };
      case 'healthy':
      default: return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, border: 'border-green-200' };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const maxBytes = 5 * 1024 * 1024; // approx 5MB max for most browsers
  const percentage = Math.min(100, Math.max(0, (sizeBytes / maxBytes) * 100));

  return (
    <Card className="p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <Database size={18} className="text-text-tertiary" />
        <h4 className="font-semibold text-text-primary text-sm">{t('storageSize', 'Ukuran Storage')}</h4>
      </div>
      
      <div className="flex-1">
        <p className="text-3xl font-bold text-text-primary mb-1">{formattedSize}</p>
        <p className="text-xs text-text-tertiary mb-4">~5MB LocalStorage Limit</p>
        
        <div className="w-full h-2 bg-ui-border rounded-full overflow-hidden">
          <div 
            className={`h-full ${status === 'danger' ? 'bg-red-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-brand-primary'}`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className={`mt-4 p-2 rounded-lg border flex items-center gap-2 text-sm font-medium ${config.bg} ${config.text} ${config.border}`}>
        <Icon size={16} />
        <span>
          {status === 'healthy' && t('healthHealthy', 'Penyimpanan Sehat')}
          {status === 'warning' && t('healthWarning', 'Peringatan Penyimpanan')}
          {status === 'danger' && t('healthDanger', 'Penyimpanan Kritis')}
        </span>
      </div>
    </Card>
  );
};
