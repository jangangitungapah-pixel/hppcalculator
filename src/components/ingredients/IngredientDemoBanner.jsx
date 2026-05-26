import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const IngredientDemoBanner = ({ onLoadDemoClick }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-brand-soft/30 border border-brand-soft/85 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-brand-primary opacity-5 blur-xl pointer-events-none"></div>

      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white text-brand-primary shrink-0 shadow-sm border border-brand-soft/40">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <p className="font-bold text-text-primary text-sm">Butuh contoh struktur bahan?</p>
          <p className="text-text-secondary text-xs mt-0.5">Muat data demo profesional F&B tanpa menghapus data bahan yang sudah kamu buat.</p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onLoadDemoClick}
          className="text-xs bg-white hover:bg-brand-soft/20 text-brand-primary border-brand-soft"
        >
          Muat Data Demo
        </Button>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-text-secondary hover:text-text-primary p-1 rounded-lg"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
