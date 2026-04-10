# Phase 1: Component Checklist - Translation & Icon Updates Required

## Overview
Complete inventory of 38 components and pages requiring translation and icon updates for the visual facelift.

**Total Components**: 27 reusable components + 11 pages  
**Status**: All identified and prioritized  
**Coverage**: 100% of UI  

---

## Components & Pages Checklist

### Legend
- ✅ = Not started
- 🔄 = In progress
- ✓ = Completed
- ⚠️ = Blocked/Needs clarification

---

## Reusable Components (27 items)

### Category: Layout & Navigation

#### Navbar.js
- [ ] Translate: Logo, nav links (Zones, Requests, Contracts)
- [ ] Translate: User menu items (My Profile, Dashboard, Logout)
- [ ] Translate: Role badges (ADMIN, TENANT)
- [ ] Icons: Replace emoji with Lucide icons (Building2, Factory, Clipboard, FileText, User, Crown, LogOut, Settings)
- **Text Labels**: 8  
- **Icons**: 8  
- **Priority**: ⭐⭐⭐ Critical (Most visible)
- **Estimated Time**: 30 minutes
- **Status**: ✅ Pending

#### DashboardCard.js
- [ ] Translate: Card titles (optional, uses parent-provided text)
- [ ] Icons: Support Lucide icons (currently hardcoded in parent)
- **Text Labels**: 0 (title passed from parent)  
- **Icons**: 1 (icon support)  
- **Priority**: ⭐⭐ Medium
- **Estimated Time**: 15 minutes
- **Status**: ✅ Pending

#### AuthCard.js
- [ ] No UI text (wrapper component)
- [ ] No icons
- **Status**: ✅ No changes needed

### Category: Forms & Input

#### FormField.js
- [ ] Translate: Error message display (if any)
- [ ] Translate: Placeholder text (passed from parent)
- **Text Labels**: Minimal (mostly parent-controlled)  
- **Icons**: 0  
- **Priority**: ⭐ Low
- **Estimated Time**: 10 minutes
- **Status**: ✅ Pending

#### ZoneSearchBar.js
- [ ] Translate: Search placeholder, sort options
- [ ] Translate: Filter labels
- [ ] Translate: Add Zone button (if visible)
- **Text Labels**: 5-8  
- **Icons**: 2-3  
- **Priority**: ⭐⭐ Medium
- **Estimated Time**: 20 minutes
- **Status**: ✅ Pending

### Category: Display & Status

#### StatusBadge.js
- [ ] Translate: Status values (PENDING, APPROVED, REJECTED, ACTIVE, EXPIRED, etc.)
- [ ] Icons: Optional icon support for status
- **Text Labels**: 7 status types  
- **Icons**: 0 (currently just text)  
- **Priority**: ⭐⭐⭐ Critical
- **Estimated Time**: 15 minutes
- **Status**: ✅ Pending

#### StatBox.js
- [ ] Translate: Label text (passed from parent)
- [ ] Icons: Already supports emoji/icons
- **Text Labels**: 0 (parent-controlled)  
- **Icons**: 1 (already integrated)  
- **Priority**: ⭐⭐ Medium
- **Estimated Time**: 5 minutes
- **Status**: ✅ No changes (emoji → icons handled in parent)

#### ZoneCard.js
- [ ] Translate: "Total Area:", "Available:", "Price:", "View Details", "Edit"
- [ ] Translate: Status badges (AVAILABLE, NOT AVAILABLE)
- [ ] Icons: Replace 📍 with MapPin, replace 🏭 with Factory
- **Text Labels**: 7  
- **Icons**: 2  
- **Priority**: ⭐⭐⭐ Critical
- **Estimated Time**: 25 minutes
- **Status**: ✅ Pending

#### ImageGallery.js
- [ ] No hardcoded UI text
- [ ] Icons: May need navigation icons
- **Text Labels**: 0  
- **Icons**: 0-2  
- **Priority**: ⭐ Low
- **Estimated Time**: 10 minutes
- **Status**: ✅ Pending

