import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ReportMetricCard } from './ReportMetricCard';
import { RecommendationCard } from './RecommendationCard';
import { SimpleBarChart } from './SimpleBarChart';
import { formatPercent } from '../../lib/calculations';
import { Database, AlertTriangle, CheckCircle, Percent } from 'lucide-react';

export const OverviewReportPanel = ({ summary, recommendations }) => {
  const { t, lang } = useLanguage();
  
  const statusData = [
    { label: 'Sehat', value: summary.healthyCount, colorClass: 'bg-status-good' },
    { label: 'Tipis', value: summary.lowCount, colorClass: 'bg-status-warning' },
    { label: 'Rugi', value: summary.lossCount, colorClass: 'bg-status-loss' }
  ].filter(d => d.value > 0);

  return (
    <div className="report-panel-stack">
      {/* Metrics Row */}
      <div className="report-metric-grid">
        <ReportMetricCard 
          label={t('reports.totalItems')} 
          value={summary.totalItems} 
          icon={Database}
        />
        <ReportMetricCard 
          label={t('reports.averageMargin')} 
          value={formatPercent(summary.averageMargin, lang)} 
          icon={Percent}
        />
        <ReportMetricCard 
          label={t('reports.healthyItems')} 
          value={summary.healthyCount} 
          icon={CheckCircle}
          tone="good"
        />
        <ReportMetricCard 
          label={t('reports.lowLossItems')} 
          value={summary.lossCount + summary.lowCount} 
          icon={AlertTriangle}
          tone={summary.lossCount > 0 ? 'danger' : (summary.lowCount > 0 ? 'warning' : 'neutral')}
        />
      </div>

      <div className="report-insight-grid">
        {/* Charts & Distributions */}
        <div>
          <h3 className="report-section-title">{t('reports.statusDistribution')}</h3>
          <div className="report-panel-card report-chart-card">
            {statusData.length > 0 ? (
              <SimpleBarChart data={statusData} height="h-6" ariaLabel={t('reports.statusDistribution')} />
            ) : (
              <div className="report-muted-message">{t('reports.noStatusData')}</div>
            )}
          </div>
        </div>

        {/* Data Coverage */}
        <div>
          <h3 className="report-section-title">{t('reports.dataCoverage')}</h3>
          <div className="report-panel-card report-coverage-card">
            <div className="report-coverage-row">
              <span className="text-text-secondary">{t('reports.calculations')}:</span>
              <span className="font-bold">{summary.dataCoverage.calculations}</span>
            </div>
            <div className="report-coverage-row">
              <span className="text-text-secondary">{t('reports.productsCount')}:</span>
              <span className="font-bold">{summary.dataCoverage.products}</span>
            </div>
            <div className="report-coverage-row">
              <span className="text-text-secondary">{t('reports.recipesCount')}:</span>
              <span className="font-bold">{summary.dataCoverage.recipes}</span>
            </div>
            <div className="report-coverage-row">
              <span className="text-text-secondary">{t('reports.simulationsCount')}:</span>
              <span className="font-bold">{summary.dataCoverage.channelSimulations + summary.dataCoverage.bundleSimulations}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="report-section-title">{t('reports.recommendations')}</h3>
        {recommendations && recommendations.length > 0 ? (
          <div className="report-recommendation-list">
            {recommendations.slice(0, 10).map(rec => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        ) : (
          <div className="report-panel-card report-muted-message">
            <p className="text-text-secondary">{t('reports.noRecommendations')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
