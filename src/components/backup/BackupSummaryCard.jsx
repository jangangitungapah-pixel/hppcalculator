import React from 'react';

export const BackupSummaryCard = ({ title, value, helper, icon: Icon, tone = 'default' }) => {
  const toneClasses = {
    default: 'bg-surface border-border/80 text-text-primary',
    success: 'bg-emerald-500/5 border-emerald-500/15 text-emerald-900',
    warning: 'bg-amber-500/5 border-amber-500/15 text-amber-900',
    danger: 'bg-red-500/5 border-red-500/15 text-red-900'
  };

  const textClasses = {
    default: 'text-text-primary',
    success: 'text-emerald-950',
    warning: 'text-amber-950',
    danger: 'text-red-950'
  };

  const iconClasses = {
    default: 'text-brand-primary bg-brand-soft/50',
    success: 'text-emerald-700 bg-emerald-500/10',
    warning: 'text-amber-700 bg-amber-500/10',
    danger: 'text-red-700 bg-red-500/10'
  };

  return (
    <div className={`rounded-2xl border p-4.5 flex flex-col justify-between shadow-xs ${toneClasses[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-1.5 truncate">{title}</p>
          <p className={`text-lg sm:text-xl font-black tracking-tight leading-none ${textClasses[tone]}`}>{value}</p>
        </div>
        {Icon && (
          <div className={`p-2 rounded-xl shrink-0 flex items-center justify-center ${iconClasses[tone]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {helper && (
        <p className="text-[11px] font-semibold text-text-secondary mt-2.5 pt-2 border-t border-border-soft/60">
          {helper}
        </p>
      )}
    </div>
  );
};
