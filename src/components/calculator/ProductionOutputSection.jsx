import React from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { parseLocalizedNumber } from '../../lib/data/calculationMapper';
import { AlertCircle, ShoppingBag } from 'lucide-react';

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
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        {/* Output Quantity + Unit */}
        <div className="col-span-1 sm:col-span-7 flex flex-col gap-3">
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
              className="font-semibold text-sm"
            />
            <Select 
              label={t('calculator.sellingUnit', 'Satuan')}
              options={unitOptions}
              value={sellingUnit}
              onChange={(e) => onFieldChange('sellingUnit', e.target.value)}
              containerClassName="w-[110px] shrink-0"
              error={errors?.sellingUnit}
              className="font-semibold text-sm"
            />
          </div>
          {sellingUnit === 'custom' && (
            <Input
              label={t('calculator.customSellingUnit', 'Nama satuan')}
              placeholder="Cth: loyang"
              value={customSellingUnit || ''}
              onChange={(e) => onFieldChange('customSellingUnit', e.target.value)}
              error={errors?.sellingUnit}
              className="font-semibold text-sm"
            />
          )}
        </div>

        {/* Failed Quantity */}
        <div className="col-span-1 sm:col-span-5">
          <Input 
            type="number"
            min="0"
            label={t('calculator.failedQuantity', 'Jumlah Gagal (opsional)')}
            placeholder="0"
            value={failedQuantity}
            onChange={(e) => onFieldChange('failedQuantity', e.target.value)}
            error={errors?.failedQuantity}
            className="font-semibold text-sm"
          />
        </div>
      </div>

      {/* Info Warning */}
      <div className="flex items-start gap-3 text-xs text-amber-800 bg-amber-500/[0.05] border border-amber-500/10 p-4 rounded-2xl shadow-xs leading-relaxed font-semibold">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p>
          Produk gagal akan mengurangi jumlah yang bisa dijual, sehingga HPP per unit bisa naik.
        </p>
      </div>

      {/* Live Preview */}
      {outputVal > 0 && (
        <div className="mt-1 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 rounded-2xl flex justify-between items-center text-sm font-extrabold shadow-xs transition-all hover:scale-101">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Bisa Dijual:</span>
          </div>
          <span className="text-base font-black px-3 py-1 bg-emerald-500/20 text-emerald-900 rounded-full">
            {sellableQty} {displayUnit}
          </span>
        </div>
      )}
    </div>
  );
};
