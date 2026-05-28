import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { formatCurrency } from '../../lib/calculations';
import { Card } from '../ui/Card';
import { AnimatedNumber } from '../motion/AnimatedNumber';

export const FeeBreakdownCard = ({ 
  platformCommission = 0, 
  paymentFee = 0, 
  sellerPromo = 0, 
  additionalPackaging = 0,
  storeFee = 0,
  totalFees = 0 
}) => {
  const { t, lang, settings } = useLanguage();
  const currency = settings?.currency || 'IDR';

  const items = [];
  
  if (platformCommission > 0) {
    items.push({ label: t('pricing.commissionPercent'), value: platformCommission });
  }
  if (paymentFee > 0) {
    items.push({ label: t('pricing.paymentFeePercent'), value: paymentFee });
  }
  if (sellerPromo > 0) {
    items.push({ label: t('pricing.sellerPromoPercent'), value: sellerPromo });
  }
  if (additionalPackaging > 0) {
    items.push({ label: t('pricing.additionalPackagingCost'), value: additionalPackaging });
  }
  if (storeFee > 0) {
    items.push({ label: t('pricing.storeFee'), value: storeFee });
  }

  if (items.length === 0) return null;

  return (
    <Card className="p-4 bg-surface-muted/50 border border-border-soft">
      <h4 className="text-sm font-semibold text-text-primary mb-3">{t('pricing.totalFees')}</h4>
      <div className="space-y-2 text-sm">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-text-secondary">
            <span>{item.label}</span>
            <span className="font-medium">
              <AnimatedNumber value={item.value} isCurrency={true} />
            </span>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t border-border-soft flex justify-between font-semibold text-text-primary">
          <span>{t('pricing.totalFees')}</span>
          <span>
            <AnimatedNumber value={totalFees || items.reduce((a, b) => a + b.value, 0)} isCurrency={true} />
          </span>
        </div>
      </div>
    </Card>
  );
};
