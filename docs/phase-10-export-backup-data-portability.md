# Phase 10: Export, Backup & Data Portability

## Goal
Create a complete local-first data portability system for Modalin without relying on a backend. Users should be able to safely backup their data, restore it on any device, and export it as CSV for analysis.

## Features Implemented
- **Data & Backup Page**: A centralized dashboard to manage backups, export CSVs, check data health, and reset local storage.
- **Full JSON Backup Export**: Exports all modules into a backend-ready JSON structure.
- **JSON Backup Import with Preview**: Imports the JSON backup safely, offering a preview of conflicts and counts before applying.
- **Merge/Replace Modes**: Users can choose to merge incoming data (skipping duplicate IDs) or replace all existing modules.
- **CSV Export Center**: Export calculations, ingredients, recipes, products, and simulations into flat CSV files.
- **Data Health Check**: Estimates localStorage size and warns if corrupted or missing data is present.
- **Backup Reminder**: A smart banner reminding users to back up their data if they have accumulated significant records but have never exported.
- **Reset Functionality**: Includes draft resets, individual module resets, and a hard reset of all data that requires a strong confirmation step ("HAPUS").

## Backup Flow
1. User clicks "Export Backup".
2. `backupBuilder` collects all modules (excluding `calculatorDraft`).
3. Formats into the `modalin-local-backup` JSON envelope.
4. Native Blob download prompts the user to save the `.json` file.
5. The `backupMeta` record is updated with `lastBackupAt`.

## Restore/Import Flow
1. User selects a `.json` backup file.
2. `fileRead` parses the JSON.
3. `backupValidator` checks the schema (kind, version, required fields) and calculates module counts.
4. `ImportPreviewPanel` displays the incoming records and conflicts.
5. User selects "Merge" or "Replace" and clicks "Apply".
6. `backupImporter` writes the new data to `localStorage`.
7. `useAppData` context is refreshed to update the UI immediately.

## Reset Data Behavior
- Resets are protected by explicit confirmations.
- A full business data reset explicitly requires typing "HAPUS" to prevent accidental wipes.
- `calculatorDraft` is cleared separately and safely since it's just a working state.

## Intentionally Not Implemented
- No Cloud Sync/Backend integration (Modalin remains fully offline and local-first).
- No Encryption/ZIP formats (pure JSON).
- No PDF/Excel exports (only CSV for portability).
- No background workers or automatic scheduled backups (requires explicit user action).

## Next Phase Suggestions
- **Phase 10.5**: Polish UX and test portability across different browser profiles.
- **Phase 11**: PWA Offline Installability & App Experience enhancements.
