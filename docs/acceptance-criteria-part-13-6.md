# Acceptance Criteria - Part 13.6: Dashboard Premium Overhaul

This document defines the quality gates and visual constraints that must be verified for the Dashboard Page redesign.

## 1. Code Modularization
- [ ] `DashboardPage.jsx` must not contain inline rendering of hero cards, metric grids, empty states, or calculation items; it must delegate them to subcomponents in `src/components/dashboard/`.
- [ ] Subcomponents must retrieve active settings, language translations, and toast commands safely using existing custom React hooks.
- [ ] No new NPM packages or dependency libraries must be imported or added.

## 2. Empty State Visuals
- [ ] When the workspace has no data, a split-layout card must be rendered.
- [ ] The left side must provide title, body text, and direct buttons for starting HPP calculations and loading demo data.
- [ ] The right side must render floating stat previews (HPP, Margin, Ideal Price) on desktop, which must be hidden on mobile screen widths.
- [ ] Standard quick actions grid must render below the onboarding card.

## 3. Data State Visuals
- [ ] The metric grid must display 4 cards, including an interactive Laporan button card with warning messages if items are at loss.
- [ ] A diagnostic progress bar showing segment fractions of healthy, low-margin, and loss items must be rendered without external canvas/chart engines.
- [ ] The recent calculations area must render up to 3 calculation cards with top status color indicators. If the list is empty, a clean placeholder card must be rendered.
- [ ] A dedicated sunset-gradient promotional calculator banner must be rendered in the data state layout.

## 4. Layout & Styling Rules
- [ ] All custom style classes (e.g. `.dashboard-hero`, `.dashboard-metric-card`, `.business-pulse-card`, `.dashboard-action-card`, etc.) must be defined inside `src/styles/pages.css`.
- [ ] Variables defined in `design-tokens.css` must be used for layout spacing, margins, border radii, shadows, and color states.
- [ ] Layout sheets must scale responsively across Mobile (< 640px), Tablet (640px to 1024px), and Desktop (> 1024px) sizes.
- [ ] Transitions (hover lifts, translate shifts, gradient animations) must execute smoothly.
- [ ] Production build (`npm run build`) and test suites (`npm run test`) must compile and execute successfully.
