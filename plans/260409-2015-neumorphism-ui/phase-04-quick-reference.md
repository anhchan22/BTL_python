# Phase 4: Quick Reference Checklist

**For quick lookup during implementation**

---

## 🎯 Implementation Checklist

### Step 1: Refactor ZoneListPage.js
- [ ] Remove MUI imports
- [ ] Add inline style definitions (40+ styles)
- [ ] Convert JSX from MUI to HTML
- [ ] Maintain all state: zones, loading, error, searchTerm, sortBy, filterAvailableOnly
- [ ] Keep API call unchanged
- [ ] Keep navigation logic unchanged
- [ ] Verify page renders without errors

### Step 2: Create ZoneCard.js
- [ ] Import React
- [ ] Define component with props: zone, isAdmin, onViewDetails, onEdit
- [ ] Create style objects (cardStyle, imageStyle, titleStyle, etc.)
- [ ] Add image loading state management
- [ ] Build card structure (image + content + actions)
- [ ] Implement placeholder gradient fallback
- [ ] Add hover state via useState
- [ ] Export component

### Step 3: Create ZoneSearchBar.js
- [ ] Import React
- [ ] Define component with props: searchTerm, onSearchChange, sortBy, onSortChange, filterAvailableOnly, onFilterChange
- [ ] Create style objects (containerStyle, inputStyle, selectStyle, etc.)
- [ ] Build responsive flex layout
- [ ] Add search input with placeholder
- [ ] Add sort dropdown with 3 options
- [ ] Add filter checkbox
- [ ] Export component

### Step 4: Update ZoneListPage.js Integration
- [ ] Import ZoneSearchBar component
- [ ] Import ZoneCard component
- [ ] Replace inline search with `<ZoneSearchBar />`
- [ ] Replace inline card rendering with `<ZoneCard />` map
- [ ] Test all props flow correctly
- [ ] Verify search/sort/filter still work

### Step 5: Create ZoneImagePlaceholder.js (Optional)
- [ ] Define PLACEHOLDER_GRADIENTS array (6 colors)
- [ ] Export getPlaceholderGradient(zoneId) function
- [ ] Use in ZoneCard when image_url missing or error

### Step 6: Update globals.css
- [ ] Add image aspect ratio variable (16/9)
- [ ] Add placeholder color variable (for future use)
- [ ] Add loading skeleton styles (optional)
- [ ] Verify all existing variables still used

### Step 7: Testing
- [ ] Mobile responsive (1 column)
- [ ] Tablet responsive (2 columns)
- [ ] Desktop responsive (3 columns)
- [ ] Search functionality
- [ ] Sort functionality (name/price/area)
- [ ] Filter functionality (available only)
- [ ] Admin button visibility
- [ ] Image loading & fallback
- [ ] Navigation works
- [ ] No console errors
- [ ] No MUI artifacts remain

---

## 🎨 Styles Quick Reference

### All Required CSS Variables

```javascript
// Colors
--color-background: #E0E5EC
--color-foreground: #3D4852
--color-muted: #6B7280
--color-accent: #6C63FF
--color-accent-light: #8B84FF
--color-accent-secondary: #38B2AC

// Shadows
--shadow-extruded
--shadow-extruded-hover
--shadow-inset
--shadow-inset-deep
--shadow-inset-small

// Radius
--radius-container: 32px
--radius-base: 16px
--radius-inner: 12px

// Motion
--duration-default: 300ms
--easing-default: ease-out
```

### 20 Essential Style Objects to Create

```javascript
// Container
1. containerStyle
2. maxWidthWrapperStyle
3. headerSectionStyle

// Typography
4. titleStyle
5. subtitleStyle
6. cardTitleStyle
7. cardLocationStyle

// Search Bar
8. searchBarContainerStyle
9. searchInputStyle
10. selectStyle
11. filterLabelStyle

// Grid & Card
12. gridContainerStyle
13. cardStyle
14. cardHoverStyle
15. imageContainerStyle

// Content
16. cardContentStyle
17. specsGridStyle
18. specLabelStyle
19. specValueStyle

// Actions
20. cardActionsStyle
```

### Button Styles (6 variants)

```javascript
// Primary
buttonPrimaryStyle
buttonPrimaryHoverStyle
buttonPrimaryActiveStyle

// Secondary
buttonSecondaryStyle
buttonSecondaryHoverStyle

// Disabled
buttonDisabledStyle
```

### Badge Styles (2 variants)

```javascript
badgeAvailableStyle     // Teal background, teal text
badgeUnavailableStyle   // Red background, red text
```

---

## 📏 Responsive Grid Breakpoints

| Breakpoint | Grid Columns | Min Width | Max Width | Gap |
|-----------|-------------|-----------|-----------|-----|
| Mobile | 1 | - | 639px | 1.5rem |
| Tablet | 2 | 640px | 1023px | 1.65rem |
| Desktop | 3 | 1024px | 1439px | 1.8rem |
| Full HD | 3-4 | 1440px | - | 2rem |

