# Phase 3: UX Flow & Wireframe Blueprint

## Goal
To create a complete UX flow and wireframe blueprint for the "Modalin" MVP. This defines the user experience, navigation architecture, responsive behaviors, and bilingual copy prior to any UI/React implementation.

## Product UX Summary
Modalin is designed to be a friendly pricing assistant for Indonesian F&B UMKM. It replaces intimidating financial spreadsheets with a simple, conversational interface that instantly answers: "What is my cost, and how much should I sell this for?"

## MVP UX Principles
- **Beginner-first:** Assume no accounting knowledge. Replace "COGS" with "Modal Produksi."
- **Mobile-first:** The primary experience is on a phone, with a bottom navigation bar and full-width cards.
- **Fast calculation:** Minimized clicks to reach the result.
- **Friendly language:** Conversational tone, encouraging results.
- **Low cognitive load:** Break inputs into digestible cards/sections.
- **Clear numbers:** Emphasize HPP and Profit.
- **Clear actions:** Obvious sticky buttons.
- **Trustworthy:** Transparent calculations with clear safe pricing suggestions.

## User Assumptions
- Users are home-based or small-scale F&B sellers.
- Users are comfortable with simple mobile apps (WhatsApp, Instagram, Gojek) but not complex SaaS tools.
- Users often guess their selling prices or base them on competitors, leading to unknown margins.

## Key UX Decisions
1. **Hybrid Calculator Layout:** A single page divided into logical sections (Product Info, Cost Items, Output, Price).
2. **Responsive Navigation:** Bottom nav for mobile; sidebar for desktop.
3. **First-Screen Onboarding:** A Welcome screen introduces the app value immediately.
4. **Responsive Results:** Result is a new page on mobile, but a side panel on desktop.
5. **Cost Input:** Default template rows (Ingredients, Packaging, etc.) that can be customized or deleted.
6. **Bilingual:** Global ID/EN toggle, prioritizing Indonesian as default.
7. **No Login MVP:** Instant access using `localStorage`.

## Screen List (MVP)
1. Welcome / Onboarding
2. Dashboard
3. Quick HPP Calculator
4. Calculation Result
5. Saved Calculations
6. Calculation Detail
7. Settings

## Navigation Summary
- **Mobile:** Bottom navigation bar (Dashboard, Calculate, History, Settings).
- **Desktop:** Left sidebar.

## Responsive Behavior Summary
- **Mobile:** Vertical flows, sticky buttons, dedicated result screens.
- **Desktop:** Two-column layouts, side-by-side forms and results, wider data presentation.

## Included in Phase 3
- UX flow diagrams.
- ASCII wireframes.
- Bilingual copy definitions.
- Edge case UX definitions.

## Intentionally Not Included in Phase 3
- React components or pages.
- CSS/Tailwind styling.
- LocalStorage logic implementation.
- Backend/Auth flows.
