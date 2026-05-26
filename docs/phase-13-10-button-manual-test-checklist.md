# Manual Testing Checklist — Button System Overhaul

This checklist is used to verify visual quality, responsive sizing, and interactive states of the modernized buttons across all main pages of Modalin.

---

## 🏁 Test Scenarios

### 1. Welcome Landing Page (`/welcome`)
- [ ] **Language Switcher**: Displays ID & EN options in a compact 36px-high segmented bar.
- [ ] **Go to Dashboard Button**: Styled as a premium orange gradient pill in top header; arrow slides right on hover.
- [ ] **Instant Calculator CTA**: Full-width, 52px-high block button inside the demo card with hover scaling.
- [ ] **Accessibility**: No raw `welcome.demoOpenHint` text is visible at the bottom of the calculator card.

### 2. Main Dashboard Page (`/dashboard`)
- [ ] **Main CTA ("Mulai Hitung Baru")**: Primary brand button is clearly visible.
- [ ] **Pulse Card Link**: "Laporan Detail" link has standard link styling and arrow alignment.
- [ ] **Accessibility**: All buttons are fully focusable via keyboard tab key.

### 3. Ingredients Library (`/ingredients`)
- [ ] **Back Buttons**: Back arrow button in header has `size="icon"`, `variant="ghost"`, and has a proper `aria-label`.
- [ ] **Add/Save Actions**: Primary button uses the correct orange brand styling.
- [ ] **Delete Actions**: Delete button uses `variant="danger"` with red outline/fill.

### 4. Recipes & Products (`/recipes`, `/products`)
- [ ] **Recipe Detail Actions**: "Edit Resep" uses secondary variant; "Hapus" uses danger variant.
- [ ] **Product Card Delete Button**: Replaced manual delete hover item with standard ghost icon button.
- [ ] **Scale Modal Buttons**: Scale resep buttons stack vertically on mobile (under 640px) and display in a row on desktop.

### 5. Forms & Confirm Dialogs
- [ ] **Form Actions**: Save/Cancel buttons stack with correct order (`order-1` for confirm/save) on mobile.
- [ ] **Confirm Dialogs**: Backdrop blur is clean; primary and delete confirm colors match their respective hierarchy.
