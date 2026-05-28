import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { calculateBundleProfit, calculateBundleSuggestedPrices, validateBundleInput } from '../../lib/channelPricing/bundlePricing';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { PricingResultSummary } from './PricingResultSummary';
import { formatCurrency } from '../../lib/calculations';
import { Trash2, AlertCircle } from 'lucide-react';
import { ProductSourcePicker } from './ProductSourcePicker';

export const BundlePricingForm = ({ onSave }) => {
  const { t, lang, settings } = useLanguage();
  const currency = settings?.currency || 'IDR';

  const [formData, setFormData] = useState({
    bundleName: '',
    bundleSellingPrice: 0,
    discountPercent: 0,
    discountFixed: 0,
    targetMarginPercent: 40
  });

  const [items, setItems] = useState([]);
  const [tempSource, setTempSource] = useState(null);
  const [tempQty, setTempQty] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'bundleName' ? value : (Number(value) || 0) }));
  };

  const handleAddItem = () => {
    if (!tempSource || !tempSource.hppPerUnit || tempQty <= 0) return;
    
    setItems(prev => [
      ...prev, 
      {
        id: crypto.randomUUID(),
        ...tempSource,
        quantity: tempQty
      }
    ]);
    
    setTempSource(null);
    setTempQty(1);
  };

  const handleRemoveItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const validationErrors = useMemo(() => {
    return validateBundleInput({ items });
  }, [items]);

  const result = useMemo(() => {
    if (items.length === 0) return null;
    
    const profitResult = calculateBundleProfit({
      items,
      bundleSellingPrice: formData.bundleSellingPrice,
      discountPercent: formData.discountPercent,
      discountFixed: formData.discountFixed
    });
    
    const recommendedPrice = calculateBundleSuggestedPrices(
      profitResult.baseTotalHpp, 
      formData.targetMarginPercent,
      settings?.roundingStep || 1000
    );
    
    return {
      ...profitResult,
      recommendedPrice
    };
  }, [items, formData, settings]);

  const handleSave = () => {
    if (!result || items.length === 0) return;
    
    const input = {
      ...formData,
      items
    };
    
    onSave(input, result, 'bundle');
  };

  return (
    <div className="pricing-grid">
      {/* Left Column: Form Inputs */}
      <div className="space-y-5">
        {/* Step 1: Bundle Items */}
        <div className="pricing-step-card">
          <h3 className="font-bold text-text-primary text-base mb-1">1. Isi Paket Produk (Bundle)</h3>
          <p className="text-xs text-text-secondary mb-4">Pilih produk dan tentukan jumlah unit yang masuk ke dalam paket ini.</p>
          
          <div className="space-y-4 mb-4">
            {items.map((item, idx) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-surface-muted/50 rounded-xl border border-border-soft">
                <div>
                  <div className="font-medium text-text-primary text-sm">{item.sourceNameSnapshot}</div>
                  <div className="text-xs text-text-muted">
                    {item.quantity} x {formatCurrency(item.hppPerUnit, lang, currency)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-semibold text-sm">
                    {formatCurrency(item.hppPerUnit * item.quantity, lang, currency)}
                  </div>
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    className="w-8 h-8 text-text-muted hover:text-status-loss hover:bg-status-lossBg rounded-lg"
                    aria-label={t('common.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-sm text-text-muted text-center py-4 border border-dashed border-border rounded-xl bg-surface-muted/30 italic">
                Belum ada item di paket ini. Tambahkan item di bawah.
              </div>
            )}
          </div>

          <div className="p-4 border border-zinc-200 rounded-xl space-y-3 bg-white shadow-xs">
            <h4 className="text-xs font-semibold text-text-secondary uppercase">{t('pricing.addBundleItem')}</h4>
            <ProductSourcePicker value={tempSource} onChange={setTempSource} />
            
            {tempSource && tempSource.sourceType === 'manual' && (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Nama Item"
                  value={tempSource.sourceNameSnapshot || ''}
                  onChange={(e) => setTempSource(prev => ({...prev, sourceNameSnapshot: e.target.value}))}
                />
                <Input
                  label={t('pricing.hppPerUnit')}
                  type="number"
                  value={tempSource.hppPerUnit || ''}
                  onChange={(e) => setTempSource(prev => ({...prev, hppPerUnit: Number(e.target.value) || 0}))}
                />
              </div>
            )}
            
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  label="Qty"
                  type="number"
                  value={tempQty}
                  onChange={(e) => setTempQty(Number(e.target.value) || 1)}
                  min="1"
                />
              </div>
              <Button 
                onClick={handleAddItem}
                disabled={!tempSource || !tempSource.hppPerUnit}
              >
                Tambah
              </Button>
            </div>
          </div>
        </div>

        {/* Step 2: Bundle Settings */}
        <div className="pricing-step-card">
          <h3 className="font-bold text-text-primary text-base mb-1">2. Detail Harga & Diskon Paket</h3>
          <p className="text-xs text-text-secondary mb-4 font-normal">Tentukan nama paket, harga jual kotor, dan komisi/potongan jika ada diskon khusus.</p>
          
          <div className="space-y-4">
            <Input
              label={t('pricing.bundleName')}
              name="bundleName"
              value={formData.bundleName}
              onChange={handleChange}
              placeholder="Cth: Paket Hemat Berdua"
            />
            <Input
              label={t('pricing.bundleSellingPrice')}
              name="bundleSellingPrice"
              type="number"
              value={formData.bundleSellingPrice || ''}
              onChange={handleChange}
              className="font-bold text-lg"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t('pricing.percentDiscount') + " (%)"}
                name="discountPercent"
                type="number"
                value={formData.discountPercent || ''}
                onChange={handleChange}
              />
              <Input
                label={t('pricing.fixedDiscount')}
                name="discountFixed"
                type="number"
                value={formData.discountFixed || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Sticky Result Preview */}
      <div className="pricing-result-panel">
        <h3 className="font-bold text-text-primary text-base">3. Hasil Analisis Paket</h3>
        
        {validationErrors?.items ? (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex gap-2 items-start text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{validationErrors.items}</p>
            </div>
          </Card>
        ) : result ? (
          <div className="space-y-4">
            <div className="bg-surface-muted/50 border border-border-soft rounded-xl px-4 py-2 mt-2">
              <div className="pricing-result-metric">
                <span className="text-xs text-text-secondary">{t('pricing.totalBundleHpp')}</span>
                <span className="text-sm font-bold text-text-primary">
                  {formatCurrency(result.baseTotalHpp, lang, currency)}
                </span>
              </div>

              {result.discountAmount > 0 && (
                <div className="pricing-result-metric">
                  <span className="text-xs text-status-good font-semibold">Diskon Paket</span>
                  <span className="text-sm font-bold text-status-good">
                    -{formatCurrency(result.discountAmount, lang, currency)}
                  </span>
                </div>
              )}
            </div>

            <PricingResultSummary result={result} />
          </div>
        ) : (
          <Card className="p-8 text-center bg-surface-muted border-border border-dashed rounded-2xl">
            <p className="text-sm text-text-muted">Tambahkan item untuk melihat hasil simulasi</p>
          </Card>
        )}

        <Button 
          className="w-full py-3 mt-2" 
          onClick={handleSave}
          disabled={!result || items.length === 0}
        >
          {t('pricing.saveSimulation')}
        </Button>
      </div>
    </div>
  );
};
