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
  Search, 
  Plus, 
  Phone, 
  MapPin, 
  Clock, 
  DollarSign, 
  Edit3, 
  MessageCircle,
  Mail,
  Map,
  ShoppingBag
} from 'lucide-react';
import { formatSupplierType, formatPurchaseDate } from '../lib/suppliers';

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

  // Initials generator
  const getInitials = (name) => {
    if (!name) return '?';
    const cleanName = name.replace(/^(toko|tb|cv|pt|pd|warung|cafe|restaurant|resto)\s+/i, '');
    const parts = cleanName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return cleanName.slice(0, 2).toUpperCase();
  };

  const getAvatarColorClass = (type) => {
    switch (type) {
      case 'market': return 'bg-red-100 text-red-700 border-red-200';
      case 'grocery': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'distributor': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'online': return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'farmer': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPillColorClass = (type) => {
    switch (type) {
      case 'market': return 'pill-market';
      case 'grocery': return 'pill-grocery';
      case 'distributor': return 'pill-distributor';
      case 'online': return 'pill-online';
      case 'farmer': return 'pill-farmer';
      default: return 'pill-other';
    }
  };

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
        title: t('suppliers.savedTitle'),
        message: t('suppliers.savedMessage'),
        type: 'success'
      });
    } catch (err) {
      addToast({
        title: t('toasts.errorTitle'),
        message: err.message,
        type: 'error'
      });
    }
  };

  const handleDeleteSupplier = (id) => {
    if (window.confirm(t('suppliers.confirmDelete'))) {
      try {
        deleteSupplier(id);
        setDialogOpen(false);
        addToast({
          title: t('suppliers.deletedTitle'),
          message: t('suppliers.deletedMessage'),
          type: 'success'
        });
      } catch (err) {
        addToast({
          title: t('toasts.errorTitle'),
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
        title: supplier.isFavorite ? t('suppliers.removedFavorite') : t('suppliers.addedFavorite'),
        message: `${supplier.name} ${supplier.isFavorite ? t('suppliers.removedFavorite').toLowerCase() : t('suppliers.addedFavorite').toLowerCase()}`,
        type: 'success'
      });
    } catch (err) {
      addToast({
        title: t('toasts.errorTitle'),
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
    { value: 'all', label: t('suppliers.allTypes') },
    { value: 'market', label: t('suppliers.typeMarket') },
    { value: 'grocery', label: t('suppliers.typeGrocery') },
    { value: 'distributor', label: t('suppliers.typeDistributor') },
    { value: 'online', label: t('suppliers.typeOnline') },
    { value: 'farmer', label: t('suppliers.typeFarmer') },
    { value: 'other', label: t('suppliers.typeOther') }
  ];

  const sortOptions = [
    { value: 'favorit', label: t('suppliers.sortFavorite') },
    { value: 'nama', label: t('suppliers.sortName') },
    { value: 'terakhir_transaksi', label: t('suppliers.sortLastTx') }
  ];

  return (
    <PageContainer maxWidth="max-w-6xl" className="suppliers-shell pb-10">
      {/* Hero */}
      <section className="app-page-hero suppliers-hero mb-8">
        <div className="app-page-hero-main">
          <div className="app-page-eyebrow flex items-center gap-1.5 text-brand-primary">
            <div className="p-1 bg-brand-soft rounded-lg">
              <Users className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-[11px] uppercase tracking-wider">{t('nav.suppliers', 'Supplier')}</span>
          </div>
          <h2 className="app-page-title text-3xl font-black tracking-tight text-text-primary mt-2">
            {t('suppliers.pageTitle')}
          </h2>
          <p className="app-page-subtitle text-sm text-text-secondary mt-1">
            {t('suppliers.pageSubtitle')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            onClick={handleAddSupplierClick} 
            className="font-bold flex items-center gap-2 shadow-glow-primary hover:shadow-soft-glow scale-102 hover:scale-105 active:scale-98 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            {t('suppliers.addNew')}
          </Button>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 suppliers-stats-grid">
        <div className="suppliers-stat-card stat-card-total">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">{t('suppliers.statTotal')}</p>
              <p className="text-xl font-black text-text-primary mt-0.5">{totalSuppliers}</p>
            </div>
          </div>
        </div>

        <div className="suppliers-stat-card stat-card-favorite">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">{t('suppliers.statFavorite')}</p>
              <p className="text-xl font-black text-text-primary mt-0.5">{favoriteCount}</p>
            </div>
          </div>
        </div>

        <div className="suppliers-stat-card stat-card-spend">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">{t('suppliers.statSpendMonth')}</p>
              <p className="text-base font-black text-text-primary mt-0.5 truncate max-w-[150px]">
                Rp {totalBelanjaBulanIni.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}
              </p>
            </div>
          </div>
        </div>

        <div className="suppliers-stat-card stat-card-most">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">{t('suppliers.statMostUsed')}</p>
              <p className="text-sm font-black text-text-primary mt-0.5 truncate max-w-[150px]" title={mostUsedSupplier?.name || '-'}>
                {mostUsedSupplier ? mostUsedSupplier.name : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="backdrop-blur-md bg-white/70 border border-border p-4 rounded-2xl shadow-xs mb-8 flex flex-col md:flex-row gap-4 justify-between items-center suppliers-toolbar">
        <div className="relative w-full md:max-w-md">
          <Input 
            placeholder={t('suppliers.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 supplier-a11y-focus"
            containerClassName="w-full"
            prefix={<Search className="w-4 h-4 text-text-muted" />}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
          <div className="w-full sm:w-48">
            <Select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={typeOptions}
              className="supplier-a11y-focus"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
              className="supplier-a11y-focus"
            />
          </div>
        </div>
      </div>

      {/* Suppliers Listing */}
      {sortedSuppliers.length === 0 ? (
        <div className="bg-surface/50 border border-border p-12 rounded-3xl text-center shadow-xs flex flex-col items-center justify-center min-h-[350px] supplier-empty-state">
          <div className="p-5 bg-brand-soft rounded-2xl text-brand-primary mb-5 animate-pulse">
            <Users className="w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            {searchQuery || filterType !== 'all' ? t('suppliers.noResultsTitle') : t('suppliers.emptyStateTitle')}
          </h3>
          <p className="text-sm text-text-secondary max-w-md mb-8 leading-relaxed">
            {searchQuery || filterType !== 'all' 
              ? t('suppliers.noResultsDesc') 
              : t('suppliers.emptyStateDesc')}
          </p>
          {!searchQuery && filterType === 'all' && (
            <Button onClick={handleAddSupplierClick} className="font-bold scale-102 hover:scale-105 transition-all duration-200">
              <Plus className="w-5 h-5 mr-1.5" />
              {t('suppliers.addFirst')}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 suppliers-grid">
          {sortedSuppliers.map(s => {
            const summary = getSupplierPurchaseSummary(s.id);
            const initials = getInitials(s.name);
            const avatarColorClass = getAvatarColorClass(s.type);
            const pillColorClass = getPillColorClass(s.type);
            const isWhatsapp = s.phone && (s.phone.startsWith('08') || s.phone.startsWith('+62'));

            return (
              <div 
                key={s.id}
                className={`supplier-card p-5 rounded-2xl flex flex-col relative ${s.isFavorite ? 'is-favorite-highlight' : ''}`}
              >
                {/* Favorite Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleToggleFavorite(s)}
                  className="absolute right-4 top-4 text-text-muted hover:text-amber-500 hover:scale-110 active:scale-90 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-amber-500 p-1.5 rounded-full bg-white/80 border border-border/20 shadow-xs z-10"
                  aria-label={s.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star className={`w-4 h-4 ${s.isFavorite ? 'fill-amber-500 text-amber-500' : 'text-text-muted'}`} />
                </button>

                {/* Card Header (Initials Avatar + Name & Category) */}
                <div className="flex items-start gap-4 mb-4 pr-6">
                  <div className={`supplier-avatar shrink-0 border ${avatarColorClass}`}>
                    {initials}
                  </div>
                  <div className="overflow-hidden">
                    <span className={`category-pill ${pillColorClass} mb-1.5`}>
                      {formatSupplierType(s.type, lang)}
                    </span>
                    <h4 className="text-base font-extrabold text-text-primary truncate" title={s.name}>
                      {s.name}
                    </h4>
                    {s.contactName && (
                      <p className="text-xs font-medium text-text-secondary mt-0.5 truncate">
                        U.p. {s.contactName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Rows */}
                <div className="space-y-2 text-xs text-text-secondary border-t border-border/50 pt-4 pb-4 mb-4 flex-1">
                  {s.phone && (
                    <div className="supplier-link-item flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <Phone className="w-3.5 h-3.5 text-text-muted shrink-0" />
                        <a href={`tel:${s.phone}`} className="truncate font-semibold transition-colors duration-150">
                          {s.phone}
                        </a>
                      </div>
                      {isWhatsapp && (
                        <a 
                          href={`https://wa.me/${s.phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-emerald-500 ml-2"
                          title="Hubungi via WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                  {s.email && (
                    <div className="supplier-link-item flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <a href={`mailto:${s.email}`} className="truncate font-semibold transition-colors duration-150">
                        {s.email}
                      </a>
                    </div>
                  )}
                  {s.address && (
                    <div className="supplier-link-item flex items-start justify-between gap-1">
                      <div className="flex items-start gap-2 truncate">
                        <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5" />
                        <span className="line-clamp-2" title={s.address}>{s.address}</span>
                      </div>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1 text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-sky-500 ml-1 mt-0.5 shrink-0"
                        title="Buka di Google Maps"
                      >
                        <Map className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span className="text-[11px]">
                      {t('suppliers.lastTx')} <strong className="text-text-primary">{summary.lastPurchaseDate ? formatPurchaseDate(summary.lastPurchaseDate, lang) : t('suppliers.noTransaction')}</strong>
                    </span>
                  </div>
                </div>

                {/* Metrics Tiles Panel */}
                <div className="supplier-metrics-board mb-5 shadow-xs border border-border/40">
                  <div className="supplier-metric-tile flex flex-col">
                    <span className="text-[9px] text-text-muted font-extrabold uppercase tracking-wider block">
                      {t('suppliers.totalBelanja')}
                    </span>
                    <span className="text-sm font-black text-brand-primary mt-0.5">
                      Rp {summary.totalSpend.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}
                    </span>
                  </div>
                  <div className="supplier-metric-tile flex flex-col border-l border-border-soft">
                    <span className="text-[9px] text-text-muted font-extrabold uppercase tracking-wider block">
                      {t('suppliers.trxCount')}
                    </span>
                    <span className="text-sm font-black text-text-primary mt-0.5">
                      {summary.purchaseCount}x
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex gap-2 pt-3 border-t border-border/40 shrink-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 text-xs text-text-secondary hover:text-brand-primary hover:bg-brand-soft font-bold rounded-xl transition-all duration-150"
                    onClick={() => handleEditSupplierClick(s)}
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                    {t('common.edit')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Side-Drawer Dialog */}
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
