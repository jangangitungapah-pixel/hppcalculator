import { STORAGE_KEYS } from './storageKeys';
import { getScopedJson, setScopedJson } from './localStorageClient';

export const getBundleSimulations = () => {
  return getScopedJson(STORAGE_KEYS.BUNDLE_SIMULATIONS, []);
};

export const saveBundleSimulations = (simulations) => {
  setScopedJson(STORAGE_KEYS.BUNDLE_SIMULATIONS, simulations);
};

export const getBundleSimulationById = (id) => {
  const simulations = getBundleSimulations();
  return simulations.find(s => s.id === id) || null;
};

export const saveBundleSimulation = (input, result, source = 'user') => {
  const simulations = getBundleSimulations();
  
  const newSimulation = {
    id: crypto.randomUUID(),
    version: 1,
    name: input.bundleName || `Paket ${new Date().toLocaleDateString()}`,
    type: 'bundle',
    items: input.items || [],
    baseTotalHpp: result.baseTotalHpp || 0,
    bundleSellingPrice: input.bundleSellingPrice || 0,
    discountPercent: input.discountPercent || 0,
    discountFixed: input.discountFixed || 0,
    finalSellingPrice: result.finalSellingPrice || 0,
    profit: result.profit || 0,
    marginPercent: result.marginPercent || 0,
    suggestedPrices: result.suggestedPrices || {},
    source,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  simulations.push(newSimulation);
  saveBundleSimulations(simulations);
  return newSimulation;
};

export const updateBundleSimulation = (id, updates) => {
  const simulations = getBundleSimulations();
  const index = simulations.findIndex(s => s.id === id);
  
  if (index !== -1) {
    simulations[index] = {
      ...simulations[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveBundleSimulations(simulations);
    return simulations[index];
  }
  return null;
};

export const deleteBundleSimulation = (id) => {
  const simulations = getBundleSimulations();
  const filtered = simulations.filter(s => s.id !== id);
  saveBundleSimulations(filtered);
};

export const deleteAllBundleSimulations = () => {
  saveBundleSimulations([]);
};

export const clearDemoBundleSimulations = () => {
  const current = getBundleSimulations();
  const userSimulations = current.filter(s => s.source !== 'demo');
  saveBundleSimulations(userSimulations);
  return userSimulations;
};
