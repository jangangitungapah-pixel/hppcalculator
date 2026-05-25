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
    <Card className={`metric-card ${className}`}>
      <div className="flex justify-between items-start">
        <h3 className="metric-label">{title}</h3>
        {Icon && (
          <div className={`metric-icon ${iconStyle}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="metric-value">{value}</div>
      {description && <p className="metric-helper">{description}</p>}
    </Card>
  );
};
