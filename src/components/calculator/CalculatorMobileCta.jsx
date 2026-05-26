import React from 'react';
import { Button } from '../ui/Button';
import { CalculatorStickySummary } from './CalculatorStickySummary';

export const CalculatorMobileCta = ({ 
  form, 
  result, 
  onCalculate, 
  onReset,
  t 
}) => {
  // Check validity
  const hasCosts = form.costItems && form.costItems.some(item => parseFloat(item.amount) > 0);
  const hasOutput = form.outputQuantity && parseFloat(form.outputQuantity) > 0;
  const isValid = hasCosts && hasOutput;

  return (
    <div className="calculator-mobile-cta lg:hidden">
      <div className="calculator-mobile-cta-inner">
        {result ? (
          <>
            <CalculatorStickySummary result={result} t={t} />
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="text-xs h-10 border-border bg-surface-muted hover:bg-border/30 text-text-primary px-3"
                onClick={onReset}
              >
                {t('calculator.resetButton', 'Reset')}
              </Button>
              <Button 
                size="sm" 
                className="text-xs h-10 px-4 font-bold"
                onClick={onCalculate}
              >
                {t('calculator.calculateButton', 'Hitung')}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="calculator-mobile-summary">
              <span className="calculator-mobile-summary-label">Status Form:</span>
              <span className="text-xs text-text-secondary mt-0.5">
                {isValid ? 'Siap Dihitung' : 'Biaya & Hasil wajib diisi'}
              </span>
            </div>
            
            <Button 
              size="sm"
              className="px-6 h-10 text-xs font-bold shadow-glow-primary"
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
