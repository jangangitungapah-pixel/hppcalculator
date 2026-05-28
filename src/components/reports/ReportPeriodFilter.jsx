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
    <div className="report-period-filter" role="radiogroup" aria-label={t('reports.periodFilterLabel')}>
      {options.map((opt) => {
        const isActive = period === opt.value;
        return (
          <Button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            variant="ghost"
            size="xs"
            onClick={() => onChange(opt.value)}
            className={`report-period-option ${isActive ? 'is-active' : ''}`}
          >
            {opt.label}
          </Button>
        );
      })}
    </div>
  );
};
