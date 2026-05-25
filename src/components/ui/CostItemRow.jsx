import React from 'react';
import { Input } from './Input';
import { Select } from './Select';
import { Trash2 } from 'lucide-react';

export const CostItemRow = ({ 
  item, 
  index, 
  onChange, 
  onRemove, 
  canRemove = true,
  t 
}) => {
  
  const categoryOptions = [
    { value: 'Bahan', label: t('calculator.costDefaultIngredients') },
    { value: 'Kemasan', label: t('calculator.costDefaultPackaging') },
    { value: 'Tenaga Kerja', label: t('calculator.costDefaultLabor') },
    { value: 'Operasional', label: t('calculator.costDefaultOperational') },
    { value: 'Lainnya', label: t('calculator.costDefaultOther') },
  ];

  return (
    <div className="flex flex-col gap-3 p-4 bg-gradient-to-r from-surface-muted to-transparent border border-transparent hover:border-brand-soft rounded-2xl relative group transition-colors">
      
      {/* Header row with name and delete button */}
      <div className="flex justify-between items-start gap-3">
        <Input
          placeholder="Cth: Tepung Terigu"
          value={item.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          containerClassName="flex-1"
          aria-label={t('calculator.costName')}
        />
        {canRemove && (
          <button 
            type="button"
            onClick={() => onRemove(index)}
            className="p-2.5 text-text-muted hover:text-status-loss hover:bg-status-lossBg rounded-md transition-colors"
            title={t('calculator.removeCost')}
            aria-label={t('calculator.removeCost')}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Second row with category and amount */}
      <div className="flex gap-3">
        <Select
          options={categoryOptions}
          value={item.category}
          onChange={(e) => onChange(index, 'category', e.target.value)}
          containerClassName="flex-1 max-w-[120px]"
          aria-label={t('calculator.costCategory')}
        />
        <Input
          type="number"
          min="0"
          prefix="Rp"
          placeholder="0"
          value={item.amount || ''}
          onChange={(e) => onChange(index, 'amount', e.target.value)}
          containerClassName="flex-1"
          aria-label={t('calculator.costAmount')}
        />
      </div>

    </div>
  );
};
