# Acceptance Criteria - Phase 13.7: Centralized Demo Data System

This document outlines the success criteria and validation requirements for the centralized demo data service.

---

## 1. Functional Requirements

### 1.1 Centralized Service Integration
- [ ] A dedicated service module `demoDataService.js` handles loading and clearing demo data.
- [ ] App context (`AppDataContext.jsx`) exposes clean callback hooks that leverage this service.
- [ ] Multi-account/scope isolation (from Phase 13.5) remains intact; demo data writes only to the active scoped keys (e.g., `guest` or logged-in user ID).

### 1.2 UI Pages Behavior
- [ ] **Dashboard**: Loading demo data populates the complete workspace (Calculations, Ingredients, Recipes, Products, Channel Profiles, Simulations).
- [ ] **Ingredients**: The load demo button seeds demo ingredients.
- [ ] **Recipes**: Checks if ingredients are present. If empty, warns the user and triggers loading the complete business library on confirmation.
- [ ] **Products**: Checks if recipes are present. If empty, warns the user and triggers loading the complete business library on confirmation.

### 1.3 Safe Scoped Cleanup
- [ ] A **Bersihkan Data Demo** button appears in settings/backup pages conditionally if and only if demo records (where `source === "demo"`) are present.
- [ ] Clicking it triggers a clear confirmation modal.
- [ ] Confirming clears only records with `source === "demo"`, leaving user-created data intact.
- [ ] Once cleared, the button hides automatically.

---

## 2. Quality Assurance & Tests

- [ ] All Vitest tests (78/78) must pass, including the new unit tests for `demoDataService.test.js`.
- [ ] Duplicate seeding must be prevented by filtering out prior demo records when loading.
- [ ] Zero build errors on `npm run build`.
- [ ] Zero runtime console errors.
