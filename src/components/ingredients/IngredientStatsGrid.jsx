import React from 'react';
import { Apple, Tag, TrendingUp, Database } from 'lucide-react';
import { formatCurrency } from '../../lib/calculations';

export const IngredientStatsGrid = ({ ingredients, settings, lang = 'id' }) => {
  const totalCount = ingredients.length;
  
  // Calculate unique categories
  const categories = ingredients.map(ing => ing.category).filter(Boolean);
  const uniqueCategoriesCount = new Set(categories).size;

  // Calculate average price of input
  const totalPurchasePrice = ingredients.reduce((sum, ing) => sum + (Number(ing.purchasePrice) || 0), 0);
  const avgPrice = totalCount > 0 ? totalPurchasePrice / totalCount : 0;

  // Demo vs User Count
  const demoCount = ingredients.filter(ing => ing.source === 'demo').length;
  const userCount = totalCount - demoCount;

  return (
    <div className="ingredients-stats-grid grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Stat 1: Total Bahan */}
      <div className="ingredient-stat-card bg-surface border border-border p-4 rounded-2xl flex items-center gap-3.5 hover:shadow-sm transition-all duration-300">
        <div className="ingredient-stat-icon flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 text-orange-500 shrink-0">
          <Apple className="w-5 h-5" />
        </div>
        <div>
          <p className="ingredient-stat-value text-xl font-extrabold text-text-primary">{totalCount}</p>
          <p className="ingredient-stat-label text-xs text-text-secondary font-medium">Total Bahan</p>
        </div>
      </div>

      {/* Stat 2: Kategori */}
      <div className="ingredient-stat-card bg-surface border border-border p-4 rounded-2xl flex items-center gap-3.5 hover:shadow-sm transition-all duration-300">
        <div className="ingredient-stat-icon flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 text-green-500 shrink-0">
          <Tag className="w-5 h-5" />
        </div>
        <div>
          <p className="ingredient-stat-value text-xl font-extrabold text-text-primary">{uniqueCategoriesCount}</p>
          <p className="ingredient-stat-label text-xs text-text-secondary font-medium">Kategori Unik</p>
        </div>
      </div>

      {/* Stat 3: Rata-rata Input */}
      <div className="ingredient-stat-card bg-surface border border-border p-4 rounded-2xl flex items-center gap-3.5 hover:shadow-sm transition-all duration-300">
        <div className="ingredient-stat-icon flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-500 shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <p className="ingredient-stat-value text-lg font-extrabold text-text-primary truncate max-w-[140px]" title={formatCurrency(avgPrice, lang, settings.currency)}>
            {formatCurrency(avgPrice, lang, settings.currency)}
          </p>
          <p className="ingredient-stat-label text-xs text-text-secondary font-medium">Rata-rata Nilai Input</p>
        </div>
      </div>

      {/* Stat 4: Demo vs User */}
      <div className="ingredient-stat-card bg-surface border border-border p-4 rounded-2xl flex items-center gap-3.5 hover:shadow-sm transition-all duration-300">
        <div className="ingredient-stat-icon flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-500 shrink-0">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <p className="ingredient-stat-value text-base font-extrabold text-text-primary">
            {userCount} <span className="text-[10px] text-text-secondary font-normal">Saya</span>
            {demoCount > 0 && <span className="text-[10px] text-blue-500 font-bold ml-1">+{demoCount} Demo</span>}
          </p>
          <p className="ingredient-stat-label text-xs text-text-secondary font-medium">Sumber Data</p>
        </div>
      </div>
    </div>
  );
};
