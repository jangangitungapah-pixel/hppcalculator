import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useAppData } from '../../hooks/useAppData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency, formatPercent } from '../../lib/calculations';
import { ChevronRight, Calculator } from 'lucide-react';
import { StaggerContainer } from '../motion/StaggerContainer';
import { FadeIn } from '../motion/FadeIn';

export const DashboardRecentCalculations = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { settings, stats } = useAppData();

  const recent = (stats?.recentCalculations || []).filter(Boolean);
  const itemsToShow = recent.slice(0, 3);

  return (
    <div className="mb-10">
      <div className="dashboard-section-header">
        <div>
          <h2 className="dashboard-section-header-title">{t('dashboard.recentCalculations')}</h2>
          <p className="dashboard-section-header-subtitle">Perhitungan terakhir yang kamu simpan</p>
        </div>
        {recent.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/history')} 
            className="text-brand-primary font-bold hover:bg-brand-soft"
          >
            {t('dashboard.viewAll')} <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {itemsToShow.length === 0 ? (
        <FadeIn>
          <Card className="p-8 text-center border-dashed border-2 border-border flex flex-col items-center justify-center">
            <Calculator className="w-8 h-8 text-text-muted mb-2" />
            <p className="text-sm text-text-secondary mb-4">Belum ada perhitungan yang tersimpan.</p>
            <Button size="sm" onClick={() => navigate('/calculator')}>
              Mulai Hitung HPP
            </Button>
          </Card>
        </FadeIn>
      ) : (
        <StaggerContainer className="dashboard-recent-grid">
          {itemsToShow.map((item) => {
            const statusKey = item.result?.profitStatus?.key || 'okay';
            const dateStr = item.createdAt 
              ? new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Baru saja';

            return (
              <FadeIn key={item.id}>
                <div 
                  className="recent-calc-card group" 
                  onClick={() => navigate(`/history/${item.id}`)}
                >
                  <div className={`recent-calc-accent ${statusKey}`} />
                  <div className="recent-calc-body">
                    <div className="recent-calc-header">
                      <div className="flex-1 min-w-0">
                        <h4 className="recent-calc-title group-hover:text-brand-primary transition-colors">
                          {item.productName}
                        </h4>
                        <span className="recent-calc-meta">{dateStr}</span>
                      </div>
                      <Badge variant={statusKey} className="shrink-0">
                        {t(`result.status.${statusKey}`)}
                      </Badge>
                    </div>

                    <div className="recent-calc-metrics">
                      <div>
                        <div className="recent-calc-metric-label">Harga Jual</div>
                        <div className="recent-calc-metric-value">
                          {formatCurrency(item.result?.sellingPrice || 0, lang, settings?.currency || 'IDR')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="recent-calc-metric-label">Margin</div>
                        <div className="recent-calc-metric-value highlight">
                          {formatPercent(item.result?.marginPercent || 0, lang)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </StaggerContainer>
      )}
    </div>
  );
};
