# Accessibility Guidelines

## Contrast
- All text must pass WCAG AA minimum contrast ratio (4.5:1 for normal text, 3:1 for large text).
- Be extremely careful with white text on `brand-primary` (Orange). Ensure the orange is dark enough, or use dark text if necessary.
- Avoid low-contrast warm neutrals for critical text.

## Touch & Interaction
- **Minimum touch target size:** 44x44px. All buttons, inputs, and nav items must respect this.
- **Keyboard navigation:** All interactive elements must be focusable.
- **Focus states:** Provide a visible focus ring (e.g., `ring-2 ring-brand-primary`) on inputs and buttons. Do not remove default focus outlines without replacing them.

## Forms & Labels
- Inputs MUST have visible labels. Do not rely solely on `placeholder` text, as it disappears upon typing.
- Error messages must be placed directly under the associated input field and programmatically linked via `aria-describedby` in implementation.

## Color as Information
- **Color must not be the only indicator.** Profit status badges must include both the color AND the text label (e.g., Red + "Rugi"). Consider adding icons for extra clarity (❌, ⚠, ✅).

## Screen Reader Considerations
- The calculation result summary (the conversational text like "Dari 50 pcs yang bisa dijual...") is explicitly designed to be highly readable for screen readers compared to complex tables.
- Buttons must have clear accessible names (e.g., icon-only buttons need `aria-label`).
- Use polite live regions (`aria-live="polite"`) when the desktop result panel updates automatically.
