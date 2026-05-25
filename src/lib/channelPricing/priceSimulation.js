import { SimulationTypes } from './channelTypes';

export const createPricingSimulation = (input, result, type = SimulationTypes.MARKETPLACE, source = 'user') => {
  return {
    id: crypto.randomUUID(),
    version: 1,
    name: input.name || `Simulasi ${new Date().toLocaleDateString()}`,
    type,
    sourceType: input.sourceType || 'manual',
    sourceId: input.sourceId || null,
    sourceNameSnapshot: input.sourceNameSnapshot || 'Manual Input',
    baseHpp: input.hppPerUnit || 0,
    baseSellingPrice: input.sellingPrice || 0,
    quantity: input.quantity || 1,
    channelProfileId: input.channelProfileId || null,
    channelProfileSnapshot: input.channelProfileSnapshot || null,
    input,
    result,
    source,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const normalizePricingSimulation = (simulation) => {
  if (!simulation) return null;
  // Fallbacks for older or corrupted data
  return {
    ...simulation,
    type: simulation.type || SimulationTypes.MARKETPLACE,
    input: simulation.input || {},
    result: simulation.result || {},
    createdAt: simulation.createdAt || new Date().toISOString(),
    updatedAt: simulation.updatedAt || new Date().toISOString()
  };
};
