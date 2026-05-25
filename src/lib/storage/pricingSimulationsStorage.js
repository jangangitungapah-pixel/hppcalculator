import { STORAGE_KEYS } from './storageKeys';
import { safeParseJSON, safeStringifyJSON } from '../../utils/safeParse';
import { createPricingSimulation } from '../channelPricing/priceSimulation';

export const getPricingSimulations = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PRICING_SIMULATIONS);
  return safeParseJSON(data, []);
};

export const savePricingSimulations = (simulations) => {
  localStorage.setItem(STORAGE_KEYS.PRICING_SIMULATIONS, safeStringifyJSON(simulations));
};

export const getPricingSimulationById = (id) => {
  const simulations = getPricingSimulations();
  return simulations.find(s => s.id === id) || null;
};

export const savePricingSimulation = (input, result, type, source = 'user') => {
  const simulations = getPricingSimulations();
  
  const newSimulation = createPricingSimulation(input, result, type, source);
  
  simulations.push(newSimulation);
  savePricingSimulations(simulations);
  return newSimulation;
};

export const updatePricingSimulation = (id, updates) => {
  const simulations = getPricingSimulations();
  const index = simulations.findIndex(s => s.id === id);
  
  if (index !== -1) {
    simulations[index] = {
      ...simulations[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    savePricingSimulations(simulations);
    return simulations[index];
  }
  return null;
};

export const deletePricingSimulation = (id) => {
  const simulations = getPricingSimulations();
  const filtered = simulations.filter(s => s.id !== id);
  savePricingSimulations(filtered);
};

export const deleteAllPricingSimulations = () => {
  savePricingSimulations([]);
};

export const loadDemoPricingSimulations = (demoSimulations) => {
  const simulations = getPricingSimulations();
  savePricingSimulations([...simulations, ...demoSimulations]);
};
