import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAppData } from '../hooks/useAppData';
import { useToast } from '../hooks/useToast';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { formatCurrency, formatPercent } from '../lib/calculations';
import {
  History as HistoryIcon, Trash2, Search, ChevronRight,
  TrendingUp, TrendingDown, Minus, SlidersHorizontal, X
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StaggerContainer } from '../components/motion/StaggerContainer';
import { FadeIn } from '../components/motion/FadeIn';

const STATUS_CONFIG = {
  good: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    icon: TrendingUp,
    iconColor: 'text-emerald-500',
    ring: 'hover:ring-emerald-200',
  },
  okay: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    dot: 'bg-blue-400',
    text: 'text-blue-700',
    icon: Minus,
    iconColor: 'text-blue-400',
    ring: 'hover:ring-blue-100',
  },
  low: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    icon: TrendingDown,
    iconColor: 'text-amber-500',
    ring: 'hover:ring-amber-100',
  },
  loss: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    dot: 'bg-red-500',
    text: 'text-red-700',
    icon: TrendingDown,
    iconColor: 'text-red-500',
    ring: 'hover:ring-red-100',
  },
};

export const HistoryPage = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { settings, calculations, loadDemoData, deleteCalculation } = useAppData();
  const { addToast } = useToast();

  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  const handleLoadDemo = () => {
    loadDemoData();
    addToast({ type: 'success', title: t('toasts.demoLoadedTitle'), message: t('toasts.demoLoadedMessage') });
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteCalculation(deleteId);
      addToast({ type: 'success', title: t('toasts.calculationDeletedTitle'), message: t('toasts.calculationDeletedMessage') });
      setDeleteId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateString));
    } catch { return dateString; }
  };

  const filteredCalculations = useMemo(() => {
    return calculations
      .filter(item => {
        const name = (item.productName || '').toLowerCase();
        const matchSearch = name.includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'all' || item.result?.profitStatus?.key === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'latest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sortBy === 'margin_desc') return (b.result?.marginPercent || 0) - (a.result?.marginPercent || 0);
        if (sortBy === 'profit_desc') return (b.result?.profitPerUnit || 0) - (a.result?.profitPerUnit || 0);
        return 0;
      });
  }, [calculations, searchQuery, statusFilter, sortBy]);

  const hasFilters = searchQuery || statusFilter !== 'all';

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-end justify-between mb-5 gap-4">
        <div>
          <h1 className="page-title">{t('history.title')}</h1>
          <p className="page-subtitle">{t('history.subtitle')}</p>
        </div>
        {calculations.length > 0 && (
          <span className="text-xs font-semibold text-text-muted bg-surface border border-border/60 rounded-full px-3 py-1 shrink-0">
            {filteredCalculations.length} produk
          </span>
        )}
      </div>

      {/* Toolbar */}
      {calculations.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {/* Search */}
          <div className="relative flex-1 min-w-44">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <input
              type="text"
              aria-label="Cari produk"
              placeholder="Cari nama produk..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-surface border border-border/70 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status chips */}
          <div className="flex items-center gap-1.5">
            {[
              { value: 'all', label: 'Semua' },
              { value: 'good', label: '🟢 Sehat' },
              { value: 'okay', label: '🔵 Cukup' },
              { value: 'low', label: '🟡 Tipis' },
              { value: 'loss', label: '🔴 Rugi' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                  statusFilter === opt.value
                    ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                    : 'bg-surface border-border/60 text-text-secondary hover:border-brand-primary/40 hover:text-brand-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative flex items-center ml-auto">
            <SlidersHorizontal className="absolute left-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            <select
              aria-label="Urutkan"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="pl-8 pr-7 py-2 bg-surface border border-border/70 rounded-xl text-sm text-text-secondary focus:border-brand-primary outline-none appearance-none transition-all"
            >
              <option value="latest">Terbaru</option>
              <option value="margin_desc">Margin ↓</option>
              <option value="profit_desc">Profit ↓</option>
            </select>
            <svg className="absolute right-2 w-3 h-3 text-text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      )}

      {/* List */}
      {filteredCalculations.length > 0 ? (
        <StaggerContainer className="space-y-3">
          {filteredCalculations.map(item => {
            const statusKey = item.result?.profitStatus?.key || 'okay';
            const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.okay;
            const StatusIcon = cfg.icon;
            const profitPositive = (item.result?.profitPerUnit || 0) >= 0;

            return (
              <FadeIn key={item.id}>
                <div
                  role="link"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/history/${item.id}`); } }}
                  onClick={() => navigate(`/history/${item.id}`)}
                  className={`group relative bg-surface rounded-2xl border ${cfg.border} overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:ring-2 ${cfg.ring} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary`}
                >
                  {/* Tonal accent strip */}
                  <div className={`absolute inset-x-0 top-0 h-0.5 ${cfg.dot}`} />

                  <div className="flex items-center gap-4 px-4 pt-3.5 pb-3">
                    {/* Status icon bubble */}
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg} border ${cfg.border}`}>
                      <StatusIcon className={`w-5 h-5 ${cfg.iconColor}`} />
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-text-primary group-hover:text-brand-primary transition-colors truncate">
                          {item.productName}
                        </h3>
                        <Badge variant={statusKey} className="text-[10px] px-2 py-0.5 shrink-0">
                          {t(`result.status.${statusKey}`)}
                        </Badge>
                        {item.source === 'demo' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted opacity-60">Demo</span>
                        )}
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5">{formatDate(item.createdAt)}</p>
                    </div>

                    {/* Metrics */}
                    <div className="hidden sm:flex items-center gap-5 shrink-0 pr-2">
                      <div className="text-right">
                        <div className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-0.5">HPP/pcs</div>
                        <div className="text-xs font-semibold text-text-secondary tabular-nums whitespace-nowrap">
                          {formatCurrency(item.result?.hppPerUnit || 0, lang, settings.currency)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-0.5">Harga Jual</div>
                        <div className="text-xs font-bold text-text-primary tabular-nums whitespace-nowrap">
                          {formatCurrency(item.result?.sellingPrice || 0, lang, settings.currency)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-0.5">Profit/pcs</div>
                        <div className={`text-xs font-bold tabular-nums whitespace-nowrap ${profitPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                          {formatCurrency(item.result?.profitPerUnit || 0, lang, settings.currency)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-0.5">Margin</div>
                        <div className={`text-sm font-extrabold tabular-nums ${profitPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                          {formatPercent(item.result?.marginPercent || 0, lang)}
                        </div>
                      </div>
                    </div>

                    {/* Mobile: just margin */}
                    <div className="flex sm:hidden items-center gap-2 shrink-0">
                      <div className="text-right">
                        <div className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Margin</div>
                        <div className={`text-base font-extrabold ${profitPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                          {formatPercent(item.result?.marginPercent || 0, lang)}
                        </div>
                      </div>
                    </div>

                    {/* Arrow + delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); setDeleteId(item.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                        aria-label={`${t('history.delete')} ${item.productName}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </StaggerContainer>
      ) : calculations.length > 0 ? (
        /* No results from filter */
        <div className="text-center py-16 bg-surface border border-border/60 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-surface-muted flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-text-muted" />
          </div>
          <h3 className="text-base font-bold text-text-primary mb-1">Tidak ada hasil</h3>
          <p className="text-sm text-text-muted mb-5">Coba ubah kata kunci atau filter status.</p>
          <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
            Hapus Filter
          </Button>
        </div>
      ) : (
        /* Truly empty */
        <EmptyState
          icon={<HistoryIcon className="w-8 h-8" />}
          title={t('history.emptyTitle')}
          description={t('history.emptyBody')}
          action={
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => navigate('/calculator')}>{t('welcome.startCalculating')}</Button>
              <Button variant="secondary" onClick={handleLoadDemo}>{t('dashboard.loadDemoData')}</Button>
            </div>
          }
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        title={t('history.deleteConfirmTitle')}
        description={t('history.deleteConfirmBody')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </PageContainer>
  );
};
