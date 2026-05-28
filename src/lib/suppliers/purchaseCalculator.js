export const calculatePurchaseTotal = (items = []) => {
  return items.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0);
};

export const calculatePurchaseUnitPrice = (item = {}) => {
  const qty = Number(item.quantity) || 0;
  const total = Number(item.totalPrice) || 0;
  return qty > 0 ? total / qty : 0;
};

export const summarizePurchaseItems = (items = []) => {
  if (items.length === 0) return '';
  const names = items.map(item => item.ingredientNameSnapshot || 'Bahan');
  if (names.length <= 2) return names.join(', ');
  return `${names.slice(0, 2).join(', ')} + ${names.length - 2} lainnya`;
};

export const calculateMonthlyPurchaseTotal = (logs = [], month = '') => {
  return logs
    .filter(log => log.purchaseDate && log.purchaseDate.startsWith(month))
    .reduce((sum, log) => sum + (Number(log.totalAmount) || 0), 0);
};

export const getIngredientPurchaseStats = (ingredientId, items = []) => {
  const ingItems = items.filter(item => item.ingredientId === ingredientId);
  if (ingItems.length === 0) {
    return {
      count: 0,
      averagePrice: 0,
      minPrice: 0,
      maxPrice: 0,
      lastPrice: 0
    };
  }

  const prices = ingItems.map(item => item.unitPrice).filter(price => price > 0);
  const count = ingItems.length;
  const averagePrice = prices.reduce((sum, p) => sum + p, 0) / (prices.length || 1);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  // Let's sort items by updated or created date desc to find lastPrice
  const sorted = [...ingItems].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const lastPrice = sorted[0]?.unitPrice || 0;

  return {
    count,
    averagePrice,
    minPrice,
    maxPrice,
    lastPrice
  };
};
