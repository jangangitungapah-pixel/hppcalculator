import { getScopedJson, setScopedJson, removeScopedItem } from './localStorageClient';
import { STORAGE_KEYS, STORAGE_VERSION } from './storageKeys';

export const getSavedCalculations = () => {
  return getScopedJson(STORAGE_KEYS.calculations, []);
};

export const getSavedCalculationById = (id) => {
  const calculations = getSavedCalculations();
  return calculations.find(calc => calc.id === id) || null;
};

export const hasSavedCalculations = () => {
  return getSavedCalculations().length > 0;
};

export const saveCalculation = (input, result, options = {}) => {
  const calculations = getSavedCalculations();
  
  const now = new Date().toISOString();
  const id = options.id || Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  
  const newCalculation = {
    id,
    version: STORAGE_VERSION,
    productName: input.productName,
    createdAt: options.createdAt || now,
    updatedAt: now,
    source: options.source || "user",
    input,
    result
  };

  const updatedCalculations = [newCalculation, ...calculations];
  const success = setScopedJson(STORAGE_KEYS.calculations, updatedCalculations);
  
  if (!success) {
    throw new Error('Failed to save calculation due to storage error');
  }
  
  return newCalculation;
};

export const deleteCalculation = (id) => {
  const calculations = getSavedCalculations();
  const updatedCalculations = calculations.filter(calc => calc.id !== id);
  return setScopedJson(STORAGE_KEYS.calculations, updatedCalculations);
};

export const deleteAllCalculations = () => {
  return removeScopedItem(STORAGE_KEYS.calculations);
};

export const loadDemoCalculations = (mockCalculations) => {
  const current = getSavedCalculations();
  const userCalculations = current.filter(c => c.source !== 'demo');
  
  // Convert mockCalculations to SavedCalculation format
  const demoCalculations = mockCalculations.map(mock => {
    return {
      id: mock.id,
      version: STORAGE_VERSION,
      productName: mock.productName,
      createdAt: mock.date || new Date().toISOString(),
      updatedAt: mock.date || new Date().toISOString(),
      source: "demo",
      input: {
        productName: mock.productName,
        costItems: mock.costItems,
        outputQuantity: mock.outputQuantity,
        failedQuantity: mock.failedQuantity,
        sellingUnit: mock.sellingUnit,
        sellingPrice: mock.sellingPrice,
        // Assume default language/currency for demo data if missing
        language: "id",
        currency: "IDR",
        roundingStep: 500
      },
      result: {
        totalProductionCost: mock.totalProductionCost,
        outputQuantity: mock.outputQuantity,
        failedQuantity: mock.failedQuantity,
        sellableQuantity: mock.outputQuantity - (mock.failedQuantity || 0),
        sellingUnit: mock.sellingUnit,
        sellingPrice: mock.sellingPrice,
        grossRevenue: mock.sellingPrice * (mock.outputQuantity - (mock.failedQuantity || 0)),
        hppPerUnit: mock.hppPerUnit,
        profitPerUnit: mock.profitPerUnit,
        totalProfit: mock.totalProfit,
        marginPercent: mock.marginPercent,
        markupPercent: mock.markupPercent,
        profitStatus: { key: mock.statusKey },
        // Add fake suggested prices for demo if not full object
        suggestedPrices: {
          safe: { price: mock.hppPerUnit * 1.33, margin: 25 },
          ideal: { price: mock.hppPerUnit * 1.66, margin: 40 },
          premium: { price: mock.hppPerUnit * 2.22, margin: 55 }
        },
        warnings: [],
        isProfitable: mock.profitPerUnit > 0,
        calculatedAt: mock.date || new Date().toISOString()
      }
    };
  });

  const updatedCalculations = [...demoCalculations, ...userCalculations];
  
  // Sort by date descending
  updatedCalculations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  setScopedJson(STORAGE_KEYS.calculations, updatedCalculations);
  return updatedCalculations;
};

export const clearDemoCalculations = () => {
  const current = getSavedCalculations();
  const userCalculations = current.filter(c => c.source !== 'demo');
  setScopedJson(STORAGE_KEYS.calculations, userCalculations);
  return userCalculations;
};

export const getCalculationStats = () => {
  const calculations = getSavedCalculations();
  
  const totalCalculations = calculations.length;
  
  if (totalCalculations === 0) {
    return {
      totalCalculations: 0,
      averageMargin: 0,
      healthyCount: 0,
      lowCount: 0,
      lossCount: 0,
      latestCalculation: null,
      recentCalculations: []
    };
  }

  let totalMargin = 0;
  let healthyCount = 0;
  let lowCount = 0;
  let lossCount = 0;

  calculations.forEach(calc => {
    const margin = calc?.result?.marginPercent || 0;
    const status = calc?.result?.profitStatus?.key || 'okay';
    
    totalMargin += margin;
    
    if (margin >= 30 || status === 'good' || status === 'excellent') {
      healthyCount++;
    } else if (status === 'loss' || margin < 0) {
      lossCount++;
    } else {
      lowCount++;
    }
  });

  // Sort by date descending to get recent
  const sorted = [...calculations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return {
    totalCalculations,
    averageMargin: totalMargin / totalCalculations,
    healthyCount,
    lowCount,
    lossCount,
    latestCalculation: sorted[0],
    recentCalculations: sorted.slice(0, 3)
  };
};

export const normalizeSavedCalculation = (calculation) => {
  // Simple check in case data model needs a quick fix
  if (!calculation) return null;
  return calculation;
};
