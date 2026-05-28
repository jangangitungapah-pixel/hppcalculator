import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useSuppliers } from '../hooks/useSuppliers';
import { usePurchases } from '../hooks/usePurchases';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { SupplierFormDialog } from '../components/suppliers/SupplierFormDialog';
import { useToast } from '../hooks/useToast';
import { 
  Users, 
  Star, 
  TrendingUp, 
  ShoppingBag, 
  Search, 
  Plus, 
  Phone, 
  MapPin, 
  Clock, 
  DollarSign, 
  Edit3, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { formatSupplierType, formatPurchaseAmount, formatPurchaseDate } from '../lib/suppliers';
import { getTopSuppliersBySpend } from '../lib/suppliers/supplierInsights';

export const SuppliersPage = () => {
  const { t, lang } = useLanguage();
  const { suppliers, saveSupplier, updateSupplier, deleteSupplier, getSupplierPurchaseSummary } = useSuppliers();
  const { purchaseLogs } = usePurchases();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('favorit');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Compute stats
  const totalSuppliers = suppliers.length;
  const favoriteCount = suppliers.filter(s => s.isFavorite).length;

  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const totalBelanjaBulanIni = purchaseLogs
    .filter(log => log.purchaseDate && log.purchaseDate.startsWith(currentMonthStr))
    .reduce((sum, log) => sum + (Number(log.totalAmount) || 0), 0);

  // Find most used supplier
  const supplierCounts = {};
  purchaseLogs.forEach(log => {
    if (log.supplierId) {
      supplierCounts[log.supplierId] = (supplierCounts[log.supplierId] || 0) + 1;
    }
  });
  let mostUsedSupplierId = null;
  let maxCount = 0;
  Object.entries(supplierCounts).forEach(([sid, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostUsedSupplierId = sid;
    }
  });
  const mostUsedSupplier = suppliers.find(s => s.id === mostUsedSupplierId);

  // Action triggers
  const handleAddSupplierClick = () => {
    setSelectedSupplier(null);
    setDialogOpen(true);
  };

  const handleEditSupplierClick = (supplier) => {
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  };

  const handleSaveSupplier = (data) => {
    try {
      saveSupplier(data);
      setDialogOpen(false);
      addToast({
        title: t('suppliers.savedTitle', 'Supplier Tersimpan'),
        message: t('suppliers.savedMessage', 'Data supplier berhasil disimpan.'),
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

  const handleDeleteSupplier = (id) => {
    if (window.confirm(t('suppliers.confirmDelete', 'Apakah Anda yakin ingin menghapus supplier ini? Histori log pembelian tidak akan terhapus.'))) {
      try {
        deleteSupplier(id);
        setDialogOpen(false);
        addToast({
          title: t('suppliers.deletedTitle', 'Supplier Dihapus'),
          message: t('suppliers.deletedMessage', 'Supplier berhasil dihapus.'),
          type: 'success'
        });
      } catch (err) {
        addToast({
          title: 'Error',
          message: err.message,
          type: 'error'
        });
      }
    }
  };

  const handleToggleFavorite = (supplier) => {
    try {
      updateSupplier(supplier.id, { isFavorite: !supplier.isFavorite });
      addToast({
        title: supplier.isFavorite ? t('suppliers.removedFavorite', 'Dihapus dari Favorit') : t('suppliers.addedFavorite', 'Ditambahkan ke Favorit'),
        message: `${supplier.name} ${supplier.isFavorite ? 'dikeluarkan dari' : 'ditambahkan ke'} daftar favorit.`,
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

  // Filter & Sort logic
  const filteredSuppliers = suppliers.filter(s => {
    const nameMatch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      (s.contactName && s.contactName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      (s.phone && s.phone.includes(searchQuery)) ||
                      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const typeMatch = filterType === 'all' || s.type === filterType;
    return nameMatch && typeMatch;
  });

  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    if (sortBy === 'favorit') {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'nama') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'terakhir_transaksi') {
      const sumA = getSupplierPurchaseSummary(a.id);
      const sumB = getSupplierPurchaseSummary(b.id);
      const dateA = sumA.lastPurchaseDate || '';
      const dateB = sumB.lastPurchaseDate || '';
      return dateB.localeCompare(dateA);
    }
    return 0;
  });

  const typeOptions = [
    { value: 'all', label: t('suppliers.allTypes', 'Semua Kategori') },
    { value: 'market', label: t('suppliers.typeMarket', 'Pasar') },
    { value: 'grocery', label: t('suppliers.typeGrocery', 'Toko Kelontong') },
    { value: 'distributor', label: t('suppliers.typeDistributor', 'Distributor') },
    { value: 'online', label: t('suppliers.typeOnline', 'Toko Online') },
    { value: 'farmer', label: t('suppliers.typeFarmer', 'Petani') },
    { value: 'other', label: t('suppliers.typeOther', 'Lainnya') }
  ];

  const sortOptions = [
    { value: 'favorit', label: t('suppliers.sortFavorite', 'Favorit Pertama') },
    { value: 'nama', label: t('suppliers.sortName', 'Nama A-Z') },
    { value: 'terakhir_transaksi', label: t('suppliers.sortLastTx', 'Transaksi Terakhir') }
  ];

  return (
    <PageContainer maxWidth="max-w-6xl" className="suppliers-shell pb-10">
      {/* Hero */}
      <section className="app-page-hero suppliers-hero mb-6">
        <div className="app-page-hero-main">
          <div className="app-page-eyebrow flex items-center gap-1">
            <Users className="w-4 h-4 text-brand-primary" />
            Supplier
          </div>
          <h2 className="app-page-title">
            {t('suppliers.pageTitle', 'Kelola Supplier')}
          </h2>
          <p className="app-page-subtitle">
            {t('suppliers.pageSubtitle', 'Simpan daftar tempat pembelian bahan dan pantau riwayat belanja bisnismu.')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleAddSupplierClick} className="font-bold flex items-center gap-1.5 shadow-sm">
            <Plus className="w-5 h-5" />
            {t('suppliers.addNew', 'Tambah Supplier')}
          </Button>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 suppliers-stats-grid">
        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-3 bg-brand-soft rounded-xl text-brand-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary">{t('suppliers.statTotal', 'Total Supplier')}</p>
            <p className="text-lg font-bold text-text-primary mt-0.5">{totalSuppliers}</p>
          </div>
        </div>

        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <Star className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary">{t('suppliers.statFavorite', 'Supplier Favorit')}</p>
            <p className="text-lg font-bold text-text-primary mt-0.5">{favoriteCount}</p>
          </div>
        </div>

        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary">{t('suppliers.statSpendMonth', 'Belanja Bulan Ini')}</p>
            <p className="text-base font-bold text-text-primary mt-0.5">Rp {totalBelanjaBulanIni.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}</p>
          </div>
        </div>

        <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-text-secondary">{t('suppliers.statMostUsed', 'Paling Sering Dipakai')}</p>
            <p className="text-sm font-bold text-text-primary mt-0.5 truncate max-w-[150px]">
              {mostUsedSupplier ? mostUsedSupplier.name : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center suppliers-toolbar">
        <div className="relative w-full md:max-w-md">
          <Input 
            placeholder={t('suppliers.searchPlaceholder', 'Cari nama, kontak, telepon, atau alamat...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            containerClassName="w-full"
            prefix={<Search className="w-4 h-4 text-text-soft" />}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
          <div className="w-full sm:w-48">
            <Select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={typeOptions}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
            />
          </div>
        </div>
      </div>

      {/* Suppliers Listing */}
      {sortedSuppliers.length === 0 ? (
        <div className="bg-surface border border-border p-8 rounded-3xl text-center shadow-sm flex flex-col items-center justify-center min-h-[300px] supplier-empty-state">
          <div className="p-4 bg-brand-soft rounded-2xl text-brand-primary mb-4 animate-bounce-slow">
            <Users className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-1">
            {searchQuery || filterType !== 'all' ? t('suppliers.noResultsTitle', 'Tidak Ada Hasil Cocok') : t('suppliers.emptyStateTitle', 'Belum Ada Supplier')}
          </h3>
          <p className="text-sm text-text-secondary max-w-sm mb-6">
            {searchQuery || filterType !== 'all' 
              ? t('suppliers.noResultsDesc', 'Coba ubah kata kunci pencarian atau filter kategori Anda.') 
              : t('suppliers.emptyStateDesc', 'Catat daftar supplier tempat Anda belanja bahan untuk memudahkan input pembelian dan monitoring pengeluaran.')}
          </p>
          {!searchQuery && filterType === 'all' && (
            <Button onClick={handleAddSupplierClick} className="font-bold">
              <Plus className="w-5 h-5 mr-1" />
              {t('suppliers.addFirst', 'Tambah Supplier Pertama')}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 suppliers-grid">
          {sortedSuppliers.map(s => {
            const summary = getSupplierPurchaseSummary(s.id);
            return (
              <div 
                key={s.id}
                className="supplier-card bg-surface border border-border p-5 rounded-2xl shadow-sm hover:border-brand-soft hover:shadow-md transition-all duration-300 relative flex flex-col"
              >
                {/* Favorite Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleToggleFavorite(s)}
                  className="absolute right-4 top-4 text-text-soft hover:text-amber-500 transition-colors duration-200"
                  aria-label={s.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star className={`w-5 h-5 ${s.isFavorite ? 'fill-amber-500 text-amber-500' : 'text-text-muted'}`} />
                </button>

                <div className="mb-4 pr-6">
                  <span className="inline-block text-xs font-bold px-2 py-0.5 bg-background border border-border rounded-full text-text-secondary uppercase mb-2">
                    {formatSupplierType(s.type, lang)}
                  </span>
                  <h4 className="text-base font-bold text-text-primary truncate">
                    {s.name}
                  </h4>
                  {s.contactName && (
                    <p className="text-xs text-text-secondary mt-0.5">
                      U.p. {s.contactName}
                    </p>
                  )}
                </div>

                <div className="space-y-2.5 text-xs text-text-secondary border-t border-b border-border py-4 mb-4 flex-1">
                  {s.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-text-soft shrink-0" />
                      <span className="truncate">{s.phone}</span>
                    </div>
                  )}
                  {s.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-text-soft shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{s.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-text-soft shrink-0" />
                    <span>
                      {t('suppliers.lastTx', 'Terakhir:')} {summary.lastPurchaseDate ? formatPurchaseDate(summary.lastPurchaseDate, lang) : t('suppliers.noTransaction', 'Belum ada transaksi')}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">
                      {t('suppliers.totalBelanja', 'Total Belanja')}
                    </span>
                    <span className="text-sm font-black text-brand-primary">
                      Rp {summary.totalSpend.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">
                      {t('suppliers.trxCount', 'Transaksi')}
                    </span>
                    <span className="text-sm font-bold text-text-primary">
                      {summary.purchaseCount}x
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border/40 shrink-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 text-xs text-text-secondary hover:text-text-primary"
                    onClick={() => handleEditSupplierClick(s)}
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1" />
                    {t('common.edit', 'Edit')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Dialog */}
      <SupplierFormDialog 
        open={dialogOpen}
        supplier={selectedSupplier}
        onSave={handleSaveSupplier}
        onCancel={() => setDialogOpen(false)}
        onDelete={handleDeleteSupplier}
      />
    </PageContainer>
  );
};
