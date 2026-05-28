import React from 'react';
import { PackageOpen, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

export const InventoryEmptyState = ({ type = 'noIngredients', onAddIngredient, onEnableTracking }) => {
  const noIngredients = type === 'noIngredients';

  return (
    <section className="inventory-empty-state">
      <PackageOpen className="w-10 h-10" />
      <h2>{noIngredients ? 'Belum ada bahan baku' : 'Belum ada bahan yang dipantau'}</h2>
      <p>
        {noIngredients
          ? 'Tambahkan bahan baku dulu untuk mulai memantau stok.'
          : 'Pilih bahan yang ingin dipantau stoknya.'}
      </p>
      <Button onClick={noIngredients ? onAddIngredient : onEnableTracking} iconLeft={<Plus className="w-4 h-4" />}>
        {noIngredients ? 'Tambah Bahan' : 'Aktifkan Tracking'}
      </Button>
    </section>
  );
};
