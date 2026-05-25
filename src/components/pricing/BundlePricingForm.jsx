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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-5 border-gray-200">
            <h3 className="text-sm font-semibold text-text-primary mb-4">{t('pricing.bundleItems')}</h3>
            
            <div className="space-y-4 mb-4">
              {items.map((item, idx) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <div className="font-medium text-text-primary text-sm">{item.sourceNameSnapshot}</div>
                    <div className="text-xs text-text-tertiary">
                      {item.quantity} x {formatCurrency(item.hppPerUnit, lang, currency)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-sm">
                      {formatCurrency(item.hppPerUnit * item.quantity, lang, currency)}
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-sm text-text-tertiary text-center py-2 italic">
                  Belum ada item di paket ini.
                </div>
              )}
            </div>

            <div className="p-4 border border-gray-200 rounded-xl space-y-3 bg-white">
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
          </Card>

          <Card className="p-5 border-gray-200">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Detail Paket</h3>
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
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={t('pricing.percentDiscount')}
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
          </Card>
        </div>

        <div className="space-y-4">
          {validationErrors?.items ? (
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex gap-2 items-start text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{validationErrors.items}</p>
              </div>
            </Card>
          ) : result ? (
            <>
              <Card className="p-4 bg-gray-50 border-gray-200 mb-4 flex justify-between items-center">
                <span className="font-medium text-text-secondary">{t('pricing.totalBundleHpp')}</span>
                <span className="text-lg font-bold text-text-primary">
                  {formatCurrency(result.baseTotalHpp, lang, currency)}
                </span>
              </Card>

              {result.discountAmount > 0 && (
                <Card className="p-4 bg-green-50 border-green-200 mb-4 flex justify-between items-center">
                  <span className="font-medium text-green-700">Diskon Paket</span>
                  <span className="font-bold text-green-700">
                    -{formatCurrency(result.discountAmount, lang, currency)}
                  </span>
                </Card>
              )}

              <PricingResultSummary result={result} />
            </>
          ) : null}

          <Button 
            className="w-full py-3" 
            onClick={handleSave}
            disabled={!result || items.length === 0}
          >
            {t('pricing.saveSimulation')}
          </Button>
        </div>
      </div>
    </div>
  );
};
