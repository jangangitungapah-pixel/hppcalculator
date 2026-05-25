import { calculatePriceIncreaseNeeded } from './profitabilityInsights';

export const generateRecommendations = (reportItems, appData, settings) => {
  if (!reportItems || !Array.isArray(reportItems)) return [];
  
  let allRecommendations = [];
  
  reportItems.forEach(item => {
    const itemRecs = generateItemRecommendation(item, settings);
    allRecommendations = [...allRecommendations, ...itemRecs];
  });
  
  return prioritizeRecommendations(allRecommendations);
};

export const generateItemRecommendation = (item, settings) => {
  const recs = [];
  if (!item) return recs;

  const priceInc = generatePriceIncreaseRecommendation(item, settings);
  if (priceInc) recs.push(priceInc);
  
  const promoWarn = generatePromoRecommendation(item);
  if (promoWarn) recs.push(promoWarn);
  
  const resellerOpp = generateResellerRecommendation(item);
  if (resellerOpp) recs.push(resellerOpp);
  
  const marketOpp = generateMarketplaceRecommendation(item);
  if (marketOpp) recs.push(marketOpp);
  
  const costRev = generateCostReviewRecommendation(item);
  if (costRev) recs.push(costRev);
  
  // Specific recipe logic
  if (item.type === 'recipe' && !item.sellingPrice) {
    // We don't have the products array here, but we can assume if it's purely a recipe in report items
    // and we need to recommend making a product
    recs.push({
      id: `rec_create_prod_${item.id}`,
      type: 'create_product',
      severity: 'info',
      titleId: 'Buat Produk',
      titleEn: 'Create Product',
      messageId: 'Buat produk/menu dari resep ini agar harga jual bisa dipantau.',
      messageEn: 'Create a product/menu from this recipe to monitor its selling price.',
      itemId: item.id,
      itemName: item.name,
      actionLabelId: 'Buat Produk',
      actionLabelEn: 'Create Product',
      actionRoute: `/products/new?sourceRecipeId=${item.id}`,
      priority: 30
    });
  }

  return recs;
};

export const generatePriceIncreaseRecommendation = (item, settings) => {
  // Only for products/calculations/simulations with a price
  if (!item.sellingPrice || item.marginPercent === null) return null;
  
  if (item.marginPercent < 15) {
    const needed = calculatePriceIncreaseNeeded(item, 25, settings?.roundingStep || 1000);
    
    return {
      id: `rec_price_inc_${item.id}`,
      type: 'price_increase',
      severity: item.marginPercent < 0 ? 'danger' : 'warning',
      titleId: 'Naikkan Harga',
      titleEn: 'Raise Price',
      messageId: item.marginPercent < 0 
        ? `Rugi! Harga jual terlalu rendah. Pertimbangkan naik menjadi ${needed ? needed.recommendedPrice : 'lebih tinggi'}.`
        : `Margin sangat tipis. Pertimbangkan naik menjadi ${needed ? needed.recommendedPrice : 'lebih tinggi'} untuk margin aman.`,
      messageEn: item.marginPercent < 0
        ? 'Loss making! Selling price is too low.'
        : 'Margin is very thin. Consider raising price.',
      itemId: item.id,
      itemName: item.name,
      actionLabelId: 'Lihat Detail',
      actionLabelEn: 'View Details',
      actionRoute: `/${item.type}s/${item.sourceId}`, // Rough guess route
      priority: item.marginPercent < 0 ? 100 : 80
    };
  }
  
  return null;
};

export const generatePromoRecommendation = (item) => {
  if (item.marginPercent !== null && item.marginPercent >= 0 && item.marginPercent < 25) {
    return {
      id: `rec_promo_warn_${item.id}`,
      type: 'promo_warning',
      severity: 'warning',
      titleId: 'Hati-hati Promo',
      titleEn: 'Promo Warning',
      messageId: 'Margin di bawah 25%. Hindari diskon besar atau ikut promo platform.',
      messageEn: 'Margin under 25%. Avoid deep discounts.',
      itemId: item.id,
      itemName: item.name,
      actionLabelId: 'Simulasi Promo',
      actionLabelEn: 'Simulate Promo',
      actionRoute: '/channel-pricing',
      priority: 60
    };
  }
  return null;
};

export const generateResellerRecommendation = (item) => {
  if (item.marginPercent !== null && item.marginPercent >= 35 && item.type !== 'channelSimulation' && item.type !== 'bundleSimulation') {
    return {
      id: `rec_reseller_opp_${item.id}`,
      type: 'reseller_opportunity',
      severity: 'success',
      titleId: 'Peluang Reseller',
      titleEn: 'Reseller Opportunity',
      messageId: 'Margin tinggi (≥35%). Cocok untuk dijual via reseller/grosir.',
      messageEn: 'High margin (≥35%). Suitable for wholesale/resellers.',
      itemId: item.id,
      itemName: item.name,
      actionLabelId: 'Simulasi Reseller',
      actionLabelEn: 'Simulate Reseller',
      actionRoute: '/channel-pricing',
      priority: 40
    };
  }
  return null;
};

export const generateMarketplaceRecommendation = (item) => {
  if (item.marginPercent !== null && item.marginPercent >= 45 && item.type !== 'channelSimulation' && item.type !== 'bundleSimulation') {
    return {
      id: `rec_market_opp_${item.id}`,
      type: 'marketplace_opportunity',
      severity: 'success',
      titleId: 'Peluang Marketplace',
      titleEn: 'Marketplace Opportunity',
      messageId: 'Margin sangat sehat (≥45%). Aman untuk dijual di GoFood/GrabFood.',
      messageEn: 'Very healthy margin (≥45%). Safe for marketplace delivery apps.',
      itemId: item.id,
      itemName: item.name,
      actionLabelId: 'Simulasi Marketplace',
      actionLabelEn: 'Simulate Marketplace',
      actionRoute: '/channel-pricing',
      priority: 50
    };
  }
  return null;
};

export const generateCostReviewRecommendation = (item) => {
  if (item.marginPercent !== null && item.marginPercent < 15 && item.hppPerUnit > 0) {
    return {
      id: `rec_cost_rev_${item.id}`,
      type: 'cost_review',
      severity: 'warning',
      titleId: 'Evaluasi HPP',
      titleEn: 'Review Cost',
      messageId: 'Margin rendah. Coba cek apakah ada bahan baku yang bisa ditekan harganya.',
      messageEn: 'Low margin. Check if you can reduce ingredient costs.',
      itemId: item.id,
      itemName: item.name,
      actionLabelId: 'Cek Resep',
      actionLabelEn: 'Check Recipe',
      actionRoute: item.type === 'product' ? `/products/${item.id}` : null,
      priority: 70
    };
  }
  return null;
};

export const prioritizeRecommendations = (recommendations) => {
  if (!recommendations) return [];
  // Sort descending by priority, then by item name to keep deterministic
  return [...recommendations].sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    return (a.itemName || '').localeCompare(b.itemName || '');
  });
};
