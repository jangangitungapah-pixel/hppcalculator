import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ReportMetricCard } from './ReportMetricCard';
import { MarginBarList } from './MarginBarList';
import { ProfitabilityTable } from './ProfitabilityTable';
import { SimpleBarChart } from './SimpleBarChart';
import { InsightCard } from './InsightCard';
import { Package, TrendingUp, AlertTriangle, TrendingDown } from 'lucide-react';

export const ProductReportPanel = ({ items, insights }) => {
  const { t } = useLanguage();
  const { bestProducts, worstProducts, promoCandidates, resellerCandidates, marketplaceCandidates, needsReview } = insights;
  
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Product Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ReportMetricCard 
          label={t('reports.productsCount')} 
          value={items.length} 
          icon={Package}
        />
        <ReportMetricCard 
          label={t('reports.priceReviewNeeded')} 
          value={needsReview.length} 
          icon={AlertTriangle}
          tone={needsReview.length > 0 ? 'warning' : 'neutral'}
        />
        <ReportMetricCard 
          label={t('reports.suitableForReseller')} 
          value={resellerCandidates.length} 
          icon={TrendingUp}
          tone="good"
        />
        <ReportMetricCard 
          label={t('reports.suitableForMarketplace')} 
          value={marketplaceCandidates.length} 
          icon={TrendingUp}
          tone="good"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Products */}
        <div>
          <h3 className="text-sm font-bold text-text-primary mb-3">{t('reports.bestMargin')}</h3>
          <div className="bg-white rounded-xl p-4 border border-border shadow-sm">
            <MarginBarList items={bestProducts} />
            {bestProducts.length === 0 && (
              <div className="text-sm text-text-tertiary text-center py-4">Belum ada data</div>
            )}
          </div>
        </div>
        
        {/* Worst Products */}
        <div>
          <h3 className="text-sm font-bold text-text-primary mb-3">{t('reports.worstMargin')}</h3>
          <div className="bg-white rounded-xl p-4 border border-border shadow-sm">
            <MarginBarList items={worstProducts} />
            {worstProducts.length === 0 && (
              <div className="text-sm text-text-tertiary text-center py-4">Belum ada data</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profitability Table */}
      <div>
        <h3 className="text-sm font-bold text-text-primary mb-3">{t('reports.profitabilityTable')}</h3>
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden p-0 sm:p-4">
           <ProfitabilityTable items={items} />
        </div>
      </div>
    </div>
  );
};