#### NeuButton.js
- [ ] No hardcoded text (content passed as children)
- [ ] Icons: Support icon integration
- **Text Labels**: 0  
- **Icons**: 0 (parent-controlled)  
- **Priority**: ⭐ Low
- **Estimated Time**: 5 minutes
- **Status**: ✅ No changes

#### NeuNavButton.js
- [ ] Translate: Label text (passed from parent)
- [ ] Icons: Already supports emoji/icons
- **Text Labels**: 0 (parent-controlled)  
- **Icons**: 1 (already integrated)  
- **Priority**: ⭐ Low
- **Estimated Time**: 5 minutes
- **Status**: ✅ No changes

#### TablePagination.js
- [ ] Translate: "Previous", "Next", "Page X of Y"
- [ ] Icons: Replace ← → with ArrowLeft, ArrowRight
- **Text Labels**: 3  
- **Icons**: 2  
- **Priority**: ⭐⭐ Medium
- **Estimated Time**: 15 minutes
- **Status**: ✅ Pending

#### ZoneImagePlaceholder.js
- [ ] No text (gradient placeholder)
- [ ] Icons: May show placeholder icon
- **Text Labels**: 0  
- **Icons**: 0-1  
- **Priority**: ⭐ Low
- **Estimated Time**: 5 minutes
- **Status**: ✅ Pending

### Category: Utility Components

#### Loading.js
- [ ] Translate: Loading message text
- [ ] Icons: May include loading spinner
- **Text Labels**: 1-2  
- **Icons**: 1  
- **Priority**: ⭐⭐ Medium
- **Estimated Time**: 10 minutes
- **Status**: ✅ Pending

#### ErrorBoundary.js
- [ ] Translate: Error message
- [ ] Icons: Error icon
- **Text Labels**: 1  
- **Icons**: 1  
- **Priority**: ⭐⭐ Medium
- **Estimated Time**: 10 minutes
- **Status**: ✅ Pending

#### PrivateRoute.js
- [ ] No UI text
- **Status**: ✅ No changes needed

---

## Pages (11 items)

### Authentication Pages

#### LoginPage.js
- [ ] Translate: Title, subtitle, labels, button text, link text
- [ ] Translate: Error messages
- [ ] Icons: No icons in this page
- **Text Labels**: 10+  
- **Icons**: 0  
- **Priority**: ⭐⭐⭐ Critical
- **Estimated Time**: 20 minutes
- **Status**: ✅ Pending

#### RegisterPage.js
- [ ] Translate: Title, subtitle, labels, button text, link text
- [ ] Translate: Error messages
- **Text Labels**: 10+  
- **Icons**: 0  
- **Priority**: ⭐⭐⭐ Critical
- **Estimated Time**: 20 minutes
- **Status**: ✅ Pending

### Main Content Pages

#### DashboardPage.js
- [ ] Translate: Title, subtitle, stat labels, section titles
- [ ] Translate: Quick action labels
- [ ] Translate: Error messages
- [ ] Icons: Replace emoji with Lucide icons (Building2, Factory, Clipboard, FileText, Users, BarChart3, Zap, Wrench, Hand)
- **Text Labels**: 20+  
- **Icons**: 10  
- **Priority**: ⭐⭐⭐ Critical
- **Estimated Time**: 45 minutes
- **Status**: ✅ Pending

#### ZoneListPage.js
- [ ] Translate: Page title, loading state, error message, empty states
- [ ] Translate: Pagination text
- [ ] Icons: Replace ← → with ArrowLeft/Right
- **Text Labels**: 6  
- **Icons**: 2  
- **Priority**: ⭐⭐⭐ Critical
- **Estimated Time**: 25 minutes
- **Status**: ✅ Pending

#### ZoneDetailPage.js
- [ ] Translate: Back button, section titles, field labels
- [ ] Translate: Loading state, error message
- [ ] Translate: Action button text
- [ ] Icons: Replace 📍 (MapPin), ℹ️ (Info), ✏️ (Edit), 🏢 (Building2)
- **Text Labels**: 12  
- **Icons**: 4  
- **Priority**: ⭐⭐⭐ Critical
- **Estimated Time**: 30 minutes
- **Status**: ✅ Pending

