import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAppData } from '../hooks/useAppData';
import { useToast } from '../hooks/useToast';
import { PageContainer } from '../components/layout/PageContainer';
import { ResultCard } from '../components/ui/ResultCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency } from '../lib/calculations';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { StaggerContainer } from '../components/motion/StaggerContainer';
import { FadeIn } from '../components/motion/FadeIn';
import { AnimatedNumber } from '../components/motion/AnimatedNumber';

export const ResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { settings, saveCalculation } = useAppData();
  const { addToast } = useToast();

  if (!state || (!state.input && !state.result)) {
    return (
      <PageContainer className="flex items-center justify-center min-h-[50vh]">
        <EmptyState 
          title="Tidak Ada Data"
          description="Lakukan perhitungan terlebih dahulu."
          action={
            <Button onClick={() => navigate('/calculator')}>
              {t('common.back')}
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const result = state.result || state;
  const input = state.input || null;
  const isLoss = result.profitStatus.key === 'loss';

  const handleSave = () => {
    if (!input) {
      addToast({ type: 'error', title: t('toasts.errorTitle'), message: "Input data missing." });
      return;
    }
    const saved = saveCalculation(input, result);
    addToast({
      type: 'success',
      title: t('toasts.calculationSavedTitle'),
      message: t('toasts.calculationSavedMessage')
    });
    navigate('/history/' + saved.id);
  };

  return (
    <PageContainer>
      <div className="page-header flex items-center gap-3 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="-ml-2" 
          onClick={() => navigate(-1)}
          aria-label={t('common.back', 'Kembali')}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h2 className="page-title text-xl">{t('result.resultTitle', 'Hasil HPP')}</h2>
      </div>

      <StaggerContainer className="content-stack pb-28">
        
        {/* Premium Hero Card */}
        <FadeIn>
          <div className="flex flex-col items-center text-center">
            <div className={`calculator-result-hero ${result.profitStatus.key} w-full p-8 shadow-floating`}>
              <Badge variant={result.profitStatus.key} className="mb-4 bg-white/20 text-white border-transparent">
                {t(`result.status.${result.profitStatus.key}`, result.profitStatus.key.toUpperCase())}
              </Badge>
              <div className="text-xs font-bold opacity-90 text-white/95 uppercase tracking-wider mb-1">
                {t('result.hppPerUnit', 'HPP per Produk')}
              </div>
              <AnimatedNumber 
                value={result.hppPerUnit} 
                isCurrency={true}
                className="calculator-result-number text-white drop-shadow-md"
              />
            </div>
          </div>
        </FadeIn>

        {/* Human Readable Summary */}
        <FadeIn>
          <Card className={`p-4.5 border-l-4 ${isLoss ? 'border-l-status-loss bg-status-lossBg' : 'border-l-brand-primary bg-surface'}`}>
            <p className="text-sm leading-relaxed text-text-primary font-medium">
              {isLoss 
                ? t('result.summaryLoss') 
                : result.profitStatus.key === 'low' 
                  ? t('result.summaryLow') 
                  : t('result.summaryGood')}
            </p>
          </Card>
        </FadeIn>

        {/* Warnings */}
        {result.warnings && result.warnings.length > 0 && (
          <FadeIn>
            <div className="flex flex-col gap-2">
              {result.warnings.map((warn, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-status-low bg-status-lowBg border border-status-low/20 p-3 rounded-xl">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-semibold">{lang === 'en' ? warn.messageEn || warn.message : warn.messageId || warn.message}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Core Metrics Grid */}
        <FadeIn>
          <div className="grid grid-cols-2 gap-4">
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
            <ResultCard 
              label={t('result.totalProductionCost', 'Total Modal Produksi')}
              value={<AnimatedNumber value={result.totalProductionCost} isCurrency={true} />}
            />
            <ResultCard 
              label={t('result.markup', 'Markup')}
              value={<AnimatedNumber value={result.markupPercent} suffix="%" />}
            />
          </div>
        </FadeIn>

        {/* Cost Breakdown */}
        {input && (
          <FadeIn>
            <Card className="p-0 overflow-hidden border-border bg-surface shadow-sm">
              <h3 className="font-bold text-sm p-5 pb-2 uppercase tracking-wider text-text-secondary">{t('calculator.costItems', 'Biaya Produksi')}</h3>
              <div className="divide-y divide-border px-5 pb-3">
                {input.costItems.map(cost => (
                  <div key={cost.id} className="flex justify-between items-center py-3">
                    <div>
                      <div className="font-bold text-sm text-text-primary">{cost.name}</div>
                      <div className="text-xs text-text-secondary font-medium">{cost.category}</div>
                    </div>
                    <div className="font-semibold text-sm text-text-primary">
                      {formatCurrency(cost.amount, lang, settings.currency)}
                    </div>
                  </div>
                ))}
              </div>
              {input.failedQuantity > 0 && (
                <div className="px-5 py-3 bg-status-lossBg border-t border-status-loss/10 text-sm text-status-loss flex justify-between font-bold">
                  <span>Produk Gagal</span>
                  <span>{input.failedQuantity} {input.sellingUnit}</span>
                </div>
              )}
              <div className="p-5 bg-surface-cream border-t border-border flex justify-between items-center font-extrabold text-sm text-text-primary">
                <span>{t('result.totalProductionCost')}</span>
                <AnimatedNumber value={result.totalProductionCost} isCurrency={true} />
              </div>
            </Card>
          </FadeIn>
        )}

        {/* Suggested Prices */}
        <FadeIn>
          <Card className="p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-text-secondary mb-1">{t('result.suggestedPrices', 'Rekomendasi Harga Jual')}</h3>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed font-medium">
              Harga ini dihitung dari target margin dan dibulatkan ke atas.
            </p>
            <div className="flex flex-col gap-2.5">
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
          </Card>
        </FadeIn>

      </StaggerContainer>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface-glass backdrop-blur-md border-t border-border z-sticky flex gap-3 pb-safe shadow-md max-w-lg mx-auto sm:rounded-t-2xl">
        <Button 
          variant="secondary" 
          className="flex-1" 
          onClick={() => navigate(-1)}
        >
          {t('result.editInput', 'Edit Input')}
        </Button>
        <Button 
          variant="primary"
          className="flex-1" 
          onClick={handleSave} 
          disabled={!input}
        >
          {t('result.saveCalculation', 'Simpan Hasil')}
        </Button>
      </div>
    </PageContainer>
  );
};
