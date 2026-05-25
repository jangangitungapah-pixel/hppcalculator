import { UNIT_OPTIONS } from './unitTypes';
import { dictionary } from '../../i18n/dictionary';

export const formatUnitLabel = (unit, language = 'id') => {
  const dict = dictionary[language] || dictionary['id'];
  const option = UNIT_OPTIONS.find(o => o.value === unit);
  
  if (option && option.labelId) {
    const parts = option.labelId.split('.');
    let value = dict;
    for (const part of parts) {
      if (value) value = value[part];
    }
    if (value) return value;
  }
  
  return unit;
};

export const formatQuantityWithUnit = (quantity, unit, language = 'id') => {
  const num = Number(quantity);
  const formattedQuantity = isNaN(num) ? '0' : num.toLocaleString(language === 'id' ? 'id-ID' : 'en-US', {
    maximumFractionDigits: 2
  });
  const label = formatUnitLabel(unit, language);
  return `${formattedQuantity} ${label}`;
};

export const getLocalizedUnitOptions = (language = 'id') => {
  return UNIT_OPTIONS.map(option => ({
    value: option.value,
    type: option.type,
    label: formatUnitLabel(option.value, language)
  }));
};
