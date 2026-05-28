# Phase 15 - Manual Test Checklist

Use this checklist to manually verify all features of the Supplier & Purchase Log system.

## 1. Suppliers Section
- [ ] Open `/suppliers` page.
- [ ] Check default empty state shows.
- [ ] Add a new supplier using the Dialog.
- [ ] Check phone and email formats.
- [ ] Toggle isFavorite check.
- [ ] Search for the supplier.
- [ ] Toggle sorting from the dropdown (favorites first / A-Z / last transaction).
- [ ] Edit a supplier.
- [ ] Delete a supplier (verify purchase logs referencing them remain unchanged, and display name snapshots).

## 2. Purchase Log Section
- [ ] Open `/purchases` page.
- [ ] Click "Catat Pembelian" to open form.
- [ ] Create a purchase containing 2 items:
  - Item 1: `addToStock: true`, `updateIngredientPrice: true`.
  - Item 2: `addToStock: false`, `updateIngredientPrice: false`.
- [ ] Save the purchase.
- [ ] Verify that a `stock_in` movement is generated under `/inventory` for Item 1 only.
- [ ] Verify that the cost of ingredient is modified for Item 1 only.
- [ ] Try creating a purchase with incompatible unit: check warning toast "Satuan pembelian berbeda dan belum bisa dikonversi otomatis".

## 3. Detail Views & Quick Actions
- [ ] Open `/ingredients/:id` details: verify "Riwayat Pembelian" is listed with last prices and average purchase indicators.
- [ ] Click "Catat Pembelian Bahan Ini" from detail: verifies dialog is opened with ingredient preselected.
- [ ] Open `/inventory` list/grid: click quick action "Beli" (ShoppingBag icon) and verify preselected purchase form triggers.

## 4. Backups, Portability & Cloud Sync
- [ ] Open `/data-backup`: click Export JSON. Verify output file contains `suppliers`, `purchaseLogs`, and `purchaseItems`.
- [ ] Click reset data for `suppliers` or reset all. Verify database clears correctly.
- [ ] Restore/Import the exported backup. Verify all suppliers, logs, and items are fully restored.
- [ ] Toggle Guest vs User accounts: verify data scopes do not leak.
- [ ] Verify cloud sync maps are correctly registered.
