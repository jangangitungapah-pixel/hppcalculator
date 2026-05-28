import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Calendar, Store, Info, Plus, Minus, History } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../hooks/useLanguage';
import { useIngredients } from '../hooks/useIngredients';
import { useAppData } from '../hooks/useAppData';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import { IngredientCategoryPill } from '../components/ingredients/IngredientCategoryPill';
import { InventoryStatusBadge } from '../components/inventory/InventoryStatusBadge';
import { InventorySettingDialog } from '../components/inventory/InventorySettingDialog';
import { StockMovementDialog } from '../components/inventory/StockMovementDialog';
import { StockMovementList } from '../components/inventory/StockMovementList';
import { useInventory } from '../hooks/useInventory';
import { usePurchases } from '../hooks/usePurchases';
import { PurchaseFormDialog } from '../components/purchases/PurchaseFormDialog';
import { formatStockQuantity } from '../lib/inventory';
import { 
  formatIngredientPurchasePrice, 
  formatIngredientUsagePrice,
  formatIngredientUnitInfo 
} from '../lib/ingredients/ingredientFormatters';

export const IngredientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { settings } = useAppData();
  const { getIngredientById, deleteIngredient } = useIngredients();
  const {
    settingsByIngredientId,
    getSnapshotByIngredientId,
    getMovementsByIngredientId,
    saveInventorySetting,
    updateInventorySetting,
    saveStockMovement
  } = useInventory();
  const { addToast } = useToast();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [showSettingDialog, setShowSettingDialog] = React.useState(false);
  const [movementType, setMovementType] = React.useState(null);
  const [showHistory, setShowHistory] = React.useState(false);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = React.useState(false);

  const { purchaseItems, purchaseLogs, savePurchaseLog } = usePurchases();
  const ingredient = getIngredientById(id);
  const inventorySetting = settingsByIngredientId.get(id);
  const inventorySnapshot = getSnapshotByIngredientId(id);
  const isStockTracked = inventorySnapshot?.stockStatus && inventorySnapshot.stockStatus !== 'not_tracked';

  if (!ingredient) {
    return (
      <PageContainer maxWidth="max-w-2xl">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-bold mb-2">Bahan Tidak Ditemukan</h2>
          <p className="text-text-secondary mb-6">Bahan ini mungkin sudah dihapus.</p>
          <Button onClick={() => navigate('/ingredients')}>Kembali ke Daftar Bahan</Button>
        </div>
      </PageContainer>
    );
  }

  const handleDelete = () => {
    deleteIngredient(id);
    addToast({ type: 'success', title: t('ingredients.deletedToastTitle') });
    navigate('/ingredients');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const handleSaveInventorySetting = (input) => {
    if (inventorySetting) updateInventorySetting(id, input);
    else saveInventorySetting(input);
    setShowSettingDialog(false);
    addToast({ type: 'success', title: 'Pengaturan stok disimpan.' });
  };

  const handleSaveStockMovement = (input) => {
    saveStockMovement(input);
    setMovementType(null);
    addToast({ type: 'success', title: 'Movement stok disimpan.' });
  };

  const handleSavePurchase = (logData, itemsData) => {
    try {
      savePurchaseLog(logData, itemsData);
      setPurchaseDialogOpen(false);
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

  const ingredientItems = purchaseItems.filter(item => item.ingredientId === id);
  const logMap = new Map(purchaseLogs.map(l => [l.id, l]));
  const purchaseHistory = ingredientItems.map(item => {
    const log = logMap.get(item.purchaseLogId);
    return {
      ...item,
      supplierName: log ? log.supplierNameSnapshot : 'Tanpa Supplier',
      purchaseDate: log ? log.purchaseDate : '',
      dateFormatted: log ? new Date(log.purchaseDate).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
    };
  }).sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate) || b.createdAt.localeCompare(a.createdAt));

  return (
    <PageContainer maxWidth="max-w-2xl" className="py-4 sm:py-5">
      {/* Top Header & Actions */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/ingredients')}
            aria-label="Kembali ke Daftar Bahan"
            className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-cream border border-border-soft hover:border-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight line-clamp-1">Detail Bahan</h2>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button 
            variant="secondary" 
            onClick={() => navigate(`/ingredients/${id}/edit`)} 
            className="h-10 px-4 border border-border/80 bg-surface-cream text-text-secondary hover:bg-border/20 rounded-xl text-xs sm:text-sm font-bold transition-all"
          >
            <Edit2 className="w-4 h-4 sm:mr-1.5 shrink-0" />
            <span className="hidden sm:inline">{t('ingredients.editIngredient')}</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setShowDeleteConfirm(true)} 
            className="h-10 px-4 bg-red-500/10 hover:bg-red-500/15 text-red-700 border border-red-500/10 rounded-xl text-xs sm:text-sm font-bold transition-all"
          >
            <Trash2 className="w-4 h-4 sm:mr-1.5 shrink-0" />
            <span className="hidden sm:inline">{t('common.delete')}</span>
          </Button>
        </div>
      </div>

      {/* Stock Section */}
      <section className="inventory-card mb-6">
        <div className="inventory-card-header">
          <div>
            <h3>Stok Bahan</h3>
            <span>{isStockTracked ? 'Tracking stok aktif' : 'Pantau stok bahan ini agar kamu tahu kapan perlu restock.'}</span>
          </div>
          <InventoryStatusBadge status={inventorySnapshot?.stockStatus} />
        </div>

        <div className="inventory-stock-block">
          <span className="inventory-stock-label">Stok saat ini</span>
          <strong className="inventory-stock-number">
            {isStockTracked
              ? formatStockQuantity(inventorySnapshot.currentStock, inventorySnapshot.stockUnit)
              : 'Belum dipantau'}
          </strong>
        </div>

        <div className="inventory-card-meta">
          <span>Minimum: {isStockTracked ? formatStockQuantity(inventorySnapshot.minimumStock, inventorySnapshot.stockUnit) : '-'}</span>
          <span>Unit: {inventorySnapshot?.stockUnit || ingredient.baseUnit || ingredient.purchaseUnit || '-'}</span>
        </div>

        <div className="inventory-card-actions">
          <Button variant="secondary" size="sm" onClick={() => setShowSettingDialog(true)}>
            {isStockTracked ? 'Atur Minimum' : 'Aktifkan Tracking'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setMovementType('stock_in')}>
            <Plus className="w-4 h-4" /> Tambah Stok
          </Button>
          <Button variant="outline" size="sm" onClick={() => setMovementType('stock_out')}>
            <Minus className="w-4 h-4" /> Kurangi Stok
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowHistory((value) => !value)}>
            <History className="w-4 h-4" /> Lihat Riwayat
          </Button>
        </div>

        {showHistory && (
          <div className="mt-4">
            <StockMovementList movements={getMovementsByIngredientId(id)} ingredients={[ingredient]} />
          </div>
        )}
      </section>

      {/* Main Details Card */}
      <div className="bg-surface border border-border/80 rounded-3xl shadow-xs overflow-hidden mb-6">
        <div className="p-6 sm:p-8">
          {/* Header Info */}
          <div className="flex justify-between items-start gap-3 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-text-primary mb-2 tracking-tight leading-tight">{ingredient.name}</h2>
              <div className="flex items-center gap-2.5 flex-wrap text-sm text-text-secondary">
                <IngredientCategoryPill category={ingredient.category} />
                {ingredient.source === 'demo' && (
                  <span className="bg-blue-500/10 text-blue-700 border border-blue-500/10 px-2.5 py-0.5 rounded-full font-extrabold uppercase text-[10px] tracking-wider">
                    Demo
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cost Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-sky-500/5 p-4.5 rounded-2xl border border-sky-500/10 text-sky-900">
              <p className="text-[10px] text-sky-700 font-extrabold uppercase tracking-wider mb-1">Harga Beli</p>
              <p className="text-xl sm:text-2xl font-black tabular-nums">
                {formatIngredientPurchasePrice(ingredient, lang, settings.currency)}
              </p>
              <p className="text-[11px] text-sky-700/80 mt-2 border-t border-sky-500/10 pt-2 font-semibold">
                Pembelian dasar dari supplier/pasar.
              </p>
            </div>
            
            <div className="bg-orange-500/5 p-4.5 rounded-2xl border border-orange-500/10 text-orange-900">
              <p className="text-[10px] text-brand-primary font-extrabold uppercase tracking-wider mb-1">Harga Satuan Pakai</p>
              <p className="text-xl sm:text-2xl font-black tabular-nums">
                {formatIngredientUsagePrice(ingredient, lang, settings.currency)}
              </p>
              {ingredient.purchaseUnit !== ingredient.baseUnit ? (
                <p className="text-[11px] text-brand-primary/80 mt-2 border-t border-orange-500/10 pt-2 font-semibold">
                  Konversi: {formatIngredientUnitInfo(ingredient)}
                </p>
              ) : (
                <p className="text-[11px] text-brand-primary/80 mt-2 border-t border-orange-500/10 pt-2 font-semibold">
                  Satuan beli sama dengan satuan pakai.
                </p>
              )}
            </div>
          </div>

          {/* Supplier & Notes Details */}
          <div className="space-y-3.5">
            {ingredient.supplier && (
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface-cream border border-border-soft">
                <Store className="w-5 h-5 text-text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-0.5">Supplier / Toko</p>
                  <p className="text-sm font-bold text-text-primary">{ingredient.supplier}</p>
                </div>
              </div>
            )}
            
            {ingredient.notes && (
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface-cream border border-border-soft">
                <Info className="w-5 h-5 text-text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-0.5">Catatan</p>
                  <p className="text-sm font-semibold text-text-secondary leading-relaxed">{ingredient.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Metadata */}
        <div className="bg-surface-cream px-6 py-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-text-secondary">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-text-soft" />
            <span>Dibuat: {formatDate(ingredient.createdAt)}</span>
          </div>
          <span className="px-2.5 py-0.5 bg-surface rounded-md border border-border-soft">v{ingredient.version}</span>
        </div>
      </div>

      {/* Riwayat Pembelian Section */}
      <section className="bg-surface border border-border/80 rounded-3xl shadow-xs overflow-hidden mb-6 p-6 sm:p-8">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
          <h3 className="text-base font-bold text-text-primary">Riwayat Pembelian</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setPurchaseDialogOpen(true)}
            className="text-xs text-brand-primary font-bold p-0 h-auto"
          >
            Catat Pembelian Baru
          </Button>
        </div>

        {purchaseHistory.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-text-secondary mb-3">Belum ada riwayat pembelian untuk bahan ini.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPurchaseDialogOpen(true)}
            >
              Catat Pembelian Pertama
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {purchaseHistory.map(item => (
              <div 
                key={item.id} 
                className="p-3 bg-background border border-border rounded-xl flex justify-between items-center text-xs cursor-pointer hover:border-brand-soft transition-colors"
                onClick={() => navigate(`/purchases/${item.purchaseLogId}`)}
              >
                <div>
                  <p className="font-bold text-text-primary">{item.supplierName || 'Tanpa Supplier'}</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">
                    {item.quantity} {item.unit} @ Rp {item.unitPrice.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US', { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-brand-primary">Rp {item.totalPrice.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}</p>
                  <p className="text-[9px] text-text-soft mt-0.5">{item.dateFormatted}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={t('ingredients.deleteConfirmTitle')}
        description={t('ingredients.deleteConfirmBody')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
      />

      <InventorySettingDialog
        open={showSettingDialog}
        ingredient={ingredient}
        setting={inventorySetting}
        onClose={() => setShowSettingDialog(false)}
        onSubmit={handleSaveInventorySetting}
      />

      <StockMovementDialog
        open={Boolean(movementType)}
        ingredient={ingredient}
        ingredients={[ingredient]}
        initialType={movementType || 'stock_in'}
        onClose={() => setMovementType(null)}
        onSubmit={handleSaveStockMovement}
      />

      <PurchaseFormDialog 
        open={purchaseDialogOpen}
        preselectedIngredientId={id}
        onSave={handleSavePurchase}
        onCancel={() => setPurchaseDialogOpen(false)}
      />
    </PageContainer>
  );
};

