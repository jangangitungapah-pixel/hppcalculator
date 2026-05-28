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
    <div className="cost-item-row">
      {/* Name Input */}
      <div className="cost-item-field-wrap">
        <Input
          placeholder="Cth: Tepung Terigu"
          value={item.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          containerClassName="w-full"
          className="bg-transparent border-transparent hover:bg-black/5 focus:bg-surface focus:border-primary shadow-none h-11 px-3"
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
          className="bg-transparent border-transparent hover:bg-black/5 focus:bg-surface focus:border-primary shadow-none h-11 px-3"
          aria-label={`${t('calculator.costCategory')} ${rowLabel}`}
        />
      </div>

      {/* Amount Input & Remove Trigger */}
      <div className="cost-item-field-wrap cost-item-amount-wrap">
        <Input
          type="number"
          min="0"
          prefix="Rp"
          placeholder="0"
          value={item.amount || ''}
          onChange={(e) => onChange(index, 'amount', e.target.value)}
          containerClassName="flex-1"
          className="bg-transparent border-transparent hover:bg-black/5 focus:bg-surface focus:border-primary shadow-none h-11 pl-10 pr-3 font-semibold"
          aria-label={`${t('calculator.costAmount')} ${rowLabel}`}
        />
        
        <div className="shrink-0 flex items-center justify-center">
          {canRemove ? (
            <Button 
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              className="cost-item-delete w-10 h-10"
              title={`${t('calculator.removeCost')} ${rowLabel}`}
              aria-label={`${t('calculator.removeCost')} ${rowLabel}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          ) : (
            <div className="w-10"></div>
          )}
        </div>
      </div>
    </div>
  );
};
