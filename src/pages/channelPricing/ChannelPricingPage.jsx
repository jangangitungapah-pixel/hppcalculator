import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useChannelPricing } from '../../hooks/useChannelPricing';
import { usePricingSimulations } from '../../hooks/usePricingSimulations';
import { AppHeader } from '../../components/layout/AppHeader';
import { ChannelTabs } from '../../components/pricing/ChannelTabs';
import { ProductSourcePicker } from '../../components/pricing/ProductSourcePicker';
import { MarketplacePricingForm } from '../../components/pricing/MarketplacePricingForm';
import { ResellerPricingForm } from '../../components/pricing/ResellerPricingForm';
import { PromoPricingForm } from '../../components/pricing/PromoPricingForm';
import { BundlePricingForm } from '../../components/pricing/BundlePricingForm';
import { ConsignmentPricingForm } from '../../components/pricing/ConsignmentPricingForm';
import { Toast } from '../../components/ui/Toast';

export const ChannelPricingPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { normalizeSourceToPricingBase } = useChannelPricing();
  const { savePricingSimulation, saveBundleSimulation } = usePricingSimulations();

  const [activeTab, setActiveTab] = useState('marketplace');
  const [sourceData, setSourceData] = useState(null);
  const [toast, setToast] = useState(null);

  // Parse state from router
  useEffect(() => {
    if (location.state) {
      if (location.state.sourceData) {
        setSourceData(normalizeSourceToPricingBase(location.state.sourceData));
      }
      if (location.state.initialTab) {
        setActiveTab(location.state.initialTab);
      }
      // Clear state
      window.history.replaceState({}, document.title);
    } else {
      setSourceData(normalizeSourceToPricingBase({ sourceType: 'manual' }));
    }
  }, [location, normalizeSourceToPricingBase]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveSimulation = (input, result, type) => {
    try {
      if (type === 'bundle') {
        saveBundleSimulation(input, result);
      } else {
        savePricingSimulation(input, result, type);
      }
      showToast(t('pricing.simulationSaved'));
      
      // Navigate to simulations list after a brief delay
      setTimeout(() => {
        navigate('/pricing-simulations');
      }, 1500);
    } catch (err) {
      showToast('Gagal menyimpan simulasi', 'error');
    }
  };

  const renderActiveForm = () => {
    switch (activeTab) {
      case 'marketplace':
        return <MarketplacePricingForm sourceData={sourceData} onSave={handleSaveSimulation} />;
      case 'reseller':
        return <ResellerPricingForm sourceData={sourceData} onSave={handleSaveSimulation} />;
      case 'promo':
        return <PromoPricingForm sourceData={sourceData} onSave={handleSaveSimulation} />;
      case 'bundle':
        return <BundlePricingForm onSave={handleSaveSimulation} />;
      case 'consignment':
        return <ConsignmentPricingForm sourceData={sourceData} onSave={handleSaveSimulation} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col pb-20">
      <AppHeader title={t('pricing.title')} onBack={() => navigate('/')} />

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
        {activeTab !== 'bundle' && (
          <div className="mb-6">
            <ProductSourcePicker 
              value={sourceData} 
              onChange={setSourceData} 
            />
          </div>
        )}

        <ChannelTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-4">
          {renderActiveForm()}
        </div>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
