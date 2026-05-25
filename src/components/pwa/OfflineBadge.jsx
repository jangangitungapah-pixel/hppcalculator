import React from 'react';
import { WifiOff } from 'lucide-react';
import { usePwaContext } from '../../contexts/PwaContext';
import { useLanguage } from '../../hooks/useLanguage';

export const OfflineBadge = () => {
  const { isOffline } = usePwaContext();
  const { t } = useLanguage();

  if (!isOffline) return null;

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-warning-50 text-warning-700 border border-warning-200 rounded-full shadow-sm text-[10px] sm:text-xs font-medium animate-in fade-in slide-in-from-top-2">
      <WifiOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      <span className="hidden sm:inline">{t('pwa.offlineModeTitle')}</span>
      <span className="sm:hidden">{t('pwa.offline')}</span>
    </div>
  );
};
