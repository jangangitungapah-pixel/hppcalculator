# Screen Wireframes

## 1. Welcome / Onboarding
**Purpose:** Introduce Modalin to new users and explain the value.
**Primary Goal:** Get the user to click "Start Calculating".

### Mobile Wireframe
```text
+------------------------------------------------+
| Modalin                                ID | EN |
+------------------------------------------------+
|                                                |
|            [ Logo / Illustration ]             |
|                                                |
| Hitung modal, atur harga, jaga untung.         |
|                                                |
| Kami bantu kamu hitung HPP dengan mudah tanpa  |
| pusing mikirin rumus akuntansi.                |
|                                                |
| [       Hitung HPP Sekarang (Primary)      ]   |
| [       Coba Contoh Demo (Secondary)       ]   |
|                                                |
|              Lanjut ke Dashboard               |
+------------------------------------------------+
```

### Desktop Wireframe
```text
+-------------------------------------------------------------------------+
| Modalin                                                         ID | EN |
+---------------------------------------+---------------------------------+
| Hitung modal, atur harga, jaga untung.|                                 |
|                                       |     +---------------------+     |
| Kami bantu kamu hitung HPP dengan     |     | Preview Kartu Hasil |     |
| mudah tanpa pusing rumus akuntansi.   |     | Margin: 40% (Sehat) |     |
|                                       |     | HPP: Rp3.000        |     |
| [Hitung HPP Sekarang] [Coba Contoh]   |     +---------------------+     |
| Lanjut ke Dashboard                   |                                 |
+---------------------------------------+---------------------------------+
```

## 2. Dashboard
**Purpose:** Quick overview for returning users.
**Primary Goal:** Quick access to new calculation or recent history.

### Mobile Wireframe
```text
+------------------------------------------------+
| Modalin                                ID | EN |
+------------------------------------------------+
| Halo, Juragan! 👋                             |
|                                                |
| +--------------------------------------------+ |
| | Mulai Hitung Baru                          | |
| | Hitung HPP menu barumu sekarang.           | |
| | [ Hitung Sekarang ]                        | |
| +--------------------------------------------+ |
|                                                |
| Ringkasan Bisnis                               |
| +--------------------+  +--------------------+ |
| | Rata-rata Margin   |  | Total Menu Disimpan| |
| | 42% (Sehat)        |  | 5 Menu             | |
| +--------------------+  +--------------------+ |
|                                                |
| Hitungan Terakhir           [ Lihat Semua ]    |
| - Donat Coklat (Margin 40%)                    |
| - Es Kopi Susu (Margin 35%)                    |
|                                                |
| +--------------------------------------------+ |
| | 💡 Tips: Jangan lupa masukkan ongkir!      | |
| +--------------------------------------------+ |
+------------------------------------------------+
| [Dashboard]  [Hitung]  [Riwayat]  [Pengaturan] |
+------------------------------------------------+
```

## 3. Quick HPP Calculator
**Purpose:** Core input engine for costs and pricing.
**Primary Goal:** Generate a calculation result.

### Mobile Wireframe
```text
+------------------------------------------------+
| < Kembali        Hitung HPP            ID | EN |
+------------------------------------------------+
| 1. Info Produk                                 |
| Nama Produk / Menu                             |
| [ Masukkan nama...                           ] |
|                                                |
| 2. Biaya Produksi                              |
| Biaya Bahan                                    |
| [ Rp 0                                       ] |
| Biaya Kemasan                                  |
| [ Rp 0                                       ] |
| [+ Tambah Biaya Lainnya]                       |
|                                                |
| 3. Hasil Produksi                              |
| Jumlah Hasil Jual                              |
| [ 10               ] [ pcs (dropdown) ]        |
| Jumlah Gagal (opsional)                        |
| [ 0                ] pcs                       |
|                                                |
| 4. Harga Jual                                  |
| Harga Jual per Pcs                             |
| [ Rp 0                                       ] |
|                                                |
|                                                |
|                                                |
| +--------------------------------------------+ |
| | [            Hitung Sekarang             ] | |
| +--------------------------------------------+ |
+------------------------------------------------+
```

