# Calculation Concepts

These concepts define the core business logic of the application. The formulas here serve as a reference for future implementation.

## 1. Total Production Cost (Total Modal Produksi)
- **Simple Meaning:** The total money spent to create a batch of products.
- **Formula:** `Ingredient Cost + Packaging Cost + Additional Cost`
- **Example:** Rp50,000 (Ingredients) + Rp10,000 (Packaging) + Rp5,000 (Gas) = Rp65,000.
- **User-friendly Explanation:** "Total uang yang kamu keluarkan untuk membuat produk ini."

## 2. Sellable Output (Jumlah Hasil Jual)
- **Simple Meaning:** How many items you can actually sell from one production batch.
- **Concept:** Excludes waste/rejects. If a batch makes 12 brownies but 2 are burned, the sellable output is 10.
- **User-friendly Explanation:** "Berapa banyak produk yang berhasil jadi dan siap dijual."

## 3. HPP per Unit (Modal per Produk)
- **Simple Meaning:** The production cost for a single item.
- **Formula:** `Total Production Cost / Sellable Output`
- **Example:** Rp65,000 / 10 = Rp6,500.
- **User-friendly Explanation:** "Modal murni untuk membuat 1 buah produk."

## 4. Profit per Unit (Untung per Produk)
- **Simple Meaning:** The money you make on a single item after subtracting its cost.
- **Formula:** `Selling Price - HPP per Unit`
- **Example:** Rp15,000 (Selling Price) - Rp6,500 (HPP) = Rp8,500.
- **User-friendly Explanation:** "Keuntungan bersih yang masuk ke kantongmu dari tiap produk yang terjual."

## 5. Total Profit (Total Keuntungan)
- **Simple Meaning:** The total profit if you sell all items in the batch.
- **Formula:** `Profit per Unit * Sellable Output`
- **Example:** Rp8,500 * 10 = Rp85,000.
- **User-friendly Explanation:** "Total untung jika semua produk laku terjual."

## 6. Margin (Margin Keuntungan)
- **Simple Meaning:** The percentage of the selling price that is profit. A measure of business health.
- **Formula:** `(Profit per Unit / Selling Price) * 100`
- **Example:** (Rp8,500 / Rp15,000) * 100 = 56.6%.
- **User-friendly Explanation:** "Persentase keuntungan dari harga jual. Semakin besar, semakin aman bisnismu."

## 7. Status & Suggested Selling Price (Harga Aman)
- **Concept:** Evaluating the margin against predefined health thresholds.
  - Rugi (Loss): Margin < 0%
  - Tipis (Thin): Margin 0% - 20%
  - Aman (Safe): Margin 21% - 40%
  - Sehat (Healthy): Margin > 40%
- **Suggested Price Formula:** `HPP per Unit / (1 - Target Margin Percentage)`
- **User-friendly Explanation:** "Rekomendasi harga jual agar kamu bisa bernapas lega dan tetap untung."

## 8. Future Concepts (Not in MVP)
- **Waste/Reject:** Tracking discarded raw materials.
- **Break-even Point:** How many items must be sold to cover fixed costs.
- **Marketplace Fee:** Adding platform tax (e.g., 20% GoFood fee) on top of the selling price.
- **Reseller Price:** Setting a wholesale price that still yields a minimum acceptable margin.
