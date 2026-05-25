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
import { AnimatedNumber } from '../components/motion/AnimatedNumber';
import { StaggerContainer } from '../components/motion/StaggerContainer';
import { FadeIn } from '../components/motion/FadeIn';

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

      <div className="page-header mb-8">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mb-2">
          {t('dashboard.greeting')}
        </h1>
        <p className="text-text-secondary text-lg">
          Ringkasan bisnis F&B kamu hari ini.
        </p>
      </div>

      {hasAnyData && (
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <FadeIn>
            <SummaryCard 
              title={t('dashboard.summaryProducts')} 
              value={<AnimatedNumber value={summary.dataCoverage.calculations} />} 
              icon={Box} 
              tone="neutral" 
            />
          </FadeIn>
          <FadeIn>
            <SummaryCard 
              title={t('dashboard.summaryAverageMargin')} 
              value={<AnimatedNumber value={summary.averageMargin} suffix="%" />} 
              icon={TrendingUp} 
              tone={summary.averageMargin >= 25 ? 'good' : 'loss'} 
            />
          </FadeIn>
          <FadeIn>
            <SummaryCard 
              title={t('dashboard.summaryHealthyMenus')} 
              value={<AnimatedNumber value={summary.healthyCount} />} 
              icon={CheckCircle} 
              tone="good" 
            />
          </FadeIn>
          <FadeIn>
            <Card 
              variant="clickable"
              className="p-5 h-full flex flex-col justify-between bg-gradient-to-br from-brand-soft/50 to-surface border-brand-primary/20"
              onClick={() => navigate('/reports')}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xs font-bold tracking-wider uppercase text-brand-primary/80">{t('nav.reports')}</h3>
                <BarChart3 className="w-5 h-5 text-brand-primary opacity-80" />
              </div>
              <div>
                <div className="text-lg font-bold mb-1 text-text-primary flex items-center justify-between">
                  Buka Laporan
                  <ChevronRight className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="text-xs text-text-secondary font-medium">
                  {summary.lossCount > 0 ? (
                    <span className="text-status-loss flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5"/> {summary.lossCount} Item Rugi</span>
                  ) : (
                    <span>Lihat insight bisnismu</span>
                  )}
                </div>
              </div>
            </Card>
          </FadeIn>
        </StaggerContainer>
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
          <Card className="p-6 md:p-8 mb-10 bg-gradient-to-r from-brand-primary to-accent-coral text-white border-none shadow-floating relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
              <Calculator className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Punya produk baru?</h2>
                <p className="text-white/90 text-sm md:text-base max-w-md leading-relaxed">Hitung HPP dan temukan harga jual yang tepat agar bisnismu tetap untung.</p>
              </div>
              <Button 
                variant="secondary"
                size="lg"
                className="bg-white text-brand-primary border-none hover:bg-surface-muted shadow-sm whitespace-nowrap w-full sm:w-auto"
                onClick={() => navigate('/calculator')}
              >
                {t('dashboard.mainCta')}
              </Button>
            </div>
          </Card>

          <div className="mb-5 flex justify-between items-end">
            <div>
              <h2 className="text-xl font-bold text-text-primary tracking-tight">{t('dashboard.recentCalculations')}</h2>
              <p className="text-sm text-text-secondary mt-1">Perhitungan terakhir yang kamu simpan</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/history')} className="hidden sm:inline-flex">
              {t('dashboard.viewAll')}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {stats.recentCalculations.slice(0, 3).map((item) => (
              <Card 
                key={item.id} 
                variant="clickable"
                className="p-5 flex flex-col justify-between" 
                onClick={() => navigate(`/history/${item.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="font-bold text-text-primary truncate pr-2 text-lg">{item.productName}</div>
                  <Badge variant={item.result.profitStatus.key} className="shrink-0">
                    {t(`result.status.${item.result.profitStatus.key}`)}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-end mt-auto pt-4 border-t border-border/50">
                  <div>
                    <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">Harga Jual</div>
                    <div className="font-semibold text-text-primary">
                      {formatCurrency(item.result.sellingPrice, lang, settings.currency)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">Margin</div>
                    <div className="font-bold text-brand-primary">
                      {formatPercent(item.result.marginPercent, lang)}
                    </div>
                  </div>
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

