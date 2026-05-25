import React from 'react';
import { WifiOff, ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { Link } from 'react-router-dom';

export const OfflinePage = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-warning-50 text-warning-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-warning-100">
        <WifiOff className="w-10 h-10" />
      </div>
      
      <h2 className="text-2xl font-bold text-text-primary mb-3">
        {t('pwa.offlinePageTitle')}
      </h2>
      
      <p className="text-text-secondary max-w-md mx-auto mb-8 leading-relaxed">
        {t('pwa.offlinePageBody')}
      </p>
      
      <Link 
        to="/dashboard"
        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-sm transition-transform active:scale-95"
      >
        {t('pwa.backToDashboard')}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
