# User Flows

## 1. First-time User Opens the App
1. User opens the app URL.
2. System detects no previous localStorage data.
3. User sees **Welcome / Onboarding** screen.
4. User selects preferred language (default ID).
5. User taps "Hitung HPP Sekarang" (Start Calculating).
6. User is redirected to the **Quick HPP Calculator** page.

## 2. User Calculates HPP Quickly
1. User is on the **Quick HPP Calculator** page.
2. User enters Product Name (e.g., "Brownies Lumer").
3. User enters Total Ingredient Cost (e.g., 50000).
4. User enters Packaging Cost (e.g., 10000).
5. User enters Additional Cost (e.g., 5000 for gas/electricity).
6. User enters Sellable Output (e.g., 10 boxes).
7. User enters Selling Price per unit (e.g., 15000).
8. User taps "Hitung" (Calculate).
9. User is redirected to **Calculation Result** screen and sees the breakdown and health status.

## 3. User Saves a Calculation
1. User is on the **Calculation Result** screen.
2. User taps "Simpan Perhitungan" (Save Calculation).
3. System saves data to `localStorage`.
4. System shows a success toast/notification.
5. User is given options to "Back to Dashboard" or "Calculate Another".

## 4. User Views Saved Calculations
1. User taps "Saved" in the bottom navigation.
2. User sees a list of previously saved calculations.
3. User taps on one item to view the detailed **Calculation Result** screen.
4. (Optional) User taps the trash icon to delete the saved calculation.

## 5. User Changes Language
1. User taps "Settings" in the bottom navigation.
2. User selects "English" from the language options.
3. System instantly updates UI labels to English and saves preference to `localStorage`.

## 6. User Resets Local Data
1. User goes to **Settings**.
2. User taps "Reset All Data".
3. System shows confirmation modal: "Are you sure? This cannot be undone."
4. User confirms.
5. System clears `localStorage` and redirects to **Welcome / Onboarding** screen.

## 7. Future Flow: Registered SaaS User (Not in MVP)
1. User taps "Backup to Cloud" on the Dashboard.
2. User sees a Paywall or Login/Register screen.
3. User registers via Google Auth.
4. Local data is merged with cloud database.
5. User unlocks multi-device sync.
