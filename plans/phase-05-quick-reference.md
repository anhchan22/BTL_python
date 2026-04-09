# Phase 5 Quick Reference Card

**Print this page or bookmark for easy access during implementation**

---

## 🎯 Key Files to Create/Modify

### NEW Files (Create These)
```
src/components/NeuTable.js              ← Reusable table wrapper
src/components/StatusBadge.js           ← Status indicator component  
src/components/TablePagination.js       ← Pagination control
```

### MODIFY Files
```
src/pages/RentalRequestListPage.js      ← Remove MUI, add NeuTable
src/pages/ContractListPage.js           ← Remove MUI, add NeuTable + Tabs
```

### REFERENCE Files (Don't modify)
```
src/globals.css                         ← CSS variables
src/services/rentalService.js           ← API calls
src/services/contractService.js         ← API calls
src/contexts/AuthContext.js             ← User role checking
```

---

## 📐 Most-Used CSS Variables

### Colors
```javascript
backgroundColor: 'var(--color-background)',  // #E0E5EC
color: 'var(--color-foreground)',           // #3D4852
color: 'var(--color-muted)',                // #6B7280 (secondary)
backgroundColor: 'var(--color-accent)',     // #6C63FF (active)
backgroundColor: 'var(--color-accent-secondary)', // #38B2AC (success)
```

### Shadows
```javascript
boxShadow: 'var(--shadow-extruded)',        // Raised button
boxShadow: 'var(--shadow-extruded-small)',  // Small button
boxShadow: 'var(--shadow-extruded-hover)',  // Button hover
boxShadow: 'var(--shadow-inset)',           // Input field
boxShadow: 'var(--shadow-inset-small)',     // Badge/small
```

### Radius & Timing
```javascript
borderRadius: 'var(--radius-base)',   // 16px (buttons, tables)
borderRadius: 'var(--radius-inner)',  // 12px (headers, small)
transition: 'all var(--duration-default) var(--easing-default)',
```

---

## 🧩 Component Props Reference

### NeuTable Props
```javascript
columns={[                    // Array of column definitions
  {
    id: 'zone_info',
    label: 'Zone',
    width: '100px',
    align: 'left',
    visible: true,
    mobileVisible: true,      // Show on mobile?
    tabletVisible: true,      // Show on tablet?
    renderCell: (row) => row.zone_info?.name
  }
]}
rows={filteredRequests}       // Data array
pageSize={10}                 // Rows per page
currentPage={currentPage}     // Current page number
onPageChange={handlePageChange} // Page change handler
loading={loading}             // Loading state
emptyMessage="No data"        // Empty state message
```

### StatusBadge Props
```javascript
status="ACTIVE"              // Status string (PENDING, APPROVED, etc.)
statusType="rental"          // 'rental' or 'contract'
size="small"                 // 'small' (12px) or 'medium' (14px)
```

### TablePagination Props
```javascript
currentPage={1}              // Current page
totalPages={10}              // Total number of pages
onPageChange={(page) => {}}  // Callback on page change
totalCount={100}             // Total items count
pageSize={10}                // Items per page
```

---

## 🎨 Common Style Patterns (Copy-Paste Ready)

### Page Container
```javascript
const pageContainerStyle = {
  width: '100%',
  minHeight: '100vh',
  backgroundColor: 'var(--color-background)',
  padding: '24px',
  fontFamily: 'DM Sans, sans-serif'
};
```

### Page Title
```javascript
const titleStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  color: 'var(--color-foreground)',
  marginBottom: '8px',
  letterSpacing: '-0.02em'
};
```

### Table Cell (Header)
```javascript
const headerCellStyle = {
  padding: '16px 12px',
  fontWeight: '600',
  color: 'var(--color-foreground)',
  fontSize: '0.9rem',
  boxShadow: 'var(--shadow-extruded-small)',
  borderRadius: 'var(--radius-inner)'
};
```

### Table Cell (Data)
```javascript
const dataCellStyle = {
  padding: '14px 12px',
  color: 'var(--color-foreground)',
  fontSize: '0.95rem',
  borderBottom: '1px solid rgba(163, 177, 198, 0.2)'
};
```

### Status Badge
```javascript
const badgeStyle = {
  padding: '6px 12px',
  fontSize: '0.75rem',
  fontWeight: '600',
  backgroundColor: '#E74C3C',  // Status-specific
  color: 'white',
  borderRadius: '6px',
  boxShadow: 'var(--shadow-inset-small)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};
```

