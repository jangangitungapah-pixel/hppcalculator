# Global Button System Overhaul — Technical Documentation

This document outlines the standard design rules, specifications, and layout guidelines implemented during **Phase 13.10: Global Button System Overhaul** for Modalin.

---

## 🎨 Design System: Button Variants

Every button in Modalin must belong to one of the following official variants to maintain high visual fidelity and clear action hierarchy:

1. **`primary`**
   - **Purpose**: Primary call to action on a page or card.
   - **Styles**: Vibrant brand orange (`var(--color-primary)`), bold white text, smooth hover lift (`translateY(-1.5px)`), and subtle orange glow shadows.

2. **`secondary`**
   - **Purpose**: Supporting actions, alternate pathways, or tertiary settings.
   - **Styles**: Card white/cream background, solid thin border (`var(--color-border-strong)`), dark espresso text. Hover fills background with light gray.

3. **`outline`**
   - **Purpose**: Secondary action that needs to remain visible but not compete with primary CTA.
   - **Styles**: Transparent background, visible border (`var(--color-border)`). Soft gray fill on hover.

4. **`ghost`**
   - **Purpose**: Low priority actions, toolbar filters, or embedded table rows.
   - **Styles**: Completely transparent background, gray text, light gray background fill on hover.

5. **`danger` / `destructive`**
   - **Purpose**: Permanent actions (delete raw material, reset workspace).
   - **Styles**: Red background (`var(--color-danger)`), white text. Darker red fill with custom drop shadow on hover.

6. **`success`**
   - **Purpose**: Positive outcomes (saving data, successful sync).
   - **Styles**: Green background (`var(--color-success)`), white text. Darker green fill on hover.

7. **`premium` / `hero`**
   - **Purpose**: Key landing page conversion CTAs.
   - **Styles**: Linear gradient from brand orange to coral red. Prominent floating shadows. Icon slides forward on hover.

8. **`link`**
   - **Purpose**: Small navigation indicators or inline links.
   - **Styles**: Brand orange text, no padding, zero height bounds. Underline decoration on hover.

---

## 📏 Button Sizing Guidelines

Button height and spacing scale consistently across form factors:

| Size Code | Height | Recommended Use Case |
| :--- | :--- | :--- |
| **`xs`** | `28px` | Tiny badge-like inline actions |
| **`sm`** | `36px` | Filters, header utility tools, secondary items |
| **`md`** | `44px` | Form fields, standard page actions (Default) |
| **`lg`** | `52px` | Primary form submit actions, key card CTAs |
| **`xl`** | `60px` | Hero landing sections |
| **`icon`** | `40-44px` | Icon-only navigation buttons (e.g. back buttons) |

---

## ♿ Accessibility (a11y) & Interactive States

- **Keyboard Navigation**: Focus indicators are styled with clear orange outline rings (`focus-visible`).
- **Screen Readers**: Icon-only buttons must have an explicit `aria-label`.
- **Loading State**: Disables clicking, renders a loading spinner, and preserves button bounds.
- **Disabled State**: Uses the native HTML `disabled` attribute. The cursor is styled as `not-allowed`.

---

## 📱 Responsive & Mobile Rules

- **Mobile Viewports (under 640px)**:
  - Form action buttons (e.g. Save/Cancel) stack vertically (`flex-col`) instead of row layout to maximize tap targets.
  - Primary button is positioned at the top of the stack (`order-1`) for natural thumb reach.
  - Buttons expand to full-width (`w-full`) inside action sheets.
  - Spacing is set to a minimum of `8px` (`gap-2`) to avoid accidental double taps.
