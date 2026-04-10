# Phase 4: Neumorphic Industrial Zone Card Grid - Implementation Plan

**Document Date:** April 9, 2026  
**Status:** Planning  
**Priority:** High  
**Complexity:** Medium-High

---

## 📋 Executive Summary

Transform ZoneListPage from Material-UI component-based layout to fully styled neumorphic React component system. Create responsive card grid with neumorphic styling, image support, search/sort functionality, while preserving 100% of API logic and navigation.

**Key Constraint:** Pure inline React styles (NO MUI, NO Tailwind) using CSS variables from globals.css.

---

## 🎯 Current State Analysis

### Existing Implementation (ZoneListPage.js)
- **UI Framework:** Material-UI (MUI)
- **Components Used:** Container, Box, Typography, Button, Grid, Card, CardContent, CardActions, TextField, InputAdornment, Chip, Alert
- **Search:** Text-based filter (name/location)
- **Display:** 3-column grid (12 xs, 6 md, 4 lg)
- **Data Display:** Zone name, location, area, price, availability status
- **Actions:** View Details, Edit (admin only)

### Existing Code Pattern (Dashboard/Auth Pages)
- **Style Approach:** Inline React style objects (NOT CSS-in-JS)
- **Colors:** CSS variables (--color-background, --color-foreground, --color-accent, etc.)
- **Shadows:** Neumorphic CSS variables (--shadow-extruded, --shadow-inset, etc.)
- **Spacing:** `clamp()` for responsive sizing
- **Grid Layout:** CSS Grid with `repeat(auto-fit, minmax(...))`
- **Components:** Custom built (NeuButton, NeuNavButton, DashboardCard, StatBox)
- **Transitions:** 300ms ease-out with state-based hover effects
- **Structure:** Single JSX file with style definitions section at top

---

## 🏗️ Target Architecture

### Component Hierarchy
```
ZoneListPage (refactored)
├── ZoneSearchBar
│   ├── Search Input
│   └── Sort Dropdown
├── Zone Grid Container
│   └── ZoneCard (repeating)
│       ├── Image Container
│       ├── Content Section
│       │   ├── Title
│       │   ├── Location
│       │   ├── Specs (Area, Price)
│       │   └── Status Badge
│       └── Actions Container
│           ├── View Details Button
│           └── Edit Button (admin)
└── Empty State / Loading State
```

### File Structure
```
frontend/src/
├── pages/
│   └── ZoneListPage.js (refactored - 180-200 lines)
│
├── components/
│   ├── ZoneCard.js (NEW - 150-180 lines)
│   ├── ZoneSearchBar.js (NEW - 120-150 lines)
│   └── ZoneImagePlaceholder.js (NEW - 50-80 lines, optional)
│
└── globals.css (UPDATED - CSS variables for images)
```

---

## 🎨 Design System & Styling

### CSS Variables Used (from globals.css)
```javascript
// Colors
--color-background: #E0E5EC
--color-foreground: #3D4852
--color-muted: #6B7280
--color-accent: #6C63FF
--color-accent-light: #8B84FF
--color-accent-secondary: #38B2AC (for available status)

// Shadows (Neumorphic)
--shadow-extruded: 9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)
--shadow-extruded-hover: 12px 12px 20px rgb(163,177,198,0.7), -12px -12px 20px rgba(255,255,255,0.6)
--shadow-inset: inset 6px 6px 10px rgb(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)

// Radius
--radius-container: 32px
--radius-base: 16px
--radius-inner: 12px

// Transitions
--duration-default: 300ms
--easing-default: ease-out
```

### Image Placeholder Strategy
**Recommendation:** Use service-based placeholder generation (Unsplash, Placeholder.com, or custom SVG)

**CSS Variables to Add:**
```css
/* Image Placeholder Configuration */
--image-placeholder-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--image-placeholder-text: #ffffff
--image-aspect-ratio: 16/9
```

