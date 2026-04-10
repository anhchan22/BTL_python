# Neumorphism UI Refactor - Session Context Artifact

**Last Updated:** 2026-04-09 | **Status:** 85% Complete (Phase 5 ✅)

---

## CRITICAL RULES (Non-Negotiable)

✅ **MUST USE:**
- Inline React styles ONLY: `style={{ backgroundColor: 'var(--color-background)' }}`
- CSS variables from globals.css (79 tokens)
- Pure JavaScript (NO TypeScript)

❌ **NEVER USE:**
- `className=""` (NO Tailwind)
- MUI components (no Container, Grid, Card, Table, etc.)
- Material-UI imports

✅ **PRESERVE:**
- ALL API calls (contractService, rentalService, zoneService)
- ALL AuthContext usage
- ALL routing/navigation
- ALL business logic

---

## IMPLEMENTATION PATTERN

```javascript
// ✅ CORRECT PATTERN (All refactored pages follow this)
import React, { useState } from 'react';

export default function MyPage() {
  const [data, setData] = useState([]);
  
  // Define ALL styles as objects
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: 'var(--color-background)',
    padding: 'clamp(1rem, 2vw, 2rem)'
  };
  
  const buttonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-base)',
    boxShadow: 'var(--shadow-extruded)',
    cursor: 'pointer',
    transition: 'all 300ms ease-out'
  };
  
  // NO className usage
  return (
    <div style={containerStyle}>
      <button style={buttonStyle}>Click me</button>
    </div>
  );
}

// ❌ WRONG (Never do this in refactored pages)
// className="bg-neu-bg p-6 rounded-lg shadow-extruded"
// <MUI.Container>...</MUI.Container>
```

---

## CSS VARIABLES (globals.css)

**Colors:**
- `--color-background: #E0E5EC` (cool grey)
- `--color-foreground: #3D4852` (dark text)
- `--color-muted: #6B7280` (secondary text)
- `--color-accent: #6C63FF` (primary action)
- `--color-accent-light: #8B84FF` (hover)
- `--color-accent-secondary: #38B2AC` (success/teal)

**Shadows:**
- `--shadow-extruded` (raised, default)
- `--shadow-extruded-hover` (lift effect)
- `--shadow-extruded-small` (icons)
- `--shadow-inset` (carved, inputs)
- `--shadow-inset-deep` (pressed)
- `--shadow-inset-small` (tracks)

**Radius:**
- `--radius-container: 32px` (cards)
- `--radius-base: 16px` (buttons)
- `--radius-inner: 12px` (small)

**Other:**
- `--duration-default: 300ms` (transitions)
- `--easing-default: ease-out`

---

## COMPLETED PHASES (Git Commits)

| Phase | Pages | Components | Commit | Status |
|-------|-------|-----------|--------|--------|
| 1 | - | globals.css, tokens | 696ec16 | ✅ |
| 2 | 2 | AuthCard, FormField, NeuButton | 1933510, 76f8340 | ✅ |
| 3 | 1 | StatBox, DashboardCard, NeuNavButton | 3024103, d755d2f | ✅ |
| 4 | 1 | ZoneCard, SearchBar, Placeholder, Pagination | 5fd8ff5, 3a11807 | ✅ |
| 5 | 2 | StatusBadge, TablePagination | 0047a07 | ✅ |

---

## REFACTORED PAGES (6/12)

✅ **Complete** (inline styles + no MUI):
1. LoginPage
2. RegisterPage
3. DashboardPage
4. ZoneListPage
5. RentalRequestListPage
6. ContractListPage

⏳ **Pending** (Phase 6+):
7. ZoneDetailPage
8. RentalRequestDetailPage
9. ContractDetailPage
10. ProfilePage
11. ZoneFormPage
12. UserManagementPage

---

## REUSABLE COMPONENTS

**Auth & Forms:**
- `AuthCard.js` (sm/md/lg sizes)
- `FormField.js` (with validation)
- `NeuButton.js` (variants: primary/secondary)

**Dashboard:**
- `StatBox.js` (KPI with 4 color variants)
- `DashboardCard.js` (flexible wrapper)
- `NeuNavButton.js` (icon + label layout)

**Zones:**
- `ZoneCard.js` (image + details + actions)
- `ZoneSearchBar.js` (search + sort + filter)
- `ZoneImagePlaceholder.js` (6 gradients)

**Tables:**
- `StatusBadge.js` (6 semantic statuses)
- `TablePagination.js` (prev/next/page numbers)

---

## QUICK COMMANDS

```bash
# Test in browser
npm start  # frontend folder

# Build
npm run build

# Git flow
git status
git add -A
git commit -m "feat(phaseX): description"
git push
```

---

## NEXT PHASE TEMPLATE

For Phase 6 (Detail Pages):

```javascript
// Step 1: Remove all MUI imports
// Step 2: Import necessary components (DashboardCard, etc.)
// Step 3: Define inline style objects
// Step 4: Replace all className="" with style={{...}}
// Step 5: Use CSS variables for colors/shadows
// Step 6: Add hover/active/disabled states with inline handlers
// Step 7: Preserve API/Auth/routing logic
// Step 8: Test in browser
// Step 9: Commit with: git commit -m "feat(phaseX): ..."
```

---

## PERFORMANCE NOTES

- Inline styles = no CSS compilation overhead
- CSS variables = single source of truth (globals.css)
- Pagination components = reusable (TablePagination.js)
- Image placeholders = deterministic (same ID = same color)

---

## TESTING CHECKLIST (For Each Page)

- [ ] Visual design (colors, shadows, spacing)
- [ ] Responsiveness (mobile/tablet/desktop)
- [ ] API calls (check Network tab)
- [ ] Navigation (routing works)
- [ ] Hover/active states (smooth transitions)
- [ ] Pagination (if applicable)
- [ ] Admin features (if applicable)
- [ ] No console errors
- [ ] No MUI imports remaining
- [ ] No className usage

---

**For future sessions:** Read this file first, then proceed with the pattern.
