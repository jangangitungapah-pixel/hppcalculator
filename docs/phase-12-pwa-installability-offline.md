# Phase 12: PWA Installability & Offline App Experience

## Goal
Tujuan utama phase ini adalah memastikan aplikasi Modalin memiliki kapabilitas Progressive Web App (PWA) sepenuhnya, dapat di-install secara native (homescreen), dapat dibuka saat koneksi offline, dan memiliki antarmuka yang memberi sinyal jelas mengenai status jaringan (online/offline) serta update versi aplikasi.

## Dependency
- `vite-plugin-pwa`: Digunakan untuk mengatur Service Worker, App Manifest, dan cache static assets menggunakan Workbox secara otomatis dengan integrasi Vite.

## Manifest Configuration
Konfigurasi manifest diatur di dalam `vite.config.js`:
- **name:** Modalin — Kalkulator HPP F&B
- **short_name:** Modalin
- **theme_color:** #FF6A00
- **background_color:** #FDFBF7
- **icons:** SVG icon yang di-scaling menjadi maskable format (192x192, 512x512).

## Service Worker Behavior & Cache Strategy
- **Strategy:** `prompt`. Aplikasi tidak akan me-refresh paksa saat background update selesai. Sebaliknya, aplikasi menampilkan prompt/toast "Versi baru tersedia" agar user merefresh secara manual.
- **Cache Strategy:** Static assets (JS, CSS, HTML, SVG, Web Fonts) akan di-cache menggunakan `CacheFirst` dan `StaleWhileRevalidate` (Workbox default build).
- **Data Cache:** Data LocalStorage *sama sekali tidak disentuh atau di-cache* oleh service worker. Service worker hanya melayani Application Shell.

## Offline & Install Prompt Behavior
- **Offline Route:** Akses navigasi ke halaman yang belum pernah dikunjungi saat offline tidak akan me-render halaman blank atau default Chrome "No Internet", melainkan fallback ke route internal atau `OfflinePage` di `/offline`.
- **Offline Badge:** Tampil di bagian `Header` apabila navigasi terdeteksi offline.
- **Install Banner:** Tampil di `Dashboard` menggunakan komponen custom `InstallAppBanner`. Banner akan disembunyikan jika app telah terinstall atau user mendismiss-nya. Kondisi dismiss disimpan di `localStorage` selama 7 hari.
- **Install Card:** Tampil di menu `Settings` menggunakan komponen custom `InstallAppCard`.

## Local-First Data Note
- **Penting:** Semua logic Modalin dirancang local-first. Fitur PWA offline memfasilitasi load App Shell, sementara LocalStorage menjaga Business Data tetap berjalan lokal secara persisten. Tidak ada integrasi Firebase/Supabase yang ditambahkan dalam scope phase ini.
