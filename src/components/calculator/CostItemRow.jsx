import React from 'react';
import { Trash2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export const CostItemRow = ({ 
  item, 
  index, 
  onChange, 
  onRemove, 
  canRemove = true,
  t 
}) => {
  const rowNumber = index + 1;
  const rowName = item.name?.trim() || `biaya ${rowNumber}`;
  const rowLabel = `Baris ${rowNumber}, ${rowName}`;

  const categoryOptions = [
    { value: 'Bahan', label: t('calculator.costDefaultIngredients', 'Biaya Bahan') },
    { value: 'Kemasan', label: t('calculator.costDefaultPackaging', 'Biaya Kemasan') },
    { value: 'Tenaga Kerja', label: t('calculator.costDefaultLabor', 'Biaya Tenaga Kerja') },
    { value: 'Operasional', label: t('calculator.costDefaultOperational', 'Biaya Operasional') },
    { value: 'Lainnya', label: t('calculator.costDefaultOther', 'Biaya Lainnya') },
  ];

  return (
    <div className="cost-item-row group/row bg-surface-cream hover:bg-surface border border-border-soft hover:border-orange-500/20 rounded-2xl p-3 sm:p-2 sm:px-3 flex flex-col sm:grid sm:grid-cols-[2fr_1.5fr_1.5fr_auto] gap-2.5 sm:gap-3 items-stretch sm:items-center transition-all duration-300 shadow-xs hover:shadow-sm">
      {/* Name Input */}
      <div className="cost-item-field-wrap">
        <Input
          placeholder="Cth: Tepung Terigu"
          value={item.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          containerClassName="w-full"
          className="bg-transparent border-transparent hover:bg-black/[0.03] focus:bg-surface focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 shadow-none h-11 px-3 rounded-xl transition-all duration-200 text-sm font-semibold"
          aria-label={`${t('calculator.costName')} ${rowNumber}`}
        />
      </div>

      {/* Category Select */}
      <div className="cost-item-field-wrap">
        <Select
          options={categoryOptions}
          value={item.category}
          onChange={(e) => onChange(index, 'category', e.target.value)}
          containerClassName="w-full"
          className="bg-transparent border-transparent hover:bg-black/[0.03] focus:bg-surface focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 shadow-none h-11 px-3 rounded-xl transition-all duration-200 text-sm font-semibold"
          aria-label={`${t('calculator.costCategory')} ${rowLabel}`}
        />
      </div>

      {/* Amount Input & Remove Trigger */}
      <div className="cost-item-field-wrap cost-item-amount-wrap flex items-center gap-2">
        <Input
          type="number"
          min="0"
          prefix="Rp"
          placeholder="0"
          value={item.amount || ''}
          onChange={(e) => onChange(index, 'amount', e.target.value)}
          containerClassName="flex-1"
          className="bg-transparent border-transparent hover:bg-black/[0.03] focus:bg-surface focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 shadow-none h-11 pl-10 pr-3 rounded-xl transition-all duration-200 text-sm font-bold text-text-primary"
          aria-label={`${t('calculator.costAmount')} ${rowLabel}`}
        />
        
        <div className="shrink-0 flex items-center justify-center">
          {canRemove ? (
            <button 
              type="button"
              onClick={() => onRemove(index)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-500/10 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              title={`${t('calculator.removeCost')} ${rowLabel}`}
              aria-label={`${t('calculator.removeCost')} ${rowLabel}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-10"></div>
          )}
        </div>
      </div>
    </div>
  );
};
