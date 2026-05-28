import React from 'react';
import { Card } from '../ui/Card';

export const ReportMetricCard = ({ label, value, helper, icon: Icon, tone = 'neutral' }) => {
  const tones = {
    neutral: 'report-metric-card-neutral',
    good: 'report-metric-card-good',
    warning: 'report-metric-card-warning',
    danger: 'report-metric-card-danger',
    brand: 'report-metric-card-brand'
  };

  const bgTone = tones[tone] || tones.neutral;

  return (
    <Card className={`report-metric-card ${bgTone}`} aria-label={`${label}: ${value}`}>
      <div className="report-metric-card-head">
        <h3 className="report-metric-card-label">
          {label}
        </h3>
        {Icon && (
          <div className="report-metric-card-icon" aria-hidden="true">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="report-metric-card-value" title={String(value)}>
          {value}
        </div>
        {helper && (
          <div className="report-metric-card-helper">
            {helper}
          </div>
        )}
      </div>
    </Card>
  );
};