**Grid CSS:**
```javascript
gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
gap: 'clamp(1.5rem, 3vw, 2rem)'
```

---

## 🖼️ Image Placeholder Gradients

```javascript
const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',    // 0: Blue-Purple
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',    // 1: Pink-Red
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',    // 2: Cyan-Blue
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',    // 3: Green-Cyan
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',    // 4: Pink-Yellow
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',    // 5: Cyan-Purple
];

// Usage: PLACEHOLDER_GRADIENTS[zoneId % 6]
```

---

## 💻 Component Props Cheat Sheet

### ZoneCard Props
```javascript
<ZoneCard
  zone={{
    id: number,
    name: string,
    location: string,
    total_area: number,
    available_area: number,
    price_per_sqm: number,
    is_available: boolean,
    image_url: string (optional)
  }}
  isAdmin={boolean}
  onViewDetails={(id) => {}}
  onEdit={(id) => {}}
/>
```

### ZoneSearchBar Props
```javascript
<ZoneSearchBar
  searchTerm={string}
  onSearchChange={(value) => {}}
  sortBy={'name' | 'price' | 'area'}
  onSortChange={(value) => {}}
  filterAvailableOnly={boolean}
  onFilterChange={(value) => {}}
/>
```

---

## 🎬 Animation Patterns

### Hover Lift
```javascript
const [isHovering, setIsHovering] = useState(false);

<div
  style={isHovering ? cardHoverStyle : cardStyle}
  onMouseEnter={() => setIsHovering(true)}
  onMouseLeave={() => setIsHovering(false)}
>
```

### Hover Color Change
```javascript
onMouseEnter={(e) => (e.target.style.color = 'var(--color-accent-light)')}
onMouseLeave={(e) => (e.target.style.color = 'var(--color-accent)')}
```

### Image Fade
```javascript
const [imageLoaded, setImageLoaded] = useState(false);
<img
  onLoad={() => setImageLoaded(true)}
  onError={() => setImageError(true)}
  style={imageLoaded ? imageStyle : loadingStyle}
/>
```

---

## 🔍 Search & Filter Logic Template

```javascript
// Filter and sort
const getFiltered = (zones, search, sort, availableOnly) => {
  let result = zones.filter(z => {
    const matchesSearch = 
      z.name.toLowerCase().includes(search.toLowerCase()) ||
      z.location.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !availableOnly || (z.is_available && z.available_area > 0);
    return matchesSearch && matchesFilter;
  });

  if (sort === 'price') {
    result.sort((a, b) => a.price_per_sqm - b.price_per_sqm);
  } else if (sort === 'area') {
    result.sort((a, b) => b.available_area - a.available_area);
  } else {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
};
```

---

## 💰 Price Formatting

```javascript
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
```

---

## ❌ Things to Avoid

- ❌ MUI imports: `@mui/material`, `@mui/icons-material`
- ❌ MUI components: `<Box>`, `<Card>`, `<Button>`, `<Grid>`
- ❌ MUI props: `sx`, `variant`, `size`, `fullWidth`
- ❌ Tailwind classes: `className="flex items-center"`
- ❌ CSS files: Don't create new .css files
- ❌ CSS-in-JS: styled-components, emotion, etc.
- ❌ Hardcoded colors: Use `var(--color-*)`
- ❌ CSS `:hover` in inline styles (use JavaScript instead)
- ❌ Hardcoded sizes for responsive elements
- ❌ Forgetting placeholder when no image_url

---

## ✅ Code Quality Patterns

### ✅ DO: Use inline style objects
```javascript
const titleStyle = {
  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
  fontWeight: '700',
  color: 'var(--color-foreground)',
};
```

### ✅ DO: Use CSS variables
```javascript
backgroundColor: 'var(--color-background)',
boxShadow: 'var(--shadow-extruded)',
borderRadius: 'var(--radius-base)',
```

### ✅ DO: Use clamp() for responsiveness
```javascript
fontSize: 'clamp(1rem, 2vw, 1.25rem)',
padding: 'clamp(1rem, 2vw, 1.5rem)',
```

### ✅ DO: Use CSS Grid auto-fit
```javascript
gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
```

### ✅ DO: Handle hover with JavaScript
```javascript
onMouseEnter={() => setIsHovering(true)}
style={isHovering ? hoverStyle : defaultStyle}
```

### ✅ DO: Handle images with error state
```javascript
const [imageError, setImageError] = useState(false);
<img onError={() => setImageError(true)} />
{imageError && <div style={placeholderStyle} />}
```

---

## 🐛 Debugging Checklist

If something doesn't work:

