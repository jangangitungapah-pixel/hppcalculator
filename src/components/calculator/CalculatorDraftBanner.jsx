import React from 'react';
import { History, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const CalculatorDraftBanner = ({ onRestore, onClear, t }) => {
  return (
    <div className="calculator-draft-banner">
      <div className="calculator-draft-banner-text">
        <History className="w-5 h-5 text-amber-500 shrink-0" />
        <span>Ada draft perhitungan yang belum selesai. Ingin dilanjutkan?</span>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="secondary" 
          size="sm" 
          className="text-xs h-9 border-amber-300 text-amber-700 hover:bg-amber-100 bg-transparent px-3 py-1 font-bold"
          onClick={onClear}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Hapus Draft
        </Button>
        <Button 
          size="sm" 
          className="text-xs h-9 bg-amber-500 hover:bg-amber-600 text-white px-4 py-1 font-bold"
          onClick={onRestore}
        >
          Lanjutkan
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
};