#### ZoneFormPage.js
- [ ] Translate: Title, section titles, field labels, placeholders
- [ ] Translate: Helper text, error messages
- [ ] Translate: Button text (Create/Update/Delete)
- [ ] Icons: Replace 📸 (Camera), 🗑️ (Trash2), 💡 (Lightbulb), ➕ (Plus), ✏️ (Edit)
- **Text Labels**: 20+  
- **Icons**: 5  
- **Priority**: ⭐⭐⭐ Critical
- **Estimated Time**: 40 minutes
- **Status**: ✅ Pending

#### RentalRequestListPage.js
- [ ] Translate: Page title (admin vs tenant), table headers
- [ ] Translate: Loading state, error message, empty state
- [ ] Translate: Button text (View)
- [ ] Icons: Replace 📋 (Clipboard), possibly table row icons
- **Text Labels**: 12  
- **Icons**: 1  
- **Priority**: ⭐⭐⭐ Critical
- **Estimated Time**: 25 minutes
- **Status**: ✅ Pending

#### RentalRequestFormPage.js
- [ ] Translate: Title, section titles, field labels, help text
- [ ] Translate: Button text
- [ ] Note: Uses MUI components (may need separate theming)
- **Text Labels**: 10  
- **Icons**: 0  
- **Priority**: ⭐⭐ Medium (MUI component)
- **Estimated Time**: 20 minutes
- **Status**: ✅ Pending

#### RentalRequestDetailPage.js
- [ ] Translate: Page title, back button, section titles, field labels
- [ ] Translate: Dialog titles and messages
- [ ] Translate: Button text
- [ ] Icons: Replace ← (ArrowLeft), ✓ (Check), ✗ (X)
- **Text Labels**: 18  
- **Icons**: 3  
- **Priority**: ⭐⭐⭐ Critical
- **Estimated Time**: 35 minutes
- **Status**: ✅ Pending

#### ContractListPage.js
- [ ] Translate: Page title, tab labels, table headers
- [ ] Translate: Loading state, error message, empty state
- [ ] Translate: Button text
- **Text Labels**: 12  
- **Icons**: 0  
- **Priority**: ⭐⭐⭐ Critical
- **Estimated Time**: 25 minutes
- **Status**: ✅ Pending

#### ContractDetailPage.js
- [ ] Translate: Back button, page title, section titles, field labels
- [ ] Translate: Timeline section, progress text
- [ ] Translate: Button text
- [ ] Icons: Replace ← (ArrowLeft), 📅 (Calendar), ⏳ (Hourglass), 📋 (Clipboard)
- **Text Labels**: 15  
- **Icons**: 4  
- **Priority**: ⭐⭐⭐ Critical
- **Estimated Time**: 35 minutes
- **Status**: ✅ Pending

#### ProfilePage.js
- [ ] Translate: Title, subtitle, section titles, field labels
- [ ] Translate: Button text, help text
- [ ] Translate: Success/error messages
- [ ] Icons: Replace 👤 (User), 🔐 (Lock), 🔄 (RefreshCw), ⚙️ (Settings)
- **Text Labels**: 15  
- **Icons**: 4  
- **Priority**: ⭐⭐⭐ Critical
- **Estimated Time**: 30 minutes
- **Status**: ✅ Pending

#### UserManagementPage.js
- [ ] Translate: Title, subtitle, table headers
- [ ] Translate: Dialog title, labels, messages
- [ ] Translate: Warning message
- [ ] Translate: Button text
- [ ] Icons: Replace 👥 (Users), 👑 (Crown), 👤 (User), ⚠️ (AlertTriangle), ✏️ (Edit)
- **Text Labels**: 15  
- **Icons**: 5  
- **Priority**: ⭐⭐ Medium (Admin only)
- **Estimated Time**: 30 minutes
- **Status**: ✅ Pending

---

## Summary Statistics

