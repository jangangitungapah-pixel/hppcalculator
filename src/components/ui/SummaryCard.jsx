import React from 'react';
import { Card } from './Card';

export const SummaryCard = ({ title, value, description, icon: Icon, tone = 'neutral', className = '' }) => {
  const toneStyles = {
    neutral: 'text-brand-primary bg-brand-primary-soft',
    good: 'text-status-good bg-status-good-bg',
    loss: 'text-status-loss bg-status-loss-bg',
  };

  const iconStyle = toneStyles[tone] || toneStyles.neutral;

  return (
    <Card className={`p-5 flex flex-col gap-2 ${className}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-semibold text-text-secondary">{title}</h3>
        {Icon && (
          <div className={`p-2 rounded-md ${iconStyle}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-text-primary">{value}</div>
      {description && <p className="text-sm text-text-muted">{description}</p>}
    </Card>
  );
};
