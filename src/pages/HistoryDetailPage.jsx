import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { PageContainer } from '../components/layout/PageContainer';
import { ResultCard } from '../components/ui/ResultCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { mockCalculations } from '../data/mockCalculations';
import { formatCurrency, formatPercent } from '../lib/calculations';
import { ArrowLeft } from 'lucide-react';

export const HistoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const item = mockCalculations.find(c => c.id === id);

  if (!item) {
    return (
      <PageContainer>
        <div className="text-center p-8">Data tidak ditemukan.</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate('/history')} className="p-2 -ml-2 rounded-full hover:bg-surface-muted text-text-secondary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-text-primary">{item.productName}</h1>
        <Badge variant={item.statusKey} className="ml-auto">{t(`result.status.${item.statusKey}`)}</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <ResultCard 
          label={t('result.hppPerUnit')} 
          value={formatCurrency(item.hppPerUnit, 'id', 'IDR')}
        />
        <ResultCard 
          label={t('result.profitPerUnit')} 
          value={formatCurrency(item.profitPerUnit, 'id', 'IDR')}
          tone={item.profitPerUnit > 0 ? 'good' : item.profitPerUnit < 0 ? 'loss' : 'neutral'}
        />
        <ResultCard 
          label={t('result.margin')} 
          value={formatPercent(item.marginPercent, 'id')}
        />
        <ResultCard 
          label={t('result.markup')} 
          value={formatPercent(item.markupPercent, 'id')}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-3">Rincian Biaya</h2>
          <Card className="p-0 overflow-hidden border-border">
            <div className="divide-y divide-border">
              {item.costItems.map(cost => (
                <div key={cost.id} className="flex justify-between items-center p-4 bg-surface">
                  <div>
                    <div className="font-medium">{cost.name}</div>
                    <div className="text-sm text-text-secondary">{cost.category}</div>
                  </div>
                  <div className="font-medium">
                    {formatCurrency(cost.amount, 'id', 'IDR')}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-surface-muted border-t border-border flex justify-between items-center font-bold">
              <span>{t('result.totalProductionCost')}</span>
              <span>{formatCurrency(item.totalProductionCost, 'id', 'IDR')}</span>
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Hasil Produksi</h2>
          <Card className="p-0 overflow-hidden border-border mb-6">
            <div className="divide-y divide-border">
              <div className="flex justify-between p-4 bg-surface">
                <span className="text-text-secondary">{t('calculator.outputQuantity')}</span>
                <span className="font-medium">{item.outputQuantity} {item.sellingUnit}</span>
              </div>
              <div className="flex justify-between p-4 bg-surface">
                <span className="text-text-secondary">{t('calculator.failedQuantity')}</span>
                <span className="font-medium">{item.failedQuantity} {item.sellingUnit}</span>
              </div>
            </div>
          </Card>

          <h2 className="text-lg font-semibold mb-3">Aksi</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => navigate('/calculator')}>
              Hitung Serupa (Akan Datang)
            </Button>
            <Button variant="destructive" className="flex-1">
              {t('history.delete')} (Akan Datang)
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

