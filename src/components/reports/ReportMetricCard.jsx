import React from 'react';
import { Card } from '../ui/Card';

export const ReportMetricCard = ({ label, value, helper, icon: Icon, tone = 'neutral' }) => {
  const tones = {
    neutral: 'bg-white text-text-primary',
    good: 'bg-status-goodBg border-status-good/20 text-status-good',
    warning: 'bg-status-warningBg border-status-warning/20 text-status-warning',
    danger: 'bg-status-lossBg border-status-loss/20 text-status-loss',
    brand: 'bg-brand-soft text-brand-primary'
  };

  const bgTone = tones[tone] || tones.neutral;
  const isNeutral = tone === 'neutral';

  return (
    <Card className={`p-4 flex flex-col justify-between ${bgTone} ${isNeutral ? 'border-border' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-xs font-semibold ${isNeutral ? 'text-text-secondary' : 'opacity-80'}`}>
          {label}
        </h3>
        {Icon && (
          <div className={`${isNeutral ? 'text-brand-primary' : ''}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold mb-1 line-clamp-1" title={String(value)}>
          {value}
        </div>
        {helper && (
          <div className={`text-[10px] ${isNeutral ? 'text-text-tertiary' : 'opacity-70'}`}>
            {helper}
          </div>
        )}
      </div>
    </Card>
  );
};
