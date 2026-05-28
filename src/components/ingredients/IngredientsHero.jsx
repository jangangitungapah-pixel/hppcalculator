import React from 'react';
import { Plus, ArchiveRestore, Sparkles, Scale } from 'lucide-react';
import { Button } from '../ui/Button';

export const IngredientsHero = ({ hasIngredients, onAddClick, onLoadDemoClick }) => {
  return (
    <div className="ingredients-hero relative overflow-hidden bg-gradient-to-br from-brand-primary to-accent-coral text-white rounded-2xl p-5 md:p-6 shadow-glow-primary mb-6">
      {/* Decorative background orbs */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div className="ingredients-hero-content max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="ingredients-hero-pill px-2.5 py-1 rounded-md bg-white/15 text-[10px] uppercase font-bold tracking-wider backdrop-blur-md">Local-first</span>
            <span className="ingredients-hero-pill px-2.5 py-1 rounded-md bg-white/15 text-[10px] uppercase font-bold tracking-wider backdrop-blur-md">Dipakai di resep</span>
            <span className="ingredients-hero-pill px-2.5 py-1 rounded-md bg-white/15 text-[10px] uppercase font-bold tracking-wider backdrop-blur-md">Satuan otomatis</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-2">
            Bahan Baku
          </h2>
          <p className="text-white/80 text-xs sm:text-sm md:text-base font-medium leading-relaxed">
            Kelola harga bahan, satuan, dan modal dasar untuk resep dan produkmu.
          </p>
        </div>

        <div className="ingredients-hero-actions flex flex-wrap gap-3 w-full md:w-auto shrink-0">
          {!hasIngredients && (
            <Button 
              variant="secondary" 
              onClick={onLoadDemoClick} 
              className="flex-1 md:flex-none bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-md"
            >
              <ArchiveRestore className="w-4 h-4 mr-2" />
              Muat Contoh Bahan
            </Button>
          )}
          <Button 
            onClick={onAddClick} 
            className="flex-1 md:flex-none bg-white text-brand-primary hover:bg-white/95 border-none shadow-lg font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Bahan
          </Button>
        </div>
      </div>

      <div className="ingredients-hero-visual absolute right-8 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
        <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center text-brand-primary shadow-2xl rotate-12">
          <Scale className="w-12 h-12" />
        </div>
      </div>
    </div>
  );
};
