import React from 'react';
import { CalendarClock, History, Minus, Plus, Settings2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatStockQuantity } from '../../lib/inventory';
import { InventoryStatusBadge } from './InventoryStatusBadge';

const formatDate = (dateString) => {
  if (!dateString) return 'Belum ada movement';
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const InventoryIngredientCard = ({
  ingredient,
  snapshot,
  onAddStock,
  onReduceStock,
  onHistory,
  onSettings
}) => {
  const isTracked = snapshot?.stockStatus !== 'not_tracked';

  return (
    <article className="inventory-card">
      <div className="inventory-card-header">
        <div>
          <h3>{ingredient.name}</h3>
          <span>{ingredient.category || 'Bahan baku'}</span>
        </div>
        <InventoryStatusBadge status={snapshot?.stockStatus} />
      </div>

      <div className="inventory-stock-block">
        <span className="inventory-stock-label">Stok saat ini</span>
        <strong className="inventory-stock-number">
          {isTracked ? formatStockQuantity(snapshot.currentStock, snapshot.stockUnit) : 'Belum dipantau'}
        </strong>
      </div>

      <div className="inventory-card-meta">
        <span>Minimum: {isTracked ? formatStockQuantity(snapshot.minimumStock, snapshot.stockUnit) : '-'}</span>
        <span className="inventory-last-movement"><CalendarClock className="w-3.5 h-3.5" />{formatDate(snapshot?.lastMovementAt)}</span>
      </div>

      <div className="inventory-card-actions">
        <Button size="sm" variant="secondary" onClick={onAddStock} iconLeft={<Plus className="w-4 h-4" />} aria-label={`Tambah stok ${ingredient.name}`}>Tambah</Button>
        <Button size="sm" variant="outline" onClick={onReduceStock} iconLeft={<Minus className="w-4 h-4" />} aria-label={`Kurangi stok ${ingredient.name}`}>Kurangi</Button>
        <Button size="sm" variant="ghost" onClick={onHistory} iconLeft={<History className="w-4 h-4" />} aria-label={`Lihat riwayat stok ${ingredient.name}`}>Riwayat</Button>
        <Button size="sm" variant="ghost" onClick={onSettings} iconLeft={<Settings2 className="w-4 h-4" />} aria-label={`Atur minimum stok ${ingredient.name}`}>Minimum</Button>
      </div>
    </article>
  );
};
