import React from 'react';
import { Receipt, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

export const CalculatorEmptyCostState = ({ onAdd, t }) => {
  return (
    <div className="border-2 border-dashed border-border/80 bg-surface-cream rounded-3xl p-6 flex flex-col items-center text-center shadow-xs">
      <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-brand-primary flex items-center justify-center mb-3.5 shadow-sm shadow-orange-500/15">
        <Receipt className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-extrabold text-text-primary mb-1">
        {t('calculator.emptyCostTitle', 'Belum ada biaya')}
      </h3>
      <p className="text-xs text-text-secondary max-w-xs mb-4 leading-relaxed font-semibold">
        {t('calculator.emptyCostBody', 'Tambahkan bahan, kemasan, atau biaya lain yang dipakai untuk produksi.')}
      </p>
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={onAdd}
        className="text-xs font-extrabold px-4.5 py-2 border-dashed border-orange-500/20 hover:border-orange-500/40 hover:bg-orange-500/5 text-orange-600 rounded-xl h-10 transition-all duration-200"
      >
        <Plus className="w-3.5 h-3.5 mr-1.5 shrink-0" />
        {t('calculator.addCostFirst', 'Tambah Biaya Pertama')}
      </Button>
    </div>
  );
};

