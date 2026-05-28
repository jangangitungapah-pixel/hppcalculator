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
    <Card className="border border-border shadow-xs overflow-hidden">
      <div className="bg-surface-muted/50 px-4 py-3 border-b border-border-soft">
        <h4 className="text-sm font-semibold text-text-primary">{t('pricing.tierPricing')}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-surface-muted/20 text-text-muted border-b border-border-soft uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-2.5 font-bold whitespace-nowrap">Min Qty</th>
              <th className="px-4 py-2.5 font-bold whitespace-nowrap">{t('pricing.wholesalePrice')}</th>
              <th className="px-4 py-2.5 font-bold whitespace-nowrap">{t('pricing.resellerSuggestedPrice')}</th>
              <th className="px-4 py-2.5 font-bold whitespace-nowrap hidden sm:table-cell">{t('pricing.ownerProfit')}</th>
              <th className="px-4 py-2.5 font-bold whitespace-nowrap hidden sm:table-cell">{t('pricing.resellerProfit')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {tiers.map((tier, i) => (
              <tr key={i} className="hover:bg-surface-muted/30 transition-colors">
                <td className="px-4 py-3 font-bold text-text-primary whitespace-nowrap">{tier.minQty} Unit</td>
                <td className="px-4 py-3 text-brand-primary font-bold whitespace-nowrap">
                  <AnimatedNumber value={tier.wholesalePrice} isCurrency={true} />
                </td>
                <td className="px-4 py-3 font-semibold text-text-primary whitespace-nowrap">
                  <AnimatedNumber value={tier.resellerSuggestedPrice} isCurrency={true} />
                </td>
                <td className="px-4 py-3 hidden sm:table-cell whitespace-nowrap">
                  <div className="font-semibold text-status-good">
                    <AnimatedNumber value={tier.ownerProfitPerUnit} isCurrency={true} />
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5">
                    Margin <AnimatedNumber value={tier.ownerMarginPercent} suffix="%" decimals={1} />
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell whitespace-nowrap">
                  <div className="font-semibold text-text-primary">
                    <AnimatedNumber value={tier.resellerProfitPerUnit} isCurrency={true} />
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5">
                    Margin <AnimatedNumber value={tier.resellerMarginPercent} suffix="%" decimals={1} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
