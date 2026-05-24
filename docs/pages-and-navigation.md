# Pages and Navigation

## MVP Pages
1. **Welcome / Onboarding** (Visible to new users)
2. **Dashboard** (Visible)
3. **Quick HPP Calculator** (Visible)
4. **Calculation Result** (Visible)
5. **Saved Calculations** (Visible)
6. **Settings** (Visible)

## Future Pages (Locked/Hidden in MVP)
- Products/Menu
- Ingredients Database
- Recipe Costing
- Batch Production
- Yield/Waste Calculator
- Marketplace Pricing
- Reseller Pricing
- Reports
- Export
- AI Assistant
- Login/Register
- Billing/Subscription

## Recommended Navigation Structure
**Mobile-First Bottom Navigation Bar:**
- Home (Dashboard)
- Calculate (Quick HPP)
- Saved (History)
- Settings

**Desktop Layout Suggestion:**
- Left Sidebar for navigation (Home, Calculate, Saved, Settings).
- Main content area centered with maximum width limits to maintain a focused form experience (e.g., max-w-2xl).

## Page Descriptions

### 1. Welcome / Onboarding
**Purpose:** Introduce the app and let the user start quickly.
**Sections:**
- App headline & friendly greeting.
- Simple benefit explanation ("Hitung modal dan untung dengan mudah").
- Language selector.
- CTA: Start Calculating (Hitung HPP Sekarang).
- CTA: View Demo Example.

### 2. Dashboard
**Purpose:** Quick overview and shortcuts for returning users.
**Sections:**
- Greeting ("Halo, Juragan!").
- Quick action card (Start new calculation).
- Recent calculations list (last 3 items).
- Summary cards (Average margin from saved items).
- Beginner tips/quotes.

### 3. Quick HPP Calculator
**Purpose:** Fast calculation for beginners.
**Sections:**
- Product/Menu name input.
- Cost inputs: Ingredients, Packaging, Additional.
- Output quantity (Jumlah Hasil Jual).
- Selling price (Harga Jual).
- Calculate CTA.

### 4. Result Screen
**Purpose:** Show results in a human-readable, friendly way.
**Sections:**
- Total production cost.
- HPP per unit.
- Profit per unit.
- Total potential profit.
- Margin percentage.
- Status badge (Rugi / Tipis / Aman / Sehat).
- Friendly recommendation paragraph.
- CTA: Save calculation.
- CTA: Edit inputs.

### 5. Saved Calculations
**Purpose:** Show history from localStorage.
**Sections:**
- List of saved calculations with quick summary (Name, Margin, Profit).
- Simple search/filter.
- Delete item capability.

### 6. Settings
**Purpose:** Basic preferences.
**Sections:**
- Language toggle.
- Currency formatting.
- Reset local data (Danger zone).
