import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { usePricingSimulations } from '../../hooks/usePricingSimulations';
import { formatCurrency, formatPercent } from '../../lib/calculations';

import { SimulationCard } from '../../components/pricing/SimulationCard';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Plus, Calculator, Search, ArrowUpDown, Filter, X } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';

const getSimulationHealthStatus = (simulation) => {
  const profit = simulation.profit !== undefined ? simulation.profit : (simulation.result?.profit || 0);
  const margin = simulation.isBundle
    ? (simulation.finalSellingPrice > 0 ? (profit / simulation.finalSellingPrice) * 100 : 0)
    : (simulation.result?.marginPercent || simulation.marginPercent || 0);
  const status = simulation.result?.status || simulation.status;

  if (status === 'loss' || profit < 0) return 'loss';
  if (status === 'low' || margin < 25) return 'low';
  return 'good';
};

export const PricingSimulationsPage = () => {
  const { t, lang, settings } = useLanguage();
  const currency = settings?.currency || 'IDR';
  const navigate = useNavigate();
  const { 
    pricingSimulations, 
    bundleSimulations, 
    hasSimulations, 
    deletePricingSimulation,
    deleteBundleSimulation
  } = usePricingSimulations();
  
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, good, low, loss
  const [sortBy, setSortBy] = useState('latest'); // latest, margin_desc
  const [detailSimulation, setDetailSimulation] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (simulation) => {
    setDeleteTarget(simulation);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.isBundle || deleteTarget.type === 'bundle') {
      deleteBundleSimulation(deleteTarget.id);
    } else {
      deletePricingSimulation(deleteTarget.id);
    }
    setDeleteTarget(null);
    showToast(t('pricing.simulationDeleted'));
  };

  const handleCardClick = (simulation) => {
    setDetailSimulation(simulation);
  };

  const rawSimulations = useMemo(() => {
    return [
      ...pricingSimulations.map(s => ({ ...s, isBundle: false })),
      ...bundleSimulations.map(s => ({ ...s, isBundle: true }))
    ];
  }, [pricingSimulations, bundleSimulations]);

  // Calculations for Summary Statistics
  const summaryStats = useMemo(() => {
    if (rawSimulations.length === 0) {
      return { total: 0, avgMargin: 0, goodCount: 0, lossCount: 0 };
    }

    let totalMargin = 0;
    let validMarginCount = 0;
    let goodCount = 0;
    let lossCount = 0;

    rawSimulations.forEach(sim => {
      const profit = sim.profit !== undefined ? sim.profit : (sim.result?.profit || 0);
      const margin = sim.isBundle 
        ? (sim.finalSellingPrice > 0 ? (profit / sim.finalSellingPrice) * 100 : 0)
        : (sim.result?.marginPercent || 0);
      
      const status = getSimulationHealthStatus(sim);

      totalMargin += margin;
      validMarginCount++;

      if (status === 'good') goodCount++;
      if (status === 'loss') lossCount++;
    });

    return {
      total: rawSimulations.length,
      avgMargin: validMarginCount > 0 ? totalMargin / validMarginCount : 0,
      goodCount,
      lossCount
    };
  }, [rawSimulations]);

  // Filtered and Sorted Simulations
  const filteredSimulations = useMemo(() => {
    return rawSimulations
      .filter(sim => {
        // Search filter
        const nameMatch = sim.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const prodMatch = sim.sourceNameSnapshot?.toLowerCase().includes(searchQuery.toLowerCase());
        const searchMatches = searchQuery === '' || nameMatch || prodMatch;

        if (!searchMatches) return false;

        // Status filter
        if (statusFilter === 'all') return true;

        const status = getSimulationHealthStatus(sim);
        
        return status === statusFilter;
      })
      .sort((a, b) => {
        if (sortBy === 'latest') {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        } else if (sortBy === 'margin_desc') {
          const aProfit = a.profit !== undefined ? a.profit : (a.result?.profit || 0);
          const aMargin = a.isBundle 
            ? (a.finalSellingPrice > 0 ? (aProfit / a.finalSellingPrice) * 100 : 0)
            : (a.result?.marginPercent || 0);

          const bProfit = b.profit !== undefined ? b.profit : (b.result?.profit || 0);
          const bMargin = b.isBundle 
            ? (b.finalSellingPrice > 0 ? (bProfit / b.finalSellingPrice) * 100 : 0)
            : (b.result?.marginPercent || 0);

          return bMargin - aMargin;
        }
        return 0;
      });
  }, [rawSimulations, searchQuery, statusFilter, sortBy]);

  const detailRows = useMemo(() => {
    if (!detailSimulation) return [];

    const isBundle = detailSimulation.type === 'bundle';
    const result = detailSimulation.result || {};
    const profit = isBundle ? detailSimulation.profit : result.profit;
    const margin = isBundle
      ? detailSimulation.marginPercent || (detailSimulation.finalSellingPrice > 0 ? (profit / detailSimulation.finalSellingPrice) * 100 : 0)
      : result.marginPercent;

    if (isBundle) {
      return [
        { label: t('pricing.totalBundleHpp'), value: formatCurrency(detailSimulation.baseTotalHpp || 0, lang, currency) },
        { label: t('pricing.bundleSellingPrice'), value: formatCurrency(detailSimulation.finalSellingPrice || 0, lang, currency) },
        { label: t('pricing.profit'), value: formatCurrency(profit || 0, lang, currency) },
        { label: t('pricing.margin'), value: formatPercent(margin || 0, lang) }
      ];
    }

    if (detailSimulation.type === 'reseller') {
      return [
        { label: t('pricing.hppPerUnit'), value: formatCurrency(detailSimulation.baseHpp || 0, lang, currency) },
        { label: t('pricing.wholesalePrice'), value: formatCurrency(result.wholesalePrice || 0, lang, currency) },
        { label: t('pricing.resellerSuggestedPrice'), value: formatCurrency(result.resellerSuggestedPrice || 0, lang, currency) },
        { label: t('pricing.ownerProfit'), value: formatCurrency(result.ownerProfitPerUnit || 0, lang, currency) }
      ];
    }

    return [
      { label: t('pricing.hppPerUnit'), value: formatCurrency(detailSimulation.baseHpp || 0, lang, currency) },
      { label: t('pricing.sellingPrice'), value: formatCurrency(result.finalPrice || detailSimulation.baseSellingPrice || 0, lang, currency) },
      { label: t('pricing.profit'), value: formatCurrency(profit || 0, lang, currency) },
      { label: t('pricing.margin'), value: formatPercent(margin || 0, lang) }
    ];
  }, [currency, detailSimulation, lang, t]);

  return (
    <PageContainer maxWidth="max-w-5xl">
      <div className="pricing-page space-y-6">
        {/* Page Hero */}
        <div className="pricing-hero">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Riwayat Simulasi Harga</h1>
              <p className="text-sm text-text-secondary mt-1">
                Pantau perbandingan harga jual, keuntungan bersih, dan margin dari simulasi yang telah disimpan.
              </p>
            </div>
            <Button 
              variant="primary" 
              size="sm" 
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/channel-pricing')}
            >
              Simulasi Baru
            </Button>
          </div>
        </div>

        {hasSimulations && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 bg-surface border border-border flex flex-col justify-between shadow-sm">
                <span className="text-xs text-text-muted font-bold">Total Simulasi</span>
                <span className="text-2xl font-extrabold text-text-primary mt-1">
                  {summaryStats.total} <span className="text-xs font-normal text-text-muted">simulasi</span>
                </span>
              </Card>
              <Card className="p-4 bg-surface border border-border flex flex-col justify-between shadow-sm">
                <span className="text-xs text-text-muted font-bold">Rata-rata Margin</span>
                <span className="text-2xl font-extrabold text-brand-primary mt-1">
                  {formatPercent(summaryStats.avgMargin, lang)}
                </span>
              </Card>
              <Card className="p-4 bg-surface border border-border flex flex-col justify-between shadow-sm">
                <span className="text-xs text-text-muted font-bold">Simulasi Sehat</span>
                <span className="text-2xl font-extrabold text-status-good mt-1">
                  {summaryStats.goodCount} <span className="text-xs font-normal text-text-muted">simulasi</span>
                </span>
              </Card>
              <Card className="p-4 bg-surface border border-border flex flex-col justify-between shadow-sm">
                <span className="text-xs text-text-muted font-bold">Simulasi Rugi</span>
                <span className="text-2xl font-extrabold text-status-loss mt-1">
                  {summaryStats.lossCount} <span className="text-xs font-normal text-text-muted">simulasi</span>
                </span>
              </Card>
            </div>

            {/* Toolbar */}
            <div className="pricing-toolbar">
              <div className="max-w-md flex-1 w-full">
                <Input 
                  type="text"
                  aria-label="Cari simulasi"
                  placeholder="Cari simulasi atau nama produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  prefix={<Search className="h-4 w-4 text-text-secondary" />}
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Filter */}
                <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                  <Filter className="w-4 h-4 text-text-muted hidden sm:inline" />
                  <div className="relative flex items-center group flex-1 sm:flex-none">
                    <select
                      aria-label="Filter status simulasi"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full sm:w-auto pl-3 pr-8 py-2 bg-surface border border-border rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none appearance-none transition-all duration-200"
                    >
                      <option value="all">Semua Status</option>
                      <option value="good">Sehat (Margin &gt;= 25%)</option>
                      <option value="low">Rendah (Margin &lt; 25%)</option>
                      <option value="loss">Rugi (Profit &lt; 0)</option>
                    </select>
                    <div className="absolute right-2.5 pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                  <ArrowUpDown className="w-4 h-4 text-text-muted hidden sm:inline" />
                  <div className="relative flex items-center group flex-1 sm:flex-none">
                    <select
                      aria-label="Urutkan simulasi"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full sm:w-auto pl-3 pr-8 py-2 bg-surface border border-border rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none appearance-none transition-all duration-200"
                    >
                      <option value="latest">Terbaru</option>
                      <option value="margin_desc">Margin Tertinggi</option>
                    </select>
                      <div className="absolute right-2.5 pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                  </div>
                </div>
              </div>
            </div>

            {/* List pricing-simulation-grid */}
            {filteredSimulations.length > 0 ? (
              <div className="pricing-simulation-grid">
                {filteredSimulations.map(sim => (
                  <SimulationCard 
                    key={sim.id} 
                    simulation={sim} 
                    onClick={handleCardClick}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="pricing-empty-state">
                <h3 className="text-base font-bold text-text-primary mb-2">Simulasi tidak ditemukan</h3>
                <p className="text-sm text-text-tertiary mb-4">
                  Coba ubah kata kunci pencarian atau filter status Anda.
                </p>
                <Button size="sm" variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
                  Reset Filter
                </Button>
              </div>
            )}
          </>
        )}

        {!hasSimulations && (
          <div className="pricing-empty-state">
            <div className="w-16 h-16 bg-brand-soft rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Belum ada simulasi</h3>
            <p className="text-text-tertiary mb-6 max-w-sm mx-auto text-sm">
              Buat simulasi harga untuk melihat profit per channel dan pastikan margin bisnis Anda tetap aman.
            </p>
            <Button onClick={() => navigate('/channel-pricing')}>
              Buat Simulasi Pertama
            </Button>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {detailSimulation && (
        <div className="dialog-overlay" onClick={() => setDetailSimulation(null)}>
          <div
            className="dialog-card max-w-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="simulation-detail-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                  {t(`pricing.${detailSimulation.type}`)}
                </p>
                <h2 id="simulation-detail-title" className="dialog-title mb-1">
                  {t('pricing.simulationDetailTitle')}
                </h2>
                <p className="text-sm font-semibold text-text-primary mb-1">
                  {detailSimulation.name}
                </p>
                {detailSimulation.sourceNameSnapshot && (
                  <p className="text-sm text-text-secondary">
                    {detailSimulation.sourceNameSnapshot}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => setDetailSimulation(null)} aria-label="Tutup detail simulasi">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
              {detailRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3 bg-surface">
                  <span className="text-sm text-text-secondary">{row.label}</span>
                  <span className="text-sm font-bold text-text-primary text-right">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="dialog-actions mt-6">
              <Button variant="outline" onClick={() => setDetailSimulation(null)}>
                {t('common.close')}
              </Button>
              <Button onClick={() => navigate('/channel-pricing')}>
                {t('pricing.calculate')}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={t('pricing.deleteConfirmTitle')}
        description={deleteTarget ? `${t('pricing.deleteConfirmBody')} ${deleteTarget.name}` : ''}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
};
