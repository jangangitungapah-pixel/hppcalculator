# Acceptance Criteria - Phase 13.5: Firebase Sync Scope & Guest Isolation

This document outlines the formal acceptance criteria for Phase 13.5. All checklist items must pass verification.

## 1. Storage Auditing & Hardening
- [ ] No global business data active keys (`modalin:v1:ingredients`, etc.) are written directly; they must always go through `setScopedJson` / `getScopedJson`.
- [ ] `deleteAllCalculations` must clear only the calculations within the active scope, leaving other user caches and guest caches intact.

## 2. Guest Data Isolation
- [ ] Guest data is prefixed with `modalin:v1:guest:`.
- [ ] Logged-in user data is prefixed with `modalin:v1:user:{uid}:`.
- [ ] Reverting to guest mode on logout must reload guest data cleanly and hide all previous user data.

## 3. Account-to-Account Isolation
- [ ] Switching from Account A to Account B must switch the localStorage prefix.
- [ ] No local data from Account A must bleed or render in Account B's interface.
- [ ] Auto-sync triggers must be guarded with active scope validation matching the authenticated Firebase user.
- [ ] Pull sync operations (`applyCloudRecordsToLocalStorage`) must verify the active storage scope matches the target user's UID and abort if a mismatch occurs.

## 4. Guest Import Flow
- [ ] Logged-in users with empty scopes must be prompted to import guest data if guest data exists.
- [ ] The import must process all 8 business modules: calculations, settings, ingredients, recipes, products, channelProfiles, pricingSimulations, and bundleSimulations.
- [ ] Merging array items must deduplicate by ID, keeping the record with the newer `updatedAt` field.
- [ ] Settings must shallow-merge with user settings having priority.
- [ ] Importing guest data must not delete or empty the guest storage scope.

## 5. UI & Sync badge State alignment
- [ ] The sync badge in the header must reflect:
  - `"Local"` for guest mode.
  - `"Local akun"` for logged-in users who have local changes but have not approved sync.
  - `"Siap Sync"` for logged-in, approved users ready to sync.
  - `"Syncing"` when a sync process is active.
  - `"Synced"` for successfully completed syncs.
  - `"Offline"` when connection is lost.
  - `"Sync Error"` for failed sync attempts.
- [ ] The `/sync` page shows clear and correct copy for guest mode, logged-in empty status, and approval status.
