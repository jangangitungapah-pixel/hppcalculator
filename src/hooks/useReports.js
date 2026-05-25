import { useState, useMemo } from 'react';
import { useAppData } from './useAppData';
import { useLanguage } from './useLanguage';
import {
  REPORT_PERIODS,
  filterByPeriod,
  collectCalculationReportItems,
  collectRecipeReportItems,
  collectProductReportItems,
  collectChannelSimulationItems,
  collectBundleSimulationItems,
  calculateReportSummary,
  analyzeProductItems,
  analyzeRecipeItems,
  analyzeChannelSimulations,
  analyzeBundleSimulations,
  generateRecommendations,
  exportReportToCsv,
  collectAllProfitabilityItems
} from '../lib/reports';

export const useReports = () => {
  const appData = useAppData();
  const { lang, settings } = useLanguage();
  
  const [period, setPeriod] = useState(REPORT_PERIODS.ALL_TIME);

  // 1. Collect all raw items
  const allCalculations = useMemo(() => collectCalculationReportItems(appData.calculations), [appData.calculations]);
  const allRecipes = useMemo(() => collectRecipeReportItems(appData.recipes), [appData.recipes]);
  const allProducts = useMemo(() => collectProductReportItems(appData.products), [appData.products]);
  const allChannelSims = useMemo(() => collectChannelSimulationItems(appData.pricingSimulations), [appData.pricingSimulations]);
  const allBundleSims = useMemo(() => collectBundleSimulationItems(appData.bundleSimulations), [appData.bundleSimulations]);

  // 2. Filter by period
  const filteredCalculations = useMemo(() => filterByPeriod(allCalculations, period), [allCalculations, period]);
  const filteredRecipes = useMemo(() => filterByPeriod(allRecipes, period), [allRecipes, period]);
  const filteredProducts = useMemo(() => filterByPeriod(allProducts, period), [allProducts, period]);
  const filteredChannelSims = useMemo(() => filterByPeriod(allChannelSims, period), [allChannelSims, period]);
  const filteredBundleSims = useMemo(() => filterByPeriod(allBundleSims, period), [allBundleSims, period]);
  
  // A combined list for overall summary and recommendations
  const allFilteredItems = useMemo(() => [
    ...filteredCalculations,
    ...filteredRecipes,
    ...filteredProducts,
    ...filteredChannelSims,
    ...filteredBundleSims
  ], [filteredCalculations, filteredRecipes, filteredProducts, filteredChannelSims, filteredBundleSims]);

  // 3. Generate Summaries & Insights
  const summary = useMemo(() => calculateReportSummary(allFilteredItems, appData), [allFilteredItems, appData]);
  
  const recommendations = useMemo(() => 
    generateRecommendations(allFilteredItems, appData, appData.settings), 
  [allFilteredItems, appData]);

  // Specific domain insights
  const productInsights = useMemo(() => analyzeProductItems([...filteredProducts, ...filteredCalculations]), [filteredProducts, filteredCalculations]);
  const recipeInsights = useMemo(() => analyzeRecipeItems(filteredRecipes, appData.products), [filteredRecipes, appData.products]);
  const channelInsights = useMemo(() => analyzeChannelSimulations(filteredChannelSims), [filteredChannelSims]);
  const simulationInsights = useMemo(() => ({
    channel: channelInsights,
    bundle: analyzeBundleSimulations(filteredBundleSims)
  }), [channelInsights, filteredBundleSims]);

  // Profitability Ranking Items (Products + Manual Calculations)
  const profitabilityItems = useMemo(() => {
    // Only pass the filtered ones that represent actual saleable products
    const items = [...filteredProducts, ...filteredCalculations];
    return items.filter(item => item.sellingPrice !== null && item.sellingPrice > 0)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [filteredProducts, filteredCalculations]);

  // Expose export function
  const exportCsv = () => {
    exportReportToCsv({
      reportItems: allFilteredItems,
      recommendations,
      period,
      language: lang
    });
  };

  return {
    period,
    setPeriod,
    summary,
    recommendations,
    productInsights,
    recipeInsights,
    channelInsights,
    simulationInsights,
    profitabilityItems,
    exportCsv,
    
    // Raw filtered items if components need them directly
    items: {
      calculations: filteredCalculations,
      recipes: filteredRecipes,
      products: filteredProducts,
      channelSimulations: filteredChannelSims,
      bundleSimulations: filteredBundleSims,
      all: allFilteredItems
    },
    
    hasAnyData: allCalculations.length > 0 || allRecipes.length > 0 || allProducts.length > 0 || allChannelSims.length > 0 || allBundleSims.length > 0
  };
};
