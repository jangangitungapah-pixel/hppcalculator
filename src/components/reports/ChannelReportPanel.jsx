import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ReportMetricCard } from './ReportMetricCard';
import { InsightCard } from './InsightCard';
import { ReportSectionEmptyState } from './ReportSectionEmptyState';
import { formatCurrency, formatPercent } from '../../lib/calculations';
import { Store, AlertOctagon } from 'lucide-react';

export const ChannelReportPanel = ({ items, insights }) => {
  const { t, lang, settings } = useLanguage();
  const currency = settings?.currency || 'IDR';
  const { highestFeeChannels, mostProfitableChannels, lossMakingSimulations } = insights;
  
  if (!items || items.length === 0) {
    return (
      <ReportSectionEmptyState
        title={t('reports.emptyChannelsTitle')}
        description={t('reports.emptyChannelsBody')}
        actionRoute="/channel-pricing"
      />
    );
  }

  return (
    <div className="report-panel-stack">
      <div className="report-metric-grid">
        <ReportMetricCard 
          label={t('reports.simulationsCount')} 
          value={items.length} 
          icon={Store}
        />
        <ReportMetricCard 
          label={t('reports.lossMakingSimulations')} 
          value={lossMakingSimulations.length} 
          icon={AlertOctagon}
          tone={lossMakingSimulations.length > 0 ? 'danger' : 'good'}
        />
      </div>

      <div className="report-insight-grid">
        <div>
          <h3 className="report-section-title">{t('reports.highestFeeChannel')}</h3>
          <div className="report-recommendation-list">
            {highestFeeChannels.slice(0, 3).map(sim => (
              <InsightCard 
                key={sim.id}
                title={sim.channelType}
                value={sim.name}
                description={`Margin: ${formatPercent(sim.marginPercent, lang)} | Laba: ${formatCurrency(sim.profitPerUnit, lang, currency)}`}
                tone={sim.marginPercent < 15 ? 'warning' : 'neutral'}
              />
            ))}
            {highestFeeChannels.length === 0 && (
              <div className="report-panel-card report-muted-message">{t('reports.noPaidChannelData')}</div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="report-section-title">{t('reports.safestChannel')}</h3>
          <div className="report-recommendation-list">
            {mostProfitableChannels.slice(0, 3).map(sim => (
              <InsightCard 
                key={sim.id}
                title={sim.channelType}
                value={sim.name}
                description={`Margin: ${formatPercent(sim.marginPercent, lang)} | Laba: ${formatCurrency(sim.profitPerUnit, lang, currency)}`}
                tone="good"
              />
            ))}
            {mostProfitableChannels.length === 0 && (
              <div className="report-panel-card report-muted-message">{t('reports.noProfitableSimulationData')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
