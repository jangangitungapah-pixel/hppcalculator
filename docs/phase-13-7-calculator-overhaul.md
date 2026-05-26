# Phase 13.7 - Calculator Page Premium Overhaul

We have successfully overhauled the user interface and user experience of the **Hitung HPP / Calculator** page. What was once a monolithic, spreadsheet-like spreadsheet form has been decomposed into 13 React subcomponents under `src/components/calculator/` and styled with a premium warm cream and orange sunset brand.

---

## 1. System Decomposition

We divided the form and calculation result panel into modular subcomponents:

1.  **[CalculatorHero.jsx](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/components/calculator/CalculatorHero.jsx)**: Warm sunset card with system capabilities indicators (F&B-optimized, Offline support, Local-first).
2.  **[CalculatorStepCard.jsx](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/components/calculator/CalculatorStepCard.jsx)**: Component wrapper that isolates form cards into sequential step lists (Step 1 to 4).
3.  **[ProductInfoSection.jsx](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/components/calculator/ProductInfoSection.jsx)**: Renders step 1 product name with custom focus rules.
4.  **[CostItemRow.jsx](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/components/calculator/CostItemRow.jsx)**: Individual cost row inputs featuring circle delete transitions and clean spacing.
5.  **[CalculatorEmptyCostState.jsx](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/components/calculator/CalculatorEmptyCostState.jsx)**: High-fidelity onboarding display shown when all costs are removed.
6.  **[CostItemsSection.jsx](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/components/calculator/CostItemsSection.jsx)**: Manages cost rows list, validation warnings, and category template shortcut chips (+ Bahan Baku, + Kemasan, + Tenaga Kerja, + Operasional).
7.  **[ProductionOutputSection.jsx](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/components/calculator/ProductionOutputSection.jsx)**: Inputs for outputs, failed wastage counts, and selling units. Renders a live preview calculation of net sellable units.
8.  **[SellingPriceSection.jsx](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/components/calculator/SellingPriceSection.jsx)**: Standard markup input. Renders profit safety indicators (Aman, Margin Rendah, Rugi) relative to the estimated HPP.
9.  **[CalculatorResultPreview.jsx](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/components/calculator/CalculatorResultPreview.jsx)**: Sticky right-hand side panel. When empty, displays a Checklist outlining remaining form steps. When valid, displays HPP per unit (hero card), margin, profit, and suggested safety price recommendations.
10. **[CalculatorStickySummary.jsx](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/components/calculator/CalculatorStickySummary.jsx)**: Tiny metrics indicator used inside mobile footers.
11. **[CalculatorMobileCta.jsx](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/components/calculator/CalculatorMobileCta.jsx)**: Fixed sticky bottom drawer overlay that stays clear of bottom nav safe areas. Displays a summary checklist when invalid and instant calculate/HPP summary buttons when valid.
12. **[CalculatorHelpCard.jsx](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/components/calculator/CalculatorHelpCard.jsx)**: Accordion card explaining HPP, Margin, and Markup definitions.
13. **[CalculatorFormActions.jsx](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/components/calculator/CalculatorFormActions.jsx)**: Bottom action panel for desktop (Reset, Save, Calculate HPP).
14. **[CalculatorDraftBanner.jsx](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/components/calculator/CalculatorDraftBanner.jsx)**: Restoration banner for unsaved drafts.

---

## 2. Style and Responsiveness

-   **Desktop Layout (Grid)**: Renders form controls on the left (column maximum `max-w-3xl`) and sticky calculations preview card on the right.
-   **Mobile Layout (Stack)**: Stacks elements into a single fluid column. Interactive delete buttons are scaled up to match comfortable finger tap targets. Employs the sticky bottom CTA drawer.
-   **Custom stylesheet**: Maintained in [calculator.css](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/styles/calculator.css) leveraging variable tokens from `design-tokens.css`. Integrated into the entry point in [index.css](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/styles/index.css).

---

## 3. Humanized Error Handling

Updated translation errors in [dictionary.js](file:///c:/VS%20CODE%20PROJECT/hppcalculator/src/i18n/dictionary.js) to be warm and conversational:
-   *ProductName empty*: "Kasih nama produk dulu, biar hasilnya mudah dicari."
-   *Cost empty*: "Nominal biaya harus lebih dari 0."
-   *Production output empty*: "Jumlah produksi harus lebih dari 0."
-   *Failed wastage invalid*: "Jumlah gagal tidak boleh negatif atau melebihi jumlah produksi."
-   *Selling price invalid*: "Harga jual target harus lebih dari 0."

---

## 4. Preserved Logic & Flow

All business costing calculations, quick calculations, saving inputs, draft updates, and history restore operations remain 100% untouched.
