# Phase 6: LocalStorage Persistence & Data Management

## Goal
Implement a robust, local-first data persistence layer using native browser `localStorage`, React Context, and Custom Hooks without introducing external state management dependencies (like Redux or Zustand) or backend integration.

## What was implemented

### Storage Client
We created safe wrappers around `localStorage` (`src/lib/storage/localStorageClient.js`) that handle quota errors, unavailable storage (e.g. strict incognito modes), and JSON parsing errors gracefully.

### Storage Modules
Data logic is isolated from UI pages:
- **`calculationsStorage.js`**: CRUD operations for user calculations.
- **`settingsStorage.js`**: Persistence for app settings (language, currency, roundingStep).
- **`draftStorage.js`**: Autosave persistence for the active calculator session.
- **`migration.js`**: Initial foundation for meta versioning and migrations.
- **`backup.js`**: Stubs for importing/exporting JSON data.

### Storage Keys
All keys are versioned and namespaced to prevent collisions and simplify future migrations:
- `modalin:v1:calculations`
- `modalin:v1:settings`
- `modalin:v1:calculatorDraft`
- `modalin:v1:meta`

### Data Flow
- **`AppDataContext`**: Acts as the single source of truth for the app. It initializes data from `localStorage` on mount, holds state in memory for fast UI access, and provides updater functions (`saveCalculation`, `updateSettings`, `loadDemoData`) that sync memory state with disk simultaneously.
- **`ToastContext`**: A lightweight context + portal system to display accessible success/error notifications.

### Save Flow
1. User enters data in Calculator.
2. Clicking "Hitung Sekarang" validates and shows the Result.
3. Clicking "Simpan Perhitungan" calls `saveCalculation(input, result)` from `AppDataContext`.
4. The calculation is stored in `modalin:v1:calculations` with both input and result snapshots.
5. The draft is cleared, a toast appears, and the user is redirected to the History view.

### Draft Flow
- The `CalculatorPage` debounces form input and saves to `modalin:v1:calculatorDraft`.
- If a user refreshes or accidentally closes the tab, `CalculatorPage` restores the draft on mount and shows a toast.

### Settings Flow
- Language and rounding options are stored in `modalin:v1:settings`.
- Language changes instantly update the UI (via `useLanguage` hook syncing to context).
- Rounding changes affect the suggested prices algorithm in the calculator.

### Demo Data Behavior
- When the history is completely empty, an "Empty State" appears offering a "Muat Contoh Data" (Load Demo Data) button.
- Clicking this injects seed data tagged with `source: "demo"` into `localStorage`. This ensures users can explore the app without us silently mixing mock data with real data.

## What remains deferred
- Impor/Ekspor UI: The backup scripts exist, but the UI triggers are disabled placeholders.
- Delete All Data: Button exists in settings but is a disabled placeholder to prevent accidental data loss.
- Cloud Sync/Backend.

## How to test manually
Run the app (`npm run dev`) and follow the `docs/phase-6-manual-test-checklist.md` to ensure all functionality behaves as expected across refreshes.
