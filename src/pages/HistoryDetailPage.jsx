import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAppData } from '../hooks/useAppData';
import { useToast } from '../hooks/useToast';
import { PageContainer } from '../components/layout/PageContainer';
import { ResultCard } from '../components/ui/ResultCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { formatCurrency, formatPercent } from '../lib/calculations';
import { ArrowLeft, History as HistoryIcon, Trash2 } from 'lucide-react';
import { StaggerContainer } from '../components/motion/StaggerContainer';
import { FadeIn } from '../components/motion/FadeIn';
import { AnimatedNumber } from '../components/motion/AnimatedNumber';

export const HistoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { settings, calculations, deleteCalculation } = useAppData();
  const { addToast } = useToast();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const savedCalculation = calculations.find(c => c.id === id);

  if (!savedCalculation) {
    return (
      <PageContainer className="flex items-center justify-center min-h-[50vh]">
        <EmptyState 
          icon={<HistoryIcon className="w-8 h-8" />}
          title={t('history.notFoundTitle')}
          description={t('history.notFoundBody')}
          action={
            <Button onClick={() => navigate('/history')}>
              {t('common.back')}
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const { input, result } = savedCalculation;

  const handleDelete = () => {
    deleteCalculation(id);
    addToast({
      type: 'success',
      title: t('toasts.calculationDeletedTitle'),
      message: t('toasts.calculationDeletedMessage')
    });
    navigate('/history');
  };

  const handleUseAgain = () => {
    // Pass the input back to calculator page via state
    navigate('/calculator', { state: { useAgainForm: input } });
  };

  return (
    <PageContainer>
      <StaggerContainer>
        <FadeIn>
          <div className="mb-6 flex items-center gap-3">
            <button onClick={() => navigate('/history')} className="p-2 -ml-2 rounded-full hover:bg-surface-muted text-text-secondary transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">{savedCalculation.productName}</h1>
            <Badge variant={result.profitStatus.key} className="ml-auto">{t(`result.status.${result.profitStatus.key}`)}</Badge>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <ResultCard 
              label={t('result.hppPerUnit')} 
              value={<AnimatedNumber value={result.hppPerUnit} isCurrency={true} />}
            />
            <ResultCard 
              label={t('result.profitPerUnit')} 
              value={<AnimatedNumber value={result.profitPerUnit} isCurrency={true} />}
              tone={result.profitPerUnit > 0 ? 'good' : result.profitPerUnit < 0 ? 'loss' : 'neutral'}
            />
            <ResultCard 
              label={t('result.margin')} 
              value={<AnimatedNumber value={result.marginPercent} suffix="%" />}
            />
            <ResultCard 
              label={t('result.markup')} 
              value={<AnimatedNumber value={result.markupPercent} suffix="%" />}
            />
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-8">
          <FadeIn>
            <div>
              <h2 className="text-lg font-semibold mb-3 tracking-tight">Rincian Biaya</h2>
              <Card className="p-0 overflow-hidden border-border shadow-sm">
                <div className="divide-y divide-border">
                  {input.costItems.map(cost => (
                    <div key={cost.id} className="flex justify-between items-center p-4 bg-surface">
                      <div>
                        <div className="font-medium">{cost.name}</div>
                        <div className="text-sm text-text-secondary">{cost.category}</div>
                      </div>
                      <div className="font-medium">
                        {formatCurrency(cost.amount, lang, settings.currency)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-surface-muted border-t border-border flex justify-between items-center font-bold">
                  <span>{t('result.totalProductionCost')}</span>
                  <AnimatedNumber value={result.totalProductionCost} isCurrency={true} />
                </div>
              </Card>
            </div>
          </FadeIn>

          <StaggerContainer>
            <FadeIn>
              <h2 className="text-lg font-semibold mb-3 tracking-tight">Hasil Produksi</h2>
              <Card className="p-0 overflow-hidden border-border mb-6 shadow-sm">
                <div className="divide-y divide-border">
                  <div className="flex justify-between p-4 bg-surface">
                    <span className="text-text-secondary">{t('calculator.outputQuantity')}</span>
                    <span className="font-medium">{input.outputQuantity} {input.sellingUnit}</span>
                  </div>
                  <div className="flex justify-between p-4 bg-surface">
                    <span className="text-text-secondary">{t('calculator.failedQuantity')}</span>
                    <span className="font-medium">{input.failedQuantity} {input.sellingUnit}</span>
                  </div>
                </div>
              </Card>
            </FadeIn>

            <FadeIn>
              <h2 className="text-lg font-semibold mb-3 tracking-tight">{t('result.suggestedPrices')}</h2>
              <Card className="p-0 overflow-hidden border-border mb-6 shadow-sm">
                <div className="divide-y divide-border">
                  <div className="flex justify-between p-4 bg-surface-muted transition-colors hover:bg-brand-soft/20">
                    <span className="text-text-secondary">{t('result.safePrice')} (15%)</span>
                    <AnimatedNumber value={result.suggestedPrices?.safe?.price || 0} isCurrency={true} className="font-bold" />
                  </div>
                  <div className="flex justify-between p-4 bg-status-okayBg text-status-okay transition-colors hover:bg-status-okayBg/80">
                    <span className="font-medium">{t('result.idealPrice')} (30%)</span>
                    <AnimatedNumber value={result.suggestedPrices?.ideal?.price || 0} isCurrency={true} className="font-bold" />
                  </div>
                  <div className="flex justify-between p-4 bg-status-goodBg text-status-good transition-colors hover:bg-status-goodBg/80">
                    <span className="font-medium">{t('result.premiumPrice')} (50%)</span>
                    <AnimatedNumber value={result.suggestedPrices?.premium?.price || 0} isCurrency={true} className="font-bold" />
                  </div>
                </div>
              </Card>
            </FadeIn>

            <FadeIn>
              <h2 className="text-lg font-semibold mb-3 tracking-tight">Aksi</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="secondary" className="flex-1 border-border hover:border-brand-primary/50" onClick={handleUseAgain}>
                  {t('history.useAgain')}
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('common.delete')}
                </Button>
              </div>
            </FadeIn>
          </StaggerContainer>
        </div>
      </StaggerContainer>

      <ConfirmDialog 
        open={showDeleteConfirm}
        title={t('history.deleteConfirmTitle')}
        description={t('history.deleteConfirmBody')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </PageContainer>
  );
};

