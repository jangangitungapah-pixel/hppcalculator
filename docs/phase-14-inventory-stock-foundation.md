# Phase 14 - Inventory & Stock Foundation

Phase ini menambahkan fondasi inventory berbasis bahan baku untuk Modalin.

Source of truth stok adalah:

- `inventorySettings`
- `stockMovements`

Snapshot stok dihitung dari movement dan setting, bukan disimpan sebagai data utama.

Fitur utama:

- Tracking stok per bahan bersifat opsional.
- Movement mendukung `opening_balance`, `stock_in`, `stock_out`, `adjustment`, `waste`, dan `correction`.
- Status stok: `ok`, `low`, `out`, `not_tracked`.
- Storage memakai scoped localStorage existing untuk guest dan user.
- Backup JSON, import, reset modular, CSV, demo data, dan sync mapper sudah mengenal inventory.

Yang belum dikerjakan di phase ini:

- Auto consume dari production batch.
- Supplier module.
- Sales/order module.
- Perubahan formula HPP.
