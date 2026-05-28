import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { InventoryHero } from '../components/inventory/InventoryHero';
import { InventoryStatsGrid } from '../components/inventory/InventoryStatsGrid';
import { InventoryToolbar } from '../components/inventory/InventoryToolbar';
import { InventoryIngredientCard } from '../components/inventory/InventoryIngredientCard';
import { InventoryIngredientListRow } from '../components/inventory/InventoryIngredientListRow';
import { InventoryStatusTabs } from '../components/inventory/InventoryStatusTabs';
import { InventoryEmptyState } from '../components/inventory/InventoryEmptyState';
import { StockMovementDialog } from '../components/inventory/StockMovementDialog';
import { InventorySettingDialog } from '../components/inventory/InventorySettingDialog';
import { StockMovementList } from '../components/inventory/StockMovementList';
import { Button } from '../components/ui/Button';
import { useIngredients } from '../hooks/useIngredients';
import { useInventory } from '../hooks/useInventory';
import { usePurchases } from '../hooks/usePurchases';
import { PurchaseFormDialog } from '../components/purchases/PurchaseFormDialog';
import { useToast } from '../hooks/useToast';

const isThisMonth = (value) => {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

export const InventoryPage = () => {
  const navigate = useNavigate();
  const { ingredients } = useIngredients();
  const {
    inventorySettings,
    stockMovements,
    inventorySnapshots,
    settingsByIngredientId,
    lowStockIngredients,
    outOfStockIngredients,
    getMovementsByIngredientId,
    saveInventorySetting,
    updateInventorySetting,
    saveStockMovement
  } = useInventory();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('name');
  const [viewMode, setViewMode] = React.useState('grid');
  const [movementDialog, setMovementDialog] = React.useState(null);
  const [settingIngredient, setSettingIngredient] = React.useState(null);
  const [historyIngredient, setHistoryIngredient] = React.useState(null);
  const [purchaseIngredient, setPurchaseIngredient] = React.useState(null);

  const { savePurchaseLog } = usePurchases();

  const snapshotsById = new Map(inventorySnapshots.map((snapshot) => [snapshot.ingredientId, snapshot]));
  const trackedCount = inventorySettings.filter((setting) => setting.stockTrackingEnabled).length;
  const monthlyMovementCount = stockMovements.filter((movement) => isThisMonth(movement.movementDate || movement.createdAt)).length;

  const enrichedIngredients = ingredients.map((ingredient) => ({
    ingredient,
    snapshot: snapshotsById.get(ingredient.id) || {
      ingredientId: ingredient.id,
      currentStock: 0,
      stockUnit: ingredient.baseUnit || ingredient.purchaseUnit || 'pcs',
      minimumStock: 0,
      stockStatus: 'not_tracked'
    }
  }));

  const statusCounts = enrichedIngredients.reduce((acc, { snapshot }) => {
    const status = snapshot.stockStatus || 'not_tracked';
    acc.all += 1;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, { all: 0, ok: 0, low: 0, out: 0, not_tracked: 0 });

  const visibleIngredients = enrichedIngredients
    .filter(({ ingredient, snapshot }) => {
      const matchesSearch = (ingredient.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || snapshot.stockStatus === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'lowest') return (a.snapshot.currentStock || 0) - (b.snapshot.currentStock || 0);
      if (sortBy === 'lastMovement') return new Date(b.snapshot.lastMovementAt || 0) - new Date(a.snapshot.lastMovementAt || 0);
      return (a.ingredient.name || '').localeCompare(b.ingredient.name || '');
    });

  const handleSaveSetting = (input) => {
    const existing = settingsByIngredientId.get(input.ingredientId);
    if (existing) updateInventorySetting(input.ingredientId, input);
    else saveInventorySetting(input);
    setSettingIngredient(null);
    addToast({ type: 'success', title: 'Pengaturan stok disimpan.' });
  };

  const handleSaveMovement = (input) => {
    saveStockMovement(input);
    setMovementDialog(null);
    addToast({ type: 'success', title: 'Movement stok disimpan.' });
  };

  const handleSavePurchase = (logData, itemsData) => {
    try {
      savePurchaseLog(logData, itemsData);
      setPurchaseIngredient(null);
      addToast({ type: 'success', title: 'Pembelian berhasil dicatat dan stok diperbarui.' });
    } catch (err) {
      addToast({ type: 'error', title: err.message });
    }
  };

  const openMovement = (ingredient, type) => setMovementDialog({ ingredient, type });

  const historyMovements = historyIngredient
    ? getMovementsByIngredientId(historyIngredient.id).slice().sort((a, b) => new Date(b.movementDate || b.createdAt) - new Date(a.movementDate || a.createdAt))
    : [];

  return (
    <PageContainer>
      <div className="inventory-shell">
        <InventoryHero
          onAddStock={() => setMovementDialog({ ingredient: null, type: 'stock_in' })}
          onAdjustStock={() => setMovementDialog({ ingredient: null, type: 'adjustment' })}
        />

        <InventoryStatsGrid
          trackedCount={trackedCount}
          lowCount={lowStockIngredients.length}
          outCount={outOfStockIngredients.length}
          monthlyMovementCount={monthlyMovementCount}
        />

        {ingredients.length === 0 ? (
          <InventoryEmptyState type="noIngredients" onAddIngredient={() => navigate('/ingredients/new')} />
        ) : (
          <>
            <InventoryToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {trackedCount === 0 && (
              <InventoryEmptyState
                type="noTracking"
                onEnableTracking={() => setSettingIngredient(ingredients[0])}
              />
            )}

            {viewMode === 'tabbed' && (
              <InventoryStatusTabs
                activeStatus={statusFilter}
                onStatusChange={setStatusFilter}
                counts={statusCounts}
              />
            )}

            {visibleIngredients.length > 0 ? (
              viewMode === 'grid' ? (
                <section className="inventory-grid" aria-label="Daftar inventory bahan grid">
                  {visibleIngredients.map(({ ingredient, snapshot }) => (
                    <InventoryIngredientCard
                      key={ingredient.id}
                      ingredient={ingredient}
                      snapshot={snapshot}
                      onAddStock={() => openMovement(ingredient, 'stock_in')}
                      onReduceStock={() => openMovement(ingredient, 'stock_out')}
                      onHistory={() => setHistoryIngredient(ingredient)}
                      onSettings={() => setSettingIngredient(ingredient)}
                      onRecordPurchase={() => setPurchaseIngredient(ingredient)}
                    />
                  ))}
                </section>
              ) : (
                <section className="inventory-list" aria-label={viewMode === 'tabbed' ? 'Daftar inventory bahan dalam tab status' : 'Daftar inventory bahan list'}>
                  {visibleIngredients.map(({ ingredient, snapshot }) => (
                    <InventoryIngredientListRow
                      key={ingredient.id}
                      ingredient={ingredient}
                      snapshot={snapshot}
                      onAddStock={() => openMovement(ingredient, 'stock_in')}
                      onReduceStock={() => openMovement(ingredient, 'stock_out')}
                      onHistory={() => setHistoryIngredient(ingredient)}
                      onSettings={() => setSettingIngredient(ingredient)}
                      onRecordPurchase={() => setPurchaseIngredient(ingredient)}
                    />
                  ))}
                </section>
              )
            ) : (
              <div className="inventory-empty-state">
                <h2>Tidak ada bahan yang cocok</h2>
                <p>Coba ubah kata kunci pencarian atau filter status stok.</p>
              </div>
            )}
          </>
        )}
      </div>

      <StockMovementDialog
        open={Boolean(movementDialog)}
        ingredients={ingredients}
        ingredient={movementDialog?.ingredient}
        initialType={movementDialog?.type}
        onClose={() => setMovementDialog(null)}
        onSubmit={handleSaveMovement}
      />

      <InventorySettingDialog
        open={Boolean(settingIngredient)}
        ingredient={settingIngredient}
        setting={settingIngredient ? settingsByIngredientId.get(settingIngredient.id) : null}
        onClose={() => setSettingIngredient(null)}
        onSubmit={handleSaveSetting}
      />

      {historyIngredient && (
        <div className="inventory-dialog-backdrop" role="dialog" aria-modal="true">
          <div className="inventory-movement-dialog">
            <div className="inventory-dialog-header">
              <div>
                <h2>Riwayat Stok</h2>
                <p>{historyIngredient.name}</p>
              </div>
              <Button variant="ghost" onClick={() => setHistoryIngredient(null)}>Tutup</Button>
            </div>
            <StockMovementList movements={historyMovements} ingredients={ingredients} />
          </div>
        </div>
      )}

      <PurchaseFormDialog
        open={Boolean(purchaseIngredient)}
        preselectedIngredientId={purchaseIngredient?.id}
        onSave={handleSavePurchase}
        onCancel={() => setPurchaseIngredient(null)}
      />
    </PageContainer>
  );
};