**Placeholder Service Options:**
1. **Unsplash API** - Real industrial zone images (requires API key)
2. **Placeholder Service** - Generic placeholder with custom background
3. **Local SVG** - Generated SVG icon + background (no external calls)
4. **Backend API** - If API returns image URLs (preferred if available)

**Selected Approach:** Fallback system
- If zone has image_url: display it
- Else: Use placeholder service (Unsplash with category tag)
- Fallback: SVG-based local placeholder with zone name initial

---

## 🔄 Responsive Design Specification

### Grid Breakpoints
```javascript
// Mobile (< 640px): 1 column
gridTemplateColumns: '1fr'

// Tablet (640px - 1024px): 2 columns  
gridTemplateColumns: 'repeat(2, 1fr)'

// Desktop (> 1024px): 3 columns
gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'

// Full HD (> 1280px): Still 3 columns, wider gaps
gap: 'clamp(1.5rem, 3vw, 2rem)'
```

### Card Dimensions
```
Width: 100% (grid controls)
Height: Auto (content-driven)
Image Height: 200px (aspect-ratio: 16/9)
Padding: clamp(1rem, 2vw, 1.5rem)
Min Card Height: ~420px (with content)
```

---

## ✨ Feature Specifications

### 1. ZoneSearchBar Component

**Props:**
```javascript
{
  searchTerm: string,
  onSearchChange: (value: string) => void,
  sortBy: 'name' | 'price' | 'area',
  onSortChange: (value: string) => void,
  filters: {
    availableOnly: boolean
  },
  onFilterChange: (filters: object) => void
}
```

**Features:**
- Search input with neumorphic inset style
- Sort dropdown (Name A-Z, Price Low-High, Area Large-Small)
- Optional filter checkbox "Available Only"
- Icons: 🔍 Search, ↕️ Sort
- Responsive: Full width on mobile, inline on desktop

**Styling:**
- Input: `--shadow-inset-deep` focus state
- Dropdown: `--shadow-inset` default, lifted on hover
- Layout: `display: flex` with responsive wrapping

### 2. ZoneCard Component

**Props:**
```javascript
{
  zone: {
    id: number,
    name: string,
    location: string,
    total_area: number,
    available_area: number,
    price_per_sqm: number,
    is_available: boolean,
    image_url?: string
  },
  onViewDetails: (id: number) => void,
  onEdit: (id: number) => void,
  isAdmin: boolean,
  loading?: boolean
}
```

**Sections:**
1. **Image Container**
   - Aspect ratio 16:9
   - Placeholder if no image
   - Overlay on hover (opacity effect)
   - Loading skeleton state

2. **Content Area**
   - Zone Name (h4 style, bold)
   - Location with emoji 📍
   - Specs grid (Area, Price)
   - Status badge (Available/Not Available)

3. **Actions Footer**
   - "View Details" button (always visible)
   - "Edit" button (admin only)
   - Button group layout

**Interactions:**
- Hover card: lift 4px with `--shadow-extruded-hover`
- Hover image: slight opacity change
- Button hover: primary color change
- Button active: inset shadow (pressed state)

### 3. ZoneImagePlaceholder Component (Optional)

**Purpose:** Generate consistent placeholder images

**Implementation Options:**
```javascript
// Option A: External URL
function getPlaceholderUrl(zoneId, zoneName) {
  return `https://unsplash.com/photos/industrial?sig=${zoneId}`
}

// Option B: Generated SVG
function getPlaceholderSvg(initials) {
  return `data:image/svg+xml,...`
}

