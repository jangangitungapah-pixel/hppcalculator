import React from 'react';

export const BackupSummaryCard = ({ title, value, helper, icon: Icon, tone = 'default' }) => {
  const toneClasses = {
    default: 'bg-white border-ui-border',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    danger: 'bg-red-50 border-red-200'
  };

  const textClasses = {
    default: 'text-text-primary',
    success: 'text-green-800',
    warning: 'text-yellow-800',
    danger: 'text-red-800'
  };

  const iconClasses = {
    default: 'text-brand-primary',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600'
  };

  return (
    <div className={`rounded-xl border p-4 ${toneClasses[tone]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary font-medium mb-1">{title}</p>
          <p className={`text-2xl font-bold ${textClasses[tone]}`}>{value}</p>
          {helper && (
            <p className="text-xs text-text-tertiary mt-1">{helper}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg bg-white/50 ${iconClasses[tone]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
};
