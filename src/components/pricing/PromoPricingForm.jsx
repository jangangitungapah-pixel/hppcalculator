import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { calculatePromoProfit, calculateBogoProfit } from '../../lib/channelPricing/promoPricing';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
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
      <Card className="p-8 text-center bg-gray-50 border-gray-100 border-dashed">
        <p className="text-text-tertiary">{t('pricing.sourceRequired')}</p>
      </Card>
    );
  }

  const isBogo = formData.promoType === 'bogo';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-5 border-gray-200">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Pengaturan Promo</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  {t('pricing.promoType')}
                </label>
                <select
                  name="promoType"
                  value={formData.promoType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                >
                  <option value="percent">{t('pricing.percentDiscount')}</option>
                  <option value="fixed">{t('pricing.fixedDiscount')}</option>
                  <option value="voucher">{t('pricing.voucherSubsidy')}</option>
                  <option value="bogo">{t('pricing.bogo')}</option>
                </select>
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
                  label={t('pricing.percentDiscount')}
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
          </Card>
        </div>

        <div className="space-y-4">
          {result && (
            <Card className="p-4 bg-brand-soft border-brand-primary/20 mb-4">
              <div className="text-sm font-medium text-text-tertiary mb-1">
                {isBogo ? t('pricing.effectivePrice') : t('pricing.finalPrice')}
              </div>
              <div className="text-xl font-bold text-brand-primary">
                {formatCurrency(isBogo ? result.effectiveRevenuePerUnit : result.finalPrice, lang, currency)}
              </div>
            </Card>
          )}

          <PricingResultSummary result={result} showRecommended={false} />
          
          <Button 
            className="w-full py-3" 
            onClick={handleSave}
            disabled={!result}
          >
            {t('pricing.saveSimulation')}
          </Button>
        </div>
      </div>
    </div>
  );
};
