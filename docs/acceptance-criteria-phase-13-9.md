# Acceptance Criteria — Phase 13.9: Ingredients Overhaul

The following criteria must be satisfied to consider this phase complete:

## 1. Modular Architecture
- Monolithic `IngredientsPage.jsx` refactored into a composer.
- Individual elements (Hero, Stats, Toolbar, Card, List, Empty State, Demo Banner, Pill) extracted into distinct files in `src/components/ingredients/`.

## 2. Dynamic Sorting, Searching & Filtering
- Supports search by keyword (name, category, unit).
- Category filter handles the dynamic set of categories present in the database.
- Source filter separates demo vs user-owned items.
- Sorting works for Name A-Z/Z-A, Price High-Low/Low-High, and Newer items.

## 3. Custom Presentation Styles
- Toggle between grid and list layouts.
- Grid mode presents clean card cards with HSL-based category visual colors.
- List mode uses dense row components on desktop, collapsing to stacked mobile elements.

## 4. Safeguard Warning Flows
- Deletion triggers a warning: explaining that existing recipes will keep their costs but the deleted item won't be available for future calculations.

## 5. UI Hygiene
- No console warnings or undefined variables.
- Standardized select element heights inside the form view.
- Success toasts trigger on all demo loading, editing, and deletion operations.
