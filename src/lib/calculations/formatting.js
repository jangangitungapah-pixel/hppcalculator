import { SELLING_UNITS, DEFAULT_LANGUAGE, DEFAULT_CURRENCY } from './constants.js';

export function formatCurrency(value, language = DEFAULT_LANGUAGE, currency = DEFAULT_CURRENCY) {
  const locale = language === 'id' ? 'id-ID' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatPercent(value, language = DEFAULT_LANGUAGE) {
  const locale = language === 'id' ? 'id-ID' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value / 100);
}

export function formatNumber(value, language = DEFAULT_LANGUAGE) {
  const locale = language === 'id' ? 'id-ID' : 'en-US';
  return new Intl.NumberFormat(locale).format(value);
}

export function getLocalizedUnitLabel(unitValue, language = DEFAULT_LANGUAGE) {
  const unit = SELLING_UNITS.find(u => u.value === unitValue);
  if (!unit) return unitValue;
  return language === 'id' ? unit.labelId : unit.labelEn;
}
