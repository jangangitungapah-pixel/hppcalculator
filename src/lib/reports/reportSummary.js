export const calculateAverageMargin = (items) => {
  if (!items || items.length === 0) return 0;
  
  let totalMargin = 0;
  let count = 0;
  
  items.forEach(item => {
    if (item.marginPercent !== null && !isNaN(item.marginPercent)) {
      totalMargin += item.marginPercent;
      count++;
    }
  });
  
  return count > 0 ? (totalMargin / count) : 0;
};

export const countByStatus = (items) => {
  const counts = {
    loss: 0,
    low: 0,
    okay: 0,
    good: 0,
    excellent: 0,
    unknown: 0
  };
  
  if (!items) return counts;
  
  items.forEach(item => {
    const key = item.statusKey || 'unknown';
    if (counts[key] !== undefined) {
      counts[key]++;
    } else {
      counts.unknown++;
    }
  });
  
  return counts;
};

export const getBestMarginItems = (items, limit = 5) => {
  if (!items) return [];
  const validItems = items.filter(item => item.marginPercent !== null && !isNaN(item.marginPercent));
  return validItems.sort((a, b) => b.marginPercent - a.marginPercent).slice(0, limit);
};

export const getWorstMarginItems = (items, limit = 5) => {
  if (!items) return [];
  const validItems = items.filter(item => item.marginPercent !== null && !isNaN(item.marginPercent));
  return validItems.sort((a, b) => a.marginPercent - b.marginPercent).slice(0, limit);
};

export const getLowMarginItems = (items) => {
  if (!items) return [];
  return items.filter(item => item.statusKey === 'low');
};

export const getLossItems = (items) => {
  if (!items) return [];
  return items.filter(item => item.statusKey === 'loss');
};

export const getHealthyItems = (items) => {
  if (!items) return [];
  return items.filter(item => ['okay', 'good', 'excellent'].includes(item.statusKey));
};

export const getItemsNeedingAttention = (items) => {
  if (!items) return [];
  return items.filter(item => ['low', 'loss'].includes(item.statusKey));
};

export const calculateDataCoverage = (appData) => {
  return {
    calculations: Array.isArray(appData?.calculations) ? appData.calculations.length : 0,
    recipes: Array.isArray(appData?.recipes) ? appData.recipes.length : 0,
    products: Array.isArray(appData?.products) ? appData.products.length : 0,
    channelSimulations: Array.isArray(appData?.pricingSimulations) ? appData.pricingSimulations.length : 0,
    bundleSimulations: Array.isArray(appData?.bundleSimulations) ? appData.bundleSimulations.length : 0,
  };
};

export const calculateReportSummary = (reportItems, appData) => {
  const counts = countByStatus(reportItems);
  
  return {
    totalItems: reportItems?.length || 0,
    averageMargin: calculateAverageMargin(reportItems),
    healthyCount: counts.okay + counts.good + counts.excellent,
    lowCount: counts.low,
    lossCount: counts.loss,
    unknownCount: counts.unknown,
    bestItems: getBestMarginItems(reportItems, 5),
    worstItems: getWorstMarginItems(reportItems, 5),
    lowMarginItems: getLowMarginItems(reportItems),
    lossItems: getLossItems(reportItems),
    healthyItems: getHealthyItems(reportItems),
    needsAttention: getItemsNeedingAttention(reportItems),
    dataCoverage: calculateDataCoverage(appData)
  };
};
