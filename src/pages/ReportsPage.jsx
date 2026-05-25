import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useReports } from '../hooks/useReports';
import { useAppData } from '../hooks/useAppData';
import { AppHeader } from '../components/layout/AppHeader';

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
  const { t } = useLanguage();
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
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title={t('reports.title')} onBack={() => navigate('/')} />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-sm text-text-secondary">{t('reports.subtitle')}</h2>
          <div className="text-xs text-text-tertiary mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-status-good animate-pulse"></span>
            {t('reports.localOnlyNote')}
          </div>
        </div>

        {hasAnyData && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <ReportPeriodFilter period={period} onChange={setPeriod} />
            <ExportCsvButton onExport={exportCsv} disabled={summary.totalItems === 0} />
          </div>
        )}

        {hasAnyData && (
          <ReportTabs activeTab={activeTab} onChange={setActiveTab} />
        )}

        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
