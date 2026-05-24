# Component Guidelines

## 1. Button System
**Purpose:** Trigger actions.
**Visual Style:** Minimum 44px height for touch targets. `radius-md`.
- **Primary:** `bg-brand-primary text-white`. Used for main actions ("Hitung Sekarang", "Simpan").
- **Secondary (Outline):** `border-brand-primary text-brand-primary bg-transparent`. Alternative actions.
- **Ghost:** `text-text-secondary bg-transparent hover:bg-surface-muted`. Subtle actions (Cancel, Back).
- **Destructive:** `bg-status-loss text-white` or `border-status-loss text-status-loss`. For delete/reset.
**States:** Disabled state uses opacity 50% and disables pointer events. Loading state adds spinner.

## 2. Card System
**Purpose:** Group related content.
**Visual Style:** `bg-surface radius-lg`.
- **Default Card:** `border` with no shadow.
- **Elevated Card:** No border, uses `shadow-card`.
- **Result Highlight Card:** Uses `brand-primary-soft` or `status-good-bg` to draw attention.

## 3. Form Input
**Purpose:** Text/Number entry.
**Visual Style:** Label above input, 16px font size to prevent iOS zoom.
- **Structure:** Label -> Input Box -> Helper Text/Error Text.
- **Focus:** Clear focus ring using `brand-primary`.
- **Currency/Quantity Input:** Include left-aligned `Rp` prefix or right-aligned `pcs` suffix using flex containers inside the input shell.

## 4. Profit Status Badge
**Purpose:** Instantly show financial health.
**Visual Style:** `radius-pill px-3 py-1 font-semibold`.
- **Loss:** `text-status-loss bg-status-loss-bg`
- **Low:** `text-status-low bg-status-low-bg`
- **Okay:** `text-status-okay bg-status-okay-bg`
- **Good:** `text-status-good bg-status-good-bg`
- **Excellent:** `text-status-excellent bg-status-excellent-bg`

## 5. Navigation
- **Bottom Navigation:** Fixed bottom, `z-nav`, 4 equal-width tap targets with icon above label.
- **Sidebar Navigation:** Fixed left, vertically stacked, active state highlighted with `brand-primary-soft`.

## 6. Empty / Loading States
- **Empty State:** Centered content, muted icon, `text-secondary`, primary CTA to resolve empty state.
- **Toast/Snackbar:** Floats at bottom-center (mobile) or bottom-right (desktop), `z-toast`, uses status colors for background.
