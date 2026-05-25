# Acceptance Criteria - Phase 12

## Kriteria Diterima:
- `vite-plugin-pwa` terpasang tanpa merusak build process.
- Konfigurasi `manifest` tersedia dan memenuhi spesifikasi branding Modalin.
- Assets / Icons tersedia (minimal valid SVG / dummy fallback).
- Service worker dapat meregister dirinya dan memanajemen static assets cache.
- Dukungan offline aktif: Header menampilkan `OfflineBadge` saat network offline.
- Toast deteksi Online/Offline aktif tanpa spamming initial render.
- Toast deteksi pembaruan "Versi baru tersedia" berfungsi (`useRegisterSW`).
- Route `/offline` tersedia dengan `OfflinePage`.
- UI `InstallAppBanner` berhasil digabungkan ke Dashboard.
- UI `InstallAppCard` berhasil digabungkan ke Settings.
- Data `localStorage` murni diakses browser API dan tidak ikut campur dalam Workbox routing.
- Tidak ada penambahan fitur bisnis baru, backend, auth, maupun sinkronisasi cloud dalam phase ini.
