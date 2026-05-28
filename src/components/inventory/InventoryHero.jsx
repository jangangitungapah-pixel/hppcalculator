import React from 'react';
import { PackageSearch, Plus, SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';

export const InventoryHero = ({ onAddStock, onAdjustStock }) => (
  <section className="inventory-hero">
    <div className="inventory-hero-content">
      <div className="inventory-hero-pills" aria-label="Karakteristik inventory">
        <span>Local-first</span>
        <span>Movement log</span>
        <span>Stok minimum</span>
      </div>
      <h1>Inventory Bahan</h1>
      <p>Pantau stok bahan, stok minimum, dan riwayat pergerakan bahan baku.</p>
    </div>
    <div className="inventory-hero-actions">
      <Button onClick={onAddStock} iconLeft={<Plus className="w-4 h-4" />}>Tambah Stok</Button>
      <Button variant="secondary" onClick={onAdjustStock} iconLeft={<SlidersHorizontal className="w-4 h-4" />}>
        Catat Penyesuaian
      </Button>
    </div>
    <PackageSearch className="inventory-hero-mark" aria-hidden="true" />
  </section>
);
