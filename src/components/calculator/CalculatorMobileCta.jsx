import React from 'react';
import { Button } from '../ui/Button';
import { CalculatorStickySummary } from './CalculatorStickySummary';
import { parseLocalizedNumber } from '../../lib/data/calculationMapper';

export const CalculatorMobileCta = ({ 
  form, 
  result, 
  onCalculate, 
  onReset,
  t 
}) => {
  // Check validity
  const hasName = form.productName && form.productName.trim().length > 0;
  const hasCosts = form.costItems && form.costItems.some(item => parseLocalizedNumber(item.amount) > 0);
  const hasOutput = parseLocalizedNumber(form.outputQuantity) > 0;
  const hasPrice = parseLocalizedNumber(form.sellingPrice) > 0;
  const hasUnit = form.sellingUnit !== 'custom' || form.customSellingUnit?.trim().length > 0;
  const isValid = hasName && hasCosts && hasOutput && hasPrice && hasUnit;

  const missingLabels = [
    !hasName && 'Nama',
    !hasCosts && 'Biaya',
    !hasOutput && 'Hasil',
    !hasPrice && 'Harga',
    !hasUnit && 'Satuan'
  ].filter(Boolean);

  return (
    <div className="calculator-mobile-cta lg:hidden bg-surface/85 backdrop-blur-md border-t border-border/80 shadow-md">
      <div className="calculator-mobile-cta-inner">
        {result ? (
          <>
            <CalculatorStickySummary result={result} t={t} />
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="text-[11px] h-10 border-border bg-surface-cream hover:bg-border/20 text-text-secondary px-3.5 rounded-xl font-bold"
                onClick={onReset}
              >
                {t('calculator.resetButton', 'Reset')}
              </Button>
              <Button 
                size="sm" 
                className="text-[11px] h-10 px-4.5 font-extrabold rounded-xl shadow-md shadow-orange-500/10"
                onClick={onCalculate}
              >
                {t('calculator.calculateButton', 'Hitung')}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="calculator-mobile-summary">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-secondary">Status Form:</span>
              <span className={`text-xs font-bold mt-0.5 ${isValid ? 'text-emerald-600' : 'text-text-secondary'}`}>
                {isValid ? 'Siap Dihitung' : `Lengkapi ${missingLabels.join(', ')}`}
              </span>
            </div>
            
            <Button 
              size="sm"
              className="px-5 h-10 text-[11px] font-extrabold rounded-xl shadow-md shadow-orange-500/10"
              disabled={!isValid}
              onClick={onCalculate}
            >
              {isValid ? t('calculator.calculateButton', 'Hitung HPP') : 'Lengkapi Data'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
