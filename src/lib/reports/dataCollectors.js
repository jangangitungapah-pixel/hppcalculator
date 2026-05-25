import { sortByDateDesc } from './dateFilters';

/**
 * Normalizes different AppData structures into a common ReportItem format.
 * 
 * ReportItem schema:
 * {
 *   id: string,
 *   type: "calculation" | "recipe" | "product" | "channelSimulation" | "bundleSimulation",
 *   name: string,
 *   sourceId: string,
 *   sourceType: string,
 *   hppPerUnit: number,
 *   sellingPrice: number | null,
 *   recommendedPrice: number | null,
 *   profitPerUnit: number | null,
 *   totalProfit: number | null,
 *   marginPercent: number | null,
 *   markupPercent: number | null,
 *   statusKey: "loss" | "low" | "okay" | "good" | "excellent" | "unknown",
 *   channelType: string | null,
 *   category: string | null,
 *   createdAt: string,
 *   raw: object
 * }
 */

const getStatusKeyFromMargin = (marginPercent, fallback = 'unknown') => {
  if (marginPercent === null || marginPercent === undefined || isNaN(marginPercent)) return fallback;
  if (marginPercent < 0) return 'loss';
  if (marginPercent >= 0 && marginPercent < 15) return 'low';
  if (marginPercent >= 15 && marginPercent < 25) return 'okay';
  if (marginPercent >= 25 && marginPercent < 40) return 'good';
  return 'excellent';
};

export const collectCalculationReportItems = (calculations = []) => {
  if (!Array.isArray(calculations)) return [];
  
  return calculations.map(calc => {
    const result = calc.result || {};
    return {
      id: calc.id,
      type: 'calculation',
      name: calc.productName || 'Tanpa Nama',
      sourceId: calc.id,
      sourceType: 'manual',
      hppPerUnit: result.hppPerUnit || 0,
      sellingPrice: result.sellingPrice || null,
      recommendedPrice: null, // Basic calculations don't save recommended price generally
      profitPerUnit: result.profitPerUnit || null,
      totalProfit: result.totalProfit || null,
      marginPercent: result.marginPercent || null,
      markupPercent: result.markupPercent || null,
      statusKey: result.profitStatus?.key || getStatusKeyFromMargin(result.marginPercent),
      channelType: null,
      category: null,
      createdAt: calc.createdAt,
      raw: calc
    };
  });
};

export const collectRecipeReportItems = (recipes = []) => {
  if (!Array.isArray(recipes)) return [];
  
  return recipes.map(recipe => {
    const result = recipe.resultSnapshot || {};
    const suggestedPrice = result.suggestedPrices?.ideal?.price || null;
    
    return {
      id: recipe.id,
      type: 'recipe',
      name: recipe.name || 'Resep Tanpa Nama',
      sourceId: recipe.id,
      sourceType: 'recipe',
      hppPerUnit: result.hppPerUnit || 0,
      sellingPrice: null, // Recipes themselves don't have a selling price, Products do
      recommendedPrice: suggestedPrice,
      profitPerUnit: null,
      totalProfit: null,
      marginPercent: null,
      markupPercent: null,
      statusKey: 'unknown',
      channelType: null,
      category: null,
      createdAt: recipe.createdAt || recipe.updatedAt,
      raw: recipe
    };
  });
};

export const collectProductReportItems = (products = []) => {
  if (!Array.isArray(products)) return [];
  
  return products.map(product => {
    const hpp = product.hppPerUnitSnapshot || 0;
    const sellPrice = product.targetSellingPrice || 0;
    
    // Calculate live margin
    let profit = null;
    let margin = null;
    let markup = null;
    
    if (sellPrice > 0) {
      profit = sellPrice - hpp;
      margin = (profit / sellPrice) * 100;
      if (hpp > 0) {
        markup = (profit / hpp) * 100;
      }
    }
    
    const suggestedPrice = product.suggestedPricesSnapshot?.ideal?.price || null;

    return {
      id: product.id,
      type: 'product',
      name: product.name || 'Menu Tanpa Nama',
      sourceId: product.id,
      sourceType: 'product',
      hppPerUnit: hpp,
      sellingPrice: sellPrice > 0 ? sellPrice : null,
      recommendedPrice: suggestedPrice,
      profitPerUnit: profit,
      totalProfit: profit, // Assuming per unit is total for a simple product view
      marginPercent: margin,
      markupPercent: markup,
      statusKey: getStatusKeyFromMargin(margin),
      channelType: null,
      category: product.category || null,
      createdAt: product.createdAt || product.updatedAt,
      raw: product
    };
  });
};

export const collectChannelSimulationItems = (pricingSimulations = []) => {
  if (!Array.isArray(pricingSimulations)) return [];
  
  return pricingSimulations.map(sim => {
    const result = sim.result || {};
    let sellPrice = sim.baseSellingPrice || 0;
    if (result.finalPrice) sellPrice = result.finalPrice;
    
    return {
      id: sim.id,
      type: 'channelSimulation',
      name: sim.name || 'Simulasi Channel',
      sourceId: sim.sourceIdSnapshot,
      sourceType: sim.sourceTypeSnapshot,
      hppPerUnit: sim.baseHpp || 0,
      sellingPrice: sellPrice,
      recommendedPrice: result.recommendedPrice || null,
      profitPerUnit: result.profit || null,
      totalProfit: result.profit || null,
      marginPercent: result.marginPercent || null,
      markupPercent: result.markupPercent || null, // Might not exist on all sims
      statusKey: getStatusKeyFromMargin(result.marginPercent),
      channelType: sim.type,
      category: null,
      createdAt: sim.createdAt || sim.updatedAt,
      raw: sim
    };
  });
};

export const collectBundleSimulationItems = (bundleSimulations = []) => {
  if (!Array.isArray(bundleSimulations)) return [];
  
  return bundleSimulations.map(sim => {
    return {
      id: sim.id,
      type: 'bundleSimulation',
      name: sim.name || 'Simulasi Paket',
      sourceId: sim.id,
      sourceType: 'bundle',
      hppPerUnit: sim.baseTotalHpp || 0,
      sellingPrice: sim.finalSellingPrice || 0,
      recommendedPrice: sim.recommendedPrice || null,
      profitPerUnit: sim.profit || null,
      totalProfit: sim.profit || null,
      marginPercent: sim.marginPercent || null,
      markupPercent: null,
      statusKey: getStatusKeyFromMargin(sim.marginPercent),
      channelType: 'bundle',
      category: null,
      createdAt: sim.createdAt || sim.updatedAt,
      raw: sim
    };
  });
};

export const collectAllProfitabilityItems = (appData) => {
  const calculations = collectCalculationReportItems(appData?.calculations);
  const products = collectProductReportItems(appData?.products);
  
  // We exclude recipes and simulations from the generic profitability ranking 
  // because recipes have no price, and simulations are hypothetical variants of products.
  const allItems = [...calculations, ...products];
  
  // Ensure we only look at items that have a selling price for profitability ranking
  const validItems = allItems.filter(item => item.sellingPrice !== null && item.sellingPrice > 0);
  
  return sortByDateDesc(validItems);
};
