# Phase 13: Firebase Auth & Cloud Sync

## Goal
Implementasi otentikasi opsional menggunakan Firebase dan sinkronisasi data ke cloud menggunakan Firestore. Modalin tetap mempertahankan kapabilitas **Local-first**, di mana pengguna tidak dipaksa untuk login untuk menggunakan kalkulator. Cloud sync adalah fitur tambahan opsional untuk mempermudah pencadangan dan pemindahan data antar perangkat.

## Arsitektur
1. **Firebase Authentication**: Menyediakan mekanisme login dengan Email/Password dan Google Auth. Profil pengguna disinkronkan ke dokumen profil di Firestore.
2. **Firestore Cloud Sync**: Semua module diubah menjadi "sync records" dan dikirimkan secara batch ke Firestore di bawah path pengguna masing-masing.
3. **Local-first Mode**: Mode ini aktif secara default bagi semua guest dan juga berguna apabila device sedang offline.

## Fitur Sync
- **Manual Sync**: Disediakan tombol paksa upload / paksa download di halaman Pusat Sinkronisasi.
- **Light Auto-sync**: Apabila user sudah login dan fitur auto-sync aktif, setiap perubahan di `localStorage` akan ditunda (debounced) selama 5 detik, lalu disinkronkan ke cloud secara otomatis (background process).
- **Conflict Handling**: Resolusi konflik dilakukan berdasarkan prinsip *"latest `updatedAt` wins"*. Apabila ada konflik dan waktu terakhir update sama, localStorage (lokal) akan diprioritaskan.

## Batasan
- Aplikasi tidak mendukung sinkronisasi realtime penuh (WebSocket listeners) untuk menjaga performa dan kuota pembacaan Firestore bagi aplikasi UMKM sederhana.
- Belum mendukung skenario Multi-Business secara kompleks atau peran/staff team.
- Fitur penghapusan lokal masih memerlukan penyempurnaan `deletedAt` (tombstone) agar dapat terhapus secara seragam di cloud. (Direncanakan pada Phase 13.5).
