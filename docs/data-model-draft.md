# Data Model Draft

Since Phase 1 utilizes `localStorage`, the data model is designed to be easily serialized into JSON.

## 1. AppSettings
Stores the user's basic preferences.
```json
{
  "language": "id",          // "id" | "en"
  "currency": "IDR",         // "IDR" | "USD"
  "targetMargin": 40,        // Default target margin %
  "hasSeenOnboarding": true  // boolean
}
```

## 2. QuickCalculation
Stores the records of calculations made by the user.
```json
{
  "id": "uuid-string",
  "productName": "Brownies Lumer",
  "ingredientCost": 50000,
  "packagingCost": 10000,
  "additionalCost": 5000,
  "sellableQuantity": 10,
  "sellingPrice": 15000,
  "calculatedAt": "2023-10-01T12:00:00Z",
  
  // Computed values (saved to prevent recalculation issues if logic changes)
  "totalCost": 65000,
  "hppPerUnit": 6500,
  "profitPerUnit": 8500,
  "totalProfit": 85000,
  "marginPercent": 56.6,
  "status": "Healthy" // "Loss" | "Thin" | "Safe" | "Healthy"
}
```

## Future Entities (SaaS Relational Database)
*These will be mapped to a real database (e.g., PostgreSQL) in future phases.*

- **UserProfile:** id, email, businessName, subscriptionTier, createdAt.
- **Ingredient:** id, userId, name, unit (kg, gr, ml), costPerUnit, lastUpdated.
- **Recipe:** id, userId, name, expectedYield, recipeCategory.
- **RecipeItem:** id, recipeId, ingredientId, quantityUsed.
- **CostItem:** generic additional costs tied to a recipe (e.g., sticker packaging).
- **SalesChannel:** id, userId, channelName (e.g., "GrabFood", "Reseller"), markupPercentage, feePercentage.
