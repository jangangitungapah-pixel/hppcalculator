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
      <Card className="p-8 text-center bg-surface-muted border-border border-dashed rounded-2xl">
        <p className="text-text-muted">{t('pricing.sourceRequired')}</p>
      </Card>
    );
  }

  return (
    <div className="pricing-grid">
      {/* Left Column: Input Steps */}
      <div className="space-y-5">
        <div className="pricing-step-card">
          <h3 className="font-bold text-text-primary text-base mb-1">1. Pengaturan Reseller</h3>
          <p className="text-xs text-text-secondary mb-4">Tentukan target profit Anda dan margin untuk komisi reseller Anda.</p>
          
          <div className="space-y-4">
            <Input
              label={t('pricing.ownerTargetMargin') + " (%)"}
              name="ownerTargetMarginPercent"
              type="number"
              value={formData.ownerTargetMarginPercent || ''}
              onChange={handleChange}
              error={validationErrors?.ownerTargetMarginPercent}
            />
            <Input
              label={t('pricing.resellerTargetMargin') + " (%)"}
              name="resellerTargetMarginPercent"
              type="number"
              value={formData.resellerTargetMarginPercent || ''}
              onChange={handleChange}
              error={validationErrors?.resellerTargetMarginPercent}
            />
            <Input
              label={t('pricing.moq') + " (Unit)"}
              name="moq"
              type="number"
              value={formData.moq || ''}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Sticky Result Preview */}
      <div className="pricing-result-panel">
        <h3 className="font-bold text-text-primary text-base">2. Hasil Analisis Harga</h3>
        
        {validationErrors?.hppPerUnit ? (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex gap-2 items-start text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{validationErrors.hppPerUnit}</p>
            </div>
          </Card>
        ) : result ? (
          <div className="space-y-4">
            {/* Owner/Reseller Split Card */}
            <div className="pricing-result-hero profit-good">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs opacity-85 uppercase tracking-wider mb-1">Harga Grosir</div>
                  <div className="text-xl font-extrabold tracking-tight">
                    {formatCurrency(result.wholesalePrice, lang, currency)}
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-85 uppercase tracking-wider mb-1">Rekomendasi Jual</div>
                  <div className="text-xl font-extrabold tracking-tight text-text-primary">
                    {formatCurrency(result.resellerSuggestedPrice, lang, currency)}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="bg-surface-muted/50 border border-border-soft rounded-xl px-4 py-2 mt-2">
              <div className="pricing-result-metric">
                <span className="text-xs text-text-secondary">Profit Anda (Owner)</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-status-good block">
                    {formatCurrency(result.ownerProfitPerUnit, lang, currency)}
                  </span>
                  <span className="text-xs text-text-muted">
                    Margin {formatPercent(result.ownerMarginPercent, lang)}
                  </span>
                </div>
              </div>
              
              <div className="pricing-result-metric">
                <span className="text-xs text-text-secondary">Profit Reseller</span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-text-primary block">
                    {formatCurrency(result.resellerProfitPerUnit, lang, currency)}
                  </span>
                  <span className="text-xs text-text-muted">
                    Margin {formatPercent(result.resellerMarginPercent, lang)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <TierPricingTable tiers={tierResult} />

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
