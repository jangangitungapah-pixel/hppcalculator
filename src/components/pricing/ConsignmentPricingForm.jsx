import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useChannelProfiles } from '../../hooks/useChannelProfiles';
import { calculateConsignmentProfit, calculateConsignmentRecommendedPrice } from '../../lib/channelPricing/consignmentPricing';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { PricingDisclaimer } from './PricingDisclaimer';
import { PricingResultSummary } from './PricingResultSummary';
import { FeeBreakdownCard } from './FeeBreakdownCard';

export const ConsignmentPricingForm = ({ sourceData, onSave }) => {
  const { t, settings } = useLanguage();
  const { channelProfiles, loadPresetChannelProfiles, hasProfiles } = useChannelProfiles();
  
  const consignmentProfiles = channelProfiles.filter(p => p.type === 'consignment');
  
  const [profileId, setProfileId] = useState('');
  
  const [formData, setFormData] = useState({
    consignmentFeePercent: 20,
    fixedChannelCost: 0,
    sellingPrice: sourceData?.sellingPrice || 0,
    quantity: 1,
    targetMarginPercent: 30
  });

  useEffect(() => {
    if (sourceData && sourceData.sellingPrice) {
      setFormData(prev => ({ ...prev, sellingPrice: sourceData.sellingPrice }));
    }
  }, [sourceData]);

  useEffect(() => {
    if (profileId) {
      const profile = consignmentProfiles.find(p => p.id === profileId);
      if (profile) {
        setFormData(prev => ({
          ...prev,
          consignmentFeePercent: profile.consignmentFeePercent || 0,
          fixedChannelCost: profile.fixedChannelCost || 0
        }));
      }
    }
  }, [profileId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const result = useMemo(() => {
    if (!sourceData || sourceData.hppPerUnit <= 0) return null;
    
    return calculateConsignmentProfit({
      hppPerUnit: sourceData.hppPerUnit,
      sellingPrice: formData.sellingPrice,
      quantity: formData.quantity,
      consignmentFeePercent: formData.consignmentFeePercent,
      fixedChannelCost: formData.fixedChannelCost
    });
  }, [sourceData, formData]);

  const recommendedPrice = useMemo(() => {
    if (!sourceData || sourceData.hppPerUnit <= 0) return null;
    
    const rec = calculateConsignmentRecommendedPrice({
      hppPerUnit: sourceData.hppPerUnit,
      quantity: formData.quantity,
      consignmentFeePercent: formData.consignmentFeePercent,
      fixedChannelCost: formData.fixedChannelCost,
      targetMarginPercent: formData.targetMarginPercent,
      roundingStep: settings?.roundingStep || 1000
    });
    
    return rec.success ? rec.recommendedPrice : null;
  }, [sourceData, formData, settings]);

  const handleSave = () => {
    if (!result) return;
    const profile = consignmentProfiles.find(p => p.id === profileId);
    
    const input = {
      ...sourceData,
      ...formData,
      channelProfileId: profileId,
      channelProfileSnapshot: profile || null
    };
    
    const fullResult = {
      ...result,
      recommendedPrice
    };
    
    onSave(input, fullResult, 'consignment');
  };

  if (!sourceData || !sourceData.hppPerUnit) {
    return (
      <Card className="p-8 text-center bg-surface-muted border-border border-dashed rounded-2xl">
        <p className="text-text-muted">{t('pricing.sourceRequired')}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Channel Profile */}
      <div className="pricing-step-card">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
          <div>
            <h3 className="font-bold text-text-primary text-base">1. Profil Titip Jual (Konsinyasi)</h3>
            <p className="text-xs text-text-secondary mt-0.5">Pilih outlet titip jual atau toko fisik mitra Anda.</p>
          </div>
          {!hasProfiles && (
            <Button variant="ghost" size="sm" onClick={loadPresetChannelProfiles}>
              {t('pricing.loadPresetProfiles')}
            </Button>
          )}
        </div>
        
        {consignmentProfiles.length > 0 ? (
          <div className="pricing-channel-grid">
            {consignmentProfiles.map(p => {
              const isSelected = profileId === p.id;
              const feeDesc = p.consignmentFeePercent > 0 ? `${p.consignmentFeePercent}%` : '0%';
              
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setProfileId(isSelected ? '' : p.id)}
                  className={`pricing-channel-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="font-bold text-sm text-text-primary">{p.name}</div>
                  <div className="text-xs text-text-muted">Bagi Hasil: {feeDesc}</div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-primary" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-border rounded-xl">
            <p className="text-sm text-text-secondary mb-3">Belum ada profil konsinyasi.</p>
            <Button size="sm" variant="outline" onClick={loadPresetChannelProfiles}>
              Muat Preset Bawaan
            </Button>
          </div>
        )}
        
        {profileId && <PricingDisclaimer className="mt-4" />}
      </div>

      <div className="pricing-grid">
        {/* Left Column: Form Inputs */}
        <div className="space-y-5">
          <div className="pricing-step-card">
            <h3 className="font-bold text-text-primary text-base mb-1">2. Harga & Bagi Hasil</h3>
            <p className="text-xs text-text-secondary mb-4">Atur harga jual di toko mitra dan biaya konsinyasi terkait.</p>
            
            <div className="space-y-4">
              <Input
                label={t('pricing.sellingPrice')}
                name="sellingPrice"
                type="number"
                value={formData.sellingPrice || ''}
                onChange={handleChange}
                placeholder="0"
                className="font-bold text-lg"
              />
              <Input
                label={t('pricing.quantity')}
                name="quantity"
                type="number"
                value={formData.quantity || ''}
                onChange={handleChange}
                min="1"
              />
              <Input
                label={t('pricing.consignmentFeePercent')}
                name="consignmentFeePercent"
                type="number"
                value={formData.consignmentFeePercent || ''}
                onChange={handleChange}
              />
              <Input
                label={t('pricing.fixedChannelCost')}
                name="fixedChannelCost"
                type="number"
                value={formData.fixedChannelCost || ''}
                onChange={handleChange}
              />
              <Input
                label={t('pricing.targetMargin')}
                name="targetMarginPercent"
                type="number"
                value={formData.targetMarginPercent || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Result Preview */}
        <div className="pricing-result-panel">
          <h3 className="font-bold text-text-primary text-base">3. Hasil & Rekomendasi</h3>
          
          <PricingResultSummary result={{...result, recommendedPrice}} showRecommended={true} />
          
          {result && (
            <FeeBreakdownCard 
              storeFee={result.storeFee}
              totalFees={result.storeFee}
            />
          )}

          <Button 
            className="w-full py-3 mt-2" 
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
