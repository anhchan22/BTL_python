# Phase 4: Technical Specifications & Code Templates

**Document Date:** April 9, 2026  
**Purpose:** Detailed code structure and inline style definitions

---

## 📐 Complete Style Objects Reference

### Container & Layout Styles

```javascript
// Main Page Container
const containerStyle = {
  minHeight: '100vh',
  backgroundColor: 'var(--color-background)',
  padding: 'clamp(1rem, 2vw, 2rem)',
};

// Max-width wrapper for content centering
const maxWidthWrapperStyle = {
  maxWidth: '80rem',
  marginLeft: 'auto',
  marginRight: 'auto',
};

// Page header section
const headerSectionStyle = {
  marginBottom: '2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
};

// Main title
const titleStyle = {
  fontSize: 'clamp(1.875rem, 5vw, 3rem)',
  fontWeight: '700',
  fontFamily: '"Plus Jakarta Sans", sans-serif',
  color: 'var(--color-foreground)',
  marginBottom: 0,
};

// Subtitle/description
const subtitleStyle = {
  color: 'var(--color-muted)',
  fontSize: 'clamp(1rem, 2vw, 1.125rem)',
  marginBottom: 0,
};
```

### Search Bar & Filter Styles

```javascript
// Search bar container - responsive flex layout
const searchBarContainerStyle = {
  display: 'flex',
  gap: 'clamp(1rem, 2vw, 1.5rem)',
  marginBottom: '2rem',
  flexWrap: 'wrap',
  alignItems: 'center',
};

// Search input field
const searchInputStyle = {
  flex: '1 1 auto',
  minWidth: '200px',
  padding: '0.75rem 1rem',
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-foreground)',
  border: 'none',
  borderRadius: 'var(--radius-base)',
  boxShadow: 'var(--shadow-inset)',
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '1rem',
  transition: 'box-shadow var(--duration-default) var(--easing-default)',
  '::placeholder': {
    color: 'var(--color-placeholder)',
  },
};

// Search input focus state
const searchInputFocusStyle = {
  ...searchInputStyle,
  outline: 'none',
  boxShadow: 'var(--shadow-inset-deep), 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-accent)',
};

// Sort/filter dropdown
const selectStyle = {
  padding: '0.75rem 1rem',
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-foreground)',
  border: 'none',
  borderRadius: 'var(--radius-base)',
  boxShadow: 'var(--shadow-inset)',
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: 'box-shadow var(--duration-default) var(--easing-default)',
};

// Filter label and checkbox
const filterLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
  color: 'var(--color-foreground)',
  fontSize: '0.95rem',
  fontWeight: '500',
};

const checkboxStyle = {
  width: '20px',
  height: '20px',
  cursor: 'pointer',
  accentColor: 'var(--color-accent)',
};
```

### Button Styles

```javascript
// Primary Action Button (Add Zone, View Details)
const buttonPrimaryStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: 'var(--color-accent)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--radius-base)',
  boxShadow: 'var(--shadow-extruded)',
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all var(--duration-default) var(--easing-default)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  minHeight: '44px',
};

// Primary button hover
const buttonPrimaryHoverStyle = {
  ...buttonPrimaryStyle,
  backgroundColor: 'var(--color-accent-light)',
  boxShadow: 'var(--shadow-extruded-hover)',
  transform: 'translateY(-1px)',
};

// Primary button active/pressed
const buttonPrimaryActiveStyle = {
  ...buttonPrimaryStyle,
  boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.2), inset -2px -2px 4px rgba(255, 255, 255, 0.3)',
  transform: 'translateY(0.5px)',
};

// Secondary Button (Edit, Cancel)
const buttonSecondaryStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-foreground)',
  border: 'none',
  borderRadius: 'var(--radius-base)',
  boxShadow: 'var(--shadow-extruded)',
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all var(--duration-default) var(--easing-default)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  minHeight: '44px',
};

// Secondary button hover
const buttonSecondaryHoverStyle = {
  ...buttonSecondaryStyle,
  backgroundColor: '#D5DDE5',
  boxShadow: 'var(--shadow-extruded-hover)',
  transform: 'translateY(-1px)',
};

// Button disabled state
const buttonDisabledStyle = {
  ...buttonSecondaryStyle,
  opacity: '0.5',
  cursor: 'not-allowed',
  transform: 'none',
};
```

### Card Grid & Card Styles

