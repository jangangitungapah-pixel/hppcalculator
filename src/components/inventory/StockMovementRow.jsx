import React from 'react';
import { formatMovementType, formatStockQuantity } from '../../lib/inventory';

const formatDateTime = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const StockMovementRow = ({ movement, ingredientName }) => (
  <div className="stock-movement-row">
    <div>
      <strong>{formatMovementType(movement.type)}</strong>
      <span>{ingredientName || movement.ingredientId}</span>
      {movement.note || movement.reason ? <p>{movement.note || movement.reason}</p> : null}
    </div>
    <div>
      <strong>{formatStockQuantity(movement.quantity, movement.unit)}</strong>
      <span>{formatDateTime(movement.movementDate || movement.createdAt)}</span>
    </div>
  </div>
);
