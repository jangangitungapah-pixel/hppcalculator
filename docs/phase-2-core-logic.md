# Phase 2: Core Logic

## Goal
To build the foundational calculation engine that powers the Quick HPP Calculator, strictly separating pure logic from UI, data storage, and external libraries.

## What was implemented
- **Constants:** `DEFAULT_TARGET_MARGINS`, `DEFAULT_PROFIT_STATUS_THRESHOLDS`, `COST_CATEGORIES`, `SELLING_UNITS`, `VALID_LANGUAGES`.
- **Validation:** Functions to validate numeric inputs, missing names, and threshold constraints. Provides user-friendly, bilingual error objects.
- **Rounding:** Custom rounding functions including `safeDivide` and `roundUpToStep` for suggested pricing.
- **Formatting:** Localized currency and percent formatters using native `Intl.NumberFormat`.
- **Profit Status Evaluator:** Logic to categorize profit margins into 5 distinct levels: Loss, Low, Okay, Good, Excellent.
- **Pricing Calculator:** Functions to evaluate margins, markup, gross revenue, and targeted selling prices.
- **HPP Calculator Main Engine:** A robust `calculateQuickHpp` function that wires all individual calculation functions together.
- **Standalone Test Runner:** An independent, dependency-free Node.js script using `assert` for validation against all key edge cases.

## Intentionally Not Implemented
- UI rendering (React / HTML).
- Browser storage integration (`localStorage`).
- Auth / Backend routing.
- Package.json updates (we avoided `vitest` dependency as requested to not overcomplicate package setup).

## File Structure
```
/src
  /lib
    /calculations
      constants.js
      rounding.js
      formatting.js
      validation.js
      profitStatus.js
      pricingCalculator.js
      hppCalculator.js
      index.js
  /tests
    calculationEngine.test.js
/docs
  ...
```

## How to Use
```js
import { calculateQuickHpp } from './src/lib/calculations/index.js';

const result = calculateQuickHpp({
  productName: "Donat",
  costItems: [{ name: "Tepung", amount: 50000 }],
  outputQuantity: 10,
  sellingPrice: 10000,
  sellingUnit: "pcs"
});

console.log(result.profitStatus.key); // 'good'
console.log(result.suggestedPrices.ideal.price); // Target price for 40% margin
```

## Future Notes
- Formatters should be applied only during UI rendering.
- State management can just feed input values to `calculateQuickHpp`.
