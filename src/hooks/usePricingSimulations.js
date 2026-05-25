import { useContext } from 'react';
import { AppDataContext } from '../contexts/AppDataContext';

export const usePricingSimulations = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('usePricingSimulations must be used within AppDataProvider');
  }

  const getSimulationById = (id) => {
    return context.pricingSimulations.find(s => s.id === id) || null;
  };

  const getBundleSimulationById = (id) => {
    return context.bundleSimulations.find(s => s.id === id) || null;
  };

  return {
    pricingSimulations: context.pricingSimulations,
    bundleSimulations: context.bundleSimulations,
    getSimulationById,
    getBundleSimulationById,
    savePricingSimulation: context.savePricingSimulation,
    updatePricingSimulation: context.updatePricingSimulation,
    deletePricingSimulation: context.deletePricingSimulation,
    deleteAllPricingSimulations: context.deleteAllPricingSimulations,
    loadDemoPricingSimulations: context.loadDemoPricingSimulations,
    saveBundleSimulation: context.saveBundleSimulation,
    updateBundleSimulation: context.updateBundleSimulation,
    deleteBundleSimulation: context.deleteBundleSimulation,
    deleteAllBundleSimulations: context.deleteAllBundleSimulations,
    hasSimulations: context.pricingSimulations.length > 0 || context.bundleSimulations.length > 0
  };
};
