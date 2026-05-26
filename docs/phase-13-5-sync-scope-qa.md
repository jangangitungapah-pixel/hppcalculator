# Phase 13.5: Firebase Sync Scope & Guest Data Isolation Hardening QA Documentation

This document describes the behavior and implementation details of local-first data isolation in Modalin, ensuring that guest data, user A data, user B data, and remote cloud data do not mix during login, logout, and multi-account switching.

## Storage Scope Architecture

Modalin uses a scoped localStorage design. Keys in localStorage are automatically prefixed based on the active storage scope:

1. **Guest Scope**:
   - Prefix: `modalin:v1:guest:`
   - Keys:
     - `modalin:v1:guest:ingredients`
     - `modalin:v1:guest:calculations`
     - `modalin:v1:guest:recipes`
     - etc.

2. **User Scope**:
   - Prefix: `modalin:v1:user:{uid}:`
   - Keys:
     - `modalin:v1:user:{uid}:ingredients`
     - `modalin:v1:user:{uid}:calculations`
     - `modalin:v1:user:{uid}:recipes`
     - etc.

---

## User Flows & Behavior Rules

### 1. Guest Mode
- All data created in Guest mode is stored under the `modalin:v1:guest:` prefix.
- The sync status badge in the header shows `"Local"`.
- Accessing the Sync Center shows a screen prompting the user to login: `"Mode lokal aktif. Login untuk sinkronisasi cloud."`

### 2. Guest $\rightarrow$ Login (Initial Sync Prompt)
When a user logs in, the active storage scope is immediately switched to `modalin:v1:user:{uid}` via the `AuthStorageBridge` component.
- The system checks both the active user's scoped storage and the guest scoped storage.
- **Scenario A: Active User has data**:
  - Show initial sync prompt: `"Kamu punya data lokal di akun ini yang belum disinkronkan."`
  - CTA: `"Upload ke Cloud"`
  - Action: Marks `localUploadApprovedAt` and pushes local user data to the cloud.
- **Scenario B: User scope is empty but Guest scope has data**:
  - Show initial sync prompt: `"Kamu punya data Guest yang belum masuk akun ini."`
  - CTA: `"Salin Guest ke Akun & Sync"`
  - Action: Merges guest data into the active user's scope (preserving original guest data) and performs a push sync to the cloud.
- **Scenario C: Both User and Guest scopes are empty**:
  - The system automatically approves future synchronization (`localUploadApprovedAt` is set) silently without prompting the user.
  - Development Log: `[Sync] Auto-approved empty user scope for future sync.`

### 3. Merging Rules (Guest $\rightarrow$ User)
- **Array modules** (Ingredients, Calculations, Recipes, Products, Channel Profiles, Simulations):
  - Records are merged by `id`.
  - In case of collision, the record with the newer `updatedAt` (or `createdAt` fallback) is kept.
  - Guest records are not deleted from guest scope.
- **Settings**:
  - Shallow merged where user settings take priority over guest settings.

### 4. Logout
- When the user logs out, the active storage scope immediately reverts to `{ type: 'guest', uid: null }`.
- App data reloads. The user can see all their original guest data. None of the logged-in user's data is visible.
- Sync status badge reverts to `"Local"`.

### 5. Multi-Account Switch (User A $\rightarrow$ Logout $\rightarrow$ User B)
- **User A Scope**: `modalin:v1:user:uidA:...`
- **User B Scope**: `modalin:v1:user:uidB:...`
- Since prefixes are bound to the authenticated `uid`, switching accounts automatically isolates their respective caches.
- Cloud pull/push is strictly verified: `applyCloudRecordsToLocalStorage` rejects and aborts writes if the active scope UID does not match the record UID being synced.
