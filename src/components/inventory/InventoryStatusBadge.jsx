import React from 'react';
import { formatStockStatus, getStockStatusTone } from '../../lib/inventory';

export const InventoryStatusBadge = ({ status = 'not_tracked' }) => {
  return (
    <span className={`inventory-status-badge inventory-status-badge--${getStockStatusTone(status)}`}>
      <span className="inventory-status-dot" aria-hidden="true" />
      {formatStockStatus(status)}
    </span>
  );
};
