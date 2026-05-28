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
      <Card className="p-8 text-center bg-surface-muted border-border border-dashed rounded-2xl">
        <p className="text-text-muted">{t('pricing.sourceRequired')}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Step 1: Channel Profile */}
      <div className="pricing-step-card">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
          <div>
            <h3 className="font-bold text-text-primary text-base">1. Channel Penjualan</h3>
            <p className="text-xs text-text-secondary mt-0.5">Pilih platform tempat Anda menjual produk ini untuk memuat tarif potongan otomatis.</p>
          </div>
          {!hasProfiles && (
            <Button variant="ghost" size="sm" onClick={loadPresetChannelProfiles}>
              {t('pricing.loadPresetProfiles')}
            </Button>
          )}
        </div>
        
        {marketplaceProfiles.length > 0 ? (
          <div className="pricing-channel-grid">
            {marketplaceProfiles.map(p => {
              const isSelected = profileId === p.id;
              const feeDesc = p.commissionPercent > 0 ? `${p.commissionPercent}%` : '';
              const paymentDesc = p.paymentFeePercent > 0 ? `+${p.paymentFeePercent}%` : '';
              const totalFeeText = [feeDesc, paymentDesc].filter(Boolean).join(' ') || '0%';
              
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setProfileId(isSelected ? '' : p.id)}
                  className={`pricing-channel-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="font-bold text-sm text-text-primary">{p.name}</div>
                  <div className="text-xs text-text-muted">Fee: {totalFeeText}</div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-primary" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-border rounded-xl">
            <p className="text-sm text-text-secondary mb-3">Belum ada profil channel.</p>
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
            <h3 className="font-bold text-text-primary text-base mb-1">2. Harga & Biaya Potongan</h3>
            <p className="text-xs text-text-secondary mb-4">Masukkan harga jual yang diincar dan atur rincian potongan jika ada perubahan.</p>
            
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
          </div>
        </div>

        {/* Right Column: Result Preview */}
        <div className="pricing-result-panel">
          <h3 className="font-bold text-text-primary text-base">3. Hasil & Rekomendasi</h3>
          
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
