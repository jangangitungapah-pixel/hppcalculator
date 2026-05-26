import React from 'react';
import { Edit2, Trash2, Eye, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { IngredientCategoryPill } from './IngredientCategoryPill';
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
  lang = 'id', 
  currency = 'IDR' 
}) => {
  const isDemo = ingredient.source === 'demo';

  return (
    <Card 
      variant="clickable"
      onClick={onClick}
      className="ingredient-card p-5 flex flex-col justify-between border-border/50 group bg-surface hover:shadow-floating hover:border-brand-soft/80 transition-all duration-300 relative rounded-3xl"
    >
      <div>
        {/* Header: Title + Badges */}
        <div className="ingredient-card-header flex justify-between items-start gap-4 mb-3">
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
        <div className="ingredient-card-meta mb-4">
          <IngredientCategoryPill category={ingredient.category} />
        </div>

        {/* Purchase Info */}
        <div className="ingredient-price-block mb-3">
          <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Harga Beli</p>
          <p className="ingredient-price-sub font-semibold text-text-primary text-sm mt-0.5 tabular-nums">
            {formatIngredientPurchasePrice(ingredient, lang, currency)}
          </p>
        </div>

        {/* Unit Info (if different) */}
        {ingredient.purchaseUnit !== ingredient.baseUnit && (
          <div className="flex items-center gap-1 text-[11px] text-text-secondary font-medium mb-4 bg-surface-muted/50 px-2.5 py-1.5 rounded-xl border border-border/30 max-w-max">
            <Info className="w-3.5 h-3.5 text-text-muted" />
            <span>Konversi: {formatIngredientUnitInfo(ingredient)}</span>
          </div>
        )}
      </div>

      {/* Cost per Base Unit (Focal Point) */}
      <div>
        <div className="ingredient-price-block bg-brand-soft/25 group-hover:bg-brand-soft/45 transition-colors p-3.5 rounded-2xl border border-brand-primary/5 mb-4">
          <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">Harga per {ingredient.baseUnit}</span>
          <p className="ingredient-price-main font-extrabold text-brand-primary text-xl mt-0.5 tabular-nums">
            {formatIngredientUsagePrice(ingredient, lang, currency)}
          </p>
        </div>

        {/* Actions Footer */}
        <div className="ingredient-card-actions flex items-center justify-end border-t border-border/40 pt-3 gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-2 text-text-secondary hover:text-brand-primary hover:bg-brand-soft/40 rounded-xl transition-all"
            title="Edit Bahan"
            aria-label="Edit Bahan"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-text-secondary hover:text-status-loss hover:bg-status-loss/10 rounded-xl transition-all"
            title="Hapus Bahan"
            aria-label="Hapus Bahan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};
