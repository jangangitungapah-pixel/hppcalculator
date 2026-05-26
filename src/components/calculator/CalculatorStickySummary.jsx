import React from 'react';
import { formatCurrency } from '../../lib/calculations';
import { useLanguage } from '../../hooks/useLanguage';
import { useAppData } from '../../hooks/useAppData';

export const CalculatorStickySummary = ({ result, t }) => {
  const { lang } = useLanguage();
  const { settings } = useAppData();

  if (!result) return null;

  const isLoss = result.profitStatus.key === 'loss';

  return (
    <div className="flex items-center gap-4 text-xs font-semibold">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">HPP / Unit</span>
        <span className="font-extrabold text-brand-primary text-sm">
          {formatCurrency(result.hppPerUnit, lang, settings.currency)}
        </span>
      </div>
      <div className="h-6 w-px bg-border"></div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Margin</span>
        <span className={`font-extrabold text-sm ${isLoss ? 'text-status-loss' : 'text-status-good'}`}>
          {result.marginPercent.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};
