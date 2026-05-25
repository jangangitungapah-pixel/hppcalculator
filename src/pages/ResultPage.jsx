import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAppData } from '../hooks/useAppData';
import { useToast } from '../hooks/useToast';
import { PageContainer } from '../components/layout/PageContainer';
import { ResultCard } from '../components/ui/ResultCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency, formatPercent } from '../lib/calculations';
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
    // If accessed directly without calculating
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

  // Handle both Phase 5 route state (result only) and Phase 6 route state (input + result)
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
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-surface-muted text-text-secondary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="page-title text-xl">{t('result.resultTitle')}</h1>
      </div>

      <StaggerContainer className="content-stack pb-24">
        {/* Hero Result */}
        <FadeIn>
          <Card className="p-8 flex flex-col items-center text-center border-transparent shadow-floating bg-gradient-to-br from-brand-soft to-surface relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>
            <div className="relative z-10 w-full flex flex-col items-center">
              <Badge variant={result.profitStatus.key} className="mb-4">
                {t(`result.status.${result.profitStatus.key}`)}
              </Badge>
              
              <div className="mb-8 bg-white/60 px-8 py-4 rounded-3xl backdrop-blur-sm border border-white/50 w-full max-w-sm">
                <div className="text-sm font-bold opacity-80 mb-1 tracking-wider uppercase">{t('result.hppPerUnit')}</div>
                <AnimatedNumber 
                  value={result.hppPerUnit}
                  isCurrency={true}
                  className="text-4xl sm:text-5xl font-extrabold text-brand-primary"
                />
              </div>

              <div className="flex gap-4 sm:gap-8 justify-center w-full">
                <div className="flex-1 bg-white/40 p-4 rounded-2xl border border-white/30 backdrop-blur-sm max-w-[200px]">
                  <div className="text-xs sm:text-sm font-bold opacity-80 mb-1 tracking-wider uppercase">{t('result.profitPerUnit')}</div>
                  <AnimatedNumber 
                    value={result.profitPerUnit}
                    isCurrency={true}
                    className={`text-2xl font-bold ${isLoss ? 'text-status-loss' : 'text-status-good'}`}
                  />
                </div>
                <div className="flex-1 bg-white/40 p-4 rounded-2xl border border-white/30 backdrop-blur-sm max-w-[200px]">
                  <div className="text-xs sm:text-sm font-bold opacity-80 mb-1 tracking-wider uppercase">{t('result.margin')}</div>
                  <AnimatedNumber 
                    value={result.marginPercent}
                    suffix="%"
                    className={`text-2xl font-bold ${isLoss ? 'text-status-loss' : 'text-status-good'}`}
                  />
                </div>
              </div>
            </div>
          </Card>
        </FadeIn>

        {/* Human Readable Summary */}
        <FadeIn>
          <Card className={`p-4 border-l-4 ${isLoss ? 'border-l-status-loss bg-status-lossBg' : 'border-l-brand-primary bg-surface'}`}>
            <p className="text-sm leading-relaxed text-text-primary">
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
                <div key={i} className="flex items-start gap-2 text-sm text-status-low bg-status-lowBg border border-status-low/20 p-3 rounded-xl">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p className="leading-relaxed">{lang === 'en' ? warn.messageEn || warn.message : warn.messageId || warn.message}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Detail Grid */}
        <FadeIn>
          <div className="page-grid grid-cols-2 gap-4">
            <ResultCard 
              label={t('result.totalProductionCost')}
              value={<AnimatedNumber value={result.totalProductionCost} isCurrency={true} />}
            />
            <ResultCard 
              label={t('result.grossRevenue')}
              value={<AnimatedNumber value={result.grossRevenue} isCurrency={true} />}
            />
            <ResultCard 
              label={t('result.totalProfit')}
              value={<AnimatedNumber value={result.totalProfit} isCurrency={true} />}
              tone={result.totalProfit > 0 ? 'good' : result.totalProfit < 0 ? 'loss' : 'neutral'}
            />
            <ResultCard 
              label={t('result.markup')}
              value={<AnimatedNumber value={result.markupPercent} suffix="%" />}
            />
          </div>
        </FadeIn>

        {/* Cost Breakdown */}
        {input && (
          <FadeIn>
            <Card className="p-0 overflow-hidden border-border bg-surface">
              <h3 className="font-bold text-lg p-5 pb-2">{t('calculator.costItems')}</h3>
              <div className="divide-y divide-border px-5 pb-3">
                {input.costItems.map(cost => (
                  <div key={cost.id} className="flex justify-between items-center py-3">
                    <div>
                      <div className="font-medium text-sm">{cost.name}</div>
                      <div className="text-xs text-text-secondary">{cost.category}</div>
                    </div>
                    <div className="font-medium text-sm">
                      {formatCurrency(cost.amount, lang, settings.currency)}
                    </div>
                  </div>
                ))}
              </div>
              {input.failedQuantity > 0 && (
                <div className="px-5 py-3 bg-status-lossBg border-t border-status-loss/10 text-sm text-status-loss flex justify-between">
                  <span>{lang === 'en' ? 'Rejected Output' : 'Produk Gagal'}</span>
                  <span>{input.failedQuantity} {input.sellingUnit}</span>
                </div>
              )}
              <div className="p-5 bg-surface-muted border-t border-border flex justify-between items-center font-bold">
                <span>{t('result.totalProductionCost')}</span>
                <AnimatedNumber value={result.totalProductionCost} isCurrency={true} />
              </div>
            </Card>
          </FadeIn>
        )}

        {/* Suggested Prices */}
        <FadeIn>
          <Card className="p-5">
            <h3 className="font-bold text-lg mb-2">{t('result.suggestedPrices')}</h3>
            <p className="text-sm text-text-secondary mb-4">
              {lang === 'en' ? 'These prices are calculated from target margins and rounded up.' : 'Harga ini dihitung dari target margin dan dibulatkan ke atas.'}
            </p>
            <div className="page-grid sm:grid-cols-3 gap-3">
              <div className="flex flex-col p-4 rounded-xl bg-surface-muted border border-border transition-premium hover:border-brand-soft">
                <span className="font-bold text-text-secondary text-xs tracking-wider uppercase mb-1">{t('result.safePrice')} (15%)</span>
                <AnimatedNumber value={result.suggestedPrices?.safe?.price || 0} isCurrency={true} className="font-bold text-lg" />
              </div>
              <div className="flex flex-col p-4 rounded-xl bg-status-okayBg border border-status-okay/20 text-status-okay transition-premium hover:border-status-okay/40">
                <span className="font-bold text-xs tracking-wider uppercase mb-1">{t('result.idealPrice')} (30%)</span>
                <AnimatedNumber value={result.suggestedPrices?.ideal?.price || 0} isCurrency={true} className="font-bold text-lg" />
              </div>
              <div className="flex flex-col p-4 rounded-xl bg-status-goodBg border border-status-good/20 text-status-good transition-premium hover:border-status-good/40">
                <span className="font-bold text-xs tracking-wider uppercase mb-1">{t('result.premiumPrice')} (50%)</span>
                <AnimatedNumber value={result.suggestedPrices?.premium?.price || 0} isCurrency={true} className="font-bold text-lg" />
              </div>
            </div>
          </Card>
        </FadeIn>

      </StaggerContainer>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface border-t border-border z-sticky flex gap-3 pb-safe">
        <Button variant="secondary" className="flex-1" onClick={() => navigate(-1)}>
          {t('result.editInput')}
        </Button>
        <Button className="flex-1" onClick={handleSave} disabled={!input}>
          {t('result.saveCalculation')}
        </Button>
      </div>
    </PageContainer>
  );
};


