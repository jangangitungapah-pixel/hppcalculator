import React from 'react';
import { formatPercent } from '../../lib/calculations';
import { useLanguage } from '../../hooks/useLanguage';

export const MarginBarList = ({ items, maxDisplayMargin = 100 }) => {
  const { lang } = useLanguage();
  
  if (!items || items.length === 0) return null;

  // Find max margin to scale the bars relative to the highest (up to maxDisplayMargin)
  const maxValInItems = Math.max(...items.map(i => i.marginPercent || 0), 10);
  const scaleMax = Math.min(Math.max(maxValInItems, 50), maxDisplayMargin);

  const getBarColor = (margin) => {
    if (margin === null || margin === undefined) return 'bg-gray-300';
    if (margin < 0) return 'bg-status-loss';
    if (margin < 15) return 'bg-status-warning';
    if (margin < 25) return 'bg-blue-400';
    return 'bg-status-good';
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, idx) => {
        const margin = item.marginPercent || 0;
        // Clamp for display
        let displayPercent = (Math.abs(margin) / scaleMax) * 100;
        if (displayPercent > 100) displayPercent = 100;
        
        const isNegative = margin < 0;

        return (
          <div key={`${item.id}-${idx}`} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <div className="w-full sm:w-1/3 text-xs font-semibold text-text-secondary truncate" title={item.name}>
              {item.name}
            </div>
            
            <div className="w-full sm:w-2/3 flex items-center gap-2">
              <div className="flex-1 h-3 bg-surface-muted rounded-full overflow-hidden flex relative">
                {/* For negative margin, we could do a center axis, but for simplicity, we just color it red and start from left */}
                <div 
                  className={`h-full rounded-full transition-all ${getBarColor(margin)}`}
                  style={{ width: `${displayPercent}%` }}
                />
              </div>
              <div className={`w-14 text-right text-xs font-bold ${isNegative ? 'text-status-loss' : 'text-text-primary'}`}>
                {item.marginPercent !== null ? formatPercent(margin, lang) : '-'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
