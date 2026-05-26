import React from 'react';
import { Button } from '../ui/Button';
import { Sparkles, Save, RotateCcw } from 'lucide-react';

export const CalculatorFormActions = ({ 
  result, 
  onCalculate, 
  onSave, 
  onReset, 
  t 
}) => {
  return (
    <div className="calculator-form-actions hidden lg:flex">
      <Button 
        variant="secondary" 
        onClick={onReset}
        className="calculator-secondary-action border-border bg-surface-cream text-text-secondary hover:bg-border/20 h-12"
      >
        <RotateCcw className="w-4 h-4 mr-1.5" />
        {t('calculator.resetButton', 'Reset')}
      </Button>

      {result ? (
        <Button 
          onClick={onSave}
          className="calculator-primary-action h-12 shadow-glow-primary font-bold"
        >
          <Save className="w-4 h-4 mr-1.5" />
          {t('result.saveCalculation', 'Simpan Perhitungan')}
        </Button>
      ) : (
        <Button 
          onClick={onCalculate}
          className="calculator-primary-action h-12 shadow-glow-primary font-bold"
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          {t('calculator.calculateButton', 'Hitung Sekarang')}
        </Button>
      )}
    </div>
  );
};
