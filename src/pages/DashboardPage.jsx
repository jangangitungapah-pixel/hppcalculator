import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAppData } from '../hooks/useAppData';
import { useToast } from '../hooks/useToast';
import { PageContainer } from '../components/layout/PageContainer';
import { SummaryCard } from '../components/ui/SummaryCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency, formatPercent } from '../lib/calculations';
import { Box, TrendingUp, CheckCircle, Database } from 'lucide-react';

export const DashboardPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { stats, loadDemoData, calculations } = useAppData();
  const { addToast } = useToast();

  const handleLoadDemo = () => {
    loadDemoData();
    addToast({
      type: 'success',
      title: t('toasts.demoLoadedTitle'),
      message: t('toasts.demoLoadedMessage')
    });
  };

  const isEmpty = calculations.length === 0;

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">{t('dashboard.greeting')}</h1>
        <p className="text-text-secondary">Ringkasan bisnis F&B kamu hari ini.</p>
      </div>

      {!isEmpty && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SummaryCard 
            title={t('dashboard.summaryProducts')} 
            value={stats.totalCalculations} 
            icon={Box} 
            tone="neutral" 
          />
          <SummaryCard 
            title={t('dashboard.summaryAverageMargin')} 
            value={formatPercent(stats.averageMargin, 'id-ID')} 
            icon={TrendingUp} 
            tone={stats.averageMargin >= 25 ? 'good' : 'loss'} 
          />
          <SummaryCard 
            title={t('dashboard.summaryHealthyMenus')} 
            value={stats.healthyCount} 
            icon={CheckCircle} 
            tone="good" 
          />
        </div>
      )}

      {isEmpty ? (
        <EmptyState 
          icon={<Database className="w-8 h-8" />}
          title={t('dashboard.emptyTitle')}
          description={t('dashboard.emptyBody')}
          className="mb-8"
          action={
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => navigate('/calculator')}>
                {t('dashboard.startCalculating')}
              </Button>
              <Button variant="secondary" onClick={handleLoadDemo}>
                {t('dashboard.loadDemoData')}
              </Button>
            </div>
          }
        />
      ) : (
        <>
          <Card className="p-6 mb-8 bg-brand-primary text-white border-transparent">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold mb-1">Punya produk baru?</h2>
                <p className="opacity-90">Hitung HPP dan temukan harga jual yang tepat.</p>
              </div>
              <Button 
                className="bg-white text-brand-primary hover:bg-brand-soft"
                onClick={() => navigate('/calculator')}
              >
                {t('dashboard.mainCta')}
              </Button>
            </div>
          </Card>

          <div className="mb-4 flex justify-between items-end">
            <h2 className="text-lg font-bold text-text-primary">{t('dashboard.recentCalculations')}</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
              {t('dashboard.viewAll')}
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {stats.recentCalculations.map((item) => (
              <Card key={item.id} className="p-4 flex justify-between items-center cursor-pointer hover:border-brand-primary transition-colors" onClick={() => navigate(`/history/${item.id}`)}>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-text-primary">{item.productName}</div>
                    {item.source === 'demo' && (
                      <Badge variant="neutral" className="text-[10px] py-0 px-1.5">{t('common.demo')}</Badge>
                    )}
                  </div>
                  <div className="text-sm text-text-secondary mt-1">
                    Harga: {formatCurrency(item.result.sellingPrice, 'IDR', 'id-ID')}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={item.result.profitStatus.key}>{t(`result.status.${item.result.profitStatus.key}`)}</Badge>
                  <div className="text-sm font-semibold">{formatPercent(item.result.marginPercent, 'id-ID')}</div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <div className="mt-8 p-4 bg-status-lowBg border border-status-low/20 rounded-lg text-status-low text-sm font-medium">
        {t('dashboard.beginnerTip')}
      </div>
    </PageContainer>
  );
};
