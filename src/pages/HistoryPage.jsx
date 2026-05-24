import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { mockCalculations } from '../data/mockCalculations';
import { formatCurrency, formatPercent } from '../lib/calculations';
import { History as HistoryIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const HistoryPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-1">{t('history.title')}</h1>
        <p className="text-text-secondary">{t('history.subtitle')}</p>
      </div>

      {mockCalculations.length > 0 ? (
        <div className="flex flex-col gap-4">
          {mockCalculations.map((item) => (
            <Card key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-text-primary">{item.productName}</h3>
                  <Badge variant={item.statusKey}>{t(`result.status.${item.statusKey}`)}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-text-secondary mt-2 max-w-sm">
                  <span>HPP: {formatCurrency(item.hppPerUnit, 'id', 'IDR')}</span>
                  <span>Jual: {formatCurrency(item.sellingPrice, 'id', 'IDR')}</span>
                  <span>Untung: {formatCurrency(item.profitPerUnit, 'id', 'IDR')}</span>
                  <span>Margin: {formatPercent(item.marginPercent, 'id')}</span>
                </div>
              </div>
              
              <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                <Button 
                  variant="secondary" 
                  className="flex-1 sm:flex-none"
                  onClick={() => navigate(`/history/${item.id}`)}
                >
                  {t('history.viewDetail')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={<HistoryIcon className="w-8 h-8" />}
          title={t('history.emptyTitle')}
          description={t('history.emptyBody')}
          action={
            <Button onClick={() => navigate('/calculator')}>
              {t('welcome.startCalculating')}
            </Button>
          }
        />
      )}
    </PageContainer>
  );
};

