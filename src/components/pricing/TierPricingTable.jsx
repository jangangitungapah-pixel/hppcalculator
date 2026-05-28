import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { formatCurrency, formatPercent } from '../../lib/calculations';
import { Card } from '../ui/Card';
import { AnimatedNumber } from '../motion/AnimatedNumber';

export const TierPricingTable = ({ tiers = [] }) => {
  const { t, lang, settings } = useLanguage();
  const currency = settings?.currency || 'IDR';

  if (!tiers || tiers.length === 0) return null;

  return (
    <Card className="overflow-x-auto border border-border shadow-xs">
      <div className="bg-surface-muted/50 px-4 py-3 border-b border-border-soft">
        <h4 className="text-sm font-semibold text-text-primary">{t('pricing.tierPricing')}</h4>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-surface-muted/20 text-text-muted">
          <tr>
            <th className="px-4 py-2 font-medium">Min Qty</th>
            <th className="px-4 py-2 font-medium">{t('pricing.wholesalePrice')}</th>
            <th className="px-4 py-2 font-medium">{t('pricing.resellerSuggestedPrice')}</th>
            <th className="px-4 py-2 font-medium hidden sm:table-cell">{t('pricing.ownerProfit')}</th>
            <th className="px-4 py-2 font-medium hidden sm:table-cell">{t('pricing.resellerProfit')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-soft">
          {tiers.map((tier, i) => (
            <tr key={i} className="hover:bg-surface-muted/30">
              <td className="px-4 py-3 font-semibold">{tier.minQty}</td>
              <td className="px-4 py-3 text-brand-primary font-medium">
                <AnimatedNumber value={tier.wholesalePrice} isCurrency={true} />
              </td>
              <td className="px-4 py-3 font-medium">
                <AnimatedNumber value={tier.resellerSuggestedPrice} isCurrency={true} />
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <div><AnimatedNumber value={tier.ownerProfitPerUnit} isCurrency={true} /></div>
                <div className="text-xs text-text-muted">
                  <AnimatedNumber value={tier.ownerMarginPercent} suffix="%" decimals={1} /> margin
                </div>
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <div><AnimatedNumber value={tier.resellerProfitPerUnit} isCurrency={true} /></div>
                <div className="text-xs text-text-muted">
                  <AnimatedNumber value={tier.resellerMarginPercent} suffix="%" decimals={1} /> margin
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
