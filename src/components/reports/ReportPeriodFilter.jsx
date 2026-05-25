import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { REPORT_PERIODS } from '../../lib/reports';

export const ReportPeriodFilter = ({ period, onChange }) => {
  const { t } = useLanguage();
  
  const options = [
    { value: REPORT_PERIODS.DAYS_7, label: t('reports.period7d') },
    { value: REPORT_PERIODS.DAYS_30, label: t('reports.period30d') },
    { value: REPORT_PERIODS.ALL_TIME, label: t('reports.periodAll') }
  ];

  return (
    <div className="flex bg-surface-muted p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
      {options.map((opt) => {
        const isActive = period === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`
              flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap
              ${isActive 
                ? 'bg-white text-brand-primary shadow-sm' 
                : 'text-text-secondary hover:text-text-primary'}
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