// Option C: CSS Background
function getPlaceholderBg(zoneId) {
  const colors = ['linear-gradient(135deg, #667eea 0%, #764ba2 100%)', ...]
  return colors[zoneId % colors.length]
}
```

**Selected:** Option C (CSS background) + Optional Unsplash fallback

---

## 🔧 Implementation Steps

### Step 1: Refactor ZoneListPage.js
**Estimated:** 45 minutes

- [ ] Remove all MUI imports (Container, Box, Typography, etc.)
- [ ] Remove MUI styling props (sx, variant, etc.)
- [ ] Add inline style definitions at top
- [ ] Extract search/sort/filter logic to component state
- [ ] Keep API call logic unchanged
- [ ] Keep navigation logic unchanged
- [ ] Add error handling for image loading

**Key Changes:**
```javascript
// REMOVE:
import { Container, Box, Typography, Button, Grid, Card, CardContent, CardActions, TextField, InputAdornment, Chip, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// ADD:
const [sortBy, setSortBy] = useState('name');
const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);

const containerStyle = { /* ... */ };
const gridStyle = { display: 'grid', gridTemplateColumns: '...' };
// ... more styles
```

### Step 2: Create ZoneSearchBar.js Component
**Estimated:** 40 minutes

- [ ] Build search input with neumorphic styling
- [ ] Build sort dropdown with options
- [ ] Add optional availability filter
- [ ] Implement responsive layout (stack on mobile)
- [ ] Add placeholder text and icons
- [ ] Test focus states and transitions

**File Size Target:** 120-150 lines

### Step 3: Create ZoneCard.js Component
**Estimated:** 60 minutes

- [ ] Build card structure with all sections
- [ ] Add image container with placeholder fallback
- [ ] Add content section with all zone info
- [ ] Format price with Intl.NumberFormat
- [ ] Create status badge with conditional styling
- [ ] Implement action buttons with hover states
- [ ] Add loading skeleton (optional)
- [ ] Test responsive card height

**File Size Target:** 150-180 lines

### Step 4: Create ZoneImagePlaceholder.js (Optional)
**Estimated:** 25 minutes

- [ ] Design placeholder SVG or color gradients
- [ ] Create fallback logic
- [ ] Export utility function for use in ZoneCard
- [ ] Add CSS variables for customization

**File Size Target:** 50-80 lines

### Step 5: Update globals.css
**Estimated:** 15 minutes

- [ ] Add image placeholder CSS variables
- [ ] Add aspect-ratio utilities if needed
- [ ] Add loading skeleton styles
- [ ] Verify all existing variables still used

### Step 6: Integrate & Test
**Estimated:** 30 minutes

- [ ] Update ZoneListPage to use new components
- [ ] Test responsive behavior (mobile/tablet/desktop)
- [ ] Test search, sort, filter functionality
- [ ] Test admin-only edit button visibility
- [ ] Test navigation to detail/edit pages
- [ ] Test error states and empty states
- [ ] Verify image loading (with and without URLs)

### Step 7: Code Review & Refinement
**Estimated:** 20 minutes

- [ ] Review inline styles for consistency
- [ ] Verify CSS variable usage
- [ ] Check accessibility (ARIA labels, focus states)
- [ ] Optimize performance (no unnecessary re-renders)
- [ ] Test on actual mobile device

---

## 🎯 Implementation Details

### ZoneListPage.js Structure (Refactored)

```javascript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { zoneService } from '../services/zoneService';
import ZoneSearchBar from '../components/ZoneSearchBar';
import ZoneCard from '../components/ZoneCard';

