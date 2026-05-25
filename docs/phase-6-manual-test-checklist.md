# Manual Test Checklist - Phase 6

## Persistence & Storage
- [x] Storage keys are correctly versioned (`modalin:v1:...`).
- [x] Application handles corrupted JSON or unavailable `localStorage` without crashing.

## Calculator & Draft
- [x] Typing into the calculator form triggers an autosave (debounced).
- [x] Refreshing the browser while halfway through a calculation restores the form inputs and shows a "Draft Restored" toast.
- [x] Clicking "Reset" clears the draft and shows a toast.

## Save Flow
- [x] Calculating and clicking "Simpan Perhitungan" (Save Calculation) on the desktop right-panel works.
- [x] Calculating and clicking "Simpan Perhitungan" on the mobile Result page works.
- [x] Saving a calculation successfully redirects to the History list and shows a Success toast.
- [x] The saved calculation draft is cleared upon successful save.

## Dashboard & History (Real Data)
- [x] Dashboard metrics (Total, Average Margin, Healthy) are calculated correctly from `localStorage`.
- [x] Dashboard empty state appears if no calculations exist.
- [x] History page lists real saved calculations (no hardcoded mocks).
- [x] Detail page (`/history/:id`) retrieves the correct object from storage.

## Demo Data
- [x] Clicking "Muat Contoh Data" (Load Demo Data) successfully populates storage with realistic F&B examples.
- [x] Demo data displays a "Demo" badge to distinguish it from user-created data.

## Deletion
- [x] Clicking "Hapus" (Delete) on the History list opens the Confirmation Dialog.
- [x] Clicking "Hapus" on the Detail page opens the Confirmation Dialog.
- [x] Confirming deletion removes the item, updates UI, and displays a Success toast.
- [x] Canceling or pressing `Escape` closes the modal without deleting.

## "Use Again" (Gunakan Lagi)
- [x] Clicking "Gunakan Lagi" from the Detail page navigates to `/calculator`.
- [x] The form is pre-filled with the exact inputs from that saved calculation.

## Settings Persistence
- [x] Changing the Language updates the UI immediately and persists across browser refreshes.
- [x] Changing the Rounding Step persists across refreshes.
- [x] Modifying the Rounding Step alters the `suggestedPrices` outputs correctly in new calculations.

## Toasts
- [x] Toasts appear in the top-right (desktop) or fixed appropriately (mobile).
- [x] Toasts auto-dismiss after a few seconds.
- [x] Toasts can be dismissed manually by clicking the 'X'.
