# Acceptance Criteria Phase 14

- Inventory settings dan stock movements tersimpan di scoped localStorage.
- Current stock dihitung dari movement, bukan field manual.
- Negative quantity hanya valid untuk `adjustment` delta.
- Inventory page tersedia di `/inventory`.
- Sidebar memiliki akses ke Inventory.
- Ingredient detail menampilkan section Stok Bahan.
- Ingredients grid menampilkan badge stok ringan saat tracking aktif.
- Dashboard menampilkan alert jika ada stok rendah.
- Demo data inventory tidak duplicate dan bisa dibersihkan tanpa menghapus data user.
- Backup JSON dan sync mapper mencakup `inventorySettings` dan `stockMovements`.
- Test inventory storage, calculator, status, sync, dan backup tersedia.
- Tidak ada perubahan formula HPP, production batch, supplier module, atau sales/order module.
