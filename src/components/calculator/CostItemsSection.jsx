import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { CostItemRow } from './CostItemRow';
import { CalculatorEmptyCostState } from './CalculatorEmptyCostState';

export const CostItemsSection = ({ 
  costItems, 
  onUpdate, 
  onRemove, 
  onAdd, 
  onAddWithCategory,
  error, 
  t 
}) => {
  return (
    <div className="flex flex-col gap-4">
      {costItems.length === 0 ? (
        <CalculatorEmptyCostState onAdd={onAdd} t={t} />
      ) : (
        <>
          {/* Table Header */}
          <div className="hidden sm:grid sm:grid-cols-[2fr_1.5fr_1.5fr_auto] text-xs font-bold text-text-secondary uppercase tracking-wider px-4 pb-2 mb-1 border-b border-border/60">
            <div className="pl-3">Nama Biaya</div>
            <div className="pl-3">Kategori</div>
            <div className="pl-3">Nominal</div>
            <div className="w-10"></div>
          </div>

          <div className="cost-items-list gap-3">
            {costItems.map((item, i) => (
              <CostItemRow 
                key={item.id}
                item={item}
                index={i}
                onChange={onUpdate}
                onRemove={onRemove}
                canRemove={costItems.length > 1}
                t={t}
              />
            ))}
          </div>
        </>
      )}

      {error && (
        <p className="text-sm text-status-loss font-semibold mt-1 bg-red-500/10 border border-red-500/20 px-3.5 py-2.5 rounded-xl">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2 pt-3 border-t border-dashed border-border/60">
        <Button 
          variant="ghost" 
          onClick={onAdd} 
          className="w-full sm:w-auto border border-dashed border-orange-500/20 hover:border-orange-500/40 hover:bg-orange-500/5 text-orange-600 text-sm font-semibold rounded-xl h-11"
        >
          <Plus className="w-4 h-4 mr-1.5 shrink-0" />
          {t('calculator.addCost', 'Tambah Biaya')}
        </Button>

        {/* Quick Cost templates */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-extrabold text-text-secondary uppercase tracking-wider mr-1">Shortcut:</span>
          <Button 
            type="button" 
            variant="ghost"
            size="xs"
            className="rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 border border-emerald-500/10 text-xs px-2.5 py-1 font-bold transition-all hover:scale-102"
            onClick={() => onAddWithCategory('Bahan', t('calculator.costDefaultIngredients', 'Biaya Bahan'))}
          >
            + Bahan Baku
          </Button>
          <Button 
            type="button" 
            variant="ghost"
            size="xs"
            className="rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 border border-blue-500/10 text-xs px-2.5 py-1 font-bold transition-all hover:scale-102"
            onClick={() => onAddWithCategory('Kemasan', t('calculator.costDefaultPackaging', 'Biaya Kemasan'))}
          >
            + Kemasan
          </Button>
          <Button 
            type="button" 
            variant="ghost"
            size="xs"
            className="rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 border border-purple-500/10 text-xs px-2.5 py-1 font-bold transition-all hover:scale-102"
            onClick={() => onAddWithCategory('Tenaga Kerja', t('calculator.costDefaultLabor', 'Biaya Tenaga Kerja'))}
          >
            + Tenaga Kerja
          </Button>
          <Button 
            type="button" 
            variant="ghost"
            size="xs"
            className="rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-500/10 text-xs px-2.5 py-1 font-bold transition-all hover:scale-102"
            onClick={() => onAddWithCategory('Operasional', t('calculator.costDefaultOperational', 'Biaya Operasional'))}
          >
            + Operasional
          </Button>
        </div>
      </div>
    </div>
  );
};
