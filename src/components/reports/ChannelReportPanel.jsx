import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ReportMetricCard } from './ReportMetricCard';
import { InsightCard } from './InsightCard';
import { formatCurrency, formatPercent } from '../../lib/calculations';
import { Store, TrendingDown, TrendingUp, AlertOctagon } from 'lucide-react';

export const ChannelReportPanel = ({ items, insights }) => {
  const { t, lang, settings } = useLanguage();
  const { highestFeeChannels, mostProfitableChannels, lossMakingSimulations } = insights;
  
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-bold text-text-primary mb-3">{t('reports.highestFeeChannel')}</h3>
          <div className="flex flex-col gap-3">
            {highestFeeChannels.slice(0, 3).map(sim => (
              <InsightCard 
                key={sim.id}
                title={sim.channelType}
                value={sim.name}
                description={`Margin: ${formatPercent(sim.marginPercent, lang)} | Laba: ${formatCurrency(sim.profitPerUnit, lang, settings.currency)}`}
                tone={sim.marginPercent < 15 ? 'warning' : 'neutral'}
              />
            ))}
            {highestFeeChannels.length === 0 && (
              <div className="text-sm text-text-tertiary">Belum ada simulasi channel berbayar</div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-bold text-text-primary mb-3">{t('reports.safestChannel')}</h3>
          <div className="flex flex-col gap-3">
            {mostProfitableChannels.slice(0, 3).map(sim => (
              <InsightCard 
                key={sim.id}
                title={sim.channelType}
                value={sim.name}
                description={`Margin: ${formatPercent(sim.marginPercent, lang)} | Laba: ${formatCurrency(sim.profitPerUnit, lang, settings.currency)}`}
                tone="good"
              />
            ))}
            {mostProfitableChannels.length === 0 && (
              <div className="text-sm text-text-tertiary">Belum ada simulasi berprofit</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
