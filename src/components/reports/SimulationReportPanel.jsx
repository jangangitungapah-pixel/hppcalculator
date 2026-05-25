import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ProfitabilityTable } from './ProfitabilityTable';

export const SimulationReportPanel = ({ items, insights }) => {
  const { t } = useLanguage();
  
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-text-primary mb-3">{t('reports.recentSimulations')}</h3>
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden p-0 sm:p-4">
           <ProfitabilityTable items={items} />
        </div>
      </div>
    </div>
  );
};
