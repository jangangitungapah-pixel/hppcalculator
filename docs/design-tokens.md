# Design Tokens

## 1. Color Tokens

### Brand
- `brand-primary`: #F97316 (Warm orange/amber - Main CTA, active states)
- `brand-primary-hover`: #EA580C
- `brand-primary-soft`: #FFEDD5 (Background for brand accents)
- `brand-secondary`: #16A34A (Green - Growth, success)
- `brand-secondary-soft`: #DCFCE7

### Neutral
- `background`: #FFF8F0 (Warm cream, off-white)
- `surface`: #FFFFFF (Pure white for cards)
- `surface-muted`: #FFF3E6
- `border`: #F2D8C2
- `text-primary`: #1F2937 (Dark slate/gray, almost black)
- `text-secondary`: #4B5563
- `text-muted`: #6B7280

### Status (Profit Health)
- `status-loss`: #DC2626
- `status-loss-bg`: #FEE2E2
- `status-low`: #D97706
- `status-low-bg`: #FEF3C7
- `status-okay`: #2563EB
- `status-okay-bg`: #DBEAFE
- `status-good`: #16A34A
- `status-good-bg`: #DCFCE7
- `status-excellent`: #059669
- `status-excellent-bg`: #D1FAE5

### Semantic
- `success`: `status-good`
- `warning`: `status-low`
- `danger`: `status-loss`
- `info`: `status-okay`

## 2. Typography Tokens
**Font Family:** Prefer `Poppins` or `Nunito`. Fallback to `Inter, system-ui, sans-serif`.

### Type Scale
- `display-lg`: 36px, Line Height 1.2, Bold (Hero numbers, large results)
- `display-md`: 30px, Line Height 1.2, Bold (Secondary results)
- `heading-xl`: 24px, Line Height 1.3, SemiBold (Page titles)
- `heading-lg`: 20px, Line Height 1.4, SemiBold (Card titles)
- `heading-md`: 16px, Line Height 1.5, SemiBold (Section headers)
- `body-lg`: 18px, Line Height 1.5, Regular (Intro text)
- `body-md`: 16px, Line Height 1.5, Regular (Default text, inputs)
- `body-sm`: 14px, Line Height 1.5, Regular (Secondary text, helper text)
- `caption`: 12px, Line Height 1.5, Regular (Smallest labels)
- `number-lg`: 32px, Line Height 1.2, Bold (Financial emphasis)
- `number-md`: 24px, Line Height 1.2, Bold (Financial emphasis)

## 3. Spacing Tokens (4px base)
- `0`: 0px
- `1`: 4px
- `2`: 8px
- `3`: 12px
- `4`: 16px (Default container padding)
- `5`: 20px
- `6`: 24px
- `8`: 32px (Section spacing)
- `10`: 40px
- `12`: 48px
- `16`: 64px

## 4. Radius Tokens
- `radius-sm`: 8px (Small inputs, badges)
- `radius-md`: 12px (Standard buttons)
- `radius-lg`: 16px (Cards)
- `radius-xl`: 20px (Large hero cards)
- `radius-2xl`: 24px (Modals)
- `radius-pill`: 999px (Pill badges)

## 5. Shadow Tokens
- `shadow-sm`: 0 1px 2px rgba(0,0,0,0.05)
- `shadow-md`: 0 4px 6px -1px rgba(0,0,0,0.1)
- `shadow-lg`: 0 10px 15px -3px rgba(0,0,0,0.1)
- `shadow-card`: 0 10px 30px rgba(31, 41, 55, 0.08) (Soft ambient shadow for elevated cards)
- `shadow-floating`: 0 20px 25px -5px rgba(0,0,0,0.1) (Modals, popovers)

## 6. Border Tokens
- `border-width`: 1px
- `border-color`: `var(--color-border)`

## 7. Z-index Tokens
- `z-base`: 0
- `z-nav`: 40
- `z-sticky`: 50
- `z-modal`: 100
- `z-toast`: 200

## 8. Motion Tokens
- `fast`: 120ms
- `normal`: 180ms
- `slow`: 240ms
- `easing`: ease-out for entry, ease-in-out for state changes

## 9. Breakpoint Tokens
- `mobile`: 0px
- `sm`: 480px
- `md`: 768px (Tablet)
- `lg`: 1024px (Desktop)
- `xl`: 1280px

## 10. Dark Mode Placeholders
*(To be populated in future SaaS phase. Currently not implemented).*