export default function ZoneListPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);

  // Styles Section (200+ lines)
  const containerStyle = { /* ... */ };
  const gridStyle = { /* ... */ };
  // ... more styles

  // Load zones
  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      const data = await zoneService.getAllZones();
      const zoneList = Array.isArray(data) ? data : (data.results || []);
      setZones(zoneList);
    } catch (err) {
      setError('Failed to load zones');
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort Logic
  let filteredZones = zones.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          zone.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterAvailableOnly || (zone.is_available && zone.available_area > 0);
    return matchesSearch && matchesFilter;
  });

  if (sortBy === 'price') {
    filteredZones.sort((a, b) => a.price_per_sqm - b.price_per_sqm);
  } else if (sortBy === 'area') {
    filteredZones.sort((a, b) => b.available_area - a.available_area);
  } else {
    filteredZones.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div style={containerStyle}>
      <div style={maxWidthWrapperStyle}>
        {/* Header */}
        <h1 style={titleStyle}>Industrial Zones 🏭</h1>

        {/* Search Bar */}
        <ZoneSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterAvailableOnly={filterAvailableOnly}
          onFilterChange={setFilterAvailableOnly}
        />

        {/* Add Zone Button - Admin Only */}
        {isAdmin() && (
          <button 
            onClick={() => navigate('/zones/create')}
            style={addButtonStyle}
          >
            ➕ Add Zone
          </button>
        )}

        {/* Error State */}
        {error && <div style={errorStyle}>{error}</div>}

        {/* Loading State */}
        {loading && <div style={loadingStyle}>Loading zones...</div>}

        {/* Zone Grid */}
        {!loading && (
          <div style={gridStyle}>
            {filteredZones.map(zone => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                isAdmin={isAdmin()}
                onViewDetails={() => navigate(`/zones/${zone.id}`)}
                onEdit={() => navigate(`/zones/${zone.id}/edit`)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredZones.length === 0 && (
          <div style={emptyStateStyle}>No zones found</div>
        )}
      </div>
    </div>
  );
}
```

### ZoneCard.js Structure

```javascript
import React, { useState } from 'react';

export default function ZoneCard({ zone, isAdmin, onViewDetails, onEdit }) {
  const [imageLoaded, setImageLoaded] = useState(!!zone.image_url);
  const [imageError, setImageError] = useState(false);

  const cardStyle = { /* neumorphic lifted card */ };
  const imageStyle = { /* aspect-ratio 16:9 */ };
  const contentStyle = { /* flex column */ };
  const titleStyle = { /* heading-4 */ };
  const locationStyle = { /* muted text */ };
  // ... more styles

  const getPlaceholderBg = (id) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      // ... more colors
    ];
    return colors[id % colors.length];
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div style={cardStyle}>
      {/* Image Container */}
      <div 
        style={{
          ...imageStyle,
          background: imageError || !zone.image_url 
            ? getPlaceholderBg(zone.id) 
            : undefined
        }}
      >
        {zone.image_url && !imageError && (
          <img
            src={zone.image_url}
            alt={zone.name}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            style={imageStyle}
          />
        )}
        {!imageLoaded && (
          <div style={imageSkeletonStyle}>Loading...</div>
        )}
      </div>

      {/* Content */}
      <div style={contentStyle}>
        <h4 style={titleStyle}>{zone.name}</h4>
        <p style={locationStyle}>📍 {zone.location}</p>

        {/* Specs Grid */}
        <div style={specsGridStyle}>
          <div>
            <p style={specLabelStyle}>Area</p>
            <p style={specValueStyle}>{zone.total_area} m²</p>
          </div>
          <div>
            <p style={specLabelStyle}>Available</p>
            <p style={specValueStyle}>{zone.available_area} m²</p>
          </div>
          <div>
            <p style={specLabelStyle}>Price</p>
            <p style={specValueStyle}>{formatPrice(zone.price_per_sqm)}/m²</p>
          </div>
        </div>

        {/* Status Badge */}
        {zone.is_available && zone.available_area > 0 ? (
          <span style={badgeAvailableStyle}>✓ Available</span>
        ) : (
          <span style={badgeUnavailableStyle}>✗ Not Available</span>
        )}
      </div>

      {/* Actions */}
      <div style={actionsStyle}>
        <button onClick={onViewDetails} style={buttonPrimaryStyle}>
          View Details
        </button>
        {isAdmin && (
          <button onClick={onEdit} style={buttonSecondaryStyle}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}
```

### ZoneSearchBar.js Structure

```javascript
import React, { useState } from 'react';

export default function ZoneSearchBar({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  filterAvailableOnly,
  onFilterChange
}) {
  const searchBarContainerStyle = { /* flex responsive */ };
  const inputStyle = { /* neumorphic inset */ };
  const selectStyle = { /* neumorphic inset */ };
  // ... more styles

  return (
    <div style={searchBarContainerStyle}>
      {/* Search Input */}
      <input
        type="text"
        placeholder="🔍 Search by name or location..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={inputStyle}
      />

      {/* Sort Dropdown */}
      <select 
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        style={selectStyle}
      >
        <option value="name">↔️ Sort by Name</option>
        <option value="price">💰 Sort by Price</option>
        <option value="area">📏 Sort by Area</option>
      </select>

      {/* Filter Checkbox */}
      <label style={filterLabelStyle}>
        <input
          type="checkbox"
          checked={filterAvailableOnly}
          onChange={(e) => onFilterChange(e.target.checked)}
          style={checkboxStyle}
        />
        <span>Available Only</span>
      </label>
    </div>
  );
}
```

---

## 🧪 Testing Strategy

### Unit Testing (Jest)
- [ ] ZoneCard renders with all props
- [ ] Image placeholder shows when no image_url
- [ ] Status badge color changes based on availability
- [ ] Price formatting works correctly
- [ ] Admin edit button hidden for non-admin

### Integration Testing
- [ ] Search filters zones correctly
- [ ] Sort changes order correctly
- [ ] Filter "Available Only" removes unavailable zones
- [ ] Navigation to detail/edit pages works
- [ ] API data loads correctly

### Visual Testing
- [ ] Card appears same across all browsers
- [ ] Neumorphic shadows render correctly
- [ ] Responsive layout works (1/2/3 columns)
- [ ] Hover states trigger smoothly
- [ ] Images load and display correctly

### Accessibility Testing
- [ ] Keyboard navigation through cards
- [ ] Focus states visible
- [ ] ARIA labels on interactive elements
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Screen reader friendly

---

## 📊 Success Criteria

### Functional Requirements
- ✅ All zones display in responsive grid
- ✅ Search filters by name/location
- ✅ Sort by name/price/area works
- ✅ Filter "Available Only" works
- ✅ Admin can add/edit zones
- ✅ Navigation to detail/edit pages works
- ✅ Images display with fallback placeholders

### Design Requirements
- ✅ 100% neumorphic styling (no MUI)
- ✅ Consistent with Dashboard/Auth pages
- ✅ All CSS variables used properly
- ✅ Responsive 1/2/3 column layout
- ✅ Smooth transitions and hover effects
- ✅ Proper typography hierarchy

### Code Quality
- ✅ No TypeScript (pure JavaScript)
- ✅ Inline styles only (no external CSS)
- ✅ Each component < 200 lines
- ✅ Consistent with codebase patterns
- ✅ Proper error handling
- ✅ No console errors/warnings

### Performance
- ✅ No unnecessary re-renders
- ✅ Images load lazily
- ✅ Smooth animations (300ms)
- ✅ Mobile performance acceptable

---

## ⚠️ Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Image loading failures | Medium | Low | Implement placeholder fallback, handle errors |
| Responsive layout breaks at edge cases | Low | Medium | Test on actual devices, use clamp() for sizing |
| CSS variable not found | Low | Low | Reference globals.css, validate all variables |
| Performance issues with many zones | Low | Medium | Implement pagination/virtualization if needed |
| Browser compatibility issues | Low | Low | Test on modern browsers (Chrome, Firefox, Safari) |

---

## 🔐 Security Considerations

- **Image URLs:** Sanitize if from user input (not applicable here)
- **XSS Prevention:** Sanitize zone name/location if from API (use textContent, not innerHTML)
- **API Security:** Use existing zoneService (already vetted)
- **Auth Check:** Verify admin status before showing edit buttons

---

## 📚 Dependencies

### No New Package Dependencies
- Use existing React and React Router
- Use existing zoneService
- Use existing AuthContext

### Internal Dependencies
- `/src/globals.css` - CSS variables
- `/src/services/zoneService.js` - API calls
- `/src/contexts/AuthContext.js` - Admin check

---

## 🚀 Deployment Notes

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Responsive design verified
- [ ] Image loading tested
- [ ] Performance acceptable
- [ ] Code review passed
- [ ] Browser compatibility verified

### Rollback Plan
- Keep old MUI version in git history
- If issues found, revert ZoneListPage.js
- Test admin functionality before full rollout

---

## 📝 Additional Implementation Notes

### Image Aspect Ratio
**Recommended:** 16:9 (landscape)
- Good for industrial zone photos
- Consistent with design system
- CSS: `aspect-ratio: 16/9;` with `object-fit: cover;`

### Placeholder Color Palette
```css
/* Vibrant gradient colors for visual interest */
#667eea → #764ba2 (Blue-Purple)
#f093fb → #f5576c (Pink-Red)
#4facfe → #00f2fe (Cyan-Blue)
#43e97b → #38f9d7 (Green-Cyan)
#fa709a → #fee140 (Pink-Yellow)
#30cfd0 → #330867 (Cyan-Purple)
```

### Button Styles Summary

**Primary Action Buttons:**
- Background: `--color-accent` (#6C63FF)
- Text: white
- Shadow: `--shadow-extruded`
- Hover: `--color-accent-light` (#8B84FF), `--shadow-extruded-hover`

**Secondary Buttons:**
- Background: `--color-background` (#E0E5EC)
- Text: `--color-foreground` (#3D4852)
- Shadow: `--shadow-extruded`
- Hover: lighter background, `--shadow-extruded-hover`

---

## 🎓 Learning Resources

- **Neumorphic Design:** Reference Neumorphism_Design.md in project docs
- **CSS Variables:** See globals.css for all available tokens
- **Responsive Design:** Use clamp() for fluid sizing, Grid for layout
- **React Patterns:** Reference DashboardPage.js and existing components

---

## 📋 Unresolved Questions

1. **Image Source** - Should we require zone.image_url from API or generate placeholders?
   - *Proposed Answer:* Use API if available, fallback to generated placeholder
   
2. **Pagination** - If zones list grows large (100+), should we add pagination?
   - *Proposed Answer:* No for Phase 4, add in Phase 5 if needed

3. **Filter Options** - Besides "Available Only", should we add price range filter?
   - *Proposed Answer:* No for Phase 4, keep simple (name/location search + sort)

4. **Card Click Action** - Should clicking card body navigate to details, or only button?
   - *Proposed Answer:* Only button click navigates, card click can highlight

5. **Admin Add Zone Button** - Should it be in header or as floating action button?
   - *Proposed Answer:* In header (top-right) consistent with Dashboard

---

## ✅ Phase Completion Criteria

**All of the following must be true to mark Phase 4 complete:**

1. ✅ ZoneListPage.js refactored with zero MUI imports
2. ✅ ZoneCard.js component created with all features
3. ✅ ZoneSearchBar.js component created with all filters
4. ✅ All inline styles follow CSS variable pattern
5. ✅ Responsive layout verified (1/2/3 columns)
6. ✅ Image loading with fallback tested
7. ✅ All API/navigation logic preserved
8. ✅ Admin functionality preserved
9. ✅ Code review passed
10. ✅ No console errors or warnings
11. ✅ Browser compatibility verified

---

## 🔗 Related Documentation

- **Design System:** `./Neumorphism_Design.md`
- **Component Examples:** `./src/components/DashboardCard.js`, `./src/pages/DashboardPage.js`
- **API Reference:** `./src/services/zoneService.js`
- **Code Standards:** `./docs/code-standards.md`

---

## 📞 Questions / Contact

For questions about this plan, refer to:
- **Code Standards:** `./docs/code-standards.md`
- **Neumorphic Patterns:** Existing auth & dashboard components
- **API Contracts:** `zoneService.getAllZones()` return format
