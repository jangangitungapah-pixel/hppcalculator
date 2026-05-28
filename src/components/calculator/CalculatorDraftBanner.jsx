import React from 'react';
import { History, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const CalculatorDraftBanner = ({ onRestore, onClear, t }) => {
  return (
    <div className="bg-amber-500/[0.07] border border-amber-500/20 p-4.5 rounded-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 shadow-xs">
      <div className="flex items-center gap-3 text-xs sm:text-[13px] font-bold text-amber-900 leading-snug">
        <History className="w-5 h-5 text-amber-500 shrink-0" />
        <span>Ada draft perhitungan yang belum selesai. Ingin dilanjutkan?</span>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button 
          variant="secondary" 
          size="sm" 
          className="text-xs h-9 border-amber-500/20 text-amber-800 hover:bg-amber-500/10 bg-transparent px-3 py-1 font-bold rounded-xl"
          onClick={onClear}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
          Hapus Draft
        </Button>
        <Button 
          size="sm" 
          className="text-xs h-9 bg-amber-500 hover:bg-amber-600 text-white px-4.5 py-1 font-bold rounded-xl shadow-sm shadow-amber-500/10"
          onClick={onRestore}
        >
          Lanjutkan
          <ArrowRight className="w-3.5 h-3.5 ml-1.5 shrink-0" />
        </Button>
      </div>
    </div>
  );
};

