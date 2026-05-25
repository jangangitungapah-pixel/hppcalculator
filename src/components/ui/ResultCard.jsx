import React from 'react';
import { Card } from './Card';

export const ResultCard = ({ label, value, helper, tone = 'neutral', large = false, className = '' }) => {
  const toneStyles = {
    neutral: 'bg-surface border-border/60 text-text-primary shadow-sm',
    good: 'bg-gradient-to-br from-status-goodBg to-surface border-status-good/30 text-status-good shadow-sm',
    loss: 'bg-gradient-to-br from-status-lossBg to-surface border-status-loss/30 text-status-loss shadow-sm',
    brand: 'bg-gradient-to-br from-brand-soft to-surface border-brand-primary/20 text-brand-primary shadow-sm',
  };

  const style = toneStyles[tone] || toneStyles.neutral;

  return (
    <Card className={`p-5 border ${style} transition-all duration-300 hover:shadow-md ${className || ''}`}>
      <div className="text-xs uppercase tracking-wider font-bold opacity-70 mb-2">{label}</div>
      <div className={`${large ? 'text-3xl md:text-4xl' : 'text-2xl'} font-extrabold tabular-nums tracking-tight`}>
        {value}
      </div>
      {helper && <div className="text-xs opacity-70 mt-2 font-medium">{helper}</div>}
    </Card>
  );
};
