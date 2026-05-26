import React from 'react';
import { Receipt, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

export const CalculatorEmptyCostState = ({ onAdd, t }) => {
  return (
    <div className="calculator-empty-cost">
      <div className="calculator-empty-cost-icon">
        <Receipt className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-text-primary mb-1">
        {t('calculator.emptyCostTitle', 'Belum ada biaya')}
      </h3>
      <p className="text-xs text-text-secondary max-w-xs mb-4 leading-relaxed">
        {t('calculator.emptyCostBody', 'Tambahkan bahan, kemasan, atau biaya lain yang dipakai untuk produksi.')}
      </p>
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={onAdd}
        className="text-xs font-semibold px-4 py-2 border-dashed border-border"
      >
        <Plus className="w-3.5 h-3.5 mr-1" />
        {t('calculator.addCostFirst', 'Tambah Biaya Pertama')}
      </Button>
    </div>
  );
};
