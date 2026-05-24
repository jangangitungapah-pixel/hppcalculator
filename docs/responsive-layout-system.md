# Responsive Layout System

## Breakpoints
- **Mobile:** 0 - 767px
- **Tablet:** 768 - 1023px
- **Desktop:** 1024px and above

## Page Container
- **Mobile Padding:** 16px (`p-4`)
- **Tablet Padding:** 24px (`p-6`)
- **Desktop Padding:** 32px (`p-8`)
- **Max Content Width:** 1180px for standard pages, 1280px for wide dashboards.

## Mobile Layout Rules
- **One-column:** Elements stack vertically.
- **Navigation:** Bottom tab bar for primary routing.
- **CTAs:** Sticky calculate button at the bottom of forms to ensure it's always accessible.
- **Cards:** Full width minus padding (`w-full`).
- **Touch Targets:** Minimum 44px height for buttons and inputs.
- **Avoid Tables:** Use vertically stacked card lists instead of horizontal tables to prevent scrolling.

## Tablet Layout Rules
- **Adaptive:** If screen > 768px, summary cards can sit 2-abreast.
- **Navigation:** Bottom nav can remain if portrait, or switch to narrow sidebar.

## Desktop Layout Rules
- **Navigation:** Left sidebar navigation permanently visible.
- **Dashboard:** Summary cards span horizontally in a row.
- **Quick Calculator:** 
  - Left column (approx 60%): The input form.
  - Right column (approx 40%): The live-updating result panel, which can stick (`position: sticky`) as the user scrolls the form.
- **Data Display:** History can be displayed in responsive tables or grid cards.
