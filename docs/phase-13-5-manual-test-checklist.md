# Manual QA Checklist - Phase 13.5: Sync Scope & Guest Isolation

Use this checklist to perform manual end-to-end verification of user isolation, guest data retention, and cloud synchronization behavior.

## A. Guest Data Isolation and Persistence

1. [ ] Open the application as a **Guest / Local user**.
2. [ ] Navigate to the **Bahan (Ingredients)** page and add a new ingredient named `"Tepung Guest"`.
3. [ ] Go to the **Simulasi HPP (Calculations)** page and save a calculation named `"Produk Guest"`.
4. [ ] Refresh the page in the browser.
5. [ ] **Verify**:
    - Both `"Tepung Guest"` and `"Produk Guest"` calculations are still present.
    - The Header sync badge reads `"Local"`.
    - Navigating to `/sync` shows the message: `"Mode lokal aktif. Login untuk sinkronisasi cloud."`

---

## B. Login Account A & Sync Dismissal

1. [ ] Navigate to the login page and authenticate with **Account A** (e.g. `userA@example.com`).
2. [ ] **Verify**:
    - A prompt appears: `"Kamu punya data Guest yang belum masuk akun ini."` with CTA `"Salin Guest ke Akun & Sync"`.
3. [ ] Click **"Nanti Saja"** to decline/dismiss the prompt.
4. [ ] **Verify**:
    - The prompt disappears.
    - The data from the Guest scope (`"Tepung Guest"`, `"Produk Guest"`) is **NOT** present in Account A.
    - Account A's dashboard / calculations are empty.
5. [ ] Add a new ingredient named `"Tepung Akun A"`.
6. [ ] Navigate to the **Sync Center** (`/sync`). The status badge shows `"Local akun"`.
7. [ ] Click **"Upload ke Cloud"** or **"Sinkronkan Sekarang"**.
8. [ ] **Verify**:
    - Sync status changes to `"Synced"` (badge says `"Synced"`).
    - Inspect Firestore database. Under `users/{uidA}/syncRecords`, verify a record exists for `"Tepung Akun A"`.

---

## C. Logout & Guest Return

1. [ ] Log out of **Account A**.
2. [ ] **Verify**:
    - The application reverts to Guest mode.
    - `"Tepung Guest"` and `"Produk Guest"` reappear.
    - `"Tepung Akun A"` is **NOT** visible.
    - Header sync badge returns to `"Local"`.

---

## D. Login Account B (Isolating Account A)

1. [ ] Log in with **Account B** (e.g. `userB@example.com`).
2. [ ] **Verify**:
    - The guest prompt `"Kamu punya data Guest yang belum masuk akun ini."` appears again (since guest data is preserved). Dismiss it by clicking **"Nanti Saja"**.
    - `"Tepung Akun A"` is **NOT** visible.
    - Account B's list is empty.
3. [ ] Add a new ingredient named `"Tepung Akun B"`.
4. [ ] Go to `/sync` and sync Account B's data to the cloud.
5. [ ] **Verify**:
    - Sync succeeds.
    - Inspect Firestore database. Under `users/{uidB}/syncRecords`, verify a record exists for `"Tepung Akun B"`.

---

## E. Switch Back to Account A

1. [ ] Log out of Account B and log back into **Account A**.
2. [ ] Dismiss the guest import prompt if it appears.
3. [ ] **Verify**:
    - `"Tepung Akun A"` is present.
    - `"Tepung Akun B"` is **NOT** present.
    - Perform a pull or bidirectional sync and verify no Account B data gets pulled into Account A.

---

## F. Guest Import Verification

1. [ ] Create or log in with a brand new **Account C** (e.g. `userC@example.com`).
2. [ ] When the guest import prompt appears, click **"Salin Guest ke Akun & Sync"**.
3. [ ] **Verify**:
    - The dashboard/lists refresh and now contain `"Tepung Guest"` and `"Produk Guest"`.
    - Go to `/sync` and verify the data has synced to Account C's cloud space.
4. [ ] Log out of Account C.
5. [ ] **Verify**:
    - You are returned to Guest mode.
    - The original guest data `"Tepung Guest"` and `"Produk Guest"` is still preserved in Guest scope.
