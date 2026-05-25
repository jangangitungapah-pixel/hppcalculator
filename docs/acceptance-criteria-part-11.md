# Acceptance Criteria: Part 11 (CSS UI Polish)

The following criteria must be met to consider Phase 11 complete:

## 1. CSS Architecture Reorganization
- `src/styles/index.css` imports a defined hierarchy of files: tokens, base, layout, components, pages, utilities, responsive.
- All files are created and contain valid CSS.

## 2. Design Tokens
- `src/styles/design-tokens.css` defines the core color palette, radii, shadows, typography, and motion curves.
- `tailwind.config.js` is updated to utilize these CSS variables for seamless integration.

## 3. Component Migration
- Core UI components (`Button`, `Card`, `Input`, `Select`, `Badge`, `Alert`, `EmptyState`) no longer have excessively long inline Tailwind strings.
- They utilize semantic classes (e.g., `.btn`, `.ui-card`) defined in `src/styles/components.css`.

## 4. Layout & Page Polish
- Layout components (`AppShell`, `SidebarNav`, `Header`, `PageContainer`) utilize `.app-root`, `.app-sidebar`, etc.
- Primary pages use `.page-header`, `.page-title`, `.page-grid`, and `.content-stack` for consistent spacing.

## 5. Build Verification
- Running `npm run build` succeeds without critical errors.
- Visual QA on a local server confirms the application retains a "premium F&B UMKM" aesthetic (warm colors, soft shadows, rounded borders).

## 6. Constraints Adhered
- No major new features were added.
- No new dependencies were installed.
- Tailwind was not removed, but its usage is streamlined.
