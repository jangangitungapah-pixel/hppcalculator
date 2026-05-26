import React from 'react';
import { Input } from './Input';
import { Select } from './Select';
import { Trash2 } from 'lucide-react';
import { Button } from './Button';

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
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 py-3 px-2 items-start sm:items-center border-b border-border/50 hover:bg-surface-muted/50 transition-colors group relative rounded-lg sm:rounded-none">
      
      {/* Name Input */}
      <div className="w-full sm:flex-[2]">
        <Input
          placeholder="Cth: Tepung Terigu"
          value={item.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          containerClassName="w-full"
          className="bg-transparent border-transparent hover:bg-black/5 focus:bg-surface focus:border-border shadow-none h-10 px-3"
          aria-label={t('calculator.costName')}
        />
      </div>

      {/* Category Select */}
      <div className="w-full sm:flex-[1.5]">
        <Select
          options={categoryOptions}
          value={item.category}
          onChange={(e) => onChange(index, 'category', e.target.value)}
          containerClassName="w-full"
          className="bg-transparent border-transparent hover:bg-black/5 focus:bg-surface focus:border-border shadow-none h-10 px-3"
          aria-label={t('calculator.costCategory')}
        />
      </div>

      {/* Amount Input */}
      <div className="w-full sm:flex-[1.5] flex items-center gap-2">
        <Input
          type="number"
          min="0"
          prefix="Rp"
          placeholder="0"
          value={item.amount || ''}
          onChange={(e) => onChange(index, 'amount', e.target.value)}
          containerClassName="flex-1"
          className="bg-transparent border-transparent hover:bg-black/5 focus:bg-surface focus:border-border shadow-none h-10 pl-10 pr-3 font-medium"
          aria-label={t('calculator.costAmount')}
        />
        
        <div className="w-10 flex justify-end shrink-0">
          {canRemove && (
            <Button 
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              className="text-text-muted opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-status-loss hover:bg-status-lossBg transition-all w-8 h-8 rounded-lg"
              title={t('calculator.removeCost')}
              aria-label={t('calculator.removeCost')}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
