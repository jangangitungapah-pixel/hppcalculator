import React from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { parseLocalizedNumber } from '../../lib/data/calculationMapper';
import { AlertCircle } from 'lucide-react';

export const ProductionOutputSection = ({ 
  outputQuantity, 
  failedQuantity, 
  sellingUnit, 
  customSellingUnit,
  onFieldChange, 
  errors, 
  t 
}) => {
  const unitOptions = [
    { value: 'pcs', label: 'Pcs' },
    { value: 'porsi', label: 'Porsi' },
    { value: 'cup', label: 'Cup' },
    { value: 'box', label: 'Box' },
    { value: 'custom', label: 'Lainnya' },
  ];

  // Simple live preview calculation
  const outputVal = parseLocalizedNumber(outputQuantity);
  const failedVal = parseLocalizedNumber(failedQuantity);
  const sellableQty = Math.max(0, outputVal - failedVal);
  const displayUnit = sellingUnit === 'custom' ? customSellingUnit?.trim() || 'satuan' : sellingUnit;

  return (
    <div className="flex flex-col gap-4">
      <div className="production-grid">
        {/* Output Quantity + Unit */}
        <div className="production-mini-card">
          <div className="flex gap-2 items-start w-full">
            <Input 
              type="number"
              min="1"
              label={t('calculator.outputQuantity', 'Jumlah Hasil Jual')}
              placeholder="0"
              value={outputQuantity}
              onChange={(e) => onFieldChange('outputQuantity', e.target.value)}
              containerClassName="flex-1"
              error={errors?.outputQuantity}
            />
            <Select 
              label={t('calculator.sellingUnit', 'Satuan')}
              options={unitOptions}
              value={sellingUnit}
              onChange={(e) => onFieldChange('sellingUnit', e.target.value)}
              containerClassName="w-[110px] shrink-0"
              error={errors?.sellingUnit}
            />
          </div>
          {sellingUnit === 'custom' && (
            <Input
              label={t('calculator.customSellingUnit', 'Nama satuan')}
              placeholder="Cth: loyang"
              value={customSellingUnit || ''}
              onChange={(e) => onFieldChange('customSellingUnit', e.target.value)}
              error={errors?.sellingUnit}
            />
          )}
        </div>

        {/* Failed Quantity */}
        <div className="production-mini-card">
          <Input 
            type="number"
            min="0"
            label={t('calculator.failedQuantity', 'Jumlah Gagal (opsional)')}
            placeholder="0"
            value={failedQuantity}
            onChange={(e) => onFieldChange('failedQuantity', e.target.value)}
            error={errors?.failedQuantity}
          />
        </div>
      </div>

      {/* Info Warning */}
      <div className="flex items-start gap-2 text-xs text-text-secondary bg-surface-cream border border-border-soft p-3.5 rounded-xl">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Produk gagal akan mengurangi jumlah yang bisa dijual, sehingga HPP per unit bisa naik.
        </p>
      </div>

      {/* Live Preview */}
      {outputVal > 0 && (
        <div className="sellable-preview">
          <span>Bisa Dijual:</span>
          <span className="font-extrabold text-base">
            {sellableQty} {displayUnit}
          </span>
        </div>
      )}
    </div>
  );
};
