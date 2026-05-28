import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ReportMetricCard } from './ReportMetricCard';
import { InsightCard } from './InsightCard';
import { ReportSectionEmptyState } from './ReportSectionEmptyState';
import { Book, AlertTriangle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../lib/calculations';

export const RecipeReportPanel = ({ items, insights }) => {
  const { t, lang, settings } = useLanguage();
  const currency = settings?.currency || 'IDR';
  const { costRanking, withoutProduct, highHpp } = insights;
  
  if (!items || items.length === 0) {
    return (
      <ReportSectionEmptyState
        title={t('reports.emptyRecipesTitle')}
        description={t('reports.emptyRecipesBody')}
        actionRoute="/recipes"
      />
    );
  }

  return (
    <div className="report-panel-stack">
      <div className="report-metric-grid">
        <ReportMetricCard 
          label={t('reports.recipesCount')} 
          value={items.length} 
          icon={Book}
        />
        <ReportMetricCard 
          label={t('reports.recipesWithoutProduct')} 
          value={withoutProduct.length} 
          icon={AlertCircle}
          tone={withoutProduct.length > 0 ? 'warning' : 'neutral'}
        />
        <ReportMetricCard 
          label={t('reports.highHppRecipes')} 
          value={highHpp.length} 
          icon={AlertTriangle}
          tone={highHpp.length > 0 ? 'warning' : 'neutral'}
        />
      </div>

      <div className="report-insight-grid">
        <div>
          <h3 className="report-section-title">{t('reports.recipeCostRanking')}</h3>
          <div className="report-panel-card">
            <div className="report-ranking-list">
              {costRanking.slice(0, 10).map((recipe, idx) => (
                <div key={recipe.id} className="report-ranking-row">
                  <div className="report-ranking-name-wrap">
                    <div className="report-ranking-index">
                      {idx + 1}
                    </div>
                    <span className="report-ranking-name">{recipe.name}</span>
                  </div>
                  <span className="report-ranking-value">
                    {formatCurrency(recipe.hppPerUnit, lang, currency)}
                  </span>
                </div>
              ))}
              {costRanking.length === 0 && (
                <div className="report-muted-message">{t('reports.noData')}</div>
              )}
            </div>
          </div>
        </div>

        {withoutProduct.length > 0 && (
          <div>
            <h3 className="report-section-title">{t('reports.recipesWithoutProduct')}</h3>
            <div className="report-recommendation-list">
              {withoutProduct.slice(0, 5).map(recipe => (
                <InsightCard 
                  key={recipe.id}
                  title="Peluang Produk Baru"
                  value={recipe.name}
                  description={`HPP: ${formatCurrency(recipe.hppPerUnit, lang, currency)}. Buat produk dari resep ini untuk memantau harga jual.`}
                  tone="warning"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
