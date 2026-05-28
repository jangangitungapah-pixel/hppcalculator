import React from 'react';
import { Calculator, Check, AlertCircle, Circle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ResultCard } from '../ui/ResultCard';
import { AnimatedNumber } from '../motion/AnimatedNumber';
import { parseLocalizedNumber } from '../../lib/data/calculationMapper';

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
  const hasCosts = form.costItems && form.costItems.some(item => parseLocalizedNumber(item.amount) > 0);
  const hasOutput = parseLocalizedNumber(form.outputQuantity) > 0;
  const hasPrice = parseLocalizedNumber(form.sellingPrice) > 0;
  const hasUnit = form.sellingUnit !== 'custom' || form.customSellingUnit?.trim().length > 0;

  return (
    <div className="calculator-result-panel">
      {result ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-extrabold text-text-primary tracking-tight">{t('result.resultTitle', 'Hasil HPP')}</h3>
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
            <div className="flex flex-col gap-2 mb-4">
              {result.warnings.map((warn, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-status-low bg-status-lowBg p-2.5 rounded-xl border border-status-low/20">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{warn.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* Pricing breakdown summary */}
          <div className="space-y-2.5 mb-4 py-3 border-t border-b border-border/60 text-sm">
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
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
              {t('result.suggestedPrices', 'Rekomendasi Harga Jual')}
            </h4>
            <div className="flex flex-col gap-1.5">
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
          <div className="flex flex-col gap-2 pt-3 border-t border-border/60">
            <Button className="w-full h-10" onClick={onSave}>
              {t('result.saveCalculation', 'Simpan Perhitungan')}
            </Button>
            <Button variant="secondary" className="w-full h-10 border-border bg-surface-muted text-text-primary hover:bg-border/30" onClick={onReset}>
              {t('calculator.resetButton', 'Reset')}
            </Button>
          </div>
        </div>
      ) : (
        /* Empty Preview / Form Checklist Onboarding */
        <div className="calculator-result-empty">
          <div className="w-12 h-12 bg-brand-soft rounded-xl flex items-center justify-center mb-4 text-brand-primary shadow-glow-primary">
            <Calculator className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-text-primary mb-1.5">
            {t('calculator.resultPlaceholderTitle', 'Hasil Perhitungan')}
          </h3>
          <p className="text-text-secondary text-xs leading-relaxed max-w-xs mb-4">
            {t('calculator.resultPlaceholderBody', 'Lengkapi langkah pengisian di sebelah kiri untuk melihat estimasi modal.')}
          </p>

          {/* Dynamic checklist */}
          <div className="w-full max-w-xs bg-surface-cream border border-border-soft p-3.5 rounded-xl text-left space-y-2.5 mb-4">
            <h4 className="text-[0.7rem] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Checklist Pengisian:</h4>
            
            <div className="flex items-center gap-2 text-xs">
              {hasName ? (
                <Check className="w-4 h-4 text-secondary shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-text-muted shrink-0" />
              )}
              <span className={hasName ? 'text-text-primary font-medium line-through opacity-60' : 'text-text-secondary'}>
                Nama produk terisi
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {hasCosts ? (
                <Check className="w-4 h-4 text-secondary shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-text-muted shrink-0" />
              )}
              <span className={hasCosts ? 'text-text-primary font-medium line-through opacity-60' : 'text-text-secondary'}>
                Minimal 1 biaya &gt; Rp0
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {hasOutput ? (
                <Check className="w-4 h-4 text-secondary shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-text-muted shrink-0" />
              )}
              <span className={hasOutput ? 'text-text-primary font-medium line-through opacity-60' : 'text-text-secondary'}>
                Jumlah hasil diisi
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {hasPrice ? (
                <Check className="w-4 h-4 text-secondary shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-text-muted shrink-0" />
              )}
              <span className={hasPrice ? 'text-text-primary font-medium line-through opacity-60' : 'text-text-secondary'}>
                Harga jual target diisi
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {hasUnit ? (
                <Check className="w-4 h-4 text-secondary shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-text-muted shrink-0" />
              )}
              <span className={hasUnit ? 'text-text-primary font-medium line-through opacity-60' : 'text-text-secondary'}>
                Satuan jual diisi
              </span>
            </div>
          </div>

          <Button 
            className="w-full h-10"
            onClick={onCalculate}
            disabled={!hasName || !hasCosts || !hasOutput || !hasPrice || !hasUnit}
          >
            {t('calculator.calculateButton', 'Hitung Sekarang')}
          </Button>
        </div>
      )}
    </div>
  );
};
