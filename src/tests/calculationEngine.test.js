// Standalone Test Runner for Node.js
import assert from 'assert';
import { calculateQuickHpp } from '../lib/calculations/hppCalculator.js';

function runTests() {
  console.log("Running Core Calculation Logic Tests...\n");

  try {
    // 1. Normal profitable product
    const input1 = {
      productName: "Donat Coklat",
      costItems: [
        { id: "1", name: "Bahan", amount: 100000, category: "ingredient" },
        { id: "2", name: "Kemasan", amount: 20000, category: "packaging" },
        { id: "3", name: "Biaya Lain", amount: 30000, category: "other" }
      ],
      outputQuantity: 50,
      failedQuantity: 0,
      sellingUnit: "pcs",
      sellingPrice: 5000,
      roundingStep: 500
    };
    const res1 = calculateQuickHpp(input1);
    assert.strictEqual(res1.isValid, true);
    assert.strictEqual(res1.totalProductionCost, 150000);
    assert.strictEqual(res1.sellableQuantity, 50);
    assert.strictEqual(res1.hppPerUnit, 3000);
    assert.strictEqual(res1.grossRevenue, 250000);
    assert.strictEqual(res1.profitPerUnit, 2000);
    assert.strictEqual(res1.totalProfit, 100000);
    assert.strictEqual(res1.marginPercent, 40);
    assert.ok(Math.abs(res1.markupPercent - 66.666) < 0.01);
    assert.strictEqual(res1.profitStatus.key, 'good');
    
    // Suggested prices given HPP=3000, Margins: 25%, 40%, 55%, step 500
    assert.strictEqual(res1.suggestedPrices.safe.price, 4000); // 3000 / 0.75 = 4000
    assert.strictEqual(res1.suggestedPrices.ideal.price, 5000); // 3000 / 0.6 = 5000
    assert.strictEqual(res1.suggestedPrices.premium.price, 7000); // 3000 / 0.45 = 6666.66 -> 7000
    console.log("✅ Test 1: Normal profitable product passed");

    // 2. Product with failed output
    const input2 = { ...input1, failedQuantity: 5 };
    const res2 = calculateQuickHpp(input2);
    assert.strictEqual(res2.sellableQuantity, 45);
    assert.ok(Math.abs(res2.hppPerUnit - 3333.33) < 0.01);
    assert.ok(Math.abs(res2.profitPerUnit - 1666.66) < 0.01);
    assert.ok(Math.abs(res2.totalProfit - 75000) < 0.01);
    assert.ok(Math.abs(res2.marginPercent - 33.33) < 0.01);
    assert.strictEqual(res2.profitStatus.key, 'good');
    console.log("✅ Test 2: Product with failed output passed");

    // 3. Loss product
    const input3 = { ...input1, sellingPrice: 2500 };
    const res3 = calculateQuickHpp(input3);
    assert.strictEqual(res3.hppPerUnit, 3000);
    assert.strictEqual(res3.profitPerUnit, -500);
    assert.strictEqual(res3.marginPercent, -20);
    assert.strictEqual(res3.profitStatus.key, 'loss');
    console.log("✅ Test 3: Loss product passed");

    // 4. Zero profit product
    const input4 = { ...input1, sellingPrice: 3000 };
    const res4 = calculateQuickHpp(input4);
    assert.strictEqual(res4.profitPerUnit, 0);
    assert.strictEqual(res4.marginPercent, 0);
    assert.strictEqual(res4.profitStatus.key, 'low');
    const hasZeroProfitWarning = res4.warnings.some(w => w.code === 'ZERO_PROFIT');
    assert.strictEqual(hasZeroProfitWarning, true);
    console.log("✅ Test 4: Zero profit product passed");

    // 5. Invalid output quantity 0
    const input5 = { ...input1, outputQuantity: 0 };
    const res5 = calculateQuickHpp(input5);
    assert.strictEqual(res5.isValid, false);
    const hasOutputQuantError = res5.errors.some(e => e.field === 'outputQuantity');
    assert.strictEqual(hasOutputQuantError, true);
    console.log("✅ Test 5: Invalid output quantity 0 passed");

    // 6. Invalid failed quantity equal to output quantity
    const input6 = { ...input1, outputQuantity: 50, failedQuantity: 50 };
    const res6 = calculateQuickHpp(input6);
    assert.strictEqual(res6.isValid, false);
    const hasFailedQuantError = res6.errors.some(e => e.field === 'failedQuantity' && e.code === 'TOO_LARGE');
    assert.strictEqual(hasFailedQuantError, true);
    console.log("✅ Test 6: Invalid failed quantity passed");

    // 7. Negative cost item
    const input7 = { ...input1, costItems: [{ name: "Bahan", amount: -10000, category: "ingredient" }] };
    const res7 = calculateQuickHpp(input7);
    assert.strictEqual(res7.isValid, false);
    console.log("✅ Test 7: Negative cost item passed");

    // 8. Missing product name
    const input8 = { ...input1, productName: "" };
    const res8 = calculateQuickHpp(input8);
    assert.strictEqual(res8.isValid, false);
    console.log("✅ Test 8: Missing product name passed");

    // 10. Custom unit accepted
    const input10 = { ...input1, sellingUnit: "loyang" };
    const res10 = calculateQuickHpp(input10);
    assert.strictEqual(res10.isValid, true);
    assert.strictEqual(res10.sellingUnit, "loyang");
    console.log("✅ Test 10: Custom unit accepted passed");

    console.log("\nAll tests passed successfully! 🎉");
  } catch (error) {
    console.error("\n❌ Test Failed!");
    console.error(error);
  }
}

runTests();
