import React from 'react';
import { Calculator, Check, AlertCircle, Circle, ArrowRight } from 'lucide-react';
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
    <div className="bg-surface border border-border rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300">
      {result ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-border/60">
            <h3 className="text-[15px] font-extrabold text-text-primary tracking-tight">{t('result.resultTitle', 'Hasil HPP')}</h3>
            <Badge variant={result.profitStatus.key}>
              {t(`result.status.${result.profitStatus.key}`, result.profitStatus.key.toUpperCase())}
            </Badge>
          </div>

          {/* Premium Hero Card */}
          <div className={`relative rounded-2xl p-5 text-center text-white overflow-hidden shadow-md ${
            result.profitStatus.key === 'loss' 
              ? 'bg-gradient-to-br from-red-700 via-red-600 to-rose-500 shadow-red-500/10' 
              : result.profitStatus.key === 'low'
              ? 'bg-gradient-to-br from-amber-500 via-amber-400 to-orange-500 shadow-amber-500/10'
              : 'bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 shadow-emerald-500/10'
          }`}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/15 via-transparent to-transparent pointer-events-none" />
            <div className="text-[11px] font-black uppercase tracking-widest text-white/80 mb-1">
              {t('result.hppPerUnit', 'HPP per Produk')}
            </div>
            <AnimatedNumber 
              value={result.hppPerUnit} 
              isCurrency={true}
              className="text-3xl sm:text-4xl font-black drop-shadow-md text-white"
            />
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-4.5 rounded-2xl border transition-all ${
              result.profitPerUnit > 0 
                ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-800' 
                : result.profitPerUnit < 0 
                ? 'bg-red-500/5 border-red-500/10 text-red-800' 
                : 'bg-surface border-border text-text-primary'
            }`}>
              <div className="text-[10px] uppercase font-bold text-text-secondary tracking-wider mb-1">
                {t('result.profitPerUnit', 'Untung / Produk')}
              </div>
              <div className="text-lg font-black leading-tight">
                <AnimatedNumber value={result.profitPerUnit} isCurrency={true} />
              </div>
            </div>

            <div className={`p-4.5 rounded-2xl border transition-all ${
              result.marginPercent > 15 
                ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-800' 
                : result.marginPercent > 0 
                ? 'bg-amber-500/5 border-amber-500/10 text-amber-800' 
                : 'bg-red-500/5 border-red-500/10 text-red-800'
            }`}>
              <div className="text-[10px] uppercase font-bold text-text-secondary tracking-wider mb-1">
                {t('result.margin', 'Margin')}
              </div>
              <div className="text-lg font-black leading-tight">
                <AnimatedNumber value={result.marginPercent} suffix="%" />
              </div>
            </div>
          </div>
          
          {/* Warnings */}
          {result.warnings && result.warnings.length > 0 && (
            <div className="flex flex-col gap-2">
              {result.warnings.map((warn, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-amber-800 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 leading-relaxed font-semibold">
                  <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <p>{warn.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* Pricing breakdown summary */}
          <div className="space-y-3 py-3 border-t border-b border-border/60 text-xs font-semibold text-text-secondary">
            <div className="flex justify-between items-center">
              <span>{t('result.totalProductionCost', 'Total Modal Produksi')}</span>
              <AnimatedNumber value={result.totalProductionCost} isCurrency={true} className="font-bold text-text-primary" />
            </div>
            <div className="flex justify-between items-center">
              <span>{t('result.totalProfit', 'Total Keuntungan')}</span>
              <AnimatedNumber 
                value={result.totalProfit} 
                isCurrency={true} 
                className={`font-black ${result.totalProfit < 0 ? 'text-red-600' : 'text-emerald-600'}`} 
              />
            </div>
          </div>

          {/* Suggested Price recommendations */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">
              {t('result.suggestedPrices', 'Rekomendasi Harga Jual')}
            </h4>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center p-3 rounded-xl border border-border-soft bg-surface-cream text-xs font-semibold hover:border-orange-500/20 transition-all duration-200">
                <span className="text-text-secondary">{t('result.safePrice', 'Aman')} (15%)</span>
                <AnimatedNumber value={result.suggestedPrices?.safe?.price || 0} isCurrency={true} className="font-bold text-text-primary" />
              </div>
              
              <div className="flex justify-between items-center p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs font-bold text-emerald-800 transition-all duration-200 shadow-xs relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-bl-lg font-black uppercase tracking-wider">
                  Rekomendasi
                </div>
                <span>{t('result.idealPrice', 'Ideal')} (30%)</span>
                <AnimatedNumber value={result.suggestedPrices?.ideal?.price || 0} isCurrency={true} className="font-extrabold text-sm" />
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl border border-purple-500/20 bg-purple-500/5 text-xs font-bold text-purple-800 transition-all duration-200">
                <span>{t('result.premiumPrice', 'Premium')} (50%)</span>
                <AnimatedNumber value={result.suggestedPrices?.premium?.price || 0} isCurrency={true} className="font-extrabold" />
              </div>
            </div>
          </div>

          {/* Panel Actions */}
          <div className="flex flex-col gap-2 pt-3 border-t border-border/60">
            <Button className="w-full h-11 text-xs font-bold shadow-glow-primary rounded-xl" onClick={onSave}>
              {t('result.saveCalculation', 'Simpan Perhitungan')}
            </Button>
            <Button variant="secondary" className="w-full h-11 text-xs font-bold border-border bg-surface-muted hover:bg-border/30 text-text-primary rounded-xl" onClick={onReset}>
              {t('calculator.resetButton', 'Reset')}
            </Button>
          </div>
        </div>
      ) : (
        /* Empty Preview / Form Checklist Onboarding */
        <div className="flex flex-col items-center justify-center text-center py-4 min-h-[300px]">
          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 text-brand-primary shadow-sm shadow-orange-500/15">
            <Calculator className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[15px] text-text-primary mb-1">
            {t('calculator.resultPlaceholderTitle', 'Hasil Perhitungan')}
          </h3>
          <p className="text-text-secondary text-xs leading-relaxed max-w-xs mb-4.5 font-medium">
            {t('calculator.resultPlaceholderBody', 'Lengkapi langkah pengisian di sebelah kiri untuk melihat estimasi modal.')}
          </p>

          {/* Dynamic checklist */}
          <div className="w-full bg-surface-cream border border-border-soft p-4 rounded-2xl text-left space-y-3 mb-5">
            <h4 className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mb-2">Checklist Pengisian:</h4>
            
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                hasName 
                  ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-600' 
                  : 'bg-surface border-border text-text-soft'
              }`}>
                {hasName ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Circle className="w-2.5 h-2.5 fill-current opacity-20" />}
              </div>
              <span className={hasName ? 'text-text-secondary/70 line-through font-bold' : 'text-text-primary'}>
                Nama produk terisi
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                hasCosts 
                  ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-600' 
                  : 'bg-surface border-border text-text-soft'
              }`}>
                {hasCosts ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Circle className="w-2.5 h-2.5 fill-current opacity-20" />}
              </div>
              <span className={hasCosts ? 'text-text-secondary/70 line-through font-bold' : 'text-text-primary'}>
                Minimal 1 biaya &gt; Rp0
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                hasOutput 
                  ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-600' 
                  : 'bg-surface border-border text-text-soft'
              }`}>
                {hasOutput ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Circle className="w-2.5 h-2.5 fill-current opacity-20" />}
              </div>
              <span className={hasOutput ? 'text-text-secondary/70 line-through font-bold' : 'text-text-primary'}>
                Jumlah hasil diisi
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                hasPrice 
                  ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-600' 
                  : 'bg-surface border-border text-text-soft'
              }`}>
                {hasPrice ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Circle className="w-2.5 h-2.5 fill-current opacity-20" />}
              </div>
              <span className={hasPrice ? 'text-text-secondary/70 line-through font-bold' : 'text-text-primary'}>
                Harga jual target diisi
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                hasUnit 
                  ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-600' 
                  : 'bg-surface border-border text-text-soft'
              }`}>
                {hasUnit ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Circle className="w-2.5 h-2.5 fill-current opacity-20" />}
              </div>
              <span className={hasUnit ? 'text-text-secondary/70 line-through font-bold' : 'text-text-primary'}>
                Satuan jual diisi
              </span>
            </div>
          </div>

          <Button 
            className="w-full h-11 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
            onClick={onCalculate}
            disabled={!hasName || !hasCosts || !hasOutput || !hasPrice || !hasUnit}
          >
            {t('calculator.calculateButton', 'Hitung Sekarang')}
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Button>
        </div>
      )}
    </div>
  );
};
