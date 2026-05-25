import React from 'react';
import { Card } from '../ui/Card';
import { ChevronRight } from 'lucide-react';

export const InsightCard = ({ title, value, description, tone = 'neutral', action, onClick }) => {
  const tones = {
    neutral: 'bg-white',
    good: 'bg-status-goodBg/50',
    warning: 'bg-status-warningBg/50',
    danger: 'bg-status-lossBg/50',
  };

  const valueTones = {
    neutral: 'text-text-primary',
    good: 'text-status-good',
    warning: 'text-status-warning',
    danger: 'text-status-loss',
  };

  return (
    <Card 
      className={`p-4 border-border flex flex-col h-full ${tones[tone]} ${onClick ? 'cursor-pointer hover:border-brand-primary/50 transition-colors' : ''}`}
      onClick={onClick}
    >
      <h4 className="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">{title}</h4>
      
      <div className="flex-1">
        <div className={`text-lg font-bold mb-1 line-clamp-2 ${valueTones[tone]}`} title={typeof value === 'string' ? value : ''}>
          {value || '-'}
        </div>
        {description && (
          <p className="text-xs text-text-tertiary line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="mt-3 flex items-center text-xs font-semibold text-brand-primary group">
          {action}
          <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </Card>
  );
};
