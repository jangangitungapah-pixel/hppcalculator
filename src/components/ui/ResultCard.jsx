import React from 'react';
import { Card } from './Card';

export const ResultCard = ({ label, value, helper, tone = 'neutral', large = false }) => {
  const toneStyles = {
    neutral: 'bg-surface-muted border-transparent text-text-primary',
    good: 'bg-status-goodBg border-status-good/20 text-status-good',
    loss: 'bg-status-lossBg border-status-loss/20 text-status-loss',
    brand: 'bg-brand-soft border-brand-primary/20 text-brand-primary',
  };

  const style = toneStyles[tone] || toneStyles.neutral;

  return (
    <Card className={`p-4 border ${style}`}>
      <div className="text-sm font-semibold opacity-80 mb-1">{label}</div>
      <div className={`${large ? 'text-2xl md:text-3xl' : 'text-xl'} font-bold`}>
        {value}
      </div>
      {helper && <div className="text-xs opacity-80 mt-1">{helper}</div>}
    </Card>
  );
};
