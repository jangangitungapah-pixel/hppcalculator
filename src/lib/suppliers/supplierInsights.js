export const getTopSuppliersBySpend = (logs = [], limit = 5) => {
  const spends = {};
  logs.forEach(log => {
    const key = log.supplierId || 'no_supplier';
    const name = log.supplierNameSnapshot || 'Tanpa Supplier';
    if (!spends[key]) {
      spends[key] = { supplierId: log.supplierId, name, spend: 0 };
    }
    spends[key].spend += Number(log.totalAmount) || 0;
  });

  return Object.values(spends)
    .sort((a, b) => b.spend - a.spend)
    .slice(0, limit);
};

export const getMostPurchasedIngredients = (items = [], limit = 5) => {
  const counts = {};
  items.forEach(item => {
    const key = item.ingredientId;
    const name = item.ingredientNameSnapshot || 'Bahan';
    if (!counts[key]) {
      counts[key] = { ingredientId: key, name, count: 0, totalQty: 0, unit: item.unit };
    }
    counts[key].count += 1;
    counts[key].totalQty += Number(item.quantity) || 0;
  });

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const getIngredientPriceTrendLite = (ingredientId, items = [], logs = []) => {
  const logMap = new Map(logs.map(l => [l.id, l]));
  const ingItems = items.filter(item => item.ingredientId === ingredientId);

  const points = ingItems.map(item => {
    const log = logMap.get(item.purchaseLogId);
    const date = log ? log.purchaseDate : item.createdAt.split('T')[0];
    return {
      date,
      unitPrice: item.unitPrice,
      unit: item.unit
    };
  });

  return points.sort((a, b) => a.date.localeCompare(b.date));
};
