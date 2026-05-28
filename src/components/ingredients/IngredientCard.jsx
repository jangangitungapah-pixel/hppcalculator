import React from 'react';
import { Edit2, Trash2, Eye, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { IngredientCategoryPill } from './IngredientCategoryPill';
import { InventoryStatusBadge } from '../inventory/InventoryStatusBadge';
import { formatStockQuantity } from '../../lib/inventory';
import { 
  formatIngredientPurchasePrice, 
  formatIngredientUsagePrice, 
  formatIngredientUnitInfo 
} from '../../lib/ingredients/ingredientFormatters';

export const IngredientCard = ({ 
  ingredient, 
  onClick, 
  onEdit, 
  onDelete, 
  inventorySnapshot,
  lang = 'id', 
  currency = 'IDR' 
}) => {
  const isDemo = ingredient.source === 'demo';
  const isTracked = inventorySnapshot?.stockStatus && inventorySnapshot.stockStatus !== 'not_tracked';

  return (
    <Card 
      variant="clickable"
      onClick={onClick}
      className="ingredient-card p-4 sm:p-5 flex flex-col justify-between border-border/50 group bg-surface hover:shadow-floating hover:border-brand-soft/80 transition-all duration-300 relative rounded-2xl"
    >
      <div>
        {/* Header: Title + Badges */}
        <div className="ingredient-card-header flex justify-between items-start gap-4 mb-2">
          <h3 
            className="ingredient-card-title font-extrabold text-lg text-text-primary line-clamp-1 group-hover:text-brand-primary transition-colors tracking-tight" 
            title={ingredient.name}
          >
            {ingredient.name}
          </h3>
          {isDemo && (
            <span className="ingredient-source-badge text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-md shrink-0">
              Demo
            </span>
          )}
        </div>

        {/* Category Badge */}
        <div className="ingredient-card-meta mb-3">
          <IngredientCategoryPill category={ingredient.category} />
          {isTracked && (
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <InventoryStatusBadge status={inventorySnapshot.stockStatus} />
              <span className="text-[11px] font-bold text-text-secondary">
                Stok: {formatStockQuantity(inventorySnapshot.currentStock, inventorySnapshot.stockUnit)}
              </span>
            </div>
          )}
        </div>

        {/* Purchase Info */}
        <div className="ingredient-price-block mb-2.5">
          <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Harga Beli</p>
          <p className="ingredient-price-sub font-semibold text-text-primary text-sm mt-0.5 tabular-nums">
            {formatIngredientPurchasePrice(ingredient, lang, currency)}
          </p>
        </div>

        {/* Unit Info (if different) */}
        {ingredient.purchaseUnit !== ingredient.baseUnit && (
          <div className="flex items-center gap-1 text-[11px] text-text-secondary font-medium mb-3 bg-surface-muted/50 px-2.5 py-1.5 rounded-xl border border-border/30 max-w-max">
            <Info className="w-3.5 h-3.5 text-text-muted" />
            <span>Konversi: {formatIngredientUnitInfo(ingredient)}</span>
          </div>
        )}
      </div>

      {/* Cost per Base Unit (Focal Point) */}
      <div>
        <div className="ingredient-price-block bg-brand-soft/25 group-hover:bg-brand-soft/45 transition-colors p-3 sm:p-3.5 rounded-xl border border-brand-primary/5 mb-3">
          <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">Harga per {ingredient.baseUnit}</span>
          <p className="ingredient-price-main font-extrabold text-brand-primary text-xl mt-0.5 tabular-nums">
            {formatIngredientUsagePrice(ingredient, lang, currency)}
          </p>
        </div>

        {/* Actions Footer */}
        <div className="ingredient-card-actions flex items-center justify-end border-t border-border/40 pt-2.5 gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
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
              onDelete();
            }}
            className="w-8 h-8 rounded-xl text-text-secondary hover:text-status-loss hover:bg-status-loss/10"
            title="Hapus Bahan"
            aria-label="Hapus Bahan"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
