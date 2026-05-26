# Manual Testing Checklist - Phase 13.7: Centralized Demo Data System

Follow these steps to manually verify the correctness of the centralized demo data seeding, dependency checking, and scoped deletion.

---

## 1. Dashboard Demo Seeding
- [ ] Clear localStorage or log in as a fresh guest user.
- [ ] Access the **Dashboard**. Verify it displays the empty state with the "Coba Data Demo" button.
- [ ] Click the button.
- [ ] Verify:
  - [ ] A success toast ("Data contoh berhasil dimuat") is shown.
  - [ ] The dashboard transitions to the populated state (calculations, margin averages, business pulse metrics are visible).
  - [ ] Go to **Bahan Baku**, **Resep**, **Produk**, and **Harga per Channel**. Verify demo items are populated correctly.

---

## 2. Dependency Warnings (Recipes Page)
- [ ] Reset all data (via Settings or by clearing browser storage).
- [ ] Go to **Bahan Baku** (empty) and **Resep** (empty).
- [ ] On the **Resep** page:
  - [ ] Verify the warning card is displayed: "Bahan Baku Kosong: Resep demo membutuhkan data bahan baku agar HPP terhitung dengan benar..."
  - [ ] Click the "Muat Resep Demo" button.
  - [ ] Verify a confirmation dialog appears prompting to load the entire business library.
  - [ ] Click **Konfirmasi**.
  - [ ] Verify both ingredients and recipes (and products) are successfully loaded, and HPP counts are fully calculated.

---

## 3. Dependency Warnings (Products Page)
- [ ] Reset all data.
- [ ] Go to **Produk & Menu** (empty).
- [ ] On the **Produk** page:
  - [ ] Verify the warning card is displayed: "Resep Kosong: Produk demo membutuhkan data resep agar HPP terhitung dengan benar..."
  - [ ] Click the "Load Demo" button.
  - [ ] Verify a confirmation dialog appears prompting to load the entire business library.
  - [ ] Click **Konfirmasi**.
  - [ ] Verify the complete workspace loads successfully.

---

## 4. Scoped Cleanup (Bersihkan Data Demo)
- [ ] Go to **Bahan Baku**, add a new custom ingredient:
  - Name: `Tepung Mandiri`
  - Purchase Price: `20000`
  - Base Unit: `kg`
- [ ] Verify `Tepung Mandiri` appears next to the demo ingredients.
- [ ] Go to **Data & Backup** (or settings navigating there).
- [ ] Verify the **Bersihkan Data Demo** panel is visible because demo data is present.
- [ ] Click **Bersihkan Data Demo**.
- [ ] Confirm the prompt.
- [ ] Verify:
  - [ ] Success toast is shown.
  - [ ] The **Bersihkan Data Demo** panel disappears (since no demo data remains).
  - [ ] Go to **Bahan Baku**: verify only `Tepung Mandiri` remains. All demo ingredients are removed.
  - [ ] Go to **Resep** and **Produk**: verify they are completely empty (no demo data remains).

---

## 5. Scope Isolation (Multi-Account Test)
- [ ] Authenticate as `user_A` or log in.
- [ ] Seed the demo data workspace.
- [ ] Verify demo data is populated.
- [ ] Log out, and log in as `user_B`.
- [ ] Verify `user_B`'s workspace is empty (demo data from `user_A` did not leak to `user_B`).
