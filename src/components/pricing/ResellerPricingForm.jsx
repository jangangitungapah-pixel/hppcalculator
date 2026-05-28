import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { calculateResellerProfitBreakdown, calculateResellerTierPricing, validateResellerPricingInput } from '../../lib/channelPricing/resellerPricing';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { TierPricingTable } from './TierPricingTable';
import { formatCurrency, formatPercent } from '../../lib/calculations';
import { AlertCircle, Plus, X } from 'lucide-react';

export const ResellerPricingForm = ({ sourceData, onSave }) => {
  const { t, lang, settings } = useLanguage();
  const currency = settings?.currency || 'IDR';

  const [formData, setFormData] = useState({
    ownerTargetMarginPercent: 30,
    resellerTargetMarginPercent: 25,
    moq: 10
  });

  const [tiers, setTiers] = useState([
    { minQty: 10, ownerTargetMarginPercent: 30, resellerTargetMarginPercent: 25 },
    { minQty: 50, ownerTargetMarginPercent: 25, resellerTargetMarginPercent: 30 },
    { minQty: 100, ownerTargetMarginPercent: 20, resellerTargetMarginPercent: 35 }
  ]);

  // Sync Tier 1 (base tier) of tiers with base inputs
  useEffect(() => {
    setTiers(prev => {
      const next = [...prev];
      if (next[0]) {
        next[0] = {
          ...next[0],
          minQty: formData.moq,
          ownerTargetMarginPercent: formData.ownerTargetMarginPercent,
          resellerTargetMarginPercent: formData.resellerTargetMarginPercent
        };
      } else {
        next.push({
          minQty: formData.moq,
          ownerTargetMarginPercent: formData.ownerTargetMarginPercent,
          resellerTargetMarginPercent: formData.resellerTargetMarginPercent
        });
      }
      return next;
    });
  }, [formData.moq, formData.ownerTargetMarginPercent, formData.resellerTargetMarginPercent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const handleTierChange = (index, field, value) => {
    setTiers(prev => prev.map((t, idx) => idx === index ? { ...t, [field]: value } : t));
  };

  const handleAddTier = () => {
    const lastTier = tiers[tiers.length - 1] || { minQty: 10, ownerTargetMarginPercent: 30, resellerTargetMarginPercent: 25 };
    setTiers(prev => [
      ...prev,
      {
        minQty: lastTier.minQty + 50,
        ownerTargetMarginPercent: Math.max(0, lastTier.ownerTargetMarginPercent - 5),
        resellerTargetMarginPercent: lastTier.resellerTargetMarginPercent + 5
      }
    ]);
  };

  const handleRemoveTier = (index) => {
    if (index === 0) return; // Disallow deleting base tier
    setTiers(prev => prev.filter((_, idx) => idx !== index));
  };

  const baseValidationErrors = useMemo(() => {
    if (!sourceData) return null;
    return validateResellerPricingInput({
      hppPerUnit: sourceData.hppPerUnit,
      ...formData
    });
  }, [sourceData, formData]);

  const tierValidationErrors = useMemo(() => {
    const errors = tiers.map((tier, idx) => {
      const err = {};
      if (tier.minQty <= 0) {
        err.minQty = 'Min Qty harus lebih dari 0';
      }
      if (tier.ownerTargetMarginPercent >= 100) {
        err.ownerTargetMarginPercent = 'Margin tidak boleh >= 100%';
      }
      if (tier.resellerTargetMarginPercent >= 100) {
        err.resellerTargetMarginPercent = 'Margin tidak boleh >= 100%';
      }
      // Check strictly ascending order
      if (idx > 0 && tier.minQty <= tiers[idx - 1].minQty) {
        err.minQty = `Harus lebih besar dari Tier ${idx}`;
      }
      return Object.keys(err).length > 0 ? err : null;
    });
    return errors.some(e => e !== null) ? errors : null;
  }, [tiers]);

  const result = useMemo(() => {
    if (baseValidationErrors || !sourceData || sourceData.hppPerUnit <= 0) return null;
    
    return calculateResellerProfitBreakdown({
      hppPerUnit: sourceData.hppPerUnit,
      ...formData,
      roundingStep: settings?.roundingStep || 1000
    });
  }, [sourceData, formData, settings, baseValidationErrors]);

  const tierResult = useMemo(() => {
    if (tierValidationErrors || !sourceData || sourceData.hppPerUnit <= 0) return null;
    
    return calculateResellerTierPricing({
      hppPerUnit: sourceData.hppPerUnit,
      tiers,
      roundingStep: settings?.roundingStep || 1000
    });
  }, [sourceData, tiers, settings, tierValidationErrors]);

  const canSave = result && !tierValidationErrors;

  const handleSave = () => {
    if (!canSave) return;
    
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
        {/* Step 1: Base Configuration */}
        <div className="pricing-step-card">
          <h3 className="font-bold text-text-primary text-base mb-1">1. Pengaturan Reseller</h3>
          <p className="text-xs text-text-secondary mb-4">Tentukan target profit Anda dan margin untuk komisi reseller Anda.</p>
          
          <div className="space-y-4">
            <Input
              label={t('pricing.ownerTargetMargin')}
              name="ownerTargetMarginPercent"
              type="number"
              value={formData.ownerTargetMarginPercent || ''}
              onChange={handleChange}
              error={baseValidationErrors?.ownerTargetMarginPercent}
            />
            <Input
              label={t('pricing.resellerTargetMargin')}
              name="resellerTargetMarginPercent"
              type="number"
              value={formData.resellerTargetMarginPercent || ''}
              onChange={handleChange}
              error={baseValidationErrors?.resellerTargetMarginPercent}
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

        {/* Step 2: Tier Configuration */}
        <div className="pricing-step-card">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-text-primary text-base">2. Skema Harga Bertingkat</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTier}
              className="text-xs py-1 px-2 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Tier
            </Button>
          </div>
          <p className="text-xs text-text-secondary mb-4">
            Atur kuantitas minimum order (MOQ) dan target margin untuk setiap level reseller (grosir).
          </p>
          
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {tiers.map((tier, idx) => {
              const tierError = tierValidationErrors?.[idx];
              return (
                <div key={idx} className="p-3 bg-surface-muted/40 border border-border-soft rounded-xl text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-text-secondary">Tier #{idx + 1} {idx === 0 ? '(Base / MOQ)' : ''}</span>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTier(idx)}
                        className="p-1 text-status-loss hover:bg-status-loss/10 rounded-md transition-colors"
                        title="Hapus Tier"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-text-muted font-semibold uppercase block mb-1">Min Qty</label>
                      <input
                        type="number"
                        value={tier.minQty || ''}
                        disabled={idx === 0}
                        onChange={(e) => handleTierChange(idx, 'minQty', Number(e.target.value) || 0)}
                        className={`w-full px-2 py-1 bg-surface border rounded-md text-xs outline-none focus:border-brand-primary disabled:opacity-60 ${
                          tierError?.minQty ? 'border-red-500 focus:border-red-500' : 'border-border'
                        }`}
                      />
                      {tierError?.minQty && (
                        <span className="text-[9px] text-red-500 mt-0.5 block leading-tight">{tierError.minQty}</span>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] text-text-muted font-semibold uppercase block mb-1">Margin Owner (%)</label>
                      <input
                        type="number"
                        value={tier.ownerTargetMarginPercent || ''}
                        disabled={idx === 0}
                        onChange={(e) => handleTierChange(idx, 'ownerTargetMarginPercent', Number(e.target.value) || 0)}
                        className={`w-full px-2 py-1 bg-surface border rounded-md text-xs outline-none focus:border-brand-primary disabled:opacity-60 ${
                          tierError?.ownerTargetMarginPercent ? 'border-red-500 focus:border-red-500' : 'border-border'
                        }`}
                      />
                      {tierError?.ownerTargetMarginPercent && (
                        <span className="text-[9px] text-red-500 mt-0.5 block leading-tight">{tierError.ownerTargetMarginPercent}</span>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] text-text-muted font-semibold uppercase block mb-1">Margin Reseller (%)</label>
                      <input
                        type="number"
                        value={tier.resellerTargetMarginPercent || ''}
                        disabled={idx === 0}
                        onChange={(e) => handleTierChange(idx, 'resellerTargetMarginPercent', Number(e.target.value) || 0)}
                        className={`w-full px-2 py-1 bg-surface border rounded-md text-xs outline-none focus:border-brand-primary disabled:opacity-60 ${
                          tierError?.resellerTargetMarginPercent ? 'border-red-500 focus:border-red-500' : 'border-border'
                        }`}
                      />
                      {tierError?.resellerTargetMarginPercent && (
                        <span className="text-[9px] text-red-500 mt-0.5 block leading-tight">{tierError.resellerTargetMarginPercent}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Sticky Result Preview */}
      <div className="pricing-result-panel">
        <h3 className="font-bold text-text-primary text-base">3. Hasil Analisis Harga</h3>
        
        {baseValidationErrors?.hppPerUnit ? (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex gap-2 items-start text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{baseValidationErrors.hppPerUnit}</p>
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

        {tierResult && <TierPricingTable tiers={tierResult} />}

        <Button 
          className="w-full py-3 mt-2" 
          onClick={handleSave}
          disabled={!canSave}
        >
          {t('pricing.saveSimulation')}
        </Button>
      </div>
    </div>
  );
};
