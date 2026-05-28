import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { AnimatedNumber } from '../motion/AnimatedNumber';
import { StaggerContainer } from '../motion/StaggerContainer';
import { FadeIn } from '../motion/FadeIn';
import { Box, TrendingUp, CheckCircle2, BarChart3, ChevronRight, AlertTriangle } from 'lucide-react';

const MetricCard = ({ title, value, helper, iconBg, icon: Icon, onClick, alert }) => {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`group relative bg-surface rounded-2xl border border-border/60 p-4 sm:p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-primary/30 ${onClick ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1.5">
          {alert && (
            <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-600 rounded-full">{alert}</span>
          )}
          {onClick && (
            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
          )}
        </div>
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">{title}</div>
        <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-text-primary group-hover:text-brand-primary transition-colors">{value}</div>
        {helper && <div className="text-xs text-text-muted mt-1 font-medium">{helper}</div>}
      </div>
    </Tag>
  );
};

export const DashboardMetricGrid = ({ summary }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!summary || !summary.dataCoverage) return null;

  const attentionCount = (summary.lowCount || 0) + (summary.lossCount || 0);

  return (
    <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <FadeIn>
        <MetricCard
          title={t('dashboard.summaryProducts')}
          value={<AnimatedNumber value={summary.dataCoverage.calculations} />}
          helper="Total produk aktif"
          iconBg="bg-blue-100"
          icon={Box}
        />
      </FadeIn>

      <FadeIn>
        <MetricCard
          title={t('dashboard.summaryAverageMargin')}
          value={<><AnimatedNumber value={summary.averageMargin} suffix="%" /></>}
          helper={summary.averageMargin >= 25 ? '✅ Di atas target 25%' : '⚠️ Di bawah target 25%'}
          iconBg={summary.averageMargin >= 25 ? 'bg-emerald-100' : 'bg-amber-100'}
          icon={TrendingUp}
        />
      </FadeIn>

      <FadeIn>
        <MetricCard
          title={t('dashboard.summaryHealthyMenus')}
          value={<AnimatedNumber value={summary.healthyCount} />}
          helper="Margin sehat ≥ 30%"
          iconBg="bg-emerald-100"
          icon={CheckCircle2}
        />
      </FadeIn>

      <FadeIn>
        <MetricCard
          title="Laporan Bisnis"
          value="Lihat →"
          helper={attentionCount > 0 ? `${attentionCount} item perlu dicek` : 'Semua aman'}
          iconBg="bg-orange-100"
          icon={BarChart3}
          onClick={() => navigate('/reports')}
          alert={attentionCount > 0 ? `${attentionCount} masalah` : undefined}
        />
      </FadeIn>
    </StaggerContainer>
  );
};
