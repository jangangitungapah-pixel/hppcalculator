import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { AnimatedNumber } from '../motion/AnimatedNumber';
import { StaggerContainer } from '../motion/StaggerContainer';
import { FadeIn } from '../motion/FadeIn';
import { Box, TrendingUp, CheckCircle, BarChart3, ChevronRight, AlertTriangle } from 'lucide-react';

export const DashboardMetricGrid = ({ summary }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!summary || !summary.dataCoverage) return null;

  return (
    <StaggerContainer className="dashboard-metric-grid">
      {/* 1. Total Kalkulasi */}
      <FadeIn>
        <div className="dashboard-metric-card">
          <div className="dashboard-metric-header">
            <h4 className="dashboard-metric-title">{t('dashboard.summaryProducts')}</h4>
            <div className="dashboard-metric-icon neutral">
              <Box className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="dashboard-metric-value">
              <AnimatedNumber value={summary.dataCoverage.calculations} />
            </div>
            <div className="dashboard-metric-helper">Total produk aktif</div>
          </div>
        </div>
      </FadeIn>

      {/* 2. Margin Rata-rata */}
      <FadeIn>
        <div className="dashboard-metric-card">
          <div className="dashboard-metric-header">
            <h4 className="dashboard-metric-title">{t('dashboard.summaryAverageMargin')}</h4>
            <div className={`dashboard-metric-icon ${summary.averageMargin >= 25 ? 'good' : 'loss'}`}>
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="dashboard-metric-value">
              <AnimatedNumber value={summary.averageMargin} suffix="%" />
            </div>
            <div className="dashboard-metric-helper">Target minimum HPP: 25%</div>
          </div>
        </div>
      </FadeIn>

      {/* 3. Item Sehat */}
      <FadeIn>
        <div className="dashboard-metric-card">
          <div className="dashboard-metric-header">
            <h4 className="dashboard-metric-title">{t('dashboard.summaryHealthyMenus')}</h4>
            <div className="dashboard-metric-icon good">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="dashboard-metric-value">
              <AnimatedNumber value={summary.healthyCount} />
            </div>
            <div className="dashboard-metric-helper">Margin sehat &gt;= 30%</div>
          </div>
        </div>
      </FadeIn>

      {/* 4. Laporan Shortcut */}
      <FadeIn>
        <div 
          className="dashboard-metric-card cursor-pointer group" 
          onClick={() => navigate('/reports')}
          style={{ cursor: 'pointer' }}
        >
          <div className="dashboard-metric-header">
            <h4 className="dashboard-metric-title">{t('nav.reports')}</h4>
            <div className="dashboard-metric-icon gold">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="dashboard-metric-value flex items-center justify-between text-xl md:text-2xl lg:text-3xl font-extrabold group-hover:text-brand-primary transition-colors">
              <span>Laporan</span>
              <ChevronRight className="w-5 h-5 text-brand-primary transform group-hover:translate-x-1.5 transition-transform" />
            </div>
            <div className="dashboard-metric-helper font-semibold">
              {summary.lossCount > 0 ? (
                <span className="text-status-loss flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {summary.lossCount} Item Rugi
                </span>
              ) : (
                <span>Lihat insight bisnismu</span>
              )}
            </div>
          </div>
        </div>
      </FadeIn>
    </StaggerContainer>
  );
};
