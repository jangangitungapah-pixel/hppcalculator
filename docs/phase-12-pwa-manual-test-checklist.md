# PWA Manual Test Checklist

## Build & Core
- [ ] `npm run build` sukses tanpa error manifest/workbox.
- [ ] `npm run preview` sukses menjalankan server production build.
- [ ] Manifest dapat dibaca di tab Application (Chrome DevTools).
- [ ] Icon aplikasi berhasil dimuat di panel Manifest.

## Installability
- [ ] Browser mendeteksi aplikasi sebagai PWA installable.
- [ ] Banner "Install Modalin" muncul di Dashboard jika memenuhi syarat.
- [ ] Menekan tombol "Nanti Saja" pada banner akan menutup banner.
- [ ] Card "Install Aplikasi" di halaman Settings muncul dan memiliki status terinstall / belum.
- [ ] Aplikasi bisa diinstall ke Home Screen (Desktop / Mobile).

## Offline Support
- [ ] Saat jaringan dimatikan via Network tab (Offline), aplikasi tidak freeze.
- [ ] Offline badge berwarna amber/orange muncul di pojok kanan atas (Header).
- [ ] Saat jaringan kembali menyala (Online), toast "Koneksi kembali online" muncul.
- [ ] Fitur kalkulator HPP tetap berjalan normal saat offline karena bergantung pada LocalStorage.
- [ ] Navigasi ke `/offline` menampilkan halaman khusus "Kamu sedang offline".
- [ ] Refresh aplikasi saat offline berhasil me-load App Shell dari Cache Storage.

## Update Mechanism
- [ ] Jika ada update pada source code dan build baru di-push, setelah user me-refresh aplikasi atau menunggu timer, toast "Versi baru tersedia" muncul.
- [ ] Klik "Refresh" di toast tersebut mereload aplikasi dengan aset terbaru.

## Lighthouse
- [ ] Menjalankan Lighthouse "Progressive Web App" audit menampilkan skor yang baik / centang PWA valid.
