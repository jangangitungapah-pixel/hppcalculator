import { useContext } from 'react';
import { AppDataContext } from '../contexts/AppDataContext';
import * as channelPricingLib from '../lib/channelPricing';

export const useChannelPricing = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useChannelPricing must be used within AppDataProvider');
  }

  const getSourcePickerOptions = () => {
    return channelPricingLib.getAvailablePricingSources({
      calculations: context.calculations,
      recipes: context.recipes,
      products: context.products
    });
  };

  return {
    ...channelPricingLib,
    getSourcePickerOptions,
    channelProfiles: context.channelProfiles,
    pricingSimulations: context.pricingSimulations,
    bundleSimulations: context.bundleSimulations,
    settings: context.settings
  };
};
