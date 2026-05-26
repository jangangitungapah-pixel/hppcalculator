import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { REPORT_PERIODS } from '../../lib/reports';
import { Button } from '../ui/Button';

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
          <Button
            key={opt.value}
            variant={isActive ? 'white' : 'ghost'}
            size="xs"
            onClick={() => onChange(opt.value)}
            className={`flex-1 sm:flex-none rounded-md transition-all ${
              isActive 
                ? 'text-brand-primary shadow-sm font-semibold' 
                : 'text-text-secondary hover:text-text-primary font-semibold'
            }`}
          >
            {opt.label}
          </Button>
        );
      })}
    </div>
  );
};
