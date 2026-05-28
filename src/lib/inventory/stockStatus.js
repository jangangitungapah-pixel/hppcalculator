import { STOCK_STATUSES } from './inventoryTypes';

export const getStockStatus = ({ currentStock = 0, minimumStock = 0, stockTrackingEnabled = false }) => {
  if (!stockTrackingEnabled) return STOCK_STATUSES.NOT_TRACKED;
  const current = Number(currentStock) || 0;
  const minimum = Number(minimumStock) || 0;
  if (current <= 0) return STOCK_STATUSES.OUT;
  if (current <= minimum) return STOCK_STATUSES.LOW;
  return STOCK_STATUSES.OK;
};
