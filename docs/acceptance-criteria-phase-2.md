# Acceptance Criteria: Phase 2

- [x] **Calculation engine is separated from UI**: No DOM, React, or browser-specific references in `/lib/calculations`.
- [x] **Total cost calculation works**: Handled in `hppCalculator.js`.
- [x] **Sellable quantity calculation works**: Handled via `calculateSellableQuantity`.
- [x] **HPP calculation works**: Done via `calculateHppPerUnit`.
- [x] **Profit calculation works**: `calculateProfitPerUnit` and `calculateTotalProfit` correctly deduct costs.
- [x] **Margin calculation works**: Handled with `calculateMarginPercent`.
- [x] **Markup calculation works**: Evaluated using `calculateMarkupPercent`.
- [x] **Suggested price calculation works**: Handles margins cleanly using `calculateSuggestedPriceFromMargin` with step rounding.
- [x] **Profit status calculation works**: Maps correctly into Loss, Low, Okay, Good, Excellent states.
- [x] **Validation works**: Built robust rules for arrays, positive numbers, and custom constraints.
- [x] **Formatting helpers exist**: `formatCurrency`, `formatPercent` using `Intl.NumberFormat`.
- [x] **Unit constants exist**: Provided bilingual unit categories.
- [x] **Cost category constants exist**: Mapped common categories for F&B.
- [x] **Tests or test runner exist**: `calculationEngine.test.js` runs via Node natively.
- [x] **Documentation is complete**: All required Phase 2 documents are generated.
