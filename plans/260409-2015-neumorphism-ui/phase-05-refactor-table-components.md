# Phase 5: Neumorphic Table Refactoring Plan

**Status:** Planning  
**Priority:** High  
**Duration:** Estimated 3-4 development sessions  
**Last Updated:** 2026-04-09

---

## 📋 Overview

Remove Material-UI table components from `RentalRequestListPage` and `ContractListPage`, replacing them with a custom Neumorphic table design system built with pure HTML `<table>` elements and CSS variables. This phase creates reusable table components while maintaining 100% of existing functionality (API integration, navigation, status mapping, admin vs. tenant views, filtering, pagination).

**Key Principle:** No Tailwind, no MUI, no external CSS libraries—only inline React styles and CSS variables from `globals.css`.

---

## 🎯 Design Decisions & Specifications

### 1. Table Header Styling
**Decision: Extruded Shadow (Raised)**
- Headers sit above data rows with subtle lift
- Uses `--shadow-extruded-small` for softer appearance than row content
- Foreground color for text contrast
- Readable but visually distinct from content rows

**Alternative:** Inset headers (not recommended—reduces clarity)

### 2. Row Hover Effect
**Decision: Dual Effect (Highlight + Subtle Lift)**
- Background color shifts slightly lighter on hover
- Apply `translateY(-1px)` for subtle lift
- Shadow adjusts to `--shadow-extruded-hover` on data rows
- Improves interactivity without overwhelming interface

**CSS Logic:**
```javascript
// On hover
backgroundColor: 'rgba(255, 255, 255, 0.2)', // 20% white overlay
transform: 'translateY(-1px)',
boxShadow: 'var(--shadow-extruded-small)'
```

### 3. Status Badge Colors
**Decision: Map to Design System + Semantic Meaning**

