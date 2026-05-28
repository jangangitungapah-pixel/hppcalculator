import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ProfitabilityTable } from './ProfitabilityTable';
import { ReportSectionEmptyState } from './ReportSectionEmptyState';

export const SimulationReportPanel = ({ items, insights }) => {
  const { t } = useLanguage();
  
  if (!items || items.length === 0) {
    return (
      <ReportSectionEmptyState
        title={t('reports.emptySimulationsTitle')}
        description={t('reports.emptySimulationsBody')}
        actionRoute="/channel-pricing"
      />
    );
  }

  return (
    <div className="report-panel-stack">
      <div>
        <h3 className="report-section-title">{t('reports.recentSimulations')}</h3>
        <div className="report-panel-card report-table-card">
           <ProfitabilityTable items={items} />
        </div>
      </div>
    </div>
  );
};
