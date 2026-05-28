import React from 'react';
import { Filter, LayoutGrid, List, PanelsTopLeft, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const InventoryToolbar = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange
}) => (
  <section className="inventory-toolbar">
    <div className="inventory-toolbar-main">
      <Input
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Cari bahan..."
        prefix={<Search className="w-4 h-4" />}
        containerClassName="inventory-toolbar-search"
        aria-label="Cari bahan inventory"
      />
      <div className="inventory-view-toggle" role="group" aria-label="Mode tampilan inventory">
        <Button
          type="button"
          variant={viewMode === 'grid' ? 'white' : 'ghost'}
          size="icon"
          onClick={() => onViewModeChange('grid')}
          className="inventory-view-button"
          aria-label="Mode grid"
          aria-pressed={viewMode === 'grid'}
          title="Grid"
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={viewMode === 'list' ? 'white' : 'ghost'}
          size="icon"
          onClick={() => onViewModeChange('list')}
          className="inventory-view-button"
          aria-label="Mode list"
          aria-pressed={viewMode === 'list'}
          title="List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={viewMode === 'tabbed' ? 'white' : 'ghost'}
          size="icon"
          onClick={() => onViewModeChange('tabbed')}
          className="inventory-view-button"
          aria-label="Mode tabbed"
          aria-pressed={viewMode === 'tabbed'}
          title="Tabbed"
        >
          <PanelsTopLeft className="w-4 h-4" />
        </Button>
      </div>
    </div>
    <div className="inventory-filter-row">
      <label className="inventory-select-wrap">
        <span><Filter className="w-3.5 h-3.5" />Status</span>
        <select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)} aria-label="Filter status stok">
          <option value="all">Semua status</option>
          <option value="ok">Aman</option>
          <option value="low">Rendah</option>
          <option value="out">Habis</option>
          <option value="not_tracked">Tidak dipantau</option>
        </select>
      </label>
      <label className="inventory-select-wrap">
        <span><SlidersHorizontal className="w-3.5 h-3.5" />Urutkan</span>
        <select value={sortBy} onChange={(event) => onSortChange(event.target.value)} aria-label="Urutkan inventory">
          <option value="name">Nama</option>
          <option value="lowest">Stok terendah</option>
          <option value="lastMovement">Terakhir bergerak</option>
        </select>
      </label>
    </div>
  </section>
);
