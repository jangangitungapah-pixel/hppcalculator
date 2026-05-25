import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { formatCurrency, formatPercent } from '../../lib/calculations';
import { Card } from '../ui/Card';

export const TierPricingTable = ({ tiers = [] }) => {
  const { t, lang, settings } = useLanguage();
  const currency = settings?.currency || 'IDR';

  if (!tiers || tiers.length === 0) return null;

  return (
    <Card className="overflow-x-auto border-gray-200">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-text-primary">{t('pricing.tierPricing')}</h4>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50/50 text-text-tertiary">
          <tr>
            <th className="px-4 py-2 font-medium">Min Qty</th>
            <th className="px-4 py-2 font-medium">{t('pricing.wholesalePrice')}</th>
            <th className="px-4 py-2 font-medium">{t('pricing.resellerSuggestedPrice')}</th>
            <th className="px-4 py-2 font-medium hidden sm:table-cell">{t('pricing.ownerProfit')}</th>
            <th className="px-4 py-2 font-medium hidden sm:table-cell">{t('pricing.resellerProfit')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tiers.map((tier, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-semibold">{tier.minQty}</td>
              <td className="px-4 py-3 text-brand-primary font-medium">{formatCurrency(tier.wholesalePrice, lang, currency)}</td>
              <td className="px-4 py-3 font-medium">{formatCurrency(tier.resellerSuggestedPrice, lang, currency)}</td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <div>{formatCurrency(tier.ownerProfitPerUnit, lang, currency)}</div>
                <div className="text-xs text-text-tertiary">{formatPercent(tier.ownerMarginPercent, lang)} margin</div>
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <div>{formatCurrency(tier.resellerProfitPerUnit, lang, currency)}</div>
                <div className="text-xs text-text-tertiary">{formatPercent(tier.resellerMarginPercent, lang)} margin</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
