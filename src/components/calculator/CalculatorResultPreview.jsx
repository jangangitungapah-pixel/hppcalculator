import React from 'react';
import { Calculator, Check, AlertCircle, Circle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ResultCard } from '../ui/ResultCard';
import { AnimatedNumber } from '../motion/AnimatedNumber';

export const CalculatorResultPreview = ({ 
  form,
  result, 
  onCalculate, 
  onSave, 
  onReset, 
  t 
}) => {
  // Checklist validation states
  const hasName = form.productName && form.productName.trim().length > 0;
  const hasCosts = form.costItems && form.costItems.some(item => parseFloat(item.amount) > 0);
  const hasOutput = form.outputQuantity && parseFloat(form.outputQuantity) > 0;
  const hasPrice = form.sellingPrice && parseFloat(form.sellingPrice) > 0;

  return (
    <div className="calculator-result-panel">
      {result ? (
        <div>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-extrabold text-text-primary tracking-tight">{t('result.resultTitle', 'Hasil HPP')}</h3>
            <Badge variant={result.profitStatus.key}>
              {t(`result.status.${result.profitStatus.key}`, result.profitStatus.key.toUpperCase())}
            </Badge>
          </div>

          {/* Premium Hero Card */}
          <div className={`calculator-result-hero ${result.profitStatus.key}`}>
            <div className="text-xs font-bold opacity-90 text-white/95 uppercase tracking-wider mb-1">
              {t('result.hppPerUnit', 'HPP per Produk')}
            </div>
            <AnimatedNumber 
              value={result.hppPerUnit} 
              isCurrency={true}
              className="calculator-result-number drop-shadow-md"
            />
          </div>

          {/* Core Metrics Grid */}
          <div className="calculator-result-metrics">
            <ResultCard 
              label={t('result.profitPerUnit', 'Untung per Produk')} 
              value={<AnimatedNumber value={result.profitPerUnit} isCurrency={true} />}
              tone={result.profitPerUnit > 0 ? 'good' : result.profitPerUnit < 0 ? 'loss' : 'neutral'}
            />
            <ResultCard 
              label={t('result.margin', 'Margin')} 
              value={<AnimatedNumber value={result.marginPercent} suffix="%" />}
              tone={result.marginPercent > 15 ? 'good' : result.marginPercent > 0 ? 'low' : 'loss'}
            />
          </div>
          
          {/* Warnings */}
          {result.warnings && result.warnings.length > 0 && (
            <div className="flex flex-col gap-2 mb-5">
              {result.warnings.map((warn, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-status-low bg-status-lowBg p-2.5 rounded-xl border border-status-low/20">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{warn.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* Pricing breakdown summary */}
          <div className="space-y-3 mb-5 py-3 border-t border-b border-border/60 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">{t('result.totalProductionCost', 'Total Modal Produksi')}</span>
              <AnimatedNumber value={result.totalProductionCost} isCurrency={true} className="font-semibold text-text-primary" />
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">{t('result.totalProfit', 'Total Keuntungan')}</span>
              <AnimatedNumber 
                value={result.totalProfit} 
                isCurrency={true} 
                className={`font-bold ${result.totalProfit < 0 ? 'text-status-loss' : 'text-status-good'}`} 
              />
            </div>
          </div>

          {/* Suggested Price recommendations */}
          <div className="calculator-suggested-prices">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
              {t('result.suggestedPrices', 'Rekomendasi Harga Jual')}
            </h4>
            <div className="flex flex-col gap-2">
              <div className="calculator-suggested-price-card">
                <span className="text-text-secondary font-medium">{t('result.safePrice', 'Aman')} (15%)</span>
                <AnimatedNumber value={result.suggestedPrices?.safe?.price || 0} isCurrency={true} className="font-bold text-text-primary" />
              </div>
              <div className="calculator-suggested-price-card ideal">
                <span className="font-bold">{t('result.idealPrice', 'Ideal')} (30%)</span>
                <AnimatedNumber value={result.suggestedPrices?.ideal?.price || 0} isCurrency={true} className="font-extrabold" />
              </div>
              <div className="calculator-suggested-price-card premium">
                <span className="font-bold">{t('result.premiumPrice', 'Premium')} (50%)</span>
                <AnimatedNumber value={result.suggestedPrices?.premium?.price || 0} isCurrency={true} className="font-extrabold" />
              </div>
            </div>
          </div>

          {/* Panel Actions */}
          <div className="flex flex-col gap-2.5 pt-4 border-t border-border/60">
            <Button className="w-full h-11" onClick={onSave}>
              {t('result.saveCalculation', 'Simpan Perhitungan')}
            </Button>
            <Button variant="secondary" className="w-full h-11 border-border bg-surface-muted text-text-primary hover:bg-border/30" onClick={onReset}>
              {t('calculator.resetButton', 'Reset')}
            </Button>
          </div>
        </div>
      ) : (
        /* Empty Preview / Form Checklist Onboarding */
        <div className="calculator-result-empty">
          <div className="w-16 h-16 bg-brand-soft rounded-2xl flex items-center justify-center mb-6 text-brand-primary shadow-glow-primary">
            <Calculator className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-text-primary mb-2">
            {t('calculator.resultPlaceholderTitle', 'Hasil Perhitungan')}
          </h3>
          <p className="text-text-secondary text-sm max-w-xs mb-6">
            {t('calculator.resultPlaceholderBody', 'Lengkapi langkah pengisian di sebelah kiri untuk melihat estimasi modal.')}
          </p>

          {/* Dynamic checklist */}
          <div className="w-full max-w-xs bg-surface-cream border border-border-soft p-4.5 rounded-2xl text-left space-y-3.5 mb-6">
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Checklist Pengisian:</h4>
            
            <div className="flex items-center gap-2.5 text-sm">
              {hasName ? (
                <Check className="w-4 h-4 text-secondary shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-text-muted shrink-0" />
              )}
              <span className={hasName ? 'text-text-primary font-medium line-through opacity-60' : 'text-text-secondary'}>
                Nama produk terisi
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-sm">
              {hasCosts ? (
                <Check className="w-4 h-4 text-secondary shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-text-muted shrink-0" />
              )}
              <span className={hasCosts ? 'text-text-primary font-medium line-through opacity-60' : 'text-text-secondary'}>
                Minimal 1 biaya &gt; Rp0
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-sm">
              {hasOutput ? (
                <Check className="w-4 h-4 text-secondary shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-text-muted shrink-0" />
              )}
              <span className={hasOutput ? 'text-text-primary font-medium line-through opacity-60' : 'text-text-secondary'}>
                Jumlah hasil diisi
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-sm">
              {hasPrice ? (
                <Check className="w-4 h-4 text-secondary shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-text-muted shrink-0" />
              )}
              <span className={hasPrice ? 'text-text-primary font-medium line-through opacity-60' : 'text-text-secondary'}>
                Harga jual target diisi
              </span>
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={onCalculate}
            disabled={!hasCosts || !hasOutput}
          >
            {t('calculator.calculateButton', 'Hitung Sekarang')}
          </Button>
        </div>
      )}
    </div>
  );
};
