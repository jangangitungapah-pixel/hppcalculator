import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ReportMetricCard } from './ReportMetricCard';
import { InsightCard } from './InsightCard';
import { Book, AlertTriangle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../lib/calculations';

export const RecipeReportPanel = ({ items, insights }) => {
  const { t, lang, settings } = useLanguage();
  const { costRanking, withoutProduct, highHpp } = insights;
  
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-bold text-text-primary mb-3">{t('reports.recipeCostRanking')}</h3>
          <div className="bg-white rounded-xl shadow-sm border border-border p-4">
            <div className="flex flex-col gap-3">
              {costRanking.slice(0, 10).map((recipe, idx) => (
                <div key={recipe.id} className="flex justify-between items-center border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-surface-muted text-text-tertiary flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-medium text-text-secondary">{recipe.name}</span>
                  </div>
                  <span className="text-sm font-bold text-text-primary">
                    {formatCurrency(recipe.hppPerUnit, lang, settings.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {withoutProduct.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-3">{t('reports.recipesWithoutProduct')}</h3>
            <div className="flex flex-col gap-3">
              {withoutProduct.slice(0, 5).map(recipe => (
                <InsightCard 
                  key={recipe.id}
                  title="Peluang Produk Baru"
                  value={recipe.name}
                  description={`HPP: ${formatCurrency(recipe.hppPerUnit, lang, settings.currency)}. Buat produk dari resep ini untuk memantau harga jual.`}
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
