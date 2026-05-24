# Empty, Error, and Loading States

## 1. Empty States
- **No Saved Calculations (History Tab):**
  - Trigger: `localStorage` has empty array.
  - ID Copy: "Belum ada perhitungan yang disimpan. Yuk, mulai hitung HPP produk pertamamu!"
  - EN Copy: "No saved calculations yet. Let's calculate your first product's cost!"
  - UI Treatment: Illustration of a blank notebook + CTA "Hitung HPP Sekarang".
- **No Recent Calculations (Dashboard):**
  - Trigger: Returning user with empty history.
  - ID Copy: "Belum ada riwayat."
  - EN Copy: "No recent history."
  - UI Treatment: Simple gray text in the recent calculations area.
- **Desktop Result Panel Empty:**
  - Trigger: Form not yet submitted.
  - ID Copy: "Isi form di sebelah kiri untuk melihat hasil perhitungan."
  - EN Copy: "Fill the form on the left to see calculation results."
  - UI Treatment: Grayed out placeholder cards.
- **No Cost Row Added:**
  - Trigger: User deletes all optional rows.
  - UI Treatment: Re-inject a blank row automatically, as validation requires at least 1 cost item.

## 2. Error / Validation States
- **Product Name Empty:**
  - ID: "Nama produk wajib diisi."
  - EN: "Product name is required."
  - UI: Red border on input, inline red helper text.
- **No Cost Amount Entered:**
  - ID: "Minimal satu biaya harus lebih dari Rp0."
  - EN: "At least one cost must be greater than 0."
- **Output / Price Invalid:**
  - ID: "Harus lebih dari 0."
  - EN: "Must be greater than 0."
- **Selling Price Below HPP:**
  - ID/EN: Handled gracefully via the "Loss" status badge on result, rather than a form error blocking calculation.
- **Failed Quantity High (Warning):**
  - ID: "Jumlah produk gagal cukup tinggi. Ini membuat HPP per produk naik."
  - EN: "Rejected output is quite high. This increases your cost per unit."
  - UI: Yellow inline alert below the failed quantity input.

## 3. Loading States (Future Proofing)
Since MVP is local-first, calculations are practically instant. However, to make the app feel robust:
- **Opening App:** Simple logo pulse animation while hydrating state from `localStorage` (approx 300ms).
- **Calculate Button Click:** Changes from "Hitung Sekarang" to "Menghitung..." with a subtle spinner if needed.
- **Switching Language:** Instant swap, no loading needed.

## 4. Success States
- **Calculation Saved:**
  - Trigger: Clicking "Simpan Perhitungan".
  - ID Copy: "Sip! Perhitungan berhasil disimpan."
  - EN Copy: "Awesome! Calculation saved successfully."
  - UI: Green Toast notification at the bottom of the screen.
- **Settings Updated:**
  - UI: Instant UI update, optional subtle toast "Pengaturan disimpan".
- **Local Data Reset:**
  - ID: "Semua data telah dihapus."
  - EN: "All data has been cleared."
  - UI: Red/Neutral Toast notification.
- **Calculation Deleted:**
  - ID: "Data berhasil dihapus."
  - EN: "Data successfully deleted."
  - UI: Toast notification on return to History list.
