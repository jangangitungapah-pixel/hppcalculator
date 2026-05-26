# Dashboard Premium Overhaul - Part 13.6 Documentation

This document describes the redesign, decomposition, and modularization of the Modalin main dashboard into a premium command cockpit designed specifically for F&B business owners.

## 1. Visual Aesthetics System
The dashboard has been updated to follow a premium SaaS cockpit aesthetic:
- **Core Color Scheme**: Rich cream backgrounds (`var(--color-background-warm)`), sunset orange gradients (`var(--color-primary)` to `var(--color-accent-coral)`), and profit green accents (`var(--color-secondary)`).
- **Cards**: Soft glassmorphism cards with thick borders (`var(--radius-xl)` / `var(--radius-2xl)`), layered depth shadows (`var(--shadow-card)`), and responsive hover transforms.
- **Numbers**: Set to use large, readable tabular fonts for numerical alignments.

---

## 2. Component Decomposition
The monolithic `DashboardPage.jsx` has been split into 10 cohesive components located under `src/components/dashboard/`:

1. **`DashboardHero.jsx`**: Time-of-day greeting (Pagi/Siang/Sore/Malam), store profile name display, custom sunset orb design, and system status tags.
2. **`DashboardMetricGrid.jsx`**: Layout grid displaying total calculations, average margin, healthy menu count, and reports shortcut. Integrates count animations.
3. **`DashboardBusinessPulse.jsx`**: Interactive color-segmented health bar (Healthy, Low Margin, Loss) based on report statistics, mapping progress without external chart libraries.
4. **`DashboardNewProductCta.jsx`**: Sunset orange promotional card inviting users to calculate newly introduced food/drink products.
5. **`DashboardRecentCalculations.jsx`**: Shows the top 3 calculations complete with profit badges, top colored accent strips, and price/margin lists. Includes fallback empty rows.
6. **`DashboardActionCard.jsx`**: Individual action trigger with a custom accent color and chevron indicator.
7. **`DashboardQuickActions.jsx`**: Central actions dashboard command grid containing shortcuts to calculate HPP, recipes, ingredients, pricing, ojol channel configurations, reports, data backups, and cloud sync settings.
8. **`DashboardRecommendations.jsx`**: Displays automated advice from the recommendation engine with severity status colors (danger, warning, success, info).
9. **`DashboardTipsCard.jsx`**: Compact coaching note displaying beginner guides and dynamic links based on data status.
10. **`DashboardEmptyState.jsx`**: Two-pane onboarding view. Left side: action items for calculating and loading demo data. Right side: floating statistic cards mockups.

---

## 3. CSS Overrides & Responsive Classes
- Custom dashboard styling is isolated inside `src/styles/pages.css` under the `/* Dashboard Premium Overhaul Styles */` section.
- Responsive breakpoints are handled dynamically:
  - Mobile (< 640px): Hero panel converts to vertical stack with centered texts; metric grids, action grids, and calculations scale to 2-column/1-column layouts; cards have tight margins.
  - Tablet (640px to 1024px): Responsive layout grid wraps columns.
  - Desktop (> 1024px): Full dashboard grid cockpit displays.
