# Acceptance Criteria Phase 13

- [x] Konfigurasi environment variables terpusat & tidak diexpose secara bahaya.
- [x] Client initialization Firebase hanya diakses jika Environment tersedia.
- [x] Implementasi AuthService untuk Firebase Auth.
- [x] `AuthContext` terhubung di seluruh layer aplikasi dan membaca status secara reaktif.
- [x] Implementasi `syncMapper` yang dapat menerjemahkan semua struktur Reducer ke Cloud Payload dan sebaliknya.
- [x] `firebaseSyncService.js` berjalan solid dengan dukungan chunking / batching Firebase limit 500 documents.
- [x] Halaman `/login`, `/register`, `/forgot-password` memiliki flow UI terpoles premium.
- [x] UI Pusat Sinkronisasi menampilkan jumlah push/pull, konflik, serta tombol aksi manual dan indikasi error.
- [x] Dashboard, Settings, Data Backup telah terhubung dengan status sync, tanpa menghapus fitur existing.
- [x] Local first & guest mode dipertahankan sepenuhnya (user dapat mengakses halaman Calculator dll tanpa dipaksa redirect Login).
- [x] Conflict Resolution Strategy menggunakan prinsip waktu (latest-updated).
- [x] Build dan Testing berhasil lewat tanpa *blocking failures*.
