import React from 'react';
import { AlertTriangle, PackageX, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useLanguage } from '../../hooks/useLanguage';

export const DashboardStockAlert = ({ 
  lowStockIngredients = [], 
  outOfStockIngredients = [], 
  getSnapshotByIngredientId,
  onClickManage
}) => {
  const { lang } = useLanguage();
  
  const hasOut = outOfStockIngredients.length > 0;
  const hasLow = lowStockIngredients.length > 0;
  
  if (!hasOut && !hasLow) return null;

  // Combine both, prioritizing out of stock
  const allCritical = [...outOfStockIngredients, ...lowStockIngredients];
  const displayedItems = allCritical.slice(0, 3);
  const remainingCount = allCritical.length - displayedItems.length;

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-300 shadow-xs
      ${hasOut 
        ? 'bg-red-500/[0.02] border-red-500/15 text-red-800' 
        : 'bg-amber-500/[0.02] border-amber-500/15 text-amber-800'
      }`}
    >
      {/* Background Glows */}
      <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-xl pointer-events-none opacity-20
        ${hasOut ? 'bg-red-500' : 'bg-amber-500'}`} 
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs animate-pulse
            ${hasOut 
              ? 'bg-red-500/10 text-red-600' 
              : 'bg-amber-500/10 text-amber-600'
            }`}
          >
            {hasOut ? <PackageX className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm sm:text-base tracking-tight text-text-primary">
              {hasOut && hasLow ? (
                lang === 'id' 
                  ? `Stok Kritis! ${outOfStockIngredients.length} bahan habis & ${lowStockIngredients.length} bahan menipis`
                  : `Critical Stock! ${outOfStockIngredients.length} items out & ${lowStockIngredients.length} items low`
              ) : hasOut ? (
                lang === 'id'
                  ? `Stok Habis! ${outOfStockIngredients.length} bahan baku habis`
                  : `Out of Stock! ${outOfStockIngredients.length} items out of stock`
              ) : (
                lang === 'id'
                  ? `Stok Menipis! ${lowStockIngredients.length} bahan baku menipis`
                  : `Low Stock! ${lowStockIngredients.length} items running low`
              )}
            </h4>
            <p className="text-xs text-text-secondary font-semibold leading-relaxed">
              {lang === 'id' 
                ? 'Segera lakukan restok atau catat penyesuaian stok bahan baku Anda.' 
                : 'Please restock these items or log stock adjustments soon.'}
            </p>
          </div>
        </div>

        <Button 
          size="sm"
          variant={hasOut ? 'danger' : 'primary'}
          onClick={onClickManage}
          className={`shrink-0 self-start md:self-auto font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-102 active:scale-98
            ${!hasOut ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none hover:shadow-amber-500/10 shadow-md' : ''}`}
        >
          {lang === 'id' ? 'Buka Inventory' : 'Open Inventory'}
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>

      {/* Preview list of items */}
      <div className="mt-4 pt-3.5 border-t border-dashed border-current/10 flex flex-wrap gap-2 items-center">
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-text-muted mr-1">
          {lang === 'id' ? 'Bahan Terdampak:' : 'Affected Items:'}
        </span>
        
        {displayedItems.map((ing) => {
          const snapshot = getSnapshotByIngredientId(ing.id);
          const isOut = snapshot?.stockStatus === 'out';
          const qty = snapshot?.currentStock ?? 0;
          const unit = snapshot?.stockUnit || ing.purchaseUnit;
          
          return (
            <div 
              key={ing.id}
              className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold border shadow-3xs transition-all hover:scale-102 cursor-pointer
                ${isOut
                  ? 'bg-red-500/5 border-red-500/10 text-red-700' 
                  : 'bg-amber-500/5 border-amber-500/10 text-amber-700'
                }`}
              onClick={onClickManage}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-red-500 animate-ping' : 'bg-amber-500'}`} />
              <span className="truncate max-w-[120px]">{ing.name}</span>
              <span className="opacity-70 font-extrabold tabular-nums">({qty} {unit})</span>
            </div>
          );
        })}

        {remainingCount > 0 && (
          <div 
            onClick={onClickManage}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-surface-cream border border-border-soft text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
          >
            <span>+{remainingCount} {lang === 'id' ? 'lainnya' : 'more'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </div>
  );
};
