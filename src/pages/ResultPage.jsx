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

export const ResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { saveCalculation } = useAppData();
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
    // Redirect to detail page (saved will be void if saveCalculation doesn't return, but we modified it to return object)
    // Actually our AppDataContext saveCalculation doesn't return. Let's just go to history.
    navigate('/history');
  };

  return (
    <PageContainer>
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-surface-muted text-text-secondary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-text-primary">{t('result.resultTitle')}</h1>
      </div>

      <div className="flex flex-col gap-6 pb-24">
        {/* Hero Result */}
        <Card className="p-6 flex flex-col items-center text-center border-transparent shadow-card bg-brand-primary-soft">
          <Badge variant={result.profitStatus.key} className="mb-4">
            {t(`result.status.${result.profitStatus.key}`)}
          </Badge>
          
          <div className="mb-6">
            <div className="text-sm font-semibold opacity-80 mb-1">{t('result.hppPerUnit')}</div>
            <div className="text-4xl font-bold text-text-primary">
              {formatCurrency(result.hppPerUnit, 'IDR', 'id-ID')}
            </div>
          </div>

          <div className="flex gap-8 justify-center w-full">
            <div>
              <div className="text-sm font-semibold opacity-80">{t('result.profitPerUnit')}</div>
              <div className={`text-2xl font-bold ${isLoss ? 'text-status-loss' : 'text-status-good'}`}>
                {formatCurrency(result.profitPerUnit, 'IDR', 'id-ID')}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold opacity-80">{t('result.margin')}</div>
              <div className={`text-2xl font-bold ${isLoss ? 'text-status-loss' : 'text-status-good'}`}>
                {formatPercent(result.marginPercent, 'id-ID')}
              </div>
            </div>
          </div>
        </Card>

        {/* Human Readable Summary */}
        <Card className={`p-4 border-l-4 ${isLoss ? 'border-l-status-loss bg-status-lossBg' : 'border-l-brand-primary bg-surface'}`}>
          <p className="text-sm leading-relaxed text-text-primary">
            {isLoss 
              ? t('result.summaryLoss') 
              : result.profitStatus.key === 'low' 
                ? t('result.summaryLow') 
                : t('result.summaryGood')}
          </p>
        </Card>

        {/* Warnings */}
        {result.warnings && result.warnings.length > 0 && (
          <div className="flex flex-col gap-2">
            {result.warnings.map((warn, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-status-low bg-status-lowBg p-3 rounded-md">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p>{lang === 'en' ? warn.messageEn || warn.message : warn.messageId || warn.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Detail Grid */}
        <div className="grid grid-cols-2 gap-4">
          <ResultCard 
            label={t('result.totalProductionCost')}
            value={formatCurrency(result.totalProductionCost, 'IDR', 'id-ID')}
          />
          <ResultCard 
            label={t('result.grossRevenue')}
            value={formatCurrency(result.grossRevenue, 'IDR', 'id-ID')}
          />
          <ResultCard 
            label={t('result.totalProfit')}
            value={formatCurrency(result.totalProfit, 'IDR', 'id-ID')}
            tone={result.totalProfit > 0 ? 'good' : result.totalProfit < 0 ? 'loss' : 'neutral'}
          />
          <ResultCard 
            label={t('result.markup')}
            value={formatPercent(result.markupPercent, 'id-ID')}
          />
        </div>

        {/* Suggested Prices */}
        <Card className="p-5">
          <h3 className="font-bold text-lg mb-4">{t('result.suggestedPrices')}</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center p-3 rounded-md bg-surface-muted">
              <span className="font-medium text-text-secondary">{t('result.safePrice')}</span>
              <span className="font-bold">{formatCurrency(result.suggestedPrices?.safe?.price || 0, 'IDR', 'id-ID')}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-md bg-status-okayBg text-status-okay">
              <span className="font-medium">{t('result.idealPrice')}</span>
              <span className="font-bold">{formatCurrency(result.suggestedPrices?.ideal?.price || 0, 'IDR', 'id-ID')}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-md bg-status-goodBg text-status-good">
              <span className="font-medium">{t('result.premiumPrice')}</span>
              <span className="font-bold">{formatCurrency(result.suggestedPrices?.premium?.price || 0, 'IDR', 'id-ID')}</span>
            </div>
          </div>
        </Card>

      </div>

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
