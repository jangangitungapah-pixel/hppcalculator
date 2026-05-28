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
        label={t('calculator.sellingPricePerUnit', 'Harga jual per satuan')}
        placeholder="0"
        value={sellingPrice}
        onChange={(e) => onFieldChange('sellingPrice', e.target.value)}
        error={error}
        helperText="Harga jual dipakai untuk menghitung profit dan margin."
        className="font-bold text-sm"
      />

      {result && (
        <div className="mt-4 pt-3 border-t border-dashed border-border/60">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-text-secondary">Status Keuntungan:</span>
            <Badge variant={result.profitStatus.key}>
              {t(`result.status.${result.profitStatus.key}`, result.profitStatus.key.toUpperCase())}
            </Badge>
          </div>

          {isLoss && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-800 p-4 rounded-2xl flex items-start gap-3 text-xs font-semibold leading-relaxed shadow-xs">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p>{t('result.summaryLoss', 'Harga jual kamu masih di bawah HPP. Produk ini berpotensi rugi.')}</p>
            </div>
          )}

          {isLow && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 p-4 rounded-2xl flex items-start gap-3 text-xs font-semibold leading-relaxed shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p>{t('result.summaryLow', 'Untungnya masih tipis. Hati-hati dengan biaya tambahan atau promo.')}</p>
            </div>
          )}

          {isGood && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 p-4 rounded-2xl flex items-start gap-3 text-xs font-semibold leading-relaxed shadow-xs">
              <Smile className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p>{t('result.summaryGood', 'Margin produk ini sudah bagus untuk bisnis F&B kecil.')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
