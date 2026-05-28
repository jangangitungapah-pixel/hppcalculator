import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { usePurchases } from '../hooks/usePurchases';
import { useSuppliers } from '../hooks/useSuppliers';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { PurchaseFormDialog } from '../components/purchases/PurchaseFormDialog';
import { useToast } from '../hooks/useToast';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Calendar, 
  DollarSign, 
  Clock, 
  ChevronRight, 
  FileText,
  TrendingUp,
  Award
} from 'lucide-react';
import { formatPurchaseDate, formatPaymentMethod, summarizePurchaseItems } from '../lib/suppliers';
import { getTopSuppliersBySpend, getMostPurchasedIngredients } from '../lib/suppliers/supplierInsights';

export const PurchaseLogPage = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { purchaseLogs, purchaseItems, savePurchaseLog } = usePurchases();
  const { suppliers } = useSuppliers();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [filterSupplier, setFilterSupplier] = useState('all');
  const [sortBy, setSortBy] = useState('terbaru');

  const [dialogOpen, setDialogOpen] = useState(false);

  // Compute stats
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const monthLogs = purchaseLogs.filter(log => log.purchaseDate && log.purchaseDate.startsWith(currentMonthStr));
  
  const totalBelanjaBulanIni = monthLogs.reduce((sum, log) => sum + (Number(log.totalAmount) || 0), 0);
  const totalTransaksiBulanIni = monthLogs.length;

  // Most purchased ingredient
  const mostPurchased = getMostPurchasedIngredients(purchaseItems, 1)[0];
  
  // Top supplier this month
  const topSupplierThisMonth = getTopSuppliersBySpend(monthLogs, 1)[0];

  // Actions
  const handleRecordPurchaseClick = () => {
    setDialogOpen(true);
  };

  const handleSavePurchase = (logData, itemsData) => {
    try {
      const result = savePurchaseLog(logData, itemsData);
      setDialogOpen(false);
      
      if (result.warnings && result.warnings.length > 0) {
        // Show warnings
        result.warnings.forEach(warn => {
          addToast({
            title: t('purchases.warningTitle', 'Peringatan Konversi'),
            message: warn,
            type: 'warning'
          });
        });
      }

      addToast({
        title: t('purchases.savedTitle', 'Pembelian Dicatat'),
        message: t('purchases.savedMessage', 'Pembelian berhasil dicatat dan stok/harga diperbarui.'),
        type: 'success'
      });
    } catch (err) {
      addToast({
        title: 'Error',
        message: err.message,
        type: 'error'
      });
    }
  };

  // Filter logs
  const filteredLogs = purchaseLogs.filter(log => {
    // 1. Search Query
    const query = searchQuery.toLowerCase().trim();
    let searchMatch = true;
    if (query !== '') {
      const supplierMatch = log.supplierNameSnapshot && log.supplierNameSnapshot.toLowerCase().includes(query);
      const invoiceMatch = log.invoiceNumber && log.invoiceNumber.toLowerCase().includes(query);
      const notesMatch = log.notes && log.notes.toLowerCase().includes(query);
      
      // Also search by item ingredient names linked to this log
      const logItems = purchaseItems.filter(item => item.purchaseLogId === log.id);
      const ingredientMatch = logItems.some(item => item.ingredientNameSnapshot && item.ingredientNameSnapshot.toLowerCase().includes(query));

      searchMatch = supplierMatch || invoiceMatch || notesMatch || ingredientMatch;
    }

    // 2. Date Filter
    let dateMatch = true;
    if (filterDate === 'month_this') {
      dateMatch = log.purchaseDate && log.purchaseDate.startsWith(currentMonthStr);
    } else if (filterDate === 'last_30_days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateMatch = log.purchaseDate && new Date(log.purchaseDate) >= thirtyDaysAgo;
    }

    // 3. Supplier Filter
    let supplierMatch = true;
    if (filterSupplier !== 'all') {
      supplierMatch = log.supplierId === filterSupplier;
    }

    return searchMatch && dateMatch && supplierMatch;
  });

  // Sort logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortBy === 'terbaru') {
      return new Date(b.purchaseDate) - new Date(a.purchaseDate) || b.createdAt.localeCompare(a.createdAt);
    }
    if (sortBy === 'terbesar') {
      return b.totalAmount - a.totalAmount;
    }
    return 0;
  });

  const dateFilterOptions = [
    { value: 'all', label: t('purchases.dateAll', 'Semua Waktu') },
    { value: 'month_this', label: t('purchases.dateThisMonth', 'Bulan Ini') },
    { value: 'last_30_days', label: t('purchases.dateLast30Days', '30 Hari Terakhir') }
  ];

  const supplierFilterOptions = [
    { value: 'all', label: t('purchases.supplierAll', 'Semua Supplier') },
    ...suppliers.map(s => ({ value: s.id, label: s.name }))
  ];

  const sortOptions = [
    { value: 'terbaru', label: t('purchases.sortNewest', 'Tanggal Terbaru') },
    { value: 'terbesar', label: t('purchases.sortLargest', 'Nominal Terbesar') }
  ];

  return (
    <PageContainer maxWidth="max-w-6xl" className="purchases-shell pb-10">
      {/* Hero */}
      <section className="app-page-hero purchases-hero mb-6">
        <div className="app-page-hero-main">
          <div className="app-page-eyebrow flex items-center gap-1">
            <ShoppingBag className="w-4 h-4 text-brand-primary" />
            Operasional
          </div>
          <h2 className="app-page-title">
            {t('purchases.pageTitle', 'Riwayat Pembelian Bahan')}
          </h2>
          <p className="app-page-subtitle">
            {t('purchases.pageSubtitle', 'Catat pembelian bahan, update stok, dan pantau perubahan harga bahan.')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleRecordPurchaseClick} className="font-bold flex items-center gap-1.5 shadow-sm">
            <Plus className="w-5 h-5" />
            {t('purchases.addNew', 'Catat Pembelian')}
          </Button>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 purchases-stats-grid">
        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-3 bg-brand-soft rounded-xl text-brand-primary">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-text-secondary">{t('purchases.statSpendMonth', 'Total Belanja Bulan Ini')}</p>
            <p className="text-base sm:text-lg font-bold text-text-primary mt-0.5">Rp {totalBelanjaBulanIni.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}</p>
          </div>
        </div>

        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-text-secondary">{t('purchases.statTrxCount', 'Jumlah Transaksi')}</p>
            <p className="text-base sm:text-lg font-bold text-text-primary mt-0.5">{totalTransaksiBulanIni} Transaksi</p>
          </div>
        </div>

        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <Award className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] sm:text-xs font-semibold text-text-secondary">{t('purchases.statFavIng', 'Bahan Sering Dibeli')}</p>
            <p className="text-sm font-bold text-text-primary mt-0.5 truncate max-w-[140px]">
              {mostPurchased ? mostPurchased.name : '-'}
            </p>
          </div>
        </div>

        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] sm:text-xs font-semibold text-text-secondary">{t('purchases.statTopSupplier', 'Supplier Terbesar')}</p>
            <p className="text-sm font-bold text-text-primary mt-0.5 truncate max-w-[140px]">
              {topSupplierThisMonth ? topSupplierThisMonth.name : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center purchases-toolbar">
        <div className="relative w-full md:max-w-md">
          <Input 
            placeholder={t('purchases.searchPlaceholder', 'Cari invoice, supplier, atau bahan...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            containerClassName="w-full"
            prefix={<Search className="w-4 h-4 text-text-soft" />}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
          <div className="w-full sm:w-44">
            <Select 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              options={dateFilterOptions}
            />
          </div>
          <div className="w-full sm:w-44">
            <Select 
              value={filterSupplier}
              onChange={(e) => setFilterSupplier(e.target.value)}
              options={supplierFilterOptions}
            />
          </div>
          <div className="w-full sm:w-44">
            <Select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
            />
          </div>
        </div>
      </div>

      {/* Purchase List */}
      {sortedLogs.length === 0 ? (
        <div className="bg-surface border border-border p-8 rounded-3xl text-center shadow-sm flex flex-col items-center justify-center min-h-[300px] purchase-empty-state">
          <div className="p-4 bg-brand-soft rounded-2xl text-brand-primary mb-4 animate-pulse">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-1">
            {searchQuery || filterDate !== 'all' || filterSupplier !== 'all' ? t('purchases.noResultsTitle', 'Tidak Ada Hasil Cocok') : t('purchases.emptyStateTitle', 'Belum Ada Catatan Pembelian')}
          </h3>
          <p className="text-sm text-text-secondary max-w-sm mb-6">
            {searchQuery || filterDate !== 'all' || filterSupplier !== 'all'
              ? t('purchases.noResultsDesc', 'Coba ubah filter atau kriteria pencarian Anda.') 
              : t('purchases.emptyStateDesc', 'Catat setiap pembelanjaan bahan baku Anda untuk melacak mutasi stok secara otomatis dan menganalisis fluktuasi harga.')}
          </p>
          {!searchQuery && filterDate === 'all' && filterSupplier === 'all' && (
            <Button onClick={handleRecordPurchaseClick} className="font-bold">
              <Plus className="w-5 h-5 mr-1" />
              {t('purchases.addFirst', 'Catat Pembelian Pertama')}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {sortedLogs.map(log => {
            const logItems = purchaseItems.filter(item => item.purchaseLogId === log.id);
            const itemsSummary = summarizePurchaseItems(logItems);

            return (
              <div 
                key={log.id}
                onClick={() => navigate(`/purchases/${log.id}`)}
                className="purchase-card bg-surface border border-border p-4.5 rounded-2xl shadow-sm hover:border-brand-soft hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer relative group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">
                      {log.supplierNameSnapshot || t('purchases.noSupplier', 'Tanpa Supplier')}
                    </span>
                    {log.invoiceNumber && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-background border border-border rounded text-text-secondary">
                        {log.invoiceNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary truncate pr-4">
                    {itemsSummary}
                  </p>
                  <div className="flex items-center gap-3.5 text-xs text-text-soft pt-0.5">
                    <span className="flex items-center gap-1 shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-text-soft" />
                      {formatPurchaseDate(log.purchaseDate, lang)}
                    </span>
                    <span className="flex items-center gap-1 shrink-0 uppercase">
                      <Clock className="w-3.5 h-3.5 text-text-soft" />
                      {formatPaymentMethod(log.paymentMethod, lang)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto shrink-0 justify-between sm:justify-end border-t border-border/40 sm:border-t-0 pt-3 sm:pt-0">
                  <div className="sm:text-right">
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">
                      {t('purchases.totalAmount', 'Total')}
                    </span>
                    <span className="text-base font-black text-brand-primary block">
                      Rp {log.totalAmount.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}
                    </span>
                  </div>
                  
                  <div className="p-2 rounded-xl bg-background border border-border group-hover:bg-brand-soft group-hover:text-brand-primary group-hover:border-brand-soft transition-all duration-300">
                    <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-brand-primary transition-colors" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Dialog */}
      <PurchaseFormDialog 
        open={dialogOpen}
        onSave={handleSavePurchase}
        onCancel={() => setDialogOpen(false)}
      />
    </PageContainer>
  );
};
