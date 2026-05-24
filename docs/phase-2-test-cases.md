# Phase 2 Test Cases

Tests are automated in `src/tests/calculationEngine.test.js`. To execute, use Node.js: `node src/tests/calculationEngine.test.js`.

### 1. Normal Profitable Product
- **Given:** Costs = 150000, Output = 50, Fails = 0, Price = 5000
- **Expect:** HPP = 3000, Profit/Unit = 2000, Margin = 40%, Status = "good"

### 2. Product with Failed Output
- **Given:** Output = 50, Fails = 5. Sellable becomes 45.
- **Expect:** HPP = 3333.33, Profit/Unit = 1666.67, Margin = ~33.33%

### 3. Loss Product
- **Given:** Price is lower than HPP (Price = 2500, HPP = 3000)
- **Expect:** Profit/Unit = -500, Margin = -20%, Status = "loss"

### 4. Zero Profit
- **Given:** Price equals HPP (Price = 3000, HPP = 3000)
- **Expect:** Profit/Unit = 0, Margin = 0%, Status = "low" with a ZERO_PROFIT warning.

### 5. Suggested Prices with Rounding
- **Given:** HPP = 3000, Rounding Step = 500
- **Expect:**
  - 25% Margin -> Target 4000
  - 40% Margin -> Target 5000
  - 55% Margin -> Target 7000

### Edge Cases Verified
- Invalid Output: 0 output fails validation.
- Failed >= Output: Fails validation.
- Missing productName: Fails validation.
- Negative Cost Amount: Fails validation.
