import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { calculateResellerProfitBreakdown, calculateResellerTierPricing, validateResellerPricingInput } from '../../lib/channelPricing/resellerPricing';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { TierPricingTable } from './TierPricingTable';
import { formatCurrency, formatPercent } from '../../lib/calculations';
import { AlertCircle } from 'lucide-react';

export const ResellerPricingForm = ({ sourceData, onSave }) => {
  const { t, lang, settings } = useLanguage();
  const currency = settings?.currency || 'IDR';

  const [formData, setFormData] = useState({
    ownerTargetMarginPercent: 30,
    resellerTargetMarginPercent: 25,
    moq: 10
  });

  const [tiers] = useState([
    { minQty: 10, ownerTargetMarginPercent: 30, resellerTargetMarginPercent: 25 },
    { minQty: 50, ownerTargetMarginPercent: 25, resellerTargetMarginPercent: 30 },
    { minQty: 100, ownerTargetMarginPercent: 20, resellerTargetMarginPercent: 35 }
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const validationErrors = useMemo(() => {
    if (!sourceData) return null;
    return validateResellerPricingInput({
      hppPerUnit: sourceData.hppPerUnit,
      ...formData
    });
  }, [sourceData, formData]);

  const result = useMemo(() => {
    if (validationErrors || !sourceData || sourceData.hppPerUnit <= 0) return null;
    
    return calculateResellerProfitBreakdown({
      hppPerUnit: sourceData.hppPerUnit,
      ...formData,
      roundingStep: settings?.roundingStep || 1000
    });
  }, [sourceData, formData, settings, validationErrors]);

  const tierResult = useMemo(() => {
    if (!sourceData || sourceData.hppPerUnit <= 0) return null;
    
    return calculateResellerTierPricing({
      hppPerUnit: sourceData.hppPerUnit,
      tiers,
      roundingStep: settings?.roundingStep || 1000
    });
  }, [sourceData, tiers, settings]);

  const handleSave = () => {
    if (!result) return;
    
    const input = {
      ...sourceData,
      ...formData,
      tiers
    };
    
    const fullResult = {
      ...result,
      tierPricing: tierResult
    };
    
    onSave(input, fullResult, 'reseller');
  };

  if (!sourceData || !sourceData.hppPerUnit) {
    return (
      <Card className="p-8 text-center bg-gray-50 border-gray-100 border-dashed">
        <p className="text-text-tertiary">{t('pricing.sourceRequired')}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-5 border-gray-200">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Pengaturan Reseller</h3>
            
            <div className="space-y-4">
              <Input
                label={t('pricing.ownerTargetMargin')}
                name="ownerTargetMarginPercent"
                type="number"
                value={formData.ownerTargetMarginPercent || ''}
                onChange={handleChange}
                error={validationErrors?.ownerTargetMarginPercent}
              />
              <Input
                label={t('pricing.resellerTargetMargin')}
                name="resellerTargetMarginPercent"
                type="number"
                value={formData.resellerTargetMarginPercent || ''}
                onChange={handleChange}
                error={validationErrors?.resellerTargetMarginPercent}
              />
              <Input
                label={t('pricing.moq')}
                name="moq"
                type="number"
                value={formData.moq || ''}
                onChange={handleChange}
                min="1"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {validationErrors?.hppPerUnit ? (
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex gap-2 items-start text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{validationErrors.hppPerUnit}</p>
              </div>
            </Card>
          ) : result ? (
            <Card className="p-5 border-brand-primary/30 bg-brand-soft overflow-hidden">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-text-tertiary mb-1">{t('pricing.wholesalePrice')}</h3>
                  <div className="text-xl font-bold text-brand-primary">
                    {formatCurrency(result.wholesalePrice, lang, currency)}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text-tertiary mb-1">{t('pricing.resellerSuggestedPrice')}</h3>
                  <div className="text-xl font-bold text-text-primary">
                    {formatCurrency(result.resellerSuggestedPrice, lang, currency)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-brand-primary/20">
                <div>
                  <div className="text-xs text-text-tertiary">{t('pricing.ownerProfit')}</div>
                  <div className="font-semibold text-text-secondary">{formatCurrency(result.ownerProfitPerUnit, lang, currency)}</div>
                  <div className="text-xs text-brand-primary">{formatPercent(result.ownerMarginPercent, lang)}</div>
                </div>
                <div>
                  <div className="text-xs text-text-tertiary">{t('pricing.resellerProfit')}</div>
                  <div className="font-semibold text-text-secondary">{formatCurrency(result.resellerProfitPerUnit, lang, currency)}</div>
                  <div className="text-xs text-brand-primary">{formatPercent(result.resellerMarginPercent, lang)}</div>
                </div>
              </div>
            </Card>
          ) : null}

          <TierPricingTable tiers={tierResult} />

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
