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
    <div className="hidden lg:flex items-center gap-3.5 mt-5">
      <Button 
        variant="secondary" 
        onClick={onReset}
        className="flex-1 border-border bg-surface-cream text-text-secondary hover:bg-border/30 h-12 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200"
      >
        <RotateCcw className="w-4 h-4 mr-2 shrink-0" />
        {t('calculator.resetButton', 'Reset')}
      </Button>

      {result ? (
        <Button 
          onClick={onSave}
          className="flex-[2] h-12 shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 font-extrabold rounded-xl text-xs sm:text-sm transition-all duration-300"
        >
          <Save className="w-4 h-4 mr-2 shrink-0" />
          {t('result.saveCalculation', 'Simpan Perhitungan')}
        </Button>
      ) : (
        <Button 
          onClick={onCalculate}
          className="flex-[2] h-12 shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 font-extrabold rounded-xl text-xs sm:text-sm transition-all duration-300"
        >
          <Sparkles className="w-4 h-4 mr-2 shrink-0" />
          {t('calculator.calculateButton', 'Hitung Sekarang')}
        </Button>
      )}
    </div>
  );
};