### Action Button
```javascript
const buttonStyle = {
  padding: '6px 12px',
  minHeight: '32px',
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-accent)',
  border: 'none',
  borderRadius: 'var(--radius-inner)',
  fontSize: '0.85rem',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: 'var(--shadow-extruded-small)',
  transition: 'all var(--duration-default) var(--easing-default)'
};
```

### Row Hover Effect
```javascript
const getRowStyle = (rowId) => ({
  backgroundColor: hoveredRowId === rowId ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
  transform: hoveredRowId === rowId ? 'translateY(-1px)' : 'translateY(0)',
  boxShadow: hoveredRowId === rowId ? 'var(--shadow-extruded-small)' : 'none',
  transition: 'all var(--duration-default) var(--easing-default)',
  cursor: 'pointer'
});
```

### Search Input
```javascript
const searchBarStyle = {
  flex: 1,
  minWidth: '200px',
  padding: '12px 16px',
  backgroundColor: 'var(--color-background)',
  border: 'none',
  borderRadius: 'var(--radius-base)',
  fontSize: '0.95rem',
  fontFamily: 'DM Sans, sans-serif',
  color: 'var(--color-foreground)',
  boxShadow: 'var(--shadow-inset)',
  transition: 'all var(--duration-default) var(--easing-default)'
};
```

### Active Tab Button
```javascript
const getTabButtonStyle = (isActive) => ({
  padding: '10px 20px',
  minHeight: '40px',
  backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-background)',
  color: isActive ? 'white' : 'var(--color-foreground)',
  border: 'none',
  borderRadius: 'var(--radius-base)',
  fontSize: '0.95rem',
  fontWeight: '600',
  fontFamily: 'DM Sans, sans-serif',
  cursor: 'pointer',
  boxShadow: isActive ? 'var(--shadow-inset)' : 'var(--shadow-extruded-small)',
  transition: 'all var(--duration-default) var(--easing-default)'
});
```

---

## 🎯 Status Color Mappings

### Quick Copy-Paste
```javascript
// For Rental Requests
const statusColorMap = {
  PENDING: { bg: 'var(--color-muted)', text: 'white' },
  APPROVED: { bg: 'var(--color-accent-secondary)', text: 'white' },
  REJECTED: { bg: '#E74C3C', text: 'white' },
  CANCELLED: { bg: '#95A5A6', text: 'white' }
};

// For Contracts
const statusColorMap = {
  ACTIVE: { bg: 'var(--color-accent-secondary)', text: 'white' },
  EXPIRED: { bg: 'var(--color-muted)', text: 'white' },
  TERMINATED: { bg: '#E74C3C', text: 'white' }
};
```

---

## 🚀 Implementation Checklist - Quick Version

### Step 1: Create Components
- [ ] Create `NeuTable.js` with pagination logic
- [ ] Create `StatusBadge.js` with color mapping
- [ ] Create `TablePagination.js` with nav buttons
- [ ] Test each component in isolation

### Step 2: Refactor RentalRequestListPage
- [ ] Remove MUI imports
- [ ] Replace table with NeuTable
- [ ] Replace Chip with StatusBadge
- [ ] Add search/filter state
- [ ] Add pagination state
- [ ] Test on mobile/tablet/desktop

### Step 3: Refactor ContractListPage
- [ ] Remove MUI imports
- [ ] Add tab buttons (replace Tabs)
- [ ] Replace table with NeuTable
- [ ] Replace Chip with StatusBadge
- [ ] Add search/filter state
- [ ] Test tab switching
- [ ] Test on mobile/tablet/desktop

### Step 4: Testing
- [ ] No console errors
- [ ] Desktop viewport: all columns visible
- [ ] Tablet viewport: conditional columns
- [ ] Mobile viewport: essential columns only
- [ ] Pagination works
- [ ] Search filters in real-time
- [ ] Navigation to detail pages works
- [ ] Admin/tenant views work correctly

### Step 5: Code Review
- [ ] No MUI components anywhere
- [ ] No Tailwind classes
- [ ] No external CSS files
- [ ] All styles inline or CSS variables
- [ ] Components <200 lines
- [ ] Responsive at 3+ breakpoints
- [ ] Accessibility: WCAG AA

---

## 📱 Responsive Column Visibility

