import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useChannelPricing } from '../../hooks/useChannelPricing';
import { usePricingSimulations } from '../../hooks/usePricingSimulations';
import { motion, AnimatePresence } from 'framer-motion';

import { ChannelTabs } from '../../components/pricing/ChannelTabs';
import { ProductSourcePicker } from '../../components/pricing/ProductSourcePicker';
import { MarketplacePricingForm } from '../../components/pricing/MarketplacePricingForm';
import { ResellerPricingForm } from '../../components/pricing/ResellerPricingForm';
import { PromoPricingForm } from '../../components/pricing/PromoPricingForm';
import { BundlePricingForm } from '../../components/pricing/BundlePricingForm';
import { ConsignmentPricingForm } from '../../components/pricing/ConsignmentPricingForm';
import { Toast } from '../../components/ui/Toast';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { History, Settings } from 'lucide-react';

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
        navigate('/simulations');
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
    <PageContainer maxWidth="max-w-5xl">
      <div className="pricing-page">
        {/* Header/Hero Section */}
        <div className="pricing-hero">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Simulasi Harga</h1>
              <p className="text-sm text-text-secondary mt-1">
                Bandingkan harga jual, biaya channel, dan margin dari berbagai skenario.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button 
                variant="outline" 
                size="sm" 
                leftIcon={<History className="w-4 h-4" />}
                onClick={() => navigate('/simulations')}
              >
                Riwayat Simulasi
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                leftIcon={<Settings className="w-4 h-4" />}
                onClick={() => navigate('/channel-profiles')}
              >
                Kelola Profil
              </Button>
            </div>
          </div>
        </div>

        {activeTab !== 'bundle' && (
          <div className="mb-8">
            <ProductSourcePicker 
              value={sourceData} 
              onChange={setSourceData} 
            />
          </div>
        )}

        <ChannelTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-2 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderActiveForm()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </PageContainer>
  );
};
