# Phase 15 - Acceptance Criteria

The Supplier & Purchase Log system must satisfy all criteria below to be considered complete.

## Functional Criteria
1. **Supplier Management**: Users must be able to create, read, update, and delete suppliers. Default sorting lists favorites first.
2. **Purchase Recording**: Multi-item purchase logs can be stored, including prices, quantities, dates, invoice numbers, and payment modes.
3. **Stok Auto-Update**: If `addToStock` is set, a stock movement (`stock_in`) is automatically logged, immediately updating inventory stock levels.
4. **Auto-Cost Update**: If `updateIngredientPrice` is set, the ingredient's cost updates automatically. If units differ, they convert based on standard weight/volume conversion formulas (and density if cross-type). Skip and display a warning toast if units are incompatible.
5. **Historical Logs**: When deleting suppliers, historical purchase logs referencing them must remain untouched. The name snapshot ensures historic log readability.
6. **Data Portability**: Full JSON backup and restore, CSV exporting, guest/user scoped isolation, and sync mappings are supported.

## Technical Criteria
1. **Tests**: All 6 Vitest suites for supplier and purchase storage, calculation, inventory/pricing integration, portability, and sync mapping must pass successfully.
2. **Build**: The React development server and production bundler compile successfully without any error outputs.
3. **Design**: Styling matches the premium dark-theme elements and warm accents of the application shell. Dialog layout behaves correctly across mobile devices.
