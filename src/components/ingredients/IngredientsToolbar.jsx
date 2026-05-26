import React from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { getIngredientCategoryLabel } from '../../lib/ingredients/ingredientVisuals';

export const IngredientsToolbar = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSource,
  onSourceChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  uniqueCategories
}) => {
  return (
    <div className="ingredients-toolbar bg-surface border border-border p-4 rounded-3xl mb-6 flex flex-col gap-4 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search Input */}
        <div className="ingredients-search relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-secondary" />
          </div>
          <Input 
            type="text" 
            placeholder="Cari bahan, kategori, atau unit..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 border-border/80 rounded-xl focus:ring-2 focus:ring-brand-primary"
            aria-label="Cari bahan baku"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="ingredients-view-toggle flex items-center bg-surface-muted p-1 rounded-xl shrink-0 self-end md:self-auto gap-1 border border-border/40">
          <Button
            variant={viewMode === 'grid' ? 'white' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('grid')}
            className={`w-8 h-8 rounded-lg ${
              viewMode === 'grid' 
                ? 'text-brand-primary' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
            aria-label="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'white' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('list')}
            className={`w-8 h-8 rounded-lg ${
              viewMode === 'list' 
                ? 'text-brand-primary' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
            aria-label="List View"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter and Sort Row */}
      <div className="ingredients-filter-row flex flex-wrap md:flex-nowrap gap-3 items-center">
        {/* Category Filter */}
        <div className="flex-1 min-w-[130px]">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
            aria-label="Filter Kategori"
          >
            <option value="all">Semua Kategori</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>
                {getIngredientCategoryLabel(cat)}
              </option>
            ))}
          </select>
        </div>

        {/* Source Filter */}
        <div className="flex-1 min-w-[130px]">
          <select
            value={selectedSource}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
            aria-label="Filter Sumber Data"
          >
            <option value="all">Semua Sumber</option>
            <option value="user">Data Saya</option>
            <option value="demo">Data Demo</option>
          </select>
        </div>

        {/* Sort Selector */}
        <div className="flex-1 min-w-[130px]">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
            aria-label="Urutkan"
          >
            <option value="newest">Terbaru</option>
            <option value="name_asc">Nama A-Z</option>
            <option value="name_desc">Nama Z-A</option>
            <option value="price_desc">Harga Termahal</option>
            <option value="price_asc">Harga Termurah</option>
          </select>
        </div>
      </div>
    </div>
  );
};
