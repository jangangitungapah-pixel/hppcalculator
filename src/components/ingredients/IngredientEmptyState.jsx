import React from 'react';
import { PackageSearch, Plus, ArchiveRestore } from 'lucide-react';
import { Button } from '../ui/Button';

export const IngredientEmptyState = ({ onAddClick, onLoadDemoClick }) => {
  return (
    <div className="ingredient-empty-state flex flex-col items-center justify-center py-16 px-6 text-center bg-gradient-to-br from-surface to-brand-soft/10 rounded-3xl border border-dashed border-brand-primary/20 mt-8 shadow-sm">
      
      {/* Icon Orbs */}
      <div className="w-24 h-24 bg-white rounded-3xl shadow-md border border-border/40 flex items-center justify-center mb-6 text-brand-primary relative">
        <PackageSearch className="w-12 h-12" />
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-primary"></span>
        </span>
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-3 tracking-tight">
        Belum ada bahan baku
      </h2>
      <p className="text-text-secondary max-w-md mx-auto mb-6 leading-relaxed font-medium text-sm">
        Tambahkan bahan seperti tepung, gula, minyak, kemasan, atau topping untuk mulai membuat resep dan menghitung HPP.
      </p>

      {/* Floating Mock Examples preview */}
      <div className="ingredient-empty-preview flex flex-wrap justify-center gap-2 mb-8 max-w-sm">
        <span className="ingredient-floating-example text-xs font-semibold px-3.5 py-2 bg-white text-text-secondary rounded-xl border border-border/60 shadow-sm">
          🍞 Tepung Terigu
        </span>
        <span className="ingredient-floating-example text-xs font-semibold px-3.5 py-2 bg-white text-text-secondary rounded-xl border border-border/60 shadow-sm">
          🧂 Gula Pasir
        </span>
        <span className="ingredient-floating-example text-xs font-semibold px-3.5 py-2 bg-white text-text-secondary rounded-xl border border-border/60 shadow-sm">
          🥤 Cup Plastik 16oz
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
        <Button 
          variant="primary" 
          size="lg" 
          onClick={onAddClick} 
          className="shadow-glow-primary w-full sm:w-auto px-8 font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Bahan Pertama
        </Button>
        <Button 
          size="lg" 
          variant="secondary" 
          onClick={onLoadDemoClick} 
          className="w-full sm:w-auto px-8"
        >
          <ArchiveRestore className="w-4 h-4 mr-2" />
          Muat Contoh Bahan
        </Button>
      </div>

      <p className="text-[10px] text-text-tertiary mt-4">
        * Data contoh bisa dihapus kapan saja dari halaman Backup & Data.
      </p>
    </div>
  );
};