### Styles not applying?
- [ ] Check style object spelling
- [ ] Check CSS variable exists in globals.css
- [ ] Check style object is passed to `style={}` prop
- [ ] Inspect in DevTools to see computed styles

### Component not rendering?
- [ ] Check import statement
- [ ] Check component is called with `<ComponentName />`
- [ ] Check props are spelled correctly
- [ ] Check no typos in JSX

### Search/sort not working?
- [ ] Check state is being updated (console.log)
- [ ] Check filter function logic
- [ ] Check event handlers are wired: `onChange`, `onSortChange`
- [ ] Check filtered array is being rendered

### Image not showing?
- [ ] Check image_url is valid
- [ ] Check onError handler exists
- [ ] Check placeholder style is correct
- [ ] Check browser console for 404s

### Not responsive?
- [ ] Check grid-template-columns
- [ ] Check clamp() syntax: `clamp(min, preferred, max)`
- [ ] Test in DevTools device emulation
- [ ] Check no hardcoded widths

### Hover not working?
- [ ] Check onMouseEnter/onMouseLeave handlers
- [ ] Check useState hooks imported
- [ ] Check hover style object defined
- [ ] Check ternary operator logic

---

## 📁 File Locations

```
/d/AnhTran/Project/BTL_python/frontend/src/

pages/
  └── ZoneListPage.js          (REFACTOR)

components/
  ├── ZoneCard.js              (CREATE)
  ├── ZoneSearchBar.js          (CREATE)
  └── ZoneImagePlaceholder.js   (CREATE - optional)

globals.css                     (UPDATE - +15 lines)

services/
  └── zoneService.js            (NO CHANGES)

contexts/
  └── AuthContext.js            (NO CHANGES)
```

---

## 🔗 Copy-Paste Code Snippets

### Hover State Pattern
```javascript
const [isHovering, setIsHovering] = useState(false);

<div
  style={isHovering ? hoverStyle : defaultStyle}
  onMouseEnter={() => setIsHovering(true)}
  onMouseLeave={() => setIsHovering(false)}
/>
```

### Image with Fallback
```javascript
const [imageError, setImageError] = useState(false);

{imageError || !zone.image_url ? (
  <div style={{ background: getPlaceholderGradient(zone.id) }} />
) : (
  <img
    src={zone.image_url}
    onError={() => setImageError(true)}
    style={imageStyle}
  />
)}
```

### Filter/Sort Logic
```javascript
let filtered = zones.filter(z => {
  const matchSearch = z.name.toLowerCase().includes(search.toLowerCase());
  const matchFilter = !availableOnly || z.is_available;
  return matchSearch && matchFilter;
});

if (sort === 'price') {
  filtered.sort((a, b) => a.price_per_sqm - b.price_per_sqm);
} else {
  filtered.sort((a, b) => a.name.localeCompare(b.name));
}
```

### Price Format
```javascript
const formatted = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
}).format(zone.price_per_sqm);
```

---

## 📊 File Size Targets

| Component | Lines | Status |
|-----------|-------|--------|
| ZoneListPage.js | 180-220 | Refactor existing |
| ZoneCard.js | 150-180 | Create new |
| ZoneSearchBar.js | 120-150 | Create new |
| ZoneImagePlaceholder.js | 50-80 | Create new (optional) |
| globals.css | +15 | Update existing |
| **TOTAL NEW** | **~500** | **Can be split** |

---

## 🚀 Implementation Order

1. **First:** Refactor ZoneListPage.js (remove MUI, add styles)
2. **Second:** Create ZoneCard.js component
3. **Third:** Create ZoneSearchBar.js component
4. **Fourth:** Integrate components into ZoneListPage
5. **Fifth:** Create ZoneImagePlaceholder.js (optional)
6. **Sixth:** Update globals.css with image variables
7. **Seventh:** Test everything

---

## ⏱️ Time Estimate by Task

| Task | Time |
|------|------|
| Review documentation | 30-45 min |
| Refactor ZoneListPage | 45-60 min |
| Create ZoneCard | 60-90 min |
| Create ZoneSearchBar | 45-60 min |
| Integration | 30-45 min |
| Testing | 90-120 min |
| Code review/polish | 30-45 min |
| **TOTAL** | **5-7 hours** |

---

## 📞 When Stuck

1. **Check the reference files first:**
   - DashboardPage.js for page pattern
   - DashboardCard.js for card pattern
   - globals.css for variables

2. **Check the plan documents:**
   - Technical specifications for code patterns
   - Visual design guide for styles
   - Main plan for implementation steps

3. **Use browser DevTools:**
   - Inspect element to see computed styles
   - Check Network tab for image loading
   - Check Console for errors/warnings

4. **Add console.logs for debugging:**
   ```javascript
   console.log('Zones:', zones);
   console.log('Filtered:', filtered);
   console.log('isHovering:', isHovering);
   ```

---

**Ready? Start with Step 1: Refactor ZoneListPage.js**

