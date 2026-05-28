import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { formatCurrency } from '../../lib/calculations';
import { Card } from '../ui/Card';
import { AnimatedNumber } from '../motion/AnimatedNumber';

export const PricePointTable = ({ points }) => {
  const { t, lang, settings } = useLanguage();
  const currency = settings?.currency || 'IDR';

  if (!points) return null;

  const data = [
    { label: t('pricing.breakEvenPrice'), value: points.breakEven, margin: '0%' },
    { label: t('result.safePrice'), value: points.safe, margin: '25%' },
    { label: t('result.idealPrice'), value: points.ideal, margin: '40%' },
    { label: t('result.premiumPrice'), value: points.premium, margin: '55%' }
  ].filter(d => d.value > 0);

  if (data.length === 0) return null;

  return (
    <Card className="overflow-hidden border border-border shadow-xs">
      <div className="bg-surface-muted/50 px-4 py-3 border-b border-border-soft">
        <h4 className="text-sm font-semibold text-text-primary">{t('pricing.pricePoints')}</h4>
      </div>
      <div className="divide-y divide-border-soft">
        {data.map((item, i) => (
          <div key={i} className="flex justify-between items-center px-4 py-3">
            <div>
              <div className="text-sm font-medium text-text-primary">{item.label}</div>
              <div className="text-xs text-text-muted">Margin {item.margin}</div>
            </div>
            <div className="font-semibold text-brand-primary">
              <AnimatedNumber value={item.value} isCurrency={true} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
