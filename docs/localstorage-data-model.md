# LocalStorage Data Model

## Storage Keys
All keys use a namespace and version prefix to prevent collisions.
- `modalin:v1:calculations`: Array of SavedCalculation objects.
- `modalin:v1:settings`: AppSettings object.
- `modalin:v1:calculatorDraft`: CalculatorDraft object.
- `modalin:v1:meta`: Meta object.

## Schemas

### SavedCalculation
```json
{
  "id": "string (unique)",
  "version": 1,
  "productName": "string",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string",
  "source": "user | demo",
  "input": {
    "productName": "string",
    "costItems": [
      {
        "id": "string",
        "name": "string",
        "category": "string",
        "amount": "number"
      }
    ],
    "outputQuantity": "number",
    "failedQuantity": "number",
    "sellingUnit": "string",
    "sellingPrice": "number",
    "language": "id | en",
    "currency": "IDR",
    "roundingStep": "number"
  },
  "result": {
    "totalProductionCost": "number",
    "outputQuantity": "number",
    "failedQuantity": "number",
    "sellableQuantity": "number",
    "sellingUnit": "string",
    "sellingPrice": "number",
    "grossRevenue": "number",
    "hppPerUnit": "number",
    "profitPerUnit": "number",
    "totalProfit": "number",
    "marginPercent": "number",
    "markupPercent": "number",
    "profitStatus": {
      "key": "loss | low | okay | good | excellent"
    },
    "suggestedPrices": {
      "safe": { "price": "number", "margin": 25 },
      "ideal": { "price": "number", "margin": 40 },
      "premium": { "price": "number", "margin": 55 }
    },
    "warnings": "array",
    "isProfitable": "boolean",
    "calculatedAt": "ISO date string"
  }
}
```
*Note: Both input and result snapshots are stored. This enables fast rendering without recalculation overhead, while maintaining the ability to recalculate in the future using the `input` parameters.*

### AppSettings
```json
{
  "version": 1,
  "language": "id | en",
  "currency": "IDR",
  "roundingStep": 500,
  "updatedAt": "ISO date string"
}
```

### CalculatorDraft
```json
{
  "version": 1,
  "updatedAt": "ISO date string",
  "form": {
    "productName": "string",
    "costItems": "array",
    "outputQuantity": "number|string",
    "failedQuantity": "number|string",
    "sellingUnit": "string",
    "sellingPrice": "number|string"
  }
}
```

### Meta
```json
{
  "version": 1,
  "initializedAt": "ISO date string",
  "lastOpenedAt": "ISO date string",
  "migrationHistory": []
}
```

## Migration Notes
The current version is `v1`. The `runStorageMigrations` function in `src/lib/storage/migration.js` initializes the `meta` key. In future phases (e.g. `v2`), this function will read the existing keys, restructure the JSON, update the version number, and log the migration to `migrationHistory`.

## Backup/Export Helper Notes
Stubs exist in `src/lib/storage/backup.js` for JSON extraction. An export returns a single unified JSON object encapsulating `version`, `settings`, and `calculations`.
