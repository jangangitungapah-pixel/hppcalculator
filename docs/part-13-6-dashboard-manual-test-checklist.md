# Manual QA Checklist - Part 13.6: Dashboard Premium Overhaul

Use this checklist to perform manual verification of the premium dashboard layouts, states, responsiveness, and interaction points.

## A. Dashboard Empty State (First Load / Guest)

1. [ ] Clear browser cache or ensure there is no business data in active scope.
2. [ ] Open the homepage/dashboard.
3. [ ] **Verify**:
    - The `DashboardHero` card displays: `"Selamat datang di Modalin"`.
    - Hero visual features a sunset-orb gradient and sparkles icon.
    - Three status tags (`Local-First`, `Cloud Sync Opsional`, `Backup Tersedia`) are displayed.
    - The split-view `DashboardEmptyState` card is visible.
    - Left side displays the title `"Mulai dari produk pertamamu"` and explanation text.
    - Main buttons `"Hitung HPP Sekarang"` and `"Coba Data Demo"` are rendered.
    - Right side renders three floating stats mock cards: `"HPP / Unit Rp 4.500"`, `"Margin Keuntungan 35%"`, `"Harga Ideal Rp 8.000"` (hidden on mobile, visible on desktop).
    - Quick actions and the tips card are rendered correctly.
4. [ ] Click **"Coba Data Demo"** on the empty state.
5. [ ] **Verify**:
    - A success toast is displayed.
    - The dashboard switches instantly to the **Data State**.

---

## B. Dashboard Data State

1. [ ] Ensure demo data is loaded (dashboard contains calculation lists and active summaries).
2. [ ] **Verify**:
    - `DashboardHero` greeting says: `"Selamat Pagi, F&B Owner!"` (or Siang/Sore/Malam depending on local time).
    - `DashboardMetricGrid` displays 4 cards:
      - Total Produk (Box icon)
      - Margin Rata-rata (TrendingUp icon, color-coded)
      - Menu Sehat (CheckCircle icon)
      - dedicated "Laporan" button card showing loss alerts and a chevron arrow.
    - Counters in the metric grid perform incremental animations (`AnimatedNumber`).
    - `DashboardBusinessPulse` renders a diagnostic segmented bar (Healthy green, Low amber, Loss red) representing the data percentages.
    - `DashboardNewProductCta` (Punya produk baru? banner) is displayed in bright gradient tones with a transparent calculator illustration.
    - `DashboardRecentCalculations` displays the latest saved items.
      - Each item card shows a color indicator strip, price, and margin percentage.
    - `DashboardQuickActions` renders all 8 main shortcuts.
    - `DashboardRecommendations` is visible (showing active advice cards or the positive fallback checkmark).
    - `DashboardTipsCard` at the bottom displays the beginner tips correctly.

---

## C. Interaction & Navigation Checks

1. [ ] Click **"Laporan"** shortcut card in the metric grid $\rightarrow$ navigates to `/reports`.
2. [ ] Click detail button in **Business Pulse** card $\rightarrow$ navigates to `/reports`.
3. [ ] Click **"Hitung HPP"** in the calculator CTA $\rightarrow$ navigates to `/calculator`.
4. [ ] Click on one of the **Recent Calculations** cards $\rightarrow$ navigates to `/history/:id`.
5. [ ] Click **"Lihat Semua"** next to recent calculations header $\rightarrow$ navigates to `/history`.
6. [ ] Click each of the **Quick Action** cards $\rightarrow$ routes to their respective pages correctly.
7. [ ] Click **"Lihat Detail"** action inside a Recommendation card $\rightarrow$ routes to the correct optimization screen.

---

## D. Responsive Viewports

1. [ ] Resize browser width to **390px (Mobile)**.
2. [ ] **Verify**:
    - No horizontal scrollbars appear (no layout overflow).
    - Hero stacks vertically with text centered.
    - Metric cards display as a 2-column grid.
    - Quick Action cockpit buttons display as a 2-column grid.
    - Recent calculation items stack vertically.
    - Bottom navigation bar overlays cleanly without blocking content.
3. [ ] Resize browser width to **768px (Tablet)**.
4. [ ] **Verify**:
    - Metrics, action cards, and calculation lists auto-adjust layout grids cleanly.
