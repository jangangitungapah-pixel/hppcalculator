import { SourceTypes } from './channelTypes';

export const getAvailablePricingSources = ({ calculations = [], recipes = [], products = [] }) => {
  return {
    calculations: calculations.map(c => ({
      sourceType: SourceTypes.CALCULATION,
      sourceId: c.id,
      name: c.productName || 'Tanpa Nama',
      hppPerUnit: c.result?.hppPerUnit || 0,
      sellingPrice: c.result?.sellingPrice || 0,
      originalData: c
    })),
    recipes: recipes.map(r => ({
      sourceType: SourceTypes.RECIPE,
      sourceId: r.id,
      name: r.name || 'Resep Tanpa Nama',
      hppPerUnit: r.resultSnapshot?.hppPerUnit || 0,
      sellingPrice: r.resultSnapshot?.suggestedPrices?.ideal?.price || 0,
      originalData: r
    })),
    products: products.map(p => ({
      sourceType: SourceTypes.PRODUCT,
      sourceId: p.id,
      name: p.name || 'Produk Tanpa Nama',
      hppPerUnit: p.hppPerUnitSnapshot || 0,
      sellingPrice: p.targetSellingPrice || 0,
      originalData: p
    }))
  };
};

export const normalizeSourceToPricingBase = (sourceData) => {
  if (!sourceData) return null;
  return {
    sourceType: sourceData.sourceType || SourceTypes.MANUAL,
    sourceId: sourceData.sourceId || null,
    sourceNameSnapshot: sourceData.name || 'Manual Input',
    hppPerUnit: sourceData.hppPerUnit || 0,
    sellingPrice: sourceData.sellingPrice || 0
  };
};
