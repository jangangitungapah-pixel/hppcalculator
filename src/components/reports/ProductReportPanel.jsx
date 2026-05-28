import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ReportMetricCard } from './ReportMetricCard';
import { MarginBarList } from './MarginBarList';
import { ProfitabilityTable } from './ProfitabilityTable';
import { ReportSectionEmptyState } from './ReportSectionEmptyState';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';

export const ProductReportPanel = ({ items, insights }) => {
  const { t } = useLanguage();
  const { bestProducts, worstProducts, resellerCandidates, marketplaceCandidates, needsReview } = insights;
  
  if (!items || items.length === 0) {
    return (
      <ReportSectionEmptyState
        title={t('reports.emptyProductsTitle')}
        description={t('reports.emptyProductsBody')}
        actionRoute="/products"
      />
    );
  }

  return (
    <div className="report-panel-stack">
      {/* Product Summary Row */}
      <div className="report-metric-grid">
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

      <div className="report-insight-grid">
        {/* Best Products */}
        <div>
          <h3 className="report-section-title">{t('reports.bestMargin')}</h3>
          <div className="report-panel-card">
            <MarginBarList items={bestProducts} />
            {bestProducts.length === 0 && (
              <div className="report-muted-message">{t('reports.noData')}</div>
            )}
          </div>
        </div>
        
        {/* Worst Products */}
        <div>
          <h3 className="report-section-title">{t('reports.worstMargin')}</h3>
          <div className="report-panel-card">
            <MarginBarList items={worstProducts} />
            {worstProducts.length === 0 && (
              <div className="report-muted-message">{t('reports.noData')}</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profitability Table */}
      <div>
        <h3 className="report-section-title">{t('reports.profitabilityTable')}</h3>
        <div className="report-panel-card report-table-card">
           <ProfitabilityTable items={items} />
        </div>
      </div>
    </div>
  );
};
