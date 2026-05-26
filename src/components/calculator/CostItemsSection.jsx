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
          <div className="hidden sm:grid sm:grid-cols-[2fr_1.5fr_1.5fr_auto] text-xs font-bold text-text-muted uppercase tracking-wider px-4 pb-2 mb-2 border-b border-border/60">
            <div className="pl-3">Nama Biaya</div>
            <div className="pl-3">Kategori</div>
            <div className="pl-3">Nominal</div>
            <div className="w-10"></div>
          </div>

          <div className="cost-items-list">
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
        <p className="text-sm text-status-loss font-semibold mt-1">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
        <Button 
          variant="ghost" 
          onClick={onAdd} 
          className="w-full sm:w-auto border border-dashed border-border hover:bg-surface-muted/50 text-text-secondary text-sm font-semibold"
        >
          <Plus className="w-4 h-4 mr-1" />
          {t('calculator.addCost', '+ Tambah Biaya Lainnya')}
        </Button>

        {/* Quick Cost templates */}
        <div className="cost-template-chips">
          <span className="text-xs font-bold text-text-secondary self-center mr-1">Shortcut:</span>
          <Button 
            type="button" 
            variant="soft"
            size="xs"
            className="rounded-lg text-text-secondary hover:text-brand-primary"
            onClick={() => onAddWithCategory('Bahan', t('calculator.costDefaultIngredients', 'Biaya Bahan'))}
          >
            + Bahan Baku
          </Button>
          <Button 
            type="button" 
            variant="soft"
            size="xs"
            className="rounded-lg text-text-secondary hover:text-brand-primary"
            onClick={() => onAddWithCategory('Kemasan', t('calculator.costDefaultPackaging', 'Biaya Kemasan'))}
          >
            + Kemasan
          </Button>
          <Button 
            type="button" 
            variant="soft"
            size="xs"
            className="rounded-lg text-text-secondary hover:text-brand-primary"
            onClick={() => onAddWithCategory('Tenaga Kerja', t('calculator.costDefaultLabor', 'Biaya Tenaga Kerja'))}
          >
            + Tenaga Kerja
          </Button>
          <Button 
            type="button" 
            variant="soft"
            size="xs"
            className="rounded-lg text-text-secondary hover:text-brand-primary"
            onClick={() => onAddWithCategory('Operasional', t('calculator.costDefaultOperational', 'Biaya Operasional'))}
          >
            + Operasional
          </Button>
        </div>
      </div>
    </div>
  );
};
