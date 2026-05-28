import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useReports } from '../hooks/useReports';
import { useAppData } from '../hooks/useAppData';
import { formatPercent } from '../lib/calculations';
import { AlertTriangle, BarChart3, Database, ShieldCheck } from 'lucide-react';

import { ReportTabs } from '../components/reports/ReportTabs';
import { ReportPeriodFilter } from '../components/reports/ReportPeriodFilter';
import { ExportCsvButton } from '../components/reports/ExportCsvButton';
import { ReportEmptyState } from '../components/reports/ReportEmptyState';

import { OverviewReportPanel } from '../components/reports/OverviewReportPanel';
import { ProductReportPanel } from '../components/reports/ProductReportPanel';
import { RecipeReportPanel } from '../components/reports/RecipeReportPanel';
import { ChannelReportPanel } from '../components/reports/ChannelReportPanel';
import { SimulationReportPanel } from '../components/reports/SimulationReportPanel';

export const ReportsPage = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const appData = useAppData();
  
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    period, 
    setPeriod, 
    summary, 
    recommendations,
    productInsights,
    recipeInsights,
    channelInsights,
    simulationInsights,
    items,
    profitabilityItems,
    hasAnyData,
    exportCsv
  } = useReports();

  const handleLoadDemo = () => {
    appData.loadDemoData();
    window.location.reload();
  };

  const activePanelId = `report-panel-${activeTab}`;
  const attentionCount = (summary.lowCount || 0) + (summary.lossCount || 0);

  const renderContent = () => {
    if (!hasAnyData) {
      return (
        <div className="pt-8">
          <ReportEmptyState onLoadDemo={handleLoadDemo} />
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewReportPanel summary={summary} recommendations={recommendations} />;
      case 'products':
        return <ProductReportPanel items={profitabilityItems} insights={productInsights} />;
      case 'recipes':
        return <RecipeReportPanel items={items.recipes} insights={recipeInsights} />;
      case 'channels':
        return <ChannelReportPanel items={items.channelSimulations} insights={channelInsights} />;
      case 'simulations':
        // Combine pricing and bundle sims for the table
        return <SimulationReportPanel items={[...items.channelSimulations, ...items.bundleSimulations]} insights={simulationInsights} />;
      default:
        return <OverviewReportPanel summary={summary} recommendations={recommendations} />;
    }
  };

  return (
    <div className="reports-page min-h-screen bg-background pb-20">
      
      <main className="reports-main" aria-labelledby="reports-page-title">
        <section className="reports-hero" aria-describedby="reports-page-subtitle">
          <div className="reports-hero-copy">
            <div className="reports-eyebrow">
              <BarChart3 className="w-4 h-4" aria-hidden="true" />
              {t('reports.generatedFromLocalData')}
            </div>
            <h2 id="reports-page-title" className="reports-title">{t('reports.title')}</h2>
            <p id="reports-page-subtitle" className="reports-subtitle">{t('reports.subtitle')}</p>
            <div className="reports-local-note">
              <span className="reports-local-dot" aria-hidden="true" />
              {t('reports.localOnlyNote')}
            </div>
          </div>

          {hasAnyData && (
            <div className="reports-hero-stats" aria-label={t('reports.quickStatsLabel')}>
              <div className="reports-hero-stat">
                <Database className="w-4 h-4" aria-hidden="true" />
                <span>{t('reports.totalItems')}</span>
                <strong>{summary.totalItems}</strong>
              </div>
              <div className="reports-hero-stat">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <span>{t('reports.averageMargin')}</span>
                <strong>{formatPercent(summary.averageMargin, lang)}</strong>
              </div>
              <div className={`reports-hero-stat ${attentionCount > 0 ? 'is-warning' : 'is-good'}`}>
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                <span>{t('reports.needsAttention')}</span>
                <strong>{attentionCount}</strong>
              </div>
            </div>
          )}
        </section>

        {hasAnyData && (
          <div className="reports-toolbar">
            <div>
              <p className="reports-toolbar-label">{t('reports.periodFilterLabel')}</p>
              <ReportPeriodFilter period={period} onChange={setPeriod} />
            </div>
            <ExportCsvButton onExport={exportCsv} disabled={summary.totalItems === 0} />
          </div>
        )}

        {hasAnyData && (
          <ReportTabs activeTab={activeTab} onChange={setActiveTab} />
        )}

        <section
          id={activePanelId}
          role={hasAnyData ? 'tabpanel' : undefined}
          aria-labelledby={hasAnyData ? `report-tab-${activeTab}` : undefined}
          tabIndex={hasAnyData ? 0 : undefined}
          className="reports-content animate-fade-in"
        >
          {renderContent()}
        </section>
      </main>
    </div>
  );
};
