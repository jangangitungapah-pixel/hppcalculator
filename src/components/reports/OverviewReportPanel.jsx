import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ReportMetricCard } from './ReportMetricCard';
import { InsightCard } from './InsightCard';
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
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Charts & Distributions */}
        <div>
          <h3 className="text-sm font-bold text-text-primary mb-3">{t('reports.statusDistribution')}</h3>
          <div className="bg-white rounded-xl shadow-sm border border-border p-5 h-48 flex flex-col justify-center">
            {statusData.length > 0 ? (
              <SimpleBarChart data={statusData} height="h-6" />
            ) : (
              <div className="text-center text-text-tertiary text-sm">Belum ada data status margin</div>
            )}
          </div>
        </div>

        {/* Data Coverage */}
        <div>
          <h3 className="text-sm font-bold text-text-primary mb-3">{t('reports.dataCoverage')}</h3>
          <div className="bg-white rounded-xl shadow-sm border border-border p-5 h-48 flex flex-col justify-center gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">{t('reports.calculations')}:</span>
              <span className="font-bold">{summary.dataCoverage.calculations}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">{t('reports.productsCount')}:</span>
              <span className="font-bold">{summary.dataCoverage.products}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">{t('reports.recipesCount')}:</span>
              <span className="font-bold">{summary.dataCoverage.recipes}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">{t('reports.simulationsCount')}:</span>
              <span className="font-bold">{summary.dataCoverage.channelSimulations + summary.dataCoverage.bundleSimulations}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-sm font-bold text-text-primary mb-3">{t('reports.recommendations')}</h3>
        {recommendations && recommendations.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {recommendations.slice(0, 10).map(rec => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        ) : (
          <div className="bg-surface-muted border border-border rounded-xl p-6 text-center">
            <p className="text-text-secondary">{t('reports.noRecommendations')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
