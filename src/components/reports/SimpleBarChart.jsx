import React from 'react';

export const SimpleBarChart = ({ data, height = "h-4", ariaLabel }) => {
  if (!data || data.length === 0) return null;

  // Assuming data is an array of { label, value, colorClass }
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  
  if (total === 0) return <div className={`w-full bg-surface-muted rounded-full ${height}`} />;

  return (
    <div className="w-full" role="img" aria-label={ariaLabel || data.map((item) => `${item.label}: ${item.value}`).join(', ')}>
      <div className={`w-full flex rounded-full overflow-hidden ${height}`}>
        {data.map((item, idx) => {
          if (!item.value) return null;
          const widthPercent = (item.value / total) * 100;
          return (
            <div 
              key={idx}
              className={item.colorClass || 'bg-brand-primary'}
              style={{ width: `${widthPercent}%` }}
              title={`${item.label}: ${item.value}`}
              aria-hidden="true"
            />
          );
        })}
      </div>
      
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
        {data.map((item, idx) => {
          if (!item.value && item.value !== 0) return null;
          const widthPercent = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={idx} className="flex items-center gap-1.5 text-xs text-text-secondary">
              <div className={`w-2.5 h-2.5 rounded-full ${item.colorClass || 'bg-brand-primary'}`} />
              <span>{item.label} ({widthPercent}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
