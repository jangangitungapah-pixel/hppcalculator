import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useChannelPricing } from '../../hooks/useChannelPricing';
import { formatCurrency } from '../../lib/calculations';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Box, FileText, CheckSquare, Edit3 } from 'lucide-react';

export const ProductSourcePicker = ({ value, onChange }) => {
  const { t, lang, settings } = useLanguage();
  const { getSourcePickerOptions } = useChannelPricing();
  
  const options = getSourcePickerOptions();
  
  const handleSelect = (e) => {
    const val = e.target.value;
    if (val === 'manual') {
      onChange({
        sourceType: 'manual',
        sourceId: null,
        name: '',
        hppPerUnit: 0,
        sellingPrice: 0
      });
      return;
    }
    
    // Find the option
    let selected = null;
    ['calculations', 'recipes', 'products'].forEach(group => {
      const found = options[group].find(opt => `${opt.sourceType}_${opt.sourceId}` === val);
      if (found) selected = found;
    });
    
    if (selected) {
      onChange(selected);
    }
  };

  const getSelectedValue = () => {
    if (!value || value.sourceType === 'manual') return 'manual';
    return `${value.sourceType}_${value.sourceId}`;
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'calculation': return <Badge variant="secondary" className="flex items-center gap-1"><CheckSquare className="w-3 h-3" /> {t('pricing.savedCalculation')}</Badge>;
      case 'recipe': return <Badge variant="primary" className="flex items-center gap-1"><FileText className="w-3 h-3" /> {t('pricing.recipeSource')}</Badge>;
      case 'product': return <Badge className="flex items-center gap-1 bg-purple-100 text-purple-700 border-purple-200"><Box className="w-3 h-3" /> {t('pricing.productSource')}</Badge>;
      default: return <Badge variant="outline" className="flex items-center gap-1"><Edit3 className="w-3 h-3" /> {t('pricing.manualSource')}</Badge>;
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-text-primary">
        {t('pricing.sourcePicker')}
      </label>
      
      <select
        value={getSelectedValue()}
        onChange={handleSelect}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-shadow"
      >
        <option value="manual">{t('pricing.manualSource')}</option>
        
        {options.products.length > 0 && (
          <optgroup label={t('pricing.productSource')}>
            {options.products.map(opt => (
              <option key={`prod_${opt.sourceId}`} value={`product_${opt.sourceId}`}>
                {opt.name}
              </option>
            ))}
          </optgroup>
        )}
        
        {options.recipes.length > 0 && (
          <optgroup label={t('pricing.recipeSource')}>
            {options.recipes.map(opt => (
              <option key={`rec_${opt.sourceId}`} value={`recipe_${opt.sourceId}`}>
                {opt.name}
              </option>
            ))}
          </optgroup>
        )}
        
        {options.calculations.length > 0 && (
          <optgroup label={t('pricing.savedCalculation')}>
            {options.calculations.map(opt => (
              <option key={`calc_${opt.sourceId}`} value={`calculation_${opt.sourceId}`}>
                {opt.name}
              </option>
            ))}
          </optgroup>
        )}
      </select>

      {value && value.sourceType !== 'manual' && (
        <Card className="p-3 bg-gray-50 border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium text-text-primary">{value.name}</div>
            {getTypeBadge(value.sourceType)}
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <div className="text-text-tertiary text-xs">{t('pricing.hppPerUnit')}</div>
              <div className="font-semibold">{formatCurrency(value.hppPerUnit, lang, settings?.currency || 'IDR')}</div>
            </div>
            {value.sellingPrice > 0 && (
              <div>
                <div className="text-text-tertiary text-xs">{t('pricing.currentSellingPrice')}</div>
                <div className="font-medium">{formatCurrency(value.sellingPrice, lang, settings?.currency || 'IDR')}</div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
