# Manual Test Checklist - Phase 5

## App Shell & Navigation
- [x] App opens on `/welcome` by default.
- [x] Navigation to `/dashboard` works.
- [x] On desktop (>1024px), sidebar is visible and bottom nav is hidden.
- [x] On mobile (<1024px), bottom nav is visible and sidebar is hidden.
- [x] Welcome page hides bottom nav/sidebar.
- [x] Language switch in header correctly toggles text instantly (in-memory).

## Dashboard (Mock)
- [x] Displays average margin (calculated from mock data).
- [x] Displays recent calculations from mock data.
- [x] Clicking a recent calculation routes to its detail page.

## Calculator
- [x] Clicking "Hitung Sekarang" on empty form triggers validation alert.
- [x] Adding a cost row works.
- [x] Removing a cost row works (cannot remove if it's the last one).
- [x] Entering valid inputs and clicking calculate works.
- [x] **Desktop behavior:** Result panel appears on the right side.
- [x] **Mobile behavior:** App routes to `/calculator/result`.

## Result Screen
- [x] HPP, Profit, Margin, and Markup are displayed.
- [x] Profit Status Badge displays correct color based on result.
- [x] Human-readable summary matches status.
- [x] Suggested prices (Safe, Ideal, Premium) are displayed.

## History (Mock)
- [x] `/history` shows list of mock items.
- [x] Clicking an item navigates to `/history/:id`.
- [x] Detail view shows full breakdown of that specific mock calculation.

## Settings
- [x] Language toggle works.
- [x] Currency dropdown is present but disabled.
- [x] Rounding Step dropdown is present but disabled.

## PWA
- [x] `manifest.webmanifest` exists in `/public`.
- [x] `index.html` links to manifest and sets `theme-color`.