### RentalRequestListPage Columns
| Column | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| ID | ✅ | ✅ | ✅ |
| Tenant (admin only) | ❌ | ✅ | ✅ |
| Zone | ✅ | ✅ | ✅ |
| Area | ✅ | ✅ | ✅ |
| Duration | ❌ | ❌ | ✅ |
| Cost | ✅ | ✅ | ✅ |
| Status | ✅ | ✅ | ✅ |
| Requested Date | ❌ | ❌ | ✅ |
| Actions | ✅ | ✅ | ✅ |

### ContractListPage Columns
| Column | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| Contract # | ✅ | ✅ | ✅ |
| Tenant (admin only) | ❌ | ✅ | ✅ |
| Zone | ✅ | ✅ | ✅ |
| Area | ✅ | ✅ | ✅ |
| Rent | ✅ | ✅ | ✅ |
| Start Date | ❌ | ✅ | ✅ |
| End Date | ❌ | ✅ | ✅ |
| Status | ✅ | ✅ | ✅ |
| Actions | ✅ | ✅ | ✅ |

---

## 🔗 Import Template

```javascript
// Services
import { rentalService } from '../services/rentalService';
import { contractService } from '../services/contractService';

// Context
import { useAuth } from '../contexts/AuthContext';

// Router
import { useNavigate } from 'react-router-dom';

// React
import React, { useState, useEffect, useRef } from 'react';

// Components (NEW)
import NeuTable from '../components/NeuTable';
import StatusBadge from '../components/StatusBadge';
```

---

## ⚡ Common Issues & Fixes

### Issue: Shadows look wrong
**Fix:** Make sure you're using the correct shadow variable with correct CSS syntax:
```javascript
// ✅ Correct
boxShadow: 'var(--shadow-extruded-small)'

// ❌ Wrong (MUI style)
boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
```

### Issue: Colors don't match
**Fix:** Use CSS variables, not hardcoded colors:
```javascript
// ✅ Correct
backgroundColor: 'var(--color-background)'
color: 'var(--color-foreground)'

// ❌ Wrong (hardcoded)
backgroundColor: '#E0E5EC'
color: '#3D4852'
```

### Issue: Table doesn't scroll on mobile
**Fix:** Add overflow wrapper with responsive logic:
```javascript
const tableWrapperStyle = {
  overflowX: window.innerWidth < 640 ? 'auto' : 'visible',
  borderRadius: 'var(--radius-base)',
  boxShadow: 'var(--shadow-extruded)'
};
```

### Issue: Pagination buttons too small
**Fix:** Add minHeight and minWidth:
```javascript
const paginationButtonStyle = {
  minHeight: '36px',
  minWidth: '36px',
  padding: '8px 12px',
  // ... other styles
};
```

### Issue: Search doesn't filter rows
**Fix:** Make sure filter function is applied to displayedRows:
```javascript
const filteredRows = rows.filter(row => 
  row.status?.toLowerCase().includes(searchQuery.toLowerCase())
);
```

### Issue: Responsive columns show on wrong breakpoint
**Fix:** Update column definition with correct breakpoints:
```javascript
{
  id: 'tenant_info',
  label: 'Tenant',
  mobileVisible: false,     // Hide on mobile < 640px
  tabletVisible: true,      // Show on tablet 640-1023px
  // No 'visible' = show on desktop ≥ 1024px
}
```

---

## 🎓 Code Quality Checkpoints

After each component, run:
```bash
# Check for syntax errors
npm run build

# Check for console warnings
npm start  # Watch browser console

# Check component size
# File should be < 200 lines
wc -l src/components/NeuTable.js
```

---

## 📞 When Stuck

1. **Check globals.css** - Verify CSS variable syntax
2. **Check existing components** - Reference NeuButton.js, DashboardCard.js
3. **Check browser DevTools** - Inspect element styles
4. **Check console** - Error messages often have hints
5. **Check props** - Verify column/row data structure matches expectations
6. **Check responsive** - Use DevTools device toolbar (F12 → Ctrl+Shift+M)

---

## ✨ Success Indicators

✅ All Done When:
- No red errors in console
- All pages load without MUI warnings
- Pagination works (10 rows per page)
- Search filters in real-time
- Responsive on 3 viewports
- Status badges show correct colors
- Navigation to detail pages works
- Admin/tenant views display correctly
- All dates formatted (vi-VN)
- All prices formatted (VND)

---

**Keep this card handy during implementation!** 📌

Last updated: 2026-04-09