For **Rental Requests:**
- `PENDING` → `--color-muted` (#6B7280) gray (waiting)
- `APPROVED` → `--color-accent-secondary` (#38B2AC) teal (success)
- `REJECTED` → Custom red (#E74C3C) (error)
- `CANCELLED` → Custom gray (#95A5A6) (neutral)

For **Contracts:**
- `ACTIVE` → `--color-accent-secondary` (#38B2AC) teal (success)
- `EXPIRED` → `--color-muted` (#6B7280) gray (inactive)
- `TERMINATED` → Custom red (#E74C3C) (error)

Badges use `--shadow-inset-small` for "carved" appearance matching input fields.

### 4. Pagination Style
**Decision: Button-Based with Number Indicators**
- Previous/Next buttons (Neumorphic style)
- Current page highlighted
- Jump-to-page number buttons (1, 2, 3, ..., n)
- Shows "Page X of Y" indicator
- Responsive: hide intermediate numbers on mobile, show range

### 5. Mobile Responsiveness
**Decision: Horizontal Scroll + Responsive Columns**
- Desktop (≥1024px): Full table with all columns visible
- Tablet (640px–1023px): Hide less critical columns (Tenant on mobile), scroll horizontally
- Mobile (<640px): Show essential columns (ID, Zone, Status, Actions), horizontal scroll for others
- Table wrapper: `overflow-x: auto`, maintains table structure

**Responsive Column Visibility:**
- Always visible: ID/Contract#, Zone, Status, Actions
- Conditional visibility:
  - Tenant: Only if `isAdmin` AND screen ≥768px
  - Area: Always (but smaller on mobile)
  - Cost/Rent: Always (formatted small on mobile)
  - Dates: Hide on <768px (available in detail view)
  - Duration: Hide on <640px

---

## 🏗️ Architecture & Component Structure

### Component Hierarchy
```
RentalRequestListPage.js
├── PageHeader (title, search)
├── ErrorAlert
├── LoadingSpinner
├── NeuTable (wrapper)
│   ├── TableHeader (extruded style)
│   ├── TableBody
│   │   └── TableRow (hover effects)
│   │       ├── TableCell (data)
│   │       └── ActionCell
│   │           └── NeuButton
│   └── TableFooter
│       └── TablePagination
├── SearchBar (filter)
└── EmptyState

ContractListPage.js
├── PageHeader (title)
├── FilterTabs (All / Active)
├── SearchBar
├── ErrorAlert
├── LoadingSpinner
├── NeuTable (same as above)
│   └── ... (same structure)
└── EmptyState
```

### New Components to Create

#### 1. **NeuTable.js** (Reusable Wrapper)
Wraps standard `<table>` with Neumorphic styling and pagination.

**Props:**
```javascript
{
  columns: [                    // Column definitions
    {
      id: 'id',
      label: 'ID',
      width: '80px',
      align: 'left',
      visible: true,            // Control visibility per viewport
      mobileVisible: true,
      renderCell: (row) => row.id
    },
    // ... more columns
  ],
  rows: [],                     // Data rows
  onRowClick: (row) => {},      // Click handler
  pageSize: 10,                 // Rows per page
  totalCount: 100,              // Total records for pagination
  loading: false,
  emptyMessage: 'No data',
  currentPage: 1,               // Current page number
  onPageChange: (page) => {},   // Page change handler
  searchQuery: '',              // For filtering rows
  onSearchChange: (query) => {}
}
```

**Features:**
- Automatic pagination (10 rows/page default)
- Horizontal scroll wrapper for mobile
- Responsive column visibility
- Built-in search/filter
- Empty state handling
- Loading skeleton (optional)

---

#### 2. **StatusBadge.js** (Status Indicator)
Displays status with Neumorphic inset styling and semantic colors.

**Props:**
```javascript
{
  status: 'ACTIVE',             // Status string
  statusType: 'contract',       // 'contract' or 'rental'
  size: 'small'                 // 'small' | 'medium'
}
```

**Features:**
- Color mapping per status type
- Inset shadow for "carved" appearance
- Rounded corners
- Padding/spacing based on size
- Text truncation support

---

#### 3. **TablePagination.js** (Pagination Control)
Neumorphic pagination buttons with page indicators.

**Props:**
```javascript
{
  currentPage: 1,
  totalPages: 10,
  onPageChange: (page) => {},
  pageSize: 10,
  totalCount: 100
}
```

**Features:**
- Previous/Next buttons (Neumorphic raised style)
- Page number buttons (responsive hiding)
- Current page highlight
- Jump-to-page navigation
- Mobile-responsive number display

---

### Code Patterns & Templates

#### Pattern 1: Neumorphic Table Cell Style
```javascript
const tableCellStyle = {
  padding: '16px 12px',
  textAlign: 'left',
  borderBottom: 'none',
  backgroundColor: 'transparent',
  color: 'var(--color-foreground)',
  fontSize: '0.95rem',
  fontWeight: '400',
  fontFamily: 'DM Sans, sans-serif'
};

const tableHeaderCellStyle = {
  ...tableCellStyle,
  fontWeight: '600',
  color: 'var(--color-foreground)',
  backgroundColor: 'var(--color-background)',
  boxShadow: 'var(--shadow-extruded-small)',
  borderRadius: 'var(--radius-inner)'
};
```

#### Pattern 2: Responsive Column Wrapper
```javascript
const TableWrapper = ({ children, isMobileView }) => (
  <div style={{
    overflowX: isMobileView ? 'auto' : 'visible',
    WebkitOverflowScrolling: 'touch',
    borderRadius: 'var(--radius-base)',
    boxShadow: 'var(--shadow-extruded)',
    backgroundColor: 'var(--color-background)'
  }}>
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: isMobileView ? '800px' : 'auto'
    }}>
      {children}
    </table>
  </div>
);
```

#### Pattern 3: Row Hover Effect
```javascript
const [hoveredRowId, setHoveredRowId] = useState(null);

const getRowStyle = (rowId) => ({
  backgroundColor: hoveredRowId === rowId ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
  transform: hoveredRowId === rowId ? 'translateY(-1px)' : 'translateY(0)',
  boxShadow: hoveredRowId === rowId ? 'var(--shadow-extruded-small)' : 'none',
  transition: 'all var(--duration-default) var(--easing-default)',
  cursor: 'pointer'
});

// In JSX
<tr
  onMouseEnter={() => setHoveredRowId(row.id)}
  onMouseLeave={() => setHoveredRowId(null)}
  style={getRowStyle(row.id)}
>
```

#### Pattern 4: Status Color Mapping Function
```javascript
const getStatusColor = (status, type = 'rental') => {
  const statusColorMap = {
    rental: {
      PENDING: { bg: 'var(--color-muted)', text: 'white' },
      APPROVED: { bg: 'var(--color-accent-secondary)', text: 'white' },
      REJECTED: { bg: '#E74C3C', text: 'white' },
      CANCELLED: { bg: '#95A5A6', text: 'white' }
    },
    contract: {
      ACTIVE: { bg: 'var(--color-accent-secondary)', text: 'white' },
      EXPIRED: { bg: 'var(--color-muted)', text: 'white' },
      TERMINATED: { bg: '#E74C3C', text: 'white' }
    }
  };
  
  const colors = statusColorMap[type] || statusColorMap.rental;
  return colors[status] || { bg: '#95A5A6', text: 'white' };
};
```

#### Pattern 5: Pagination State Management
```javascript
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 10;
const totalPages = Math.ceil(totalCount / pageSize);

// Calculate slice for pagination
const startIdx = (currentPage - 1) * pageSize;
const endIdx = startIdx + pageSize;
const paginatedRows = filteredRows.slice(startIdx, endIdx);

const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages) {
    setCurrentPage(newPage);
    // Optionally scroll to table top
    tableRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
};
```

---

## 📝 Implementation Steps

### Step 1: Create Reusable Components (Session 1)
**Deliverable:** 3 new components + CSS patterns
- [ ] Create `NeuTable.js` wrapper component
  - Basic HTML `<table>` structure
  - Neumorphic styling via inline React styles
  - Column configuration system
  - Responsive wrapper
  - Pagination state management
- [ ] Create `StatusBadge.js` component
  - Status color mapping function
  - Semantic styling
  - Size variants
- [ ] Create `TablePagination.js` component
  - Previous/Next navigation
  - Page number buttons
  - Responsive display
  - Jump-to-page functionality

**Acceptance Criteria:**
- All 3 components compile without errors
- Props interfaces documented
- Code <200 lines per component
- Inline styles only (no CSS files)
- CSS variables used for all colors/shadows

---

### Step 2: Refactor RentalRequestListPage (Session 2)
**Deliverable:** Refactored rental requests page
- [ ] Remove all MUI imports (Table, TableContainer, Chip, Paper, Alert)
- [ ] Remove MUI Container, Typography, Button from page-level layout
- [ ] Implement custom page header (h1 + subtitle)
- [ ] Integrate NeuTable wrapper
- [ ] Replace MUI Chip with StatusBadge
- [ ] Add search/filter functionality
- [ ] Implement pagination (10 rows/page)
- [ ] Create error/loading states with Neumorphic styling
- [ ] Preserve admin vs. tenant view logic
- [ ] Preserve all navigation (View button → /rentals/:id)
- [ ] Add responsive column visibility

**Acceptance Criteria:**
- Page displays without MUI components
- All API calls still work
- Status colors match design spec
- Pagination loads/displays correctly
- Search filters rows in real-time
- Mobile viewport (375px) shows essential columns only
- Admin view shows tenant names, tenant view hides them
- Navigation to detail pages works
- All date/currency formatting preserved

---

### Step 3: Refactor ContractListPage (Session 3)
**Deliverable:** Refactored contracts page
- [ ] Remove all MUI imports
- [ ] Implement custom page header
- [ ] Replace Tabs with Neumorphic button group
- [ ] Integrate NeuTable wrapper
- [ ] Replace MUI Chip with StatusBadge
- [ ] Add search/filter bar
- [ ] Implement pagination (10 rows/page)
- [ ] Implement tab logic (All Contracts / Active Only)
- [ ] Create error/loading states
- [ ] Preserve admin vs. tenant view
- [ ] Preserve navigation to detail pages
- [ ] Add responsive column visibility

**Acceptance Criteria:**
- Page displays without MUI components
- Tab switching works (All / Active filters)
- Active-only filter shows only ACTIVE contracts
- All columns responsive per spec
- Search filters contracts in real-time
- Admin view shows tenant names
- Navigation to detail pages works
- Date formatting correct
- Price formatting correct

---

### Step 4: Mobile Testing & Responsive Adjustments (Session 4)
**Deliverable:** Mobile-optimized tables
- [ ] Test on iPhone SE (375px) viewport
- [ ] Test on iPad (768px) viewport
- [ ] Test on desktop (1920px) viewport
- [ ] Adjust column widths per viewport
- [ ] Test horizontal scroll behavior
- [ ] Verify touch-friendly button sizes (min 44px height)
- [ ] Test pagination on mobile
- [ ] Verify search/filter interactions on mobile
- [ ] Adjust shadows for mobile readability
- [ ] Test with slow network (loading states)

**Acceptance Criteria:**
- No horizontal overflow on mobile
- Essential columns always visible
- Pagination buttons touch-friendly
- Search input visible and usable on all devices
- Shadows not too harsh on mobile (reduced opacity)
- Row click/hover works on touch devices
- Responsive images/icons properly scaled

---

### Step 5: Code Review & Documentation (Session 5)
**Deliverable:** Polished, documented code
- [ ] Code review by `code-reviewer` agent
- [ ] Fix any linting/style issues
- [ ] Add JSDoc comments to all components
- [ ] Add inline comments for complex logic
- [ ] Document props interfaces
- [ ] Create usage examples for each component
- [ ] Update project documentation (if needed)
- [ ] Run final visual tests
- [ ] Verify no console errors/warnings

**Acceptance Criteria:**
- No console errors or warnings
- All code reviewed and approved
- Components well-documented
- No TypeScript, no external CSS, no Tailwind
- All inline styles follow Neumorphism spec

---

## 🗂️ Related Code Files

### Files to Modify
- `frontend/src/pages/RentalRequestListPage.js`
- `frontend/src/pages/ContractListPage.js`

### Files to Create
- `frontend/src/components/NeuTable.js` (NEW)
- `frontend/src/components/StatusBadge.js` (NEW)
- `frontend/src/components/TablePagination.js` (NEW)

### Files to Reference
- `frontend/src/globals.css` (CSS variables)
- `frontend/src/components/NeuButton.js` (button patterns)
- `frontend/src/services/rentalService.js` (API)
- `frontend/src/services/contractService.js` (API)

---

## 📊 Success Criteria & Validation

### Functional Requirements
- ✅ 100% of existing API calls preserved
- ✅ All navigation routes working
- ✅ Status mapping accurate per type
- ✅ Admin vs. tenant views respected
- ✅ Tab/filter functionality preserved
- ✅ Pagination loads correct data
- ✅ Search filters in real-time
- ✅ Date/currency formatting correct

### Non-Functional Requirements
- ✅ No MUI components anywhere
- ✅ No Tailwind classes
- ✅ No external CSS files
- ✅ Inline React styles only
- ✅ CSS variables from `globals.css` only
- ✅ Components <200 lines each
- ✅ Responsive at 3 breakpoints
- ✅ Accessibility: WCAG AA compliant

### Design Requirements
- ✅ Neumorphic shadows match spec
- ✅ Colors match design system
- ✅ Typography matches `globals.css`
- ✅ Spacing consistent with existing components
- ✅ Hover states provide feedback
- ✅ Touch-friendly on mobile

---

## ⚠️ Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| API breaking on refactor | Low | High | Keep all service calls identical; test each API method |
| Mobile responsiveness issues | Medium | Medium | Test at 3+ viewport sizes early; use overflow scroll |
| Shadow rendering varies across browsers | Low | Low | Use standard CSS properties; test in Chrome/Safari/Firefox |
| Navigation broken | Low | High | Run navigation tests after each page refactor |
| Status colors hard to distinguish | Low | Medium | Use high-contrast colors; get design approval |

---

## 🔒 Security Considerations

- No sensitive data in console logs
- No hardcoded API endpoints (use service layer)
- Search/filter sanitized (no XSS)
- User role checks preserved (`isAdmin()`)
- Admin-only columns conditionally rendered
- Pagination prevents unauthorized data access

---

## 🔗 Dependencies & Prerequisites

### Required
- React 18+ (already installed)
- React Router v6+ (already installed)
- `globals.css` with CSS variables (already exists)
- `rentalService` and `contractService` (already exist)
- `AuthContext` for role checking (already exists)

### Build/Deploy
- No new npm packages needed
- No new build configuration needed
- No TypeScript compilation needed

---

## 📚 Reference & Code Snippets

### CSS Variables Available
```css
/* Colors */
--color-background: #E0E5EC;
--color-foreground: #3D4852;
--color-muted: #6B7280;
--color-accent: #6C63FF;
--color-accent-secondary: #38B2AC;

/* Shadows */
--shadow-extruded: 9px 9px 16px rgb(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.5);
--shadow-inset: inset 6px 6px 10px rgb(163, 177, 198, 0.6), inset -6px -6px 10px rgba(255, 255, 255, 0.5);
--shadow-inset-small: inset 3px 3px 6px rgb(163, 177, 198, 0.6), inset -3px -3px 6px rgba(255, 255, 255, 0.5);

/* Radius */
--radius-container: 32px;
--radius-base: 16px;
--radius-inner: 12px;

/* Transitions */
--duration-default: 300ms;
--easing-default: ease-out;
```

### Import Pattern for Services
```javascript
import { rentalService } from '../services/rentalService';
import { contractService } from '../services/contractService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
```

### Component Template
```javascript
export default function NeuTable({ columns, rows, pageSize = 10, onPageChange }) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'var(--color-background)',
    borderRadius: 'var(--radius-base)',
    boxShadow: 'var(--shadow-extruded)',
    overflow: 'hidden'
  };

  return (
    <div>
      <table style={tableStyle}>
        {/* Header & Body */}
      </table>
      <TablePagination 
        currentPage={currentPage}
        totalPages={Math.ceil(rows.length / pageSize)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
```

---

## 📞 Contact & Questions

**Questions/Blockers? Check:**
1. Is API returning expected data shape? (logs in DevTools)
2. Are shadows rendering correctly? (inspect element styles)
3. Is responsive breakpoint correct? (check CSS media queries)
4. Is admin role checked? (`useAuth()` hook)

**Next Steps After Approval:**
1. Lead reviews and approves this plan
2. Implementation team starts Step 1 (NeuTable component)
3. Delegate to code-reviewer after each component
4. Parallel testing during Step 4

---

## 🎬 Next Phase: Phase 6

After table refactoring complete:
- **Phase 6:** Refactor Form Components (FormField, Input, Select)
- Remove MUI Form components
- Create Neumorphic form elements
- Implement validation states
