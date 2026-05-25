# Part 11: Manual Test Checklist (UI Polish)

Use this checklist to manually verify the UI polish applied in Phase 11.

## Global Design Tokens
- [ ] Verify the global background is a warm cream color (`#FDFBF7`).
- [ ] Verify the primary action color is an energetic orange.
- [ ] Verify cards and buttons have rounded, soft corners (radii applied).
- [ ] Verify hover states and focus rings appear on interactive elements.

## Layout & Navigation
- [ ] Check `AppShell`: Sidebar on Desktop, Bottom Nav on Mobile.
- [ ] Check `Header`: Sticky at the top, clear typography.
- [ ] Check `SidebarNav`: Active state styling is prominent and distinct.
- [ ] Check `BottomNav`: Active state styling is prominent and distinct; it is hidden on Desktop.

## UI Components
- [ ] **Buttons**: Test `primary`, `secondary`, `ghost`, and `destructive` variants. Check hover (slight lift + shadow) and active states.
- [ ] **Cards**: Test default, `elevated`, `soft`, and `result` variants. Check borders and shadows.
- [ ] **Inputs/Selects**: Verify consistent border radii, focus rings, and error states. Prefix/Suffix icons should be aligned.
- [ ] **Badges/Alerts**: Verify semantic colors (`success`, `warning`, `danger`, `info`).

## Pages
- [ ] **Welcome Page**: Check the hero section gradient background.
- [ ] **Dashboard**: Verify SummaryCards and the main grid layout using `.page-grid`.
- [ ] **Calculator**: Ensure the form fields map correctly and the Desktop right-side sticky panel works.
- [ ] **Result Page**: Check the bold, premium styling of the Result Cards and margin visualizations.
- [ ] **History & Settings**: Verify the list layout and `.content-stack` spacing.

## Responsive Checks
- [ ] Shrink window to mobile size and ensure no horizontal scrolling.
- [ ] Check that mobile inputs have a minimum height of `44px` (touch targets).