```javascript
// Zone card grid container - responsive columns
const gridContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 'clamp(1.5rem, 3vw, 2rem)',
  marginBottom: '2rem',
};

// Zone card main wrapper
const cardStyle = {
  width: '100%',
  backgroundColor: 'var(--color-background)',
  borderRadius: 'var(--radius-container)',
  boxShadow: 'var(--shadow-extruded)',
  overflow: 'hidden',
  transition: 'all var(--duration-default) var(--easing-default)',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '420px',
};

// Card hover state (lifted)
const cardHoverStyle = {
  ...cardStyle,
  boxShadow: 'var(--shadow-extruded-hover)',
  transform: 'translateY(-4px)',
};

// Image container with aspect ratio
const imageContainerStyle = {
  width: '100%',
  aspectRatio: '16/9',
  overflow: 'hidden',
  backgroundColor: '#f0f0f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// Image inside container
const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  transition: 'opacity var(--duration-default) var(--easing-default)',
};

// Image hover effect
const imageHoverStyle = {
  ...imageStyle,
  opacity: '0.9',
};

// Loading skeleton for image
const imageSkeletonStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--color-muted)',
  opacity: '0.2',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--color-muted)',
  fontSize: '0.875rem',
};

// Card content area
const cardContentStyle = {
  flex: '1',
  padding: 'clamp(1.5rem, 3vw, 1.75rem)',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

// Card title (zone name)
const cardTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  fontFamily: '"Plus Jakarta Sans", sans-serif',
  color: 'var(--color-foreground)',
  margin: 0,
  lineHeight: '1.3',
};

// Card location subtitle
const cardLocationStyle = {
  fontSize: '0.95rem',
  color: 'var(--color-muted)',
  margin: 0,
  fontWeight: '500',
};

// Specifications grid (Area, Price, Available)
const specsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
  padding: '1rem',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  borderRadius: 'var(--radius-inner)',
};

// Individual spec cell
const specCellStyle = {
  textAlign: 'center',
};

// Spec label (Area, Price, Available)
const specLabelStyle = {
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  color: 'var(--color-muted)',
  margin: 0,
  marginBottom: '0.25rem',
  letterSpacing: '0.05em',
};

// Spec value (actual number)
const specValueStyle = {
  fontSize: '1rem',
  fontWeight: '700',
  color: 'var(--color-foreground)',
  margin: 0,
};

// Status badge - Available
const badgeAvailableStyle = {
  display: 'inline-block',
  padding: '0.35rem 0.75rem',
  backgroundColor: 'rgba(56, 178, 172, 0.2)',
  color: 'var(--color-accent-secondary)',
  borderRadius: '9999px',
  fontSize: '0.875rem',
  fontWeight: '700',
};

// Status badge - Not Available
const badgeUnavailableStyle = {
  display: 'inline-block',
  padding: '0.35rem 0.75rem',
  backgroundColor: 'rgba(239, 68, 68, 0.2)',
  color: '#DC2626',
  borderRadius: '9999px',
  fontSize: '0.875rem',
  fontWeight: '700',
};

// Card actions footer
const cardActionsStyle = {
  padding: 'clamp(1rem, 2vw, 1.5rem)',
  paddingTop: '1rem',
  display: 'flex',
  gap: '0.75rem',
  borderTop: '1px solid var(--color-muted)',
  borderTopOpacity: '0.15',
  justifyContent: 'space-between',
};
```

### Error & Empty State Styles

```javascript
// Error message box
const errorBoxStyle = {
  marginBottom: '1.5rem',
  padding: '1rem 1.5rem',
  borderRadius: 'var(--radius-base)',
  backgroundColor: '#FEE2E2',
  borderLeft: '4px solid #EF4444',
};

const errorTextStyle = {
  color: '#7F1D1D',
  fontSize: '0.95rem',
  fontWeight: '500',
  margin: 0,
};

// Empty state container
const emptyStateStyle = {
  textAlign: 'center',
  paddingTop: '4rem',
  paddingBottom: '4rem',
  color: 'var(--color-muted)',
  fontSize: '1.125rem',
};

// Loading state
const loadingStateStyle = {
  textAlign: 'center',
  paddingTop: '3rem',
  paddingBottom: '3rem',
  color: 'var(--color-muted)',
  fontSize: '1rem',
  fontStyle: 'italic',
};
```

---

## 🎨 Placeholder Color Gradients

```javascript
const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',    // Blue-Purple
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',    // Pink-Red
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',    // Cyan-Blue
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',    // Green-Cyan
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',    // Pink-Yellow
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',    // Cyan-Purple
];

function getPlaceholderGradient(zoneId) {
  return PLACEHOLDER_GRADIENTS[zoneId % PLACEHOLDER_GRADIENTS.length];
}
```