### Desktop Wireframe
```text
+-------------------------------------------------------------------------+
| [Sidebar] | Hitung HPP                                          ID | EN |
| Dashboard |-----------------------------------+-------------------------+
| Hitung    | 1. Info Produk                    | Hasil Perhitungan       |
| Riwayat   | [ Nama Produk ]                   |                         |
| Setting   | 2. Biaya Produksi                 | (Muncul setelah klik    |
|           | [ Bahan ] [ Kemasan ] dll         | Hitung atau saat input  |
|           | 3. Hasil Produksi                 | valid)                  |
|           | [ Jumlah ] [ Gagal ]              |                         |
|           | 4. Harga Jual                     |                         |
|           | [ Harga ]                         |                         |
|           | [ Hitung Sekarang ]               |                         |
+-----------+-----------------------------------+-------------------------+
```

## 4. Calculation Result
**Purpose:** Display the health of the pricing.

### Mobile Wireframe
```text
+------------------------------------------------+
| < Edit Input       Hasil HPP           ID | EN |
+------------------------------------------------+
| Donat Coklat                                   |
| Status: [ Bagus (Hijau) ]                      |
|                                                |
| HPP per Pcs               Untung per Pcs       |
| Rp 3.000                  Rp 2.000             |
|                                                |
| Margin Keuntungan                              |
| 40%                                            |
|                                                |
| 📝 "Margin produk ini sudah bagus untuk bisnis |
| F&B kecil."                                    |
|                                                |
| Rekomendasi Harga Aman:                        |
| - Aman (25%): Rp 4.000                         |
| - Ideal (40%): Rp 5.000                        |
| - Premium (55%): Rp 7.000                      |
|                                                |
| [ Simpan Perhitungan ]                         |
| [ Hitung Ulang ]                               |
+------------------------------------------------+
```

## 5. Saved Calculations (History)
**Purpose:** View past calculations.

### Mobile Wireframe
```text
+------------------------------------------------+
| Riwayat Perhitungan                    ID | EN |
+------------------------------------------------+
| [ Cari menu... ]                               |
|                                                |
| +--------------------------------------------+ |
| | Donat Coklat                               | |
| | Harga Jual: Rp 5.000  | Margin: 40%        | |
| | Status: Bagus                              | |
| +--------------------------------------------+ |
| +--------------------------------------------+ |
| | Es Kopi Susu                               | |
| | Harga Jual: Rp 8.000  | Margin: 10%        | |
| | Status: Rendah                             | |
| +--------------------------------------------+ |
|                                                |
+------------------------------------------------+
| [Dashboard]  [Hitung]  [Riwayat]  [Pengaturan] |
+------------------------------------------------+
```

## 6. Calculation Detail
**Purpose:** View full breakdown of a saved calculation.

### Mobile Wireframe
```text
+------------------------------------------------+
| < Kembali        Detail Produk         ID | EN |
+------------------------------------------------+
| [ Full Result Breakdown Sama Seperti Screen 4 ]|
|                                                |
| Rincian Biaya:                                 |
| - Biaya Bahan: Rp 100.000                      |
| - Biaya Kemasan: Rp 20.000                     |
| - Biaya Lain: Rp 30.000                        |
|                                                |
| [ Gunakan Lagi (Duplicate) ]                   |
| [ Hapus Perhitungan (Merah) ]                  |
+------------------------------------------------+
```

## 7. Settings
**Purpose:** App preferences.

### Mobile Wireframe
```text
+------------------------------------------------+
| Pengaturan                             ID | EN |
+------------------------------------------------+
| Bahasa Aplikasi                                |
| (o) Indonesia                                  |
| ( ) English                                    |
|                                                |
| Format Mata Uang                               |
| (o) Rupiah (IDR)                               |
|                                                |
| ⚠ Hapus Data                                   |
| Menghapus semua riwayat dari perangkat ini.    |
| [ Reset Semua Data ]                           |
+------------------------------------------------+
| [Dashboard]  [Hitung]  [Riwayat]  [Pengaturan] |
+------------------------------------------------+
```
