import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAppData } from '../hooks/useAppData';
import { useReports } from '../hooks/useReports';
import { useToast } from '../hooks/useToast';
import { useDataBackup } from '../hooks/useDataBackup';
import { BackupReminderBanner } from '../components/backup/BackupReminderBanner';
import { PageContainer } from '../components/layout/PageContainer';
import { SummaryCard } from '../components/ui/SummaryCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency, formatPercent } from '../lib/calculations';
import { Box, TrendingUp, CheckCircle, Database, Calculator, Store, Users, ShoppingBag, BarChart3, ChevronRight, AlertTriangle } from 'lucide-react';

export const DashboardPage = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { settings, stats, loadDemoData, calculations } = useAppData();
  const { 
    summary: reportSummary,
    recommendations,
    hasAnyData 
  } = useReports();
  const { storageHealth } = useDataBackup();
  const { addToast } = useToast();

  const handleLoadDemo = () => {
    loadDemoData();
    addToast({
      type: 'success',
      title: t('toasts.demoLoadedTitle'),
      message: t('toasts.demoLoadedMessage')
    });
  };

  const summary = reportSummary;

  return (
    <PageContainer>
      {storageHealth?.backupReminder?.shouldShow && (
        <BackupReminderBanner 
          reminder={storageHealth.backupReminder}
          onExport={() => navigate('/data-backup')}
        />
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">{t('dashboard.greeting')}</h1>
        <p className="text-text-secondary">Ringkasan bisnis F&B kamu hari ini.</p>
      </div>

      {hasAnyData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <SummaryCard 
            title={t('dashboard.summaryProducts')} 
            value={summary.dataCoverage.calculations} 
            icon={Box} 
            tone="neutral" 
          />
          <SummaryCard 
            title={t('dashboard.summaryAverageMargin')} 
            value={formatPercent(summary.averageMargin, lang)} 
            icon={TrendingUp} 
            tone={summary.averageMargin >= 25 ? 'good' : 'loss'} 
          />
          <SummaryCard 
            title={t('dashboard.summaryHealthyMenus')} 
            value={summary.healthyCount} 
            icon={CheckCircle} 
            tone="good" 
          />
          <Card 
            className="p-4 flex flex-col justify-between cursor-pointer hover:border-brand-primary transition-colors bg-brand-soft/30 border-brand-primary/20"
            onClick={() => navigate('/reports')}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xs font-semibold text-brand-primary">{t('nav.reports')}</h3>
              <BarChart3 className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <div className="text-xl font-bold mb-1 text-text-primary flex items-center justify-between">
                Buka Laporan
                <ChevronRight className="w-5 h-5 text-brand-primary" />
              </div>
              <div className="text-[10px] text-text-secondary">
                {summary.lossCount > 0 ? (
                  <span className="text-status-loss flex items-center gap-1 font-medium"><AlertTriangle className="w-3 h-3"/> {summary.lossCount} Item Rugi</span>
                ) : (
                  <span>Lihat insight bisnismu</span>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {!hasAnyData ? (
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
                    Harga: {formatCurrency(item.result.sellingPrice, lang, settings.currency)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={item.result.profitStatus.key}>{t(`result.status.${item.result.profitStatus.key}`)}</Badge>
                  <div className="text-sm font-semibold">{formatPercent(item.result.marginPercent, lang)}</div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 mb-4">
            <h2 className="text-lg font-bold text-text-primary">Simulasi & Penjualan</h2>
            <p className="text-sm text-text-secondary">Simulasi harga untuk berbagai channel penjualan</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <Card 
              className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-primary transition-colors bg-white group"
              onClick={() => navigate('/channel-pricing')}
            >
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-sm text-text-primary">Simulasi Harga</h3>
            </Card>
            
            <Card 
              className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-primary transition-colors bg-white group"
              onClick={() => navigate('/pricing-simulations')}
            >
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-sm text-text-primary">Riwayat Simulasi</h3>
            </Card>
            
            <Card 
              className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-primary transition-colors bg-white group"
              onClick={() => navigate('/channel-profiles')}
            >
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
                <Store className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-sm text-text-primary">Profil Channel</h3>
            </Card>

            <Card 
              className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-primary transition-colors bg-white group"
              onClick={() => navigate('/ingredients')}
            >
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-100 transition-colors">
                <Box className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-sm text-text-primary">Bahan Baku</h3>
            </Card>
            <Card 
              className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-primary transition-colors bg-white group"
              onClick={() => navigate('/reports')}
            >
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-sm text-text-primary">Laporan & Insight</h3>
            </Card>
          </div>

          {/* Top Recommendations Preview */}
          {recommendations && recommendations.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-text-primary">Rekomendasi Bisnis</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate('/reports')}>
                  {t('dashboard.viewAll')}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.slice(0, 2).map(rec => (
                  <Card key={rec.id} className="p-4 border-l-4 border-l-status-warning bg-white">
                    <h4 className="font-bold text-sm mb-1">{rec.titleId || rec.titleEn}</h4>
                    <p className="text-xs text-text-secondary">{rec.messageId || rec.messageEn}</p>
                    <button 
                      className="text-xs text-brand-primary font-semibold mt-2 flex items-center"
                      onClick={() => rec.actionRoute ? navigate(rec.actionRoute) : navigate('/reports')}
                    >
                      {rec.actionLabelId || 'Lihat'} <ChevronRight className="w-3 h-3 ml-1" />
                    </button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-8 p-4 bg-status-lowBg border border-status-low/20 rounded-lg text-status-low text-sm font-medium">
        {t('dashboard.beginnerTip')}
      </div>
    </PageContainer>
  );
};

