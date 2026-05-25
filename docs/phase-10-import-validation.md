# Phase 10 Import Validation

When a user selects a JSON file for import, the `backupValidator` executes the following checks:

## 1. Envelope Validation
- The file must be valid JSON.
- `kind` must equal `"modalin-local-backup"`.
- `data` object must be present.
- If it fails, the import halts entirely with an "Invalid File" error.

## 2. Version Check
- The `version` property is checked against the current `BACKUP_FORMAT_VERSION`.
- If the incoming version is higher, it raises a **warning**, but permits import. We assume future versions are backwards compatible, but the user should be aware.

## 3. Data Shape Validation
- Every expected module in the `data` object is checked. If present, it must be an array (or an object for `settings`).
- We tolerate missing optional fields or missing arrays by falling back to empty arrays `[]`.

## 4. Conflict Calculation
- The validator maps all existing IDs in the local `appData`.
- It iterates over the incoming backup data arrays.
- It counts the number of overlapping IDs and stores this in the `conflicts` property.

## Import Behavior

### Replace Mode
- Drops all existing business arrays in `localStorage`.
- Injects the arrays directly from the backup JSON.
- Replaces settings (if `includeSettings` is true).

### Merge Mode
- For each module array, `backupImporter` runs `mergeArrayById()`.
- Iterates through incoming records. If an incoming record `id` matches a current record `id`, the incoming record is **skipped**.
- New records are appended to the current data.
- If `includeSettings` is true, settings are shallowly merged.

## Edge Cases
- **Missing modules in backup:** Will leave existing modules untouched in Merge mode, or empty them in Replace mode.
- **Malformed records:** If individual array items are malformed, the validator could be extended to skip them, but currently we accept them assuming the app code is fault-tolerant.
