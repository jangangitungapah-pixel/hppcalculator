import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useChannelProfiles } from '../../hooks/useChannelProfiles';
import { calculateMarketplaceProfit, simulateMarketplacePricePoints } from '../../lib/channelPricing/marketplacePricing';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { PricingDisclaimer } from './PricingDisclaimer';
import { PricingResultSummary } from './PricingResultSummary';
import { FeeBreakdownCard } from './FeeBreakdownCard';
import { PricePointTable } from './PricePointTable';

export const MarketplacePricingForm = ({ sourceData, onSave }) => {
  const { t, settings } = useLanguage();
  const { channelProfiles, loadPresetChannelProfiles, hasProfiles } = useChannelProfiles();
  
  const marketplaceProfiles = channelProfiles.filter(p => p.type === 'marketplace' || p.type === 'offline');
  
  const [profileId, setProfileId] = useState('');
  
  const [formData, setFormData] = useState({
    commissionPercent: 0,
    paymentFeePercent: 0,
    paymentFeeFixed: 0,
    additionalPackagingCost: 0,
    sellerPromoPercent: 0,
    sellerPromoFixed: 0,
    sellingPrice: sourceData?.sellingPrice || 0,
    quantity: 1,
    targetMarginPercent: 40
  });

  useEffect(() => {
    if (sourceData && sourceData.sellingPrice) {
      setFormData(prev => ({ ...prev, sellingPrice: sourceData.sellingPrice }));
    }
  }, [sourceData]);

  useEffect(() => {
    if (profileId) {
      const profile = marketplaceProfiles.find(p => p.id === profileId);
      if (profile) {
        setFormData(prev => ({
          ...prev,
          commissionPercent: profile.commissionPercent || 0,
          paymentFeePercent: profile.paymentFeePercent || 0,
          paymentFeeFixed: profile.paymentFeeFixed || 0,
          additionalPackagingCost: profile.additionalPackagingCost || 0,
          sellerPromoPercent: profile.sellerPromoPercent || 0,
          sellerPromoFixed: profile.sellerPromoFixed || 0
        }));
      }
    }
  }, [profileId]); // removed marketplaceProfiles from deps to avoid loop

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const result = useMemo(() => {
    if (!sourceData || sourceData.hppPerUnit <= 0) return null;
    
    return calculateMarketplaceProfit({
      hppPerUnit: sourceData.hppPerUnit,
      sellingPrice: formData.sellingPrice,
      quantity: formData.quantity,
      commissionPercent: formData.commissionPercent,
      paymentFeePercent: formData.paymentFeePercent,
      paymentFeeFixed: formData.paymentFeeFixed,
      additionalPackagingCost: formData.additionalPackagingCost,
      sellerPromoPercent: formData.sellerPromoPercent,
      sellerPromoFixed: formData.sellerPromoFixed
    });
  }, [sourceData, formData]);

  const pricePoints = useMemo(() => {
    if (!sourceData || sourceData.hppPerUnit <= 0) return null;
    
    return simulateMarketplacePricePoints({
      hppPerUnit: sourceData.hppPerUnit,
      commissionPercent: formData.commissionPercent,
      paymentFeePercent: formData.paymentFeePercent,
      paymentFeeFixed: formData.paymentFeeFixed,
      additionalPackagingCost: formData.additionalPackagingCost,
      sellerPromoPercent: formData.sellerPromoPercent,
      sellerPromoFixed: formData.sellerPromoFixed,
      roundingStep: settings?.roundingStep || 1000
    });
  }, [sourceData, formData, settings]);

  const handleSave = () => {
    if (!result) return;
    const profile = marketplaceProfiles.find(p => p.id === profileId);
    
    const input = {
      ...sourceData,
      ...formData,
      channelProfileId: profileId,
      channelProfileSnapshot: profile || null
    };
    
    const fullResult = {
      ...result,
      pricePoints
    };
    
    onSave(input, fullResult, 'marketplace');
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
          <option value="">-- Pilih Profil Channel --</option>
          {marketplaceProfiles.map(p => (
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
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={t('pricing.commissionPercent')}
                  name="commissionPercent"
                  type="number"
                  value={formData.commissionPercent || ''}
                  onChange={handleChange}
                />
                <Input
                  label={t('pricing.paymentFeePercent')}
                  name="paymentFeePercent"
                  type="number"
                  value={formData.paymentFeePercent || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={t('pricing.additionalPackagingCost')}
                  name="additionalPackagingCost"
                  type="number"
                  value={formData.additionalPackagingCost || ''}
                  onChange={handleChange}
                />
                <Input
                  label={t('pricing.sellerPromoPercent')}
                  name="sellerPromoPercent"
                  type="number"
                  value={formData.sellerPromoPercent || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <PricingResultSummary result={result} showRecommended={false} />
          
          {result && (
            <FeeBreakdownCard 
              platformCommission={result.platformCommission}
              paymentFee={result.paymentFee}
              sellerPromo={result.sellerPromo}
              additionalPackaging={result.totalAdditionalPackaging}
              totalFees={result.totalFees}
            />
          )}

          <PricePointTable points={pricePoints} />

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
