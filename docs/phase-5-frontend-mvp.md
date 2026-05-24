# Phase 5: Frontend MVP App Shell & Core Screens

## Goal
Implement the core React frontend, integrating Tailwind CSS styling and the Phase 2 calculation engine, using mock data for dashboard and history. No localStorage or backend persistence is implemented in this phase.

## Dependencies Installed
- **Runtime:** `react-router-dom`, `lucide-react`
- **Dev:** `tailwindcss`, `postcss`, `autoprefixer`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`

## Screens Implemented
1. **WelcomePage:** Introduction and onboarding.
2. **DashboardPage:** Summary overview with mock data.
3. **CalculatorPage:** Core form with desktop result panel.
4. **ResultPage:** Mobile dedicated result screen.
5. **HistoryPage:** Mock list of past calculations.
6. **HistoryDetailPage:** Detailed view of a mock calculation.
7. **SettingsPage:** In-memory toggle for Language, with disabled placeholders for currency/rounding.
8. **NotFoundPage:** 404 fallback.

## Components Implemented
- `Button`, `Card`, `Input`, `Select`, `Badge`, `Alert`, `EmptyState`, `SummaryCard`, `ResultCard`, `CostItemRow`, `LanguageSwitch`.
- Layouts: `AppShell`, `Header`, `SidebarNav`, `BottomNav`, `PageContainer`.

## Routing Implemented
Configured via React Router in `App.jsx`. Root `/` redirects to `/welcome`. Sidebar and Bottom Nav handle active states.

## Calculator Integration
`CalculatorPage.jsx` is fully wired to `/src/lib/calculations/index.js`.
- It dynamically manages cost item rows.
- It validates before calculating, showing friendly alerts.
- On calculation, desktop shows a sticky right panel. Mobile routes to `/calculator/result` passing the calculation payload in route state.

## Mock Data
Added `/src/data/mockCalculations.js` with 4 realistic items to populate Dashboard and History.

## Intentionally Deferred to Phase 6
- LocalStorage persistence for saving calculations.
- LocalStorage persistence for settings (Language, Currency).
- Deletion logic.

## How to Run
```bash
npm run dev
```

## How to Test
```bash
npx vitest run src/tests/calculatorIntegration.test.jsx
```
