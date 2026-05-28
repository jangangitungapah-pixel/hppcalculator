import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useChannelPricing } from '../../hooks/useChannelPricing';
import { formatCurrency } from '../../lib/calculations';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Box, FileText, CheckSquare, Edit3, ChevronDown } from 'lucide-react';

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
        sourceNameSnapshot: t('pricing.manualSource'),
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
      onChange({
        ...selected,
        sourceNameSnapshot: selected.name
      });
    }
  };

  const handleManualChange = (field) => (e) => {
    const rawValue = e.target.value;
    const nextValue = field === 'name' ? rawValue : Number(rawValue) || 0;
    const nextName = field === 'name' ? rawValue : value?.name || '';

    onChange({
      sourceType: 'manual',
      sourceId: null,
      name: nextName,
      sourceNameSnapshot: nextName.trim() || t('pricing.manualSource'),
      hppPerUnit: value?.hppPerUnit || 0,
      sellingPrice: value?.sellingPrice || 0,
      [field]: nextValue
    });
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
      <label htmlFor="pricing-source-picker" className="block text-sm font-semibold text-text-primary">
        {t('pricing.sourcePicker')}
      </label>
      
      <div className="relative">
        <select
          id="pricing-source-picker"
          value={getSelectedValue()}
          onChange={handleSelect}
          className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-shadow appearance-none pr-10"
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
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {value && value.sourceType === 'manual' && (
        <Card className="p-4 bg-surface border border-border-soft rounded-xl">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="text-sm font-bold text-text-primary">{t('pricing.manualInputTitle')}</h3>
              <p className="text-xs text-text-secondary mt-0.5">{t('pricing.manualInputHelp')}</p>
            </div>
            {getTypeBadge('manual')}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label={t('pricing.manualProductName')}
              value={value.name || ''}
              onChange={handleManualChange('name')}
              placeholder={t('pricing.manualProductNamePlaceholder')}
              containerClassName="sm:col-span-3"
            />
            <Input
              label={t('pricing.hppPerUnit')}
              type="number"
              inputMode="decimal"
              min="0"
              value={value.hppPerUnit || ''}
              onChange={handleManualChange('hppPerUnit')}
              placeholder="0"
              helperText={t('pricing.hppManualHelp')}
            />
            <Input
              label={t('pricing.currentSellingPrice')}
              type="number"
              inputMode="decimal"
              min="0"
              value={value.sellingPrice || ''}
              onChange={handleManualChange('sellingPrice')}
              placeholder="0"
              helperText={t('pricing.sellingPriceManualHelp')}
              containerClassName="sm:col-span-2"
            />
          </div>
        </Card>
      )}

      {value && value.sourceType !== 'manual' && (
        <Card className="p-3.5 bg-surface-muted/50 border border-border-soft rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium text-text-primary">{value.name}</div>
            {getTypeBadge(value.sourceType)}
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <div className="text-text-muted text-xs">{t('pricing.hppPerUnit')}</div>
              <div className="font-semibold">{formatCurrency(value.hppPerUnit, lang, settings?.currency || 'IDR')}</div>
            </div>
            {value.sellingPrice > 0 && (
              <div>
                <div className="text-text-muted text-xs">{t('pricing.currentSellingPrice')}</div>
                <div className="font-medium">{formatCurrency(value.sellingPrice, lang, settings?.currency || 'IDR')}</div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
