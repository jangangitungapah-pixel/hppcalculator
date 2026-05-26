# Acceptance Criteria — Phase 13.10 Overhaul

This document defines the strict criteria required for sign-off on the Global Button System Overhaul.

---

## 📌 Criteria Checklist

- [ ] **Standard Component Usage**: Native `<button>` elements used for primary page actions have been replaced with the standardized `<Button>` component.
- [ ] **Visual Hierarchy**: Primary, secondary, danger, and premium variants are applied correctly. No two primary buttons are rendered directly next to each other.
- [ ] **Touch Target Sizing**: All button heights comply with their size specifications (minimum height of `44px` for interactive inputs/default actions on mobile devices).
- [ ] **Accessibility Compliance**:
  - Focus outlines are present and visible on all buttons.
  - Active/pressed states for toggle components use appropriate `aria-` attributes.
  - Icon-only buttons have unique `aria-label` text describing their purpose.
- [ ] **Clean Layout & Overflow**:
  - No text-wrapping issues inside buttons on narrow screens.
  - Mobile action blocks stack cleanly instead of causing layout overflow.
- [ ] **Technical Boundary Safety**:
  - No database logic, calculation models, or routing code was modified.
  - No new external packages or dependencies were installed.
  - `npm run build` compiles with zero warnings or errors.
