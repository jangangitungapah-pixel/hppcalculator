import React from 'react';
import { StockMovementRow } from './StockMovementRow';

export const StockMovementList = ({ movements = [], ingredients = [] }) => {
  const ingredientsById = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));

  if (movements.length === 0) {
    return <div className="stock-movement-list stock-movement-list--empty">Belum ada riwayat stok.</div>;
  }

  return (
    <div className="stock-movement-list">
      {movements.map((movement) => (
        <StockMovementRow
          key={movement.id}
          movement={movement}
          ingredientName={ingredientsById.get(movement.ingredientId)?.name}
        />
      ))}
    </div>
  );
};