---

## 🔄 Responsive Breakpoint Styles

```javascript
// Mobile-first approach
// Base styles are for mobile, then expand

// Tablet breakpoint (640px+)
// Already handled by clamp() in padding/gap/font-size

// Desktop breakpoint (1024px+)
// Grid automatically adjusts with auto-fit, minmax()

// Full HD breakpoint (1280px+)
// Still 3 columns, but with more generous spacing

// Example: Mobile to Desktop Grid Progression
// Mobile (< 640px):    1 column   (280px min)
// Tablet (640-1024px): 2 columns  (280px each min)
// Desktop (> 1024px):  3 columns  (280px each min)
```

---

## 🖼️ Image Loading Strategy

```javascript
// Image handling in ZoneCard
const [imageLoaded, setImageLoaded] = useState(!!zone.image_url);
const [imageError, setImageError] = useState(false);

const handleImageLoad = () => {
  setImageLoaded(true);
};

const handleImageError = () => {
  setImageError(true);
};

// Render logic
{zone.image_url && !imageError ? (
  <img
    src={zone.image_url}
    alt={zone.name}
    onLoad={handleImageLoad}
    onError={handleImageError}
    style={imageLoaded ? imageStyle : imageSkeletonStyle}
  />
) : (
  <div style={imageSkeletonStyle}>
    Loading...
  </div>
)}
```

---

## 💰 Price Formatting Utility

```javascript
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Example outputs:
// formatPrice(150000)     => "150.000 ₫"
// formatPrice(1500000)    => "1.500.000 ₫"
// formatPrice(15000000)   => "15.000.000 ₫"
```

---

## 🔍 Search & Filter Logic

```javascript
// Filter function
const getFilteredAndSortedZones = (zones, searchTerm, sortBy, filterAvailableOnly) => {
  // Step 1: Search filter
  let result = zones.filter(zone => {
    const matchesSearch = 
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAvailableFilter = !filterAvailableOnly || 
      (zone.is_available && zone.available_area > 0);
    
    return matchesSearch && matchesAvailableFilter;
  });

  // Step 2: Sort
  if (sortBy === 'price') {
    result.sort((a, b) => a.price_per_sqm - b.price_per_sqm);
  } else if (sortBy === 'area') {
    result.sort((a, b) => b.available_area - a.available_area);
  } else {
    // Default: by name (A-Z)
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
};

// Usage in ZoneListPage
const filteredZones = getFilteredAndSortedZones(
  zones,
  searchTerm,
  sortBy,
  filterAvailableOnly
);
```

---

## ⚙️ Required CSS Variables (globals.css Addition)

```css
:root {
  /* ...existing variables... */

  /* Image placeholder configuration */
  --image-placeholder-opacity: 0.3;
  --image-placeholder-text-color: rgba(255, 255, 255, 0.7);
  
  /* Aspect ratio (CSS native support) */
  /* Used with aspect-ratio: var(--image-aspect-ratio) */
  --image-aspect-ratio: 16/9;
}
```

---

## 🧩 Component Integration Points

### How components connect:

```
ZoneListPage (Page)
  ↓ Props: zones[], loading, error
  ├→ ZoneSearchBar (Component)
  │   Props: searchTerm, sortBy, filters
  │   Events: onSearchChange, onSortChange, onFilterChange
  │
  └→ ZoneCard (Component) [repeating]
      Props: zone, isAdmin, onViewDetails, onEdit
      Events: onClick handlers
```

### Data flow:

```
API Response (zoneService.getAllZones())
    ↓
  setZones() 
    ↓
  getFilteredAndSortedZones()
    ↓
  filteredZones.map((zone) => <ZoneCard zone={zone} ... />)
    ↓
  User clicks "View Details" or "Edit"
    ↓
  navigate() to detail/edit page
```

---

## 🚨 Error Handling Examples

```javascript
// API Error Handling (ZoneListPage)
const loadZones = async () => {
  try {
    setLoading(true);
    setError('');
    const data = await zoneService.getAllZones();
    const zoneList = Array.isArray(data) ? data : (data.results || []);
    setZones(zoneList);
  } catch (err) {
    console.error('Failed to load zones:', err);
    setError('Failed to load zones. Please try again.');
  } finally {
    setLoading(false);
  }
};

// Image Loading Error (ZoneCard)
const handleImageError = () => {
  setImageError(true);
  // Falls back to gradient background
};

// Render Error State
{error && (
  <div style={errorBoxStyle}>
    <p style={errorTextStyle}>{error}</p>
    <button 
      onClick={loadZones}
      style={buttonSecondaryStyle}
    >
      Try Again
    </button>
  </div>
)}
```

