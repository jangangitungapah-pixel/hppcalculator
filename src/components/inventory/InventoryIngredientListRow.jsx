import React from 'react';
import { CalendarClock, History, Minus, Plus, Settings2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatStockQuantity } from '../../lib/inventory';
import { InventoryStatusBadge } from './InventoryStatusBadge';

const formatDate = (dateString) => {
  if (!dateString) return 'Belum ada movement';
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const InventoryIngredientListRow = ({
  ingredient,
  snapshot,
  onAddStock,
  onReduceStock,
  onHistory,
  onSettings
}) => {
  const isTracked = snapshot?.stockStatus !== 'not_tracked';

  return (
    <article className="inventory-list-row">
      <div className="inventory-list-main">
        <div className="inventory-list-title-wrap">
          <h3>{ingredient.name}</h3>
          <span>{ingredient.category || 'Bahan baku'}</span>
        </div>
        <InventoryStatusBadge status={snapshot?.stockStatus} />
      </div>

      <div className="inventory-list-stock">
        <span>Stok</span>
        <strong>{isTracked ? formatStockQuantity(snapshot.currentStock, snapshot.stockUnit) : 'Belum dipantau'}</strong>
      </div>

      <div className="inventory-list-meta">
        <span>Minimum: {isTracked ? formatStockQuantity(snapshot.minimumStock, snapshot.stockUnit) : '-'}</span>
        <span><CalendarClock className="w-3.5 h-3.5" />{formatDate(snapshot?.lastMovementAt)}</span>
      </div>

      <div className="inventory-list-actions">
        <Button size="icon" variant="secondary" onClick={onAddStock} aria-label={`Tambah stok ${ingredient.name}`} title="Tambah stok">
          <Plus className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="outline" onClick={onReduceStock} aria-label={`Kurangi stok ${ingredient.name}`} title="Kurangi stok">
          <Minus className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onHistory} aria-label={`Lihat riwayat stok ${ingredient.name}`} title="Riwayat">
          <History className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onSettings} aria-label={`Atur minimum stok ${ingredient.name}`} title="Atur minimum">
          <Settings2 className="w-4 h-4" />
        </Button>
      </div>
    </article>
  );
};
