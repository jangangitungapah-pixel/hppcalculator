import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Info } from 'lucide-react';

export const PricingDisclaimer = ({ className = '' }) => {
  const { t } = useLanguage();
  return (
    <div className={`bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 flex items-start gap-2 ${className}`}>
      <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
      <div className="text-sm">
        <span className="font-semibold">{t('pricing.disclaimerTitle')}: </span>
        {t('pricing.disclaimerBody')}
      </div>
    </div>
  );
};
