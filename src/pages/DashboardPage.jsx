import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { PageContainer } from '../components/layout/PageContainer';
import { SummaryCard } from '../components/ui/SummaryCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { mockCalculations } from '../data/mockCalculations';
import { formatCurrency, formatPercent } from '../lib/calculations';
import { Box, TrendingUp, CheckCircle } from 'lucide-react';

export const DashboardPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Basic mock aggregations
  const totalMenus = mockCalculations.length;
  const avgMargin = totalMenus > 0 
    ? mockCalculations.reduce((acc, curr) => acc + curr.marginPercent, 0) / totalMenus 
    : 0;
  const healthyMenus = mockCalculations.filter(m => m.marginPercent >= 25).length;
  
  const recentCalculations = mockCalculations.slice(0, 3); // top 3

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">{t('dashboard.greeting')}</h1>
        <p className="text-text-secondary">Ringkasan bisnis F&B kamu hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard 
          title={t('dashboard.summaryProducts')} 
          value={totalMenus} 
          icon={Box} 
          tone="neutral" 
        />
        <SummaryCard 
          title={t('dashboard.summaryAverageMargin')} 
          value={formatPercent(avgMargin, 'id')} 
          icon={TrendingUp} 
          tone={avgMargin >= 25 ? 'good' : 'loss'} 
        />
        <SummaryCard 
          title={t('dashboard.summaryHealthyMenus')} 
          value={healthyMenus} 
          icon={CheckCircle} 
          tone="good" 
        />
      </div>

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
        {recentCalculations.length > 0 ? (
          recentCalculations.map((item) => (
            <Card key={item.id} className="p-4 flex justify-between items-center cursor-pointer hover:border-brand-primary transition-colors" onClick={() => navigate(`/history/${item.id}`)}>
              <div>
                <div className="font-semibold text-text-primary">{item.productName}</div>
                <div className="text-sm text-text-secondary mt-1">
                  Harga: {formatCurrency(item.sellingPrice, 'id', 'IDR')}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={item.statusKey}>{t(`result.status.${item.statusKey}`)}</Badge>
                <div className="text-sm font-semibold">{formatPercent(item.marginPercent, 'id')}</div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center text-text-secondary">
            {t('dashboard.emptyHistory')}
          </Card>
        )}
      </div>

      <div className="mt-8 p-4 bg-status-lowBg border border-status-low/20 rounded-lg text-status-low text-sm font-medium">
        {t('dashboard.beginnerTip')}
      </div>
    </PageContainer>
  );
};

