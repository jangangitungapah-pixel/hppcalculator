# Phase 4: UI Design System Blueprint

## Goal
To establish a complete UI Design System Blueprint for the Modalin MVP. This ensures the frontend team can build a consistent, accessible, and scalable UI in Phase 5 without over-engineering or guessing visual rules.

## Product Visual Summary
Modalin should look like a friendly F&B business assistant: warm enough for home-based sellers, clear enough for financial decisions, and modern enough to become a public SaaS product.

## Design Principles
- **Beginner-friendly clarity:** Prevent UI from looking like complex accounting software.
- **Warm and helpful visual tone:** Use F&B friendly colors (oranges/ambers) paired with trust-building neutrals.
- **Numbers must be easy to scan:** Large, clear typography for financial metrics.
- **Important financial status must be obvious:** Colors map directly to profit health (Red = Loss, Green = Good).
- **Forms must feel simple:** Inputs should feel airy and un-intimidating.
- **Mobile-first:** Optimized for thumbs, tap targets, and vertical scrolling.
- **Consistency over decoration:** Do not over-use gradients or shadows; keep it functional.
- **Friendly but trustworthy:** A balance between casual SaaS and a reliable utility.
- **Color supports meaning, not just decoration:** E.g., red is for danger/loss only.
- **Accessible contrast:** Ensuring text is readable against warm backgrounds.

## Main UI Personality
- UMKM helper yang ramah (A friendly UMKM helper)
- Food business assistant yang hangat (A warm food business assistant)

## Design System Scope
This phase defines the tokens, component guidelines, layout rules, and Tailwind strategy. 

## Included in Phase 4
- Brand visual direction definitions.
- Design tokens (Colors, Typography, Spacing, Radius, Shadows).
- Component interaction guidelines.
- Responsive layout architecture.
- Accessibility rules.
- Tailwind CSS implementation strategy.
- Base CSS variables for tokens.

## Intentionally Not Included in Phase 4
- Full React component implementation.
- App routing or navigation code.
- LocalStorage logic.
- Backend/Auth architecture.
- Tailwind package installation.

## Relationship to Previous Phases
- **Phase 1-2:** The logic determines the data. The UI must map status thresholds to the colors defined here.
- **Phase 3:** The wireframes dictate the layout hierarchy, which is styled by the components defined here.

## How Phase 5 Should Use This System
Phase 5 will map these CSS variables into a `tailwind.config.js` theme and build foundational React components (Button, Card, Input) before assembling the screens defined in Phase 3.
