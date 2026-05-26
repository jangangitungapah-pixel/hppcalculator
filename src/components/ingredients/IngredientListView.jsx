import React from 'react';
import { Edit2, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { IngredientCategoryPill } from './IngredientCategoryPill';
import { 
  formatIngredientPurchasePrice, 
  formatIngredientUsagePrice 
} from '../../lib/ingredients/ingredientFormatters';

export const IngredientListView = ({ 
  ingredients, 
  onItemClick, 
  onEdit, 
  onDelete, 
  lang = 'id', 
  currency = 'IDR' 
}) => {
  return (
    <div className="ingredients-list flex flex-col gap-3">
      {/* Desktop Headers */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider border-b border-border/60">
        <div className="col-span-4">Bahan Baku</div>
        <div className="col-span-2">Kategori</div>
        <div className="col-span-3 text-right">Harga Beli</div>
        <div className="col-span-2 text-right">Harga / Satuan Dasar</div>
        <div className="col-span-1 text-right">Aksi</div>
      </div>

      {/* Rows */}
      {ingredients.map(ing => {
        const isDemo = ing.source === 'demo';
        
        return (
          <div 
            key={ing.id}
            onClick={() => onItemClick(ing.id)}
            className="ingredient-list-row bg-surface border border-border hover:border-brand-soft hover:shadow-sm p-4 md:px-5 md:py-3.5 rounded-2xl md:rounded-xl cursor-pointer transition-all duration-200 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center group"
          >
            {/* Column 1: Title & Badges */}
            <div className="col-span-1 md:col-span-4 flex items-center justify-between md:justify-start gap-2.5">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-text-primary text-base md:text-sm group-hover:text-brand-primary transition-colors tracking-tight line-clamp-1">
                  {ing.name}
                </span>
                {isDemo && (
                  <span className="md:hidden self-start text-[8px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded">
                    Demo
                  </span>
                )}
              </div>
              
              {isDemo && (
                <span className="hidden md:inline-block text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-md shrink-0">
                  Demo
                </span>
              )}
            </div>

            {/* Column 2: Category */}
            <div className="col-span-1 md:col-span-2 flex items-center">
              <IngredientCategoryPill category={ing.category} />
            </div>

            {/* Column 3: Purchase Price */}
            <div className="col-span-1 md:col-span-3 flex md:flex-col justify-between md:justify-center md:items-end text-sm md:text-right">
              <span className="md:hidden text-xs text-text-secondary font-medium">Harga Beli:</span>
              <span className="font-semibold text-text-primary tabular-nums">
                {formatIngredientPurchasePrice(ing, lang, currency)}
              </span>
            </div>

            {/* Column 4: Cost per Base Unit */}
            <div className="col-span-1 md:col-span-2 flex md:flex-col justify-between md:justify-center md:items-end text-sm md:text-right bg-brand-soft/10 md:bg-transparent p-2.5 md:p-0 rounded-xl">
              <span className="md:hidden text-xs text-brand-primary font-bold">Harga Satuan Pakai:</span>
              <span className="font-bold text-brand-primary md:text-text-primary tabular-nums">
                {formatIngredientUsagePrice(ing, lang, currency)}
              </span>
            </div>

            {/* Column 5: Actions */}
            <div className="col-span-1 md:col-span-1 flex items-center justify-end gap-1 border-t md:border-t-0 border-border/40 pt-2 md:pt-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(ing.id);
                }}
                className="w-8 h-8 rounded-xl text-text-secondary hover:text-brand-primary hover:bg-brand-soft"
                title="Edit Bahan"
                aria-label="Edit Bahan"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(ing.id);
                }}
                className="w-8 h-8 rounded-xl text-text-secondary hover:text-status-loss hover:bg-status-loss/10"
                title="Hapus Bahan"
                aria-label="Hapus Bahan"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-brand-primary hover:bg-brand-soft rounded-xl flex items-center gap-1 font-semibold text-xs py-1"
                aria-label="Lihat Detail"
              >
                <span>Detail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
