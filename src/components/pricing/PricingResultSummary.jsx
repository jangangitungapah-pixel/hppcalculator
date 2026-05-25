import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { formatCurrency, formatPercent } from '../../lib/calculations';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

export const PricingResultSummary = ({ result, showRecommended = true, error = null }) => {
  const { t, lang, settings } = useLanguage();
  const currency = settings?.currency || 'IDR';

  if (error) {
    return (
      <Card className="p-4 bg-red-50 border-red-200">
        <div className="flex gap-2 items-start text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      </Card>
    );
  }

  if (!result) return null;

  const isLoss = result.profit < 0;

  return (
    <Card className="p-5 border-gray-200 overflow-hidden relative">
      <div className={`absolute top-0 left-0 w-1 h-full ${isLoss ? 'bg-status-loss' : 'bg-status-good'}`} />
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-medium text-text-tertiary mb-1">{t('pricing.profit')}</h3>
          <div className={`text-2xl font-bold ${isLoss ? 'text-status-loss' : 'text-status-good'}`}>
            {formatCurrency(result.profit, lang, currency)}
          </div>
        </div>
        <Badge variant={isLoss ? 'danger' : 'success'} className="flex items-center gap-1">
          {isLoss ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
          {formatPercent(result.marginPercent, lang)} {t('pricing.margin')}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        {result.netRevenue !== undefined && (
          <div>
            <div className="text-xs text-text-tertiary mb-0.5">{t('pricing.netRevenue')}</div>
            <div className="font-semibold text-text-primary">{formatCurrency(result.netRevenue, lang, currency)}</div>
          </div>
        )}
        {result.totalCost !== undefined && (
          <div>
            <div className="text-xs text-text-tertiary mb-0.5">{t('pricing.totalCost')}</div>
            <div className="font-medium text-text-secondary">{formatCurrency(result.totalCost, lang, currency)}</div>
          </div>
        )}
      </div>

      {showRecommended && result.recommendedPrice && (
        <div className="mt-5 p-4 bg-brand-soft rounded-xl border border-brand-primary/20 flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <CheckCircle className="w-5 h-5 text-brand-primary" />
            <span className="font-semibold text-brand-primary">{t('pricing.recommendedPrice')}</span>
          </div>
          <span className="font-bold text-lg text-brand-primary">{formatCurrency(result.recommendedPrice, lang, currency)}</span>
        </div>
      )}
    </Card>
  );
};
