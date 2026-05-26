# Manual Testing Checklist - Phase 13.7: Calculator Page Overhaul

Use this checklist to verify the visual quality and usability flows of the newly overhauled calculator page.

---

## 1. Visual Quality (Desktop - 1440px)
- [ ] Go to `/calculator`.
- [ ] Verify the cream background and sunset orange accents are rendered correctly.
- [ ] Verify the layout is split into two columns:
  - Left column: Title, Hero Banner, Step Cards, Help accordion.
  - Right column: Sticky result preview card.
- [ ] Verify the input fields are exactly 48-52px tall, with soft corners and focus rings.

---

## 2. Empty State & Checklist Validation
- [ ] Clear drafts or reset form.
- [ ] Verify the right sticky panel shows:
  - Checklist block indicating Nama Produk, Biaya, Hasil, and Harga Jual are incomplete.
  - "Hitung Sekarang" button is disabled because costs/output are missing.
- [ ] Fill in name "Donat". Verify the first checklist item is marked as checked.

---

## 3. Cost Rows & Quick Templates
- [ ] Click "+ Bahan Baku" template chip. Verify a new cost row is created with "Biaya Bahan" placeholder and "Bahan" category.
- [ ] Delete all cost rows except one. Verify the delete button hides (requires at least 1 row).
- [ ] Fill in amount `10000`. Verify "Minimal 1 biaya > Rp0" checklist item marks as checked.
- [ ] Verify the delete buttons are styled as clean circles and display a soft red background on hover.

---

## 4. Live Calculations & Price Warnings
- [ ] Fill in batch output `10` pcs.
- [ ] Fill in price target `2000` Rp.
- [ ] Verify the checklist is fully checked and the results are automatically rendered in the right panel (HPP: Rp 1.000, Profit: Rp 1.000, Margin: 50%).
- [ ] Change target price to `500` Rp (which is less than HPP).
- [ ] Verify:
  - [ ] The profitStatus badge turns to "Rugi" (red).
  - [ ] The hero gradient card turns red.
  - [ ] The warning text shows: "Harga jual kamu masih di bawah HPP. Produk ini berpotensi rugi."

---

## 5. Mobile Sticky CTA & Responsiveness
- [ ] Open the inspector and simulate mobile view (390px width).
- [ ] Verify:
  - [ ] Page title stacks properly.
  - [ ] Form step cards stack into a single column.
  - [ ] Cost row inputs stack clean and do not overflow horizontally.
  - [ ] A fixed sticky CTA panel is visible at the bottom of the viewport.
- [ ] Click "Hitung HPP" on mobile. Verify it redirects to `/calculator/result` correctly showing the detailed breakdown.
- [ ] Verify the sticky CTA panel does not overlap or cover bottom navigation links.

---

## 6. Draft recovery flow
- [ ] Fill in some inputs on the form.
- [ ] Reload the page.
- [ ] Verify the restore draft banner pops up at the top of the page.
- [ ] Click "Lanjutkan". Verify the inputs are restored.
- [ ] Wreck inputs, reload, click "Hapus Draft". Verify the form resets back to defaults and the banner hides.
