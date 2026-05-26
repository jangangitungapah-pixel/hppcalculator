# Phase 13.9 — Ingredients Page Premium Overhaul Documentation

## Overview
This document details the architectural and UI/UX overhaul of the **Ingredients / Bahan Baku** page inside the Modalin application.

## Key Goals
- **Decompose** the monolithic ingredients page into reusable and maintainable subcomponents.
- **Improve Visual Design**: Add card gradients, category tone mappings, soft borders, and premium stats metrics.
- **Support Advanced Toolbar Controls**: Search, dynamic Category filtering, Source filtering (Demo vs User), and Sort selector.
- **Provide List and Grid Toggles**: Support both visual grid cards and a dense compact list row layout.
- **Enhance Mobile Usability**: Standardized button touch targets, stacked list rows on small screens, and responsive gutters.

## Modular Component Structure
All components are placed under `src/components/ingredients/`:
1. `IngredientsHero`: Clean banner card with action triggers.
2. `IngredientStatsGrid`: Visual metrics dashboard.
3. `IngredientsToolbar`: Houses filters, search input, and grid/list view switcher.
4. `IngredientCategoryPill`: Category badge maps with visual tone and Lucide icons.
5. `IngredientCard`: Visual card grid layout.
6. `IngredientListView`: Table-like row layout that collapses to card-stacks on mobile.
7. `IngredientEmptyState`:Illustrated onboarding layout with mock chips.
8. `IngredientDemoBanner`: Subtle reminder for empty database or additional data load.

## Helpers & Visual Systems
- `src/lib/ingredients/ingredientVisuals.jsx`: Formats category strings to local labels, specific tone classes (orange, green, purple, blue, amber, neutral), and dynamic icons.
- `src/lib/ingredients/ingredientFormatters.js`: Formats purchase price, usage price, unit conversion info, and completeness score.
