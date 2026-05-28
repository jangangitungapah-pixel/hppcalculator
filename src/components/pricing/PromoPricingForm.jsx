import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { calculatePromoProfit, calculateBogoProfit } from '../../lib/channelPricing/promoPricing';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ChevronDown } from 'lucide-react';
import { PricingResultSummary } from './PricingResultSummary';
import { formatCurrency } from '../../lib/calculations';

export const PromoPricingForm = ({ sourceData, onSave }) => {
  const { t, lang, settings } = useLanguage();
  const currency = settings?.currency || 'IDR';

  const [formData, setFormData] = useState({
    promoType: 'percent',
    normalSellingPrice: sourceData?.sellingPrice || 0,
    quantity: 1,
    discountPercent: 0,
    discountFixed: 0,
    sellerVoucherSubsidy: 0,
    bogoPaidQty: 1,
    bogoFreeQty: 1
  });

  useEffect(() => {
    if (sourceData && sourceData.sellingPrice) {
      setFormData(prev => ({ ...prev, normalSellingPrice: sourceData.sellingPrice }));
    }
  }, [sourceData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'promoType' ? value : (Number(value) || 0) }));
  };

  const result = useMemo(() => {
    if (!sourceData || sourceData.hppPerUnit <= 0) return null;
    
    if (formData.promoType === 'bogo') {
      return calculateBogoProfit({
        hppPerUnit: sourceData.hppPerUnit,
        normalSellingPrice: formData.normalSellingPrice,
        bogoPaidQty: formData.bogoPaidQty,
        bogoFreeQty: formData.bogoFreeQty
      });
    }
    
    return calculatePromoProfit({
      hppPerUnit: sourceData.hppPerUnit,
      normalSellingPrice: formData.normalSellingPrice,
      quantity: formData.quantity,
      discountPercent: formData.promoType === 'percent' ? formData.discountPercent : 0,
      discountFixed: formData.promoType === 'fixed' ? formData.discountFixed : 0,
      sellerVoucherSubsidy: formData.promoType === 'voucher' ? formData.sellerVoucherSubsidy : 0
    });
  }, [sourceData, formData]);

  const handleSave = () => {
    if (!result) return;
    
    const input = {
      ...sourceData,
      ...formData
    };
    
    onSave(input, result, 'promo');
  };

  if (!sourceData || !sourceData.hppPerUnit) {
    return (
      <Card className="p-8 text-center bg-surface-muted border-border border-dashed rounded-2xl">
        <p className="text-text-muted">{t('pricing.sourceRequired')}</p>
      </Card>
    );
  }

  const isBogo = formData.promoType === 'bogo';

  return (
    <div className="pricing-grid">
      {/* Left Column: Form Inputs */}
      <div className="space-y-5">
        <div className="pricing-step-card">
          <h3 className="font-bold text-text-primary text-base mb-1">1. Pengaturan Promo</h3>
          <p className="text-xs text-text-secondary mb-4">Tentukan jenis promo diskon atau BOGO (Beli X Gratis Y) yang akan disimulasikan.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                {t('pricing.promoType')}
              </label>
              <div className="relative">
                <select
                  name="promoType"
                  value={formData.promoType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none appearance-none pr-10"
                >
                  <option value="percent">{t('pricing.percentDiscount')}</option>
                  <option value="fixed">{t('pricing.fixedDiscount')}</option>
                  <option value="voucher">{t('pricing.voucherSubsidy')}</option>
                  <option value="bogo">{t('pricing.bogo')}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <Input
              label={t('pricing.currentSellingPrice')}
              name="normalSellingPrice"
              type="number"
              value={formData.normalSellingPrice || ''}
              onChange={handleChange}
            />
            
            {!isBogo && (
              <Input
                label={t('pricing.quantity')}
                name="quantity"
                type="number"
                value={formData.quantity || ''}
                onChange={handleChange}
                min="1"
              />
            )}

            {formData.promoType === 'percent' && (
              <Input
                label={t('pricing.percentDiscount') + " (%)"}
                name="discountPercent"
                type="number"
                value={formData.discountPercent || ''}
                onChange={handleChange}
              />
            )}

            {formData.promoType === 'fixed' && (
              <Input
                label={t('pricing.fixedDiscount')}
                name="discountFixed"
                type="number"
                value={formData.discountFixed || ''}
                onChange={handleChange}
              />
            )}

            {formData.promoType === 'voucher' && (
              <Input
                label={t('pricing.voucherSubsidy')}
                name="sellerVoucherSubsidy"
                type="number"
                value={formData.sellerVoucherSubsidy || ''}
                onChange={handleChange}
              />
            )}

            {isBogo && (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={t('pricing.bogoPaidQty')}
                  name="bogoPaidQty"
                  type="number"
                  value={formData.bogoPaidQty || ''}
                  onChange={handleChange}
                  min="1"
                />
                <Input
                  label={t('pricing.bogoFreeQty')}
                  name="bogoFreeQty"
                  type="number"
                  value={formData.bogoFreeQty || ''}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Sticky Result Preview */}
      <div className="pricing-result-panel">
        <h3 className="font-bold text-text-primary text-base">2. Hasil Simulasi Promo</h3>
        
        {result && (
          <div className="p-4 bg-brand-soft border border-brand-primary/20 rounded-xl">
            <div className="text-xs font-semibold text-brand-primary mb-1">
              {isBogo ? t('pricing.effectivePrice') : t('pricing.finalPrice')}
            </div>
            <div className="text-xl font-extrabold text-brand-primary">
              {formatCurrency(isBogo ? result.effectiveRevenuePerUnit : result.finalPrice, lang, currency)}
            </div>
          </div>
        )}

        <PricingResultSummary result={result} showRecommended={false} />
        
        <Button 
          className="w-full py-3 mt-2" 
          onClick={handleSave}
          disabled={!result}
        >
          {t('pricing.saveSimulation')}
        </Button>
      </div>
    </div>
  );
};
