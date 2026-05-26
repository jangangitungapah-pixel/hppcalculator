import React from 'react';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { AlertTriangle, Smile, ShieldAlert } from 'lucide-react';

export const SellingPriceSection = ({ 
  sellingPrice, 
  onFieldChange, 
  error, 
  result, 
  t 
}) => {
  const isLoss = result?.profitStatus?.key === 'loss';
  const isLow = result?.profitStatus?.key === 'low';
  const isGood = result?.profitStatus?.key === 'good' || result?.profitStatus?.key === 'excellent' || result?.profitStatus?.key === 'okay';

  return (
    <div className="calculator-field">
      <Input 
        type="number"
        min="0"
        prefix="Rp"
        label={t('calculator.sellingPrice', 'Harga Jual')}
        placeholder="0"
        value={sellingPrice}
        onChange={(e) => onFieldChange('sellingPrice', e.target.value)}
        error={error}
        helperText="Harga jual dipakai untuk menghitung profit dan margin."
      />

      {result && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-text-secondary">Status Keuntungan:</span>
            <Badge variant={result.profitStatus.key}>
              {t(`result.status.${result.profitStatus.key}`, result.profitStatus.key.toUpperCase())}
            </Badge>
          </div>

          {isLoss && (
            <div className="selling-price-hint loss flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{t('result.summaryLoss', 'Harga jual kamu masih di bawah HPP. Produk ini berpotensi rugi.')}</p>
            </div>
          )}

          {isLow && (
            <div className="selling-price-hint low flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{t('result.summaryLow', 'Untungnya masih tipis. Hati-hati dengan biaya tambahan atau promo.')}</p>
            </div>
          )}

          {isGood && (
            <div className="selling-price-hint good flex items-start gap-2">
              <Smile className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{t('result.summaryGood', 'Margin produk ini sudah bagus untuk bisnis F&B kecil.')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
