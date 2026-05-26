import React from 'react';
import { Apple, Beef, Leaf, Flame, Milk, Package, Cake, Wrench, HelpCircle } from 'lucide-react';

export const getIngredientCategoryLabel = (category) => {
  if (!category || typeof category !== 'string') return 'Lainnya';
  const norm = category.toLowerCase().trim();
  switch (norm) {
    case 'ingredient':
    case 'bahan utama':
    case 'bahan pokok':
      return 'Bahan Pokok';
    case 'protein':
      return 'Protein';
    case 'sayur/buah':
    case 'sayur':
    case 'buah':
    case 'sayur_buah':
      return 'Sayur/Buah';
    case 'spice':
    case 'bumbu':
    case 'rempah':
      return 'Bumbu';
    case 'dairy':
    case 'susu':
    case 'keju':
      return 'Dairy';
    case 'packaging':
    case 'kemasan':
      return 'Kemasan';
    case 'topping':
      return 'Topping';
    case 'operasional':
    case 'operational':
      return 'Operasional';
    case 'other':
    case 'lainnya':
    default:
      return 'Lainnya';
  }
};

export const getIngredientCategoryTone = (category) => {
  if (!category || typeof category !== 'string') return 'neutral';
  const norm = category.toLowerCase().trim();
  switch (norm) {
    case 'ingredient':
    case 'bahan utama':
    case 'bahan pokok':
      return 'orange';
    case 'protein':
      return 'red';
    case 'sayur/buah':
    case 'sayur':
    case 'buah':
    case 'sayur_buah':
      return 'green';
    case 'spice':
    case 'bumbu':
    case 'rempah':
      return 'amber';
    case 'dairy':
    case 'susu':
    case 'keju':
      return 'yellow';
    case 'packaging':
    case 'kemasan':
      return 'blue';
    case 'topping':
      return 'purple';
    case 'operasional':
    case 'operational':
      return 'neutral';
    case 'other':
    case 'lainnya':
    default:
      return 'neutral';
  }
};

export const getIngredientCategoryIcon = (category, className = "w-4 h-4") => {
  if (!category || typeof category !== 'string') return <HelpCircle className={className} />;
  const norm = category.toLowerCase().trim();
  switch (norm) {
    case 'ingredient':
    case 'bahan utama':
    case 'bahan pokok':
      return <Apple className={className} />;
    case 'protein':
      return <Beef className={className} />;
    case 'sayur/buah':
    case 'sayur':
    case 'buah':
    case 'sayur_buah':
      return <Leaf className={className} />;
    case 'spice':
      return <Flame className={className} />;
    case 'dairy':
    case 'susu':
    case 'keju':
      return <Milk className={className} />;
    case 'packaging':
      return <Package className={className} />;
    case 'topping':
      return <Cake className={className} />;
    case 'operasional':
      return <Wrench className={className} />;
    case 'other':
    case 'lainnya':
    default:
      return <HelpCircle className={className} />;
  }
};

export const getIngredientSourceLabel = (source) => {
  return source === 'demo' ? 'Demo' : 'Data Saya';
};
