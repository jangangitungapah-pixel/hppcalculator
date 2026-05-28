import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAppData } from '../hooks/useAppData';
import { useToast } from '../hooks/useToast';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { formatCurrency, formatPercent } from '../lib/calculations';
import {
  ArrowLeft, History as HistoryIcon, Trash2, RotateCcw,
  TrendingUp, TrendingDown, Minus, Package, Calculator,
  ShoppingCart, BarChart2, Zap, Star
} from 'lucide-react';
import { StaggerContainer } from '../components/motion/StaggerContainer';
import { FadeIn } from '../components/motion/FadeIn';
import { AnimatedNumber } from '../components/motion/AnimatedNumber';

const MetricTile = ({ label, value, sub, tone = 'neutral', large = false }) => {
  const tones = {
    neutral:  { wrap: 'bg-surface border-border/60',         val: 'text-text-primary',  label: 'text-text-muted' },
    good:     { wrap: 'bg-emerald-50 border-emerald-200',    val: 'text-emerald-700',   label: 'text-emerald-500' },
    loss:     { wrap: 'bg-red-50 border-red-200',            val: 'text-red-600',       label: 'text-red-400' },
    brand:    { wrap: 'bg-orange-50 border-orange-200',      val: 'text-orange-600',    label: 'text-orange-400' },
    okay:     { wrap: 'bg-blue-50 border-blue-200',          val: 'text-blue-700',      label: 'text-blue-400' },
  };
  const s = tones[tone] || tones.neutral;
  return (
    <div className={`rounded-2xl border p-4 ${s.wrap} transition-all duration-200 hover:shadow-md`}>
      <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${s.label}`}>{label}</div>
      <div className={`${large ? 'text-2xl' : 'text-xl'} font-extrabold tabular-nums tracking-tight ${s.val}`}>{value}</div>
      {sub && <div className="text-[11px] mt-1.5 text-text-muted font-medium">{sub}</div>}
    </div>
  );
};

const Row = ({ label, value, muted = false }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0 group">
    <span className={`text-sm ${muted ? 'text-text-muted' : 'text-text-secondary'}`}>{label}</span>
    <span className="text-sm font-semibold text-text-primary tabular-nums">{value}</span>
  </div>
);

const SectionTitle = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center">
      <Icon className="w-3.5 h-3.5 text-brand-primary" />
    </div>
    <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">{children}</h2>
  </div>
);

export const HistoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { settings, calculations, deleteCalculation } = useAppData();
  const { addToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const savedCalculation = calculations.find(c => c.id === id);

  if (!savedCalculation) {
    return (
      <PageContainer className="flex items-center justify-center min-h-[50vh]">
        <EmptyState
          icon={<HistoryIcon className="w-8 h-8" />}
          title={t('history.notFoundTitle')}
          description={t('history.notFoundBody')}
          action={<Button onClick={() => navigate('/history')}>{t('common.back')}</Button>}
        />
      </PageContainer>
    );
  }

  const { input, result } = savedCalculation;
  const statusKey = result.profitStatus?.key || 'okay';
  const isProfit = result.profitPerUnit > 0;
  const isLoss = result.profitPerUnit < 0;

  const metricTone = isProfit ? 'good' : isLoss ? 'loss' : 'neutral';
  const StatusIcon = isProfit ? TrendingUp : isLoss ? TrendingDown : Minus;

  const formatDate = (ds) => {
    if (!ds) return '';
    try {
      return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      }).format(new Date(ds));
    } catch { return ds; }
  };

  const handleDelete = () => {
    deleteCalculation(id);
    addToast({ type: 'success', title: t('toasts.calculationDeletedTitle'), message: t('toasts.calculationDeletedMessage') });
    navigate('/history');
  };

  const handleUseAgain = () => navigate('/calculator', { state: { useAgainForm: input } });

  return (
    <PageContainer>
      <StaggerContainer>
        {/* Back nav */}
        <FadeIn>
          <button
            onClick={() => navigate('/history')}
            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-brand-primary transition-colors mb-5 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke Riwayat
          </button>
        </FadeIn>

        {/* Hero header */}
        <FadeIn>
          <div className={`relative rounded-3xl border overflow-hidden mb-6 p-5 sm:p-7 ${
            isProfit ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200' :
            isLoss   ? 'bg-gradient-to-br from-red-50 to-white border-red-200' :
                       'bg-gradient-to-br from-blue-50 to-white border-blue-200'
          }`}>
            {/* decorative glow */}
            <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 ${
              isProfit ? 'bg-emerald-400' : isLoss ? 'bg-red-400' : 'bg-blue-400'
            }`} />

            <div className="relative flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Icon */}
              <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                isProfit ? 'bg-emerald-100 border border-emerald-300' :
                isLoss   ? 'bg-red-100 border border-red-300' :
                           'bg-blue-100 border border-blue-300'
              }`}>
                <StatusIcon className={`w-7 h-7 ${isProfit ? 'text-emerald-600' : isLoss ? 'text-red-500' : 'text-blue-500'}`} />
              </div>

              {/* Name & date */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight truncate">
                    {savedCalculation.productName}
                  </h2>
                  <Badge variant={statusKey}>
                    {t(`result.status.${statusKey}`)}
                  </Badge>
                  {savedCalculation.source === 'demo' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-surface border border-border/60 rounded-full px-2 py-0.5">Demo</span>
                  )}
                </div>
                <p className="text-sm text-text-muted">{formatDate(savedCalculation.createdAt)}</p>
              </div>

              {/* Big margin display */}
              <div className="shrink-0 text-right">
                <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Margin</div>
                <div className={`text-3xl sm:text-4xl font-black tabular-nums ${
                  isProfit ? 'text-emerald-600' : isLoss ? 'text-red-500' : 'text-blue-600'
                }`}>
                  <AnimatedNumber value={result.marginPercent} suffix="%" />
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* 4 key metrics */}
        <FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <MetricTile
              label={t('result.hppPerUnit')}
              value={<AnimatedNumber value={result.hppPerUnit} isCurrency />}
              tone="neutral"
            />
            <MetricTile
              label={t('result.sellingPrice') || 'Harga Jual'}
              value={<AnimatedNumber value={result.sellingPrice} isCurrency />}
              tone="brand"
            />
            <MetricTile
              label={t('result.profitPerUnit')}
              value={<AnimatedNumber value={result.profitPerUnit} isCurrency />}
              tone={metricTone}
            />
            <MetricTile
              label={t('result.markup')}
              value={<AnimatedNumber value={result.markupPercent} suffix="%" />}
              tone="okay"
            />
          </div>
        </FadeIn>

        {/* Main grid */}
        <div className="grid lg:grid-cols-5 gap-5">
          {/* Left: cost breakdown (wider) */}
          <FadeIn className="lg:col-span-3">
            <div className="bg-surface rounded-2xl border border-border/60 overflow-hidden">
              <div className="px-5 pt-4 pb-2">
                <SectionTitle icon={Calculator}>Rincian Biaya Produksi</SectionTitle>
              </div>
              <div className="px-5 pb-1">
                {input.costItems?.length > 0 ? (
                  input.costItems.map(cost => (
                    <Row
                      key={cost.id}
                      label={
                        <span>
                          {cost.name}
                          {cost.category && (
                            <span className="ml-1.5 text-[10px] text-text-muted font-medium uppercase tracking-wider">({cost.category})</span>
                          )}
                        </span>
                      }
                      value={formatCurrency(cost.amount, lang, settings.currency)}
                    />
                  ))
                ) : (
                  <p className="text-sm text-text-muted py-3">Tidak ada biaya terdata.</p>
                )}
              </div>
              <div className="flex items-center justify-between mx-5 mt-1 mb-4 pt-3 border-t border-border/60">
                <span className="text-sm font-bold text-text-primary">{t('result.totalProductionCost')}</span>
                <span className="text-base font-extrabold text-text-primary tabular-nums">
                  <AnimatedNumber value={result.totalProductionCost} isCurrency />
                </span>
              </div>

              {/* Production output */}
              <div className="border-t border-border/50 px-5 pb-4 pt-3">
                <SectionTitle icon={Package}>Output Produksi</SectionTitle>
                <Row label={t('calculator.outputQuantity')} value={`${input.outputQuantity} ${input.sellingUnit || 'pcs'}`} />
                <Row label={t('calculator.failedQuantity')} value={`${input.failedQuantity || 0} ${input.sellingUnit || 'pcs'}`} muted />
                <Row label="HPP / pcs" value={formatCurrency(result.hppPerUnit, lang, settings.currency)} />
              </div>
            </div>
          </FadeIn>

          {/* Right: prices + actions */}
          <div className="lg:col-span-2 space-y-4">
            {/* Suggested prices */}
            <FadeIn>
              <div className="bg-surface rounded-2xl border border-border/60 overflow-hidden">
                <div className="px-5 pt-4 pb-2">
                  <SectionTitle icon={Star}>{t('result.suggestedPrices')}</SectionTitle>
                </div>
                <div className="px-5 pb-4 space-y-2">
                  {[
                    { key: 'safe',    label: `${t('result.safePrice')} · 15%`,    price: result.suggestedPrices?.safe?.price,    accent: 'border-blue-400 bg-blue-50',    val: 'text-blue-700' },
                    { key: 'ideal',   label: `${t('result.idealPrice')} · 30%`,   price: result.suggestedPrices?.ideal?.price,   accent: 'border-emerald-400 bg-emerald-50',  val: 'text-emerald-700' },
                    { key: 'premium', label: `${t('result.premiumPrice')} · 50%`, price: result.suggestedPrices?.premium?.price, accent: 'border-orange-400 bg-orange-50', val: 'text-orange-700' },
                  ].map(p => (
                    <div key={p.key} className={`flex items-center justify-between rounded-xl border-l-4 px-4 py-3 ${p.accent} transition-all hover:shadow-sm`}>
                      <span className="text-sm font-medium text-text-secondary">{p.label}</span>
                      <span className={`text-sm font-extrabold tabular-nums ${p.val}`}>
                        <AnimatedNumber value={p.price || 0} isCurrency />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Actions */}
            <FadeIn>
              <div className="bg-surface rounded-2xl border border-border/60 p-4">
                <SectionTitle icon={Zap}>Aksi</SectionTitle>
                <div className="flex flex-col gap-2.5">
                  <Button
                    onClick={handleUseAgain}
                    className="w-full h-10 gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t('history.useAgain')}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full h-10 gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </StaggerContainer>

      <ConfirmDialog
        open={showDeleteConfirm}
        title={t('history.deleteConfirmTitle')}
        description={t('history.deleteConfirmBody')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </PageContainer>
  );
};
