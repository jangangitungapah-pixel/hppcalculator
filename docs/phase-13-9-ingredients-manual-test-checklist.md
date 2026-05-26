# Phase 13.9 — Ingredients Overhaul Manual Test Checklist

Use this checklist to perform visual QA on a browser or device.

## 1. Empty State Verification
- [ ] Clear localStorage/ingredients and navigate to `/ingredients`.
- [ ] Check if the empty state banner has floating mock chips (Tepung, Gula, Cup).
- [ ] Verify that "Tambah Bahan Pertama" navigates to `/ingredients/new`.
- [ ] Verify that "Muat Contoh Bahan" loads the demo data successfully.

## 2. Stats Dashboard
- [ ] Verify that the stats cards show correct numbers (Total count, unique categories count, average price, data source ratios).
- [ ] Verify hover state micro-animations of stat cards.

## 3. Filters & Search (Toolbar)
- [ ] Type "Tepung" into the search bar and verify that the results only show Tepung.
- [ ] Select category filter "Kemasan" and verify it displays only packaging items.
- [ ] Select source filter "Demo" and verify only demo badge items display.
- [ ] Change sort selector to "Nama A-Z" and verify alphabetic order.
- [ ] Change sort selector to "Harga Termahal" and verify price sequence.

## 4. Layouts
- [ ] Toggle grid view and verify cards display.
- [ ] Toggle list view and verify compact rows display.
- [ ] Shrink screen to 375px (mobile) and verify list rows transform into mobile stacks.

## 5. detail, Edit & Deletion
- [ ] Click an ingredient card to view its detail page.
- [ ] Click edit and make changes, save, and verify it updates.
- [ ] Click delete on an ingredient card and verify that the warning confirm modal opens.
- [ ] Confirm delete and check success toast.
