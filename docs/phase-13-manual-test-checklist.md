# Manual Test Checklist Phase 13

## Environment Kosong
- [ ] Kosongkan `.env.local`
- [ ] Buka halaman `Dashboard`, aplikasi tidak error.
- [ ] Buka `/login`, muncul informasi bahwa otentikasi belum tersedia.

## Otentikasi
- [ ] Mendaftar lewat form email/password (sukses & dialihkan ke `/account`).
- [ ] Login menggunakan email (sukses & dialihkan ke `/dashboard`).
- [ ] Fitur *Sign in with Google* berjalan (jika diakses online / disetup Firebase).
- [ ] Logout berfungsi.

## Profil dan Bisnis
- [ ] Buka menu Akun & Profil (`/account`).
- [ ] Edit profil bisnis (nama, jenis, dll) dan tekan Simpan.
- [ ] Reload browser, profil bisnis tetap tersimpan.

## Sinkronisasi 
- [ ] Prompt awal sinkronisasi muncul jika ada data lokal & baru login pertama kali.
- [ ] *Push to cloud*: Paksa menimpa data Cloud dengan Lokal bekerja mulus.
- [ ] *Pull from cloud*: Paksa menimpa data Lokal dengan Cloud bekerja mulus (data terisi di localStorage).
- [ ] Fitur sinkronisasi otomatis bekerja di background ~5 detik pasca edit data produk / settings.

## Offline / Online States
- [ ] Matikan koneksi internet (DevTools Network -> Offline).
- [ ] Badge header & dashboard menampilkan keterangan offline.
- [ ] Fungsi sinkronisasi dicegah / disabled selama offline.
- [ ] Menambahkan resep baru saat offline (disimpan aman di local storage).
- [ ] Mengembalikan koneksi, auto-sync menyala kembali dan mengunggah resep.
