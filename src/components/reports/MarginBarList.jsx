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
    <div className="report-margin-list">
      {items.map((item, idx) => {
        const margin = item.marginPercent || 0;
        // Clamp for display
        let displayPercent = (Math.abs(margin) / scaleMax) * 100;
        if (displayPercent > 100) displayPercent = 100;
        
        const isNegative = margin < 0;

        return (
          <div key={`${item.id}-${idx}`} className="report-margin-row">
            <div className="report-margin-name" title={item.name}>
              {item.name}
            </div>
            
            <div className="report-margin-bar-wrap">
              <div
                className="report-margin-bar-track"
                role="meter"
                aria-label={`${item.name} margin`}
                aria-valuemin={-100}
                aria-valuemax={100}
                aria-valuenow={Math.round(margin)}
              >
                <div 
                  className={`report-margin-bar-fill ${getBarColor(margin)}`}
                  style={{ width: `${displayPercent}%` }}
                />
              </div>
              <div className={`report-margin-value ${isNegative ? 'text-status-loss' : 'text-text-primary'}`}>
                {item.marginPercent !== null ? formatPercent(margin, lang) : '-'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
