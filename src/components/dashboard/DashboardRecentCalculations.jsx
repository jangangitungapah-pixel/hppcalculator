import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useAppData } from '../../hooks/useAppData';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency, formatPercent } from '../../lib/calculations';
import { ChevronRight, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';
import { StaggerContainer } from '../motion/StaggerContainer';
import { FadeIn } from '../motion/FadeIn';

const STATUS_DOT = {
  good: 'bg-emerald-500',
  okay: 'bg-blue-400',
  low:  'bg-amber-500',
  loss: 'bg-red-500',
};

const STATUS_ICON = {
  good: TrendingUp,
  okay: Minus,
  low:  TrendingDown,
  loss: TrendingDown,
};

export const DashboardRecentCalculations = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { settings, stats } = useAppData();

  const recent = (stats?.recentCalculations || []).filter(Boolean).slice(0, 3);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1">
          <Clock className="w-4 h-4 text-text-muted" />
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">{t('dashboard.recentCalculations')}</h2>
        </div>
        {recent.length > 0 && (
          <button
            onClick={() => navigate('/history')}
            className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-0.5"
          >
            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="bg-surface border border-dashed border-border rounded-2xl p-8 text-center">
          <p className="text-sm text-text-muted mb-3">Belum ada perhitungan tersimpan.</p>
          <Button size="sm" onClick={() => navigate('/calculator')}>Mulai Hitung HPP</Button>
        </div>
      ) : (
        <StaggerContainer className="space-y-2">
          {recent.map((item) => {
            const statusKey = item.result?.profitStatus?.key || 'okay';
            const dotClass = STATUS_DOT[statusKey] || STATUS_DOT.okay;
            const StatusIcon = STATUS_ICON[statusKey] || Minus;
            const profitPos = (item.result?.profitPerUnit || 0) >= 0;
            const dateStr = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
              : '';

            return (
              <FadeIn key={item.id}>
                <div
                  className="group flex items-center gap-3 bg-surface border border-border/60 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-px hover:border-brand-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  onClick={() => navigate(`/history/${item.id}`)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/history/${item.id}`); } }}
                >
                  {/* Status dot */}
                  <div className={`shrink-0 w-2 h-2 rounded-full ${dotClass}`} />

                  {/* Name + date */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-text-primary group-hover:text-brand-primary transition-colors truncate">
                      {item.productName}
                    </div>
                    <div className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1.5">
                      <Badge variant={statusKey} className="text-[9px] px-1.5 py-0 shrink-0">
                        {t(`result.status.${statusKey}`)}
                      </Badge>
                      {dateStr}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="shrink-0 text-right hidden sm:block">
                    <div className="text-xs font-bold text-text-primary tabular-nums whitespace-nowrap">
                      {formatCurrency(item.result?.sellingPrice || 0, lang, settings?.currency || 'IDR')}
                    </div>
                    <div className={`text-xs font-extrabold tabular-nums ${profitPos ? 'text-emerald-600' : 'text-red-500'}`}>
                      {formatPercent(item.result?.marginPercent || 0, lang)}
                    </div>
                  </div>

                  <ChevronRight className="shrink-0 w-4 h-4 text-text-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </FadeIn>
            );
          })}
        </StaggerContainer>
      )}
    </div>
  );
};