---

## 🎯 Component Props Specification

### ZoneCard Props Interface

```javascript
/**
 * @typedef {Object} Zone
 * @property {number} id - Zone identifier
 * @property {string} name - Zone name
 * @property {string} location - Zone location
 * @property {number} total_area - Total area in m²
 * @property {number} available_area - Available area in m²
 * @property {number} price_per_sqm - Price per m²/month
 * @property {boolean} is_available - Availability flag
 * @property {string} [image_url] - Optional image URL
 */

/**
 * ZoneCard Component Props
 * @param {Zone} zone - Zone data object
 * @param {boolean} isAdmin - Whether user is admin
 * @param {function} onViewDetails - Callback for view details button
 * @param {function} onEdit - Callback for edit button
 */
ZoneCard.propTypes = {
  zone: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    total_area: PropTypes.number.isRequired,
    available_area: PropTypes.number.isRequired,
    price_per_sqm: PropTypes.number.isRequired,
    is_available: PropTypes.bool.isRequired,
    image_url: PropTypes.string,
  }).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};
```

### ZoneSearchBar Props Interface

```javascript
/**
 * ZoneSearchBar Component Props
 * @param {string} searchTerm - Current search term
 * @param {function} onSearchChange - Callback when search term changes
 * @param {string} sortBy - Current sort option ('name'|'price'|'area')
 * @param {function} onSortChange - Callback when sort changes
 * @param {boolean} filterAvailableOnly - Whether to show only available
 * @param {function} onFilterChange - Callback when filter changes
 */
ZoneSearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  sortBy: PropTypes.oneOf(['name', 'price', 'area']).isRequired,
  onSortChange: PropTypes.func.isRequired,
  filterAvailableOnly: PropTypes.bool.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};
```

---

## 📦 File Size Targets

| File | Target Lines | Current | Target |
|------|-------------|---------|--------|
| ZoneListPage.js | 180-220 | 137 | +80 styles |
| ZoneCard.js | 150-180 | NEW | 170-180 |
| ZoneSearchBar.js | 120-150 | NEW | 130-150 |
| ZoneImagePlaceholder.js | 50-80 | NEW | 60-70 |
| globals.css | +15 lines | 542 | +15 |

---

## ✅ Implementation Checklist for Code Review

**Style Consistency:**
- [ ] All colors use CSS variables (no hardcoded hex except gradients)
- [ ] All shadows use CSS variables
- [ ] All radius values use CSS variables
- [ ] All transitions use `--duration-default` and `--easing-default`
- [ ] Consistent padding/margin with clamp() for responsiveness

**Inline Styles Pattern:**
- [ ] Styles defined as const objects at top of component
- [ ] Hover/active states handled via JavaScript, not CSS
- [ ] No class names or external CSS
- [ ] No CSS-in-JS libraries (styled-components, emotion, etc.)

**Component Structure:**
- [ ] Props clearly documented
- [ ] State variables well-named
- [ ] Event handlers prefixed with `handle`
- [ ] No console.logs in production code
- [ ] Error handling present for async operations

**Responsive Design:**
- [ ] Uses CSS Grid with auto-fit/minmax
- [ ] Uses clamp() for fluid sizing
- [ ] Tested on mobile/tablet/desktop
- [ ] No hardcoded pixel widths (except small values)
- [ ] Proper use of flex for button groups

**Accessibility:**
- [ ] Buttons have proper `onClick` handlers
- [ ] Inputs have `placeholder` text
- [ ] Focus states visible
- [ ] Color not only indicator (e.g., status badges have text)
- [ ] Semantic HTML used

**Performance:**
- [ ] No unnecessary state updates
- [ ] No unnecessary re-renders
- [ ] Image loading handled properly
- [ ] Smooth animations (300ms)
- [ ] No console warnings

---

## 🔗 Reference Files

- **Neumorphic Pattern:** `/src/pages/DashboardPage.js`
- **Card Component:** `/src/components/DashboardCard.js`
- **Service Layer:** `/src/services/zoneService.js`
- **Design Tokens:** `/src/globals.css`
- **Auth Context:** `/src/contexts/AuthContext.js`

