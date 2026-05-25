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
      <Card className="p-8 text-center bg-gray-50 border-gray-100 border-dashed">
        <p className="text-text-tertiary">{t('pricing.sourceRequired')}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-5 border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-semibold text-text-primary">
            {t('pricing.profilesTitle')}
          </label>
          {!hasProfiles && (
            <Button variant="ghost" size="sm" onClick={loadPresetChannelProfiles}>
              {t('pricing.loadPresetProfiles')}
            </Button>
          )}
        </div>
        
        <select
          value={profileId}
          onChange={(e) => setProfileId(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
        >
          <option value="">-- Pilih Profil Titip Jual --</option>
          {consignmentProfiles.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        
        {profileId && <PricingDisclaimer className="mt-3" />}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-5 border-gray-200">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Input Harga & Potongan</h3>
            
            <div className="space-y-4">
              <Input
                label={t('pricing.sellingPrice')}
                name="sellingPrice"
                type="number"
                value={formData.sellingPrice || ''}
                onChange={handleChange}
                placeholder="0"
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
                label={t('pricing.storeFee')}
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
                label="Target Margin (%)"
                name="targetMarginPercent"
                type="number"
                value={formData.targetMarginPercent || ''}
                onChange={handleChange}
              />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <PricingResultSummary result={{...result, recommendedPrice}} showRecommended={true} />
          
          {result && (
            <FeeBreakdownCard 
              storeFee={result.storeFee}
              totalFees={result.storeFee}
            />
          )}

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
