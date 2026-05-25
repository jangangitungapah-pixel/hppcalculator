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

export const HistoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { calculations, deleteCalculation } = useAppData();
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
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate('/history')} className="p-2 -ml-2 rounded-full hover:bg-surface-muted text-text-secondary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-text-primary">{savedCalculation.productName}</h1>
        <Badge variant={result.profitStatus.key} className="ml-auto">{t(`result.status.${result.profitStatus.key}`)}</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <ResultCard 
          label={t('result.hppPerUnit')} 
          value={formatCurrency(result.hppPerUnit, 'IDR', 'id-ID')}
        />
        <ResultCard 
          label={t('result.profitPerUnit')} 
          value={formatCurrency(result.profitPerUnit, 'IDR', 'id-ID')}
          tone={result.profitPerUnit > 0 ? 'good' : result.profitPerUnit < 0 ? 'loss' : 'neutral'}
        />
        <ResultCard 
          label={t('result.margin')} 
          value={formatPercent(result.marginPercent, 'id-ID')}
        />
        <ResultCard 
          label={t('result.markup')} 
          value={formatPercent(result.markupPercent, 'id-ID')}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-3">Rincian Biaya</h2>
          <Card className="p-0 overflow-hidden border-border">
            <div className="divide-y divide-border">
              {input.costItems.map(cost => (
                <div key={cost.id} className="flex justify-between items-center p-4 bg-surface">
                  <div>
                    <div className="font-medium">{cost.name}</div>
                    <div className="text-sm text-text-secondary">{cost.category}</div>
                  </div>
                  <div className="font-medium">
                    {formatCurrency(cost.amount, 'IDR', 'id-ID')}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-surface-muted border-t border-border flex justify-between items-center font-bold">
              <span>{t('result.totalProductionCost')}</span>
              <span>{formatCurrency(result.totalProductionCost, 'IDR', 'id-ID')}</span>
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Hasil Produksi</h2>
          <Card className="p-0 overflow-hidden border-border mb-6">
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

          <h2 className="text-lg font-semibold mb-3">Aksi</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" className="flex-1" onClick={handleUseAgain}>
              {t('history.useAgain')}
            </Button>
            <Button variant="destructive" className="flex-1" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </div>

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
