import React from 'react';
import { getIngredientCategoryLabel, getIngredientCategoryTone, getIngredientCategoryIcon } from '../../lib/ingredients/ingredientVisuals';

export const IngredientCategoryPill = ({ category }) => {
  const label = getIngredientCategoryLabel(category);
  const tone = getIngredientCategoryTone(category);
  
  // Custom theme classes based on color tone
  const toneClasses = {
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    neutral: 'bg-neutral-50 text-neutral-600 border-neutral-100'
  };

  const activeClass = toneClasses[tone] || toneClasses.neutral;

  return (
    <span className={`ingredient-category-pill inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border uppercase tracking-wider ${activeClass}`}>
      {getIngredientCategoryIcon(category, "w-3 h-3")}
      <span>{label}</span>
    </span>
  );
};