### By Category
| Category | Count | Text Items | Icons | Priority |
|---|---|---|---|---|
| Components | 27 | ~50 | ~30 | Mixed |
| Pages | 11 | ~150+ | ~35 | Critical |
| **Total** | **38** | **~200** | **~65** | Mixed |

### By Priority
| Priority | Components | Pages | Estimated Time |
|---|---|---|---|
| ⭐⭐⭐ Critical | 4 | 8 | 5.5 hours |
| ⭐⭐ Medium | 8 | 2 | 2 hours |
| ⭐ Low | 15 | 1 | 1 hour |
| **Total** | **27** | **11** | **8.5 hours** |

### Implementation Phases

**Phase 1 (Critical - Highest Impact)**
- Navbar.js (30 min)
- LoginPage.js (20 min)
- DashboardPage.js (45 min)
- ZoneListPage.js (25 min)
- ZoneDetailPage.js (30 min)
- ZoneFormPage.js (40 min)
- RentalRequestListPage.js (25 min)
- RentalRequestDetailPage.js (35 min)
- **Total**: 5.5 hours

**Phase 2 (Medium - Core Features)**
- ContractListPage.js (25 min)
- ContractDetailPage.js (35 min)
- ProfilePage.js (30 min)
- ZoneCard.js (25 min)
- StatusBadge.js (15 min)
- TablePagination.js (15 min)
- UserManagementPage.js (30 min)
- **Total**: 3.2 hours

**Phase 3 (Low - Polish & Edge Cases)**
- Supporting components (Loading, ErrorBoundary, etc.)
- Form components (FormField, ZoneSearchBar, etc.)
- Display components (ImageGallery, StatBox, etc.)
- **Total**: 1.5 hours

---

## Implementation Notes

### Shared Utilities
Create these utilities for reuse:

```javascript
// src/utils/formatPrice.js
export const formatPrice = (price, currency = 'VND') => { /* ... */ };

// src/utils/translations.js (optional)
export const translations = {
  'PENDING': 'CHỜ DUYỆT',
  'APPROVED': 'ĐÃ PHÊ DUYỆT',
  // ... etc
};
```

### Icon Strategy
- Use centralized Lucide import
- Create icon utility if needed for sizing/styling
- Maintain consistent sizing across app

### Testing Considerations
- Test with Vietnamese characters (special diacritics)
- Verify icon alignment in all contexts
- Check currency formatting with edge cases (0, large numbers)

---

## Component Dependencies

### Navbar.js
- No dependencies (top-level)
- Used by: App.js

### DashboardPage.js
- Depends on: StatBox, DashboardCard, NeuNavButton, NeuButton, StatusBadge
- Needs translation of all child components first

### Page Components
- Generally depend on 2-5 child components
- Recommend translating child components first

### Execution Order Recommendation
1. Create utility functions (formatPrice.js, translations.js)
2. Update components from bottom-up (leaf components first)
3. Update pages from most critical to least
4. Test navigation and cross-component integration

---

## Quality Assurance Checklist

For each component/page:

- [ ] All English text translated to Vietnamese
- [ ] Emoji replaced with Lucide icons
- [ ] Text formatting verified (proper spacing)
- [ ] Icons sized appropriately for context
- [ ] Accessibility labels updated
- [ ] No hardcoded English left in UI
- [ ] Currency formatting correct (if applicable)
- [ ] Tested in browser for alignment/overflow

---

## Unresolved Questions

1. **Registration page**: Is RegisterPage.js using standard forms or MUI?
   - Recommendation: Check if implementation exists, adapt accordingly

2. **Search/Filter components**: Are these in a separate SearchBar file?
   - Recommendation: Locate and include in checklist

3. **Date formatting**: Should dates also be localized to Vietnamese format?
   - Recommendation: Use 'vi-VN' locale for Intl.DateTimeFormat

4. **Error message sources**: Are error messages hardcoded in components or from backend?
   - Recommendation: Document error message sources for translation

5. **Snackbar/Toast notifications**: Need to find and update these
   - Recommendation: Search for 'snackbar' and 'notification' in codebase
