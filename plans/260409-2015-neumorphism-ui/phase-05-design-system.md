# Phase 5 Design System Specifications & CSS Reference

**Document Version:** 1.0  
**Last Updated:** 2026-04-09  
**Purpose:** Complete design system specifications for Neumorphic table components

---

## 🎨 Design System Overview

All components use the Neumorphism design system defined in `globals.css`. This document provides visual specifications, color mappings, and shadow/radius reference tables.

---

## 🎯 Color System

### Base Colors (from globals.css)

| Variable | Value | Use Case |
|----------|-------|----------|
| `--color-background` | #E0E5EC | Main surface, tables, cards |
| `--color-foreground` | #3D4852 | Primary text, headings |
| `--color-muted` | #6B7280 | Secondary text, disabled states |
| `--color-accent` | #6C63FF | Interactive elements, active states |
| `--color-accent-light` | #8B84FF | Hover states, highlights |
| `--color-accent-secondary` | #38B2AC | Success states, positive indicators |

### Status-Specific Colors

#### Rental Request Statuses
```javascript
const rentalStatusColors = {
  PENDING: {
    background: 'var(--color-muted)',    // #6B7280
    text: 'white',
    border: 'rgba(107, 114, 128, 0.3)'
  },
  APPROVED: {
    background: 'var(--color-accent-secondary)',  // #38B2AC
    text: 'white',
    border: 'rgba(56, 178, 172, 0.3)'
  },
  REJECTED: {
    background: '#E74C3C',  // Custom red
    text: 'white',
    border: 'rgba(231, 76, 60, 0.3)'
  },
  CANCELLED: {
    background: '#95A5A6',  // Custom neutral
    text: 'white',
    border: 'rgba(149, 165, 166, 0.3)'
  }
};
```

#### Contract Statuses
```javascript
const contractStatusColors = {
  ACTIVE: {
    background: 'var(--color-accent-secondary)',  // #38B2AC
    text: 'white',
    border: 'rgba(56, 178, 172, 0.3)'
  },
  EXPIRED: {
    background: 'var(--color-muted)',    // #6B7280
    text: 'white',
    border: 'rgba(107, 114, 128, 0.3)'
  },
  TERMINATED: {
    background: '#E74C3C',  // Custom red
    text: 'white',
    border: 'rgba(231, 76, 60, 0.3)'
  }
};
```

#### Custom Status Colors
```css
/* Red (Error/Danger) */
#E74C3C - Bright red for rejections/terminations
rgba(231, 76, 60, 0.3) - Border variant (30% opacity)
rgba(231, 76, 60, 0.1) - Light background variant

/* Grey (Neutral/Muted) */
#95A5A6 - Neutral grey for cancelled/inactive
rgba(149, 165, 166, 0.3) - Border variant
```

---

## 🔲 Shadow System

### Shadow Variables (from globals.css)

#### Extruded (Raised/Elevated)
```css
/* Default extruded: for raised buttons, active tabs, table headers */
--shadow-extruded: 9px 9px 16px rgb(163, 177, 198, 0.6),
                   -9px -9px 16px rgba(255, 255, 255, 0.5);

/* Extruded hover: for hover states on elevated elements */
--shadow-extruded-hover: 12px 12px 20px rgb(163, 177, 198, 0.7),
                         -12px -12px 20px rgba(255, 255, 255, 0.6);

/* Extruded small: for smaller elements like icon buttons, action buttons */
--shadow-extruded-small: 5px 5px 10px rgb(163, 177, 198, 0.6),
                         -5px -5px 10px rgba(255, 255, 255, 0.5);
```

**Visual Effect:** Creates a 3D "lifted" appearance with light from top-left, shadow from bottom-right.

#### Inset (Pressed/Carved)
```css
/* Default inset: for input fields, pressed buttons, subtle wells */
--shadow-inset: inset 6px 6px 10px rgb(163, 177, 198, 0.6),
                inset -6px -6px 10px rgba(255, 255, 255, 0.5);

/* Inset deep: for deep input fields, active wells, focused elements */
--shadow-inset-deep: inset 10px 10px 20px rgb(163, 177, 198, 0.7),
                     inset -10px -10px 20px rgba(255, 255, 255, 0.6);

/* Inset small: for subtle tracks, status badges, small wells */
--shadow-inset-small: inset 3px 3px 6px rgb(163, 177, 198, 0.6),
                      inset -3px -3px 6px rgba(255, 255, 255, 0.5);
```

**Visual Effect:** Creates a 3D "pressed" or "carved" appearance, like the surface is pushed inward.

### Shadow Usage in Components

| Component | Resting State | Hover State | Active/Focus State |
|-----------|--------------|------------|------------------|
| Table Header | `--shadow-extruded-small` | (no change) | (no change) |
| Table Row | none | `--shadow-extruded-small` | (click handler) |
| Action Button | `--shadow-extruded-small` | `--shadow-extruded` | `--shadow-inset-small` |
| Status Badge | `--shadow-inset-small` | (no change) | (no change) |
| Tab Button (inactive) | `--shadow-extruded-small` | `--shadow-extruded` | (click) |
| Tab Button (active) | `--shadow-inset` | (no change) | (no change) |
| Pagination Button (inactive) | `--shadow-extruded-small` | `--shadow-extruded` | (click) |
| Pagination Button (active) | `--shadow-inset-small` | (no change) | (no change) |
| Search Input | `--shadow-inset` | `--shadow-inset-deep` + accent ring | `--shadow-inset-deep` |

---

## 🔷 Border Radius System

### Radius Variables

| Variable | Value | Use Case |
|----------|-------|----------|
| `--radius-container` | 32px | Large cards, modals, page containers |
| `--radius-base` | 16px | Buttons, inputs, tables, major components |
| `--radius-inner` | 12px | Table headers, smaller components, dividers |

### Application in Tables

```javascript
// Table wrapper
borderRadius: 'var(--radius-base)'  // 16px for outer container

// Table header cells (first/last)
borderRadius: 'var(--radius-inner)'  // 12px for individual cells

// Status badges
borderRadius: '6px' // Custom small radius for compact appearance

// Action buttons
borderRadius: 'var(--radius-inner)'  // 12px

// Pagination buttons
borderRadius: 'var(--radius-inner)'  // 12px
```

---

## 📐 Spacing & Sizing

### Padding System (Multiples of 4px)

| Spacing | Value | Use Case |
|---------|-------|----------|
| Extra Small | 4px | Icon padding, tight spacing |
| Small | 8px | Button internal padding, compact cells |
| Medium | 12px | Standard cell padding, inline spacing |
| Large | 16px | Container padding, section spacing |
| Extra Large | 20px | Major sections, large components |
| 2XL | 24px | Page/content padding, big gaps |
| 3XL | 32px | Large section gaps |

### Table-Specific Sizing

```javascript
// Table cells
padding: '14px 12px'        // Balanced data cells
padding: '16px 12px'        // Header cells (slightly more)

// Status badges
padding: '6px 12px'         // Small badges
padding: '8px 16px'         // Medium badges

// Action buttons
padding: '6px 12px'         // Table action buttons
minHeight: '32px'           // Touch-friendly (mobile)
minWidth: '80px'            // Minimum click target

// Pagination buttons
padding: '8px 12px'
minHeight: '36px'           // Better touch target
minWidth: '36px'            // Square buttons for page numbers

// Search input
padding: '12px 16px'        // Spacious input
minHeight: '40px'           // Touch-friendly
```

---

## 📝 Typography System

### Font Families
```css
/* Display/Heading Font */
font-family: 'Plus Jakarta Sans', sans-serif;
font-weight: 700 or 800;    // Bold or extra-bold

/* Body/UI Font */
font-family: 'DM Sans', sans-serif;
font-weight: 400, 500, 600, or 700;
```

### Type Scales (from globals.css)

| Element | Font Size | Font Weight | Font Family | Line Height |
|---------|-----------|------------|------------|-------------|
| h1 | 3rem (48px) | 700 | Plus Jakarta Sans | 1.2 |
| h2 | 2.25rem (36px) | 700 | Plus Jakarta Sans | 1.3 |
| h3 | 1.875rem (30px) | 700 | Plus Jakarta Sans | 1.3 |
| h4 | 1.25rem (20px) | 700 | DM Sans | 1.4 |
| h5 | 1rem (16px) | 600 | DM Sans | 1.5 |
| Body | 1rem (16px) | 400 | DM Sans | 1.5 |
| Small | 0.875rem (14px) | 400 | DM Sans | 1.5 |
| Tiny | 0.75rem (12px) | 400 | DM Sans | 1.4 |

### Table Typography

```javascript
// Page title
fontSize: '2rem'           // 32px
fontWeight: '700'
fontFamily: 'Plus Jakarta Sans'
letterSpacing: '-0.02em'   // Tighter tracking for display fonts

// Table headers
fontSize: '0.9rem'         // 14.4px
fontWeight: '600'
fontFamily: 'DM Sans'

// Table cells
fontSize: '0.95rem'        // 15.2px (desktop)
fontSize: '0.85rem'        // 13.6px (mobile)
fontWeight: '400'
fontFamily: 'DM Sans'

// Status badges
fontSize: '0.75rem'        // 12px (small)
fontSize: '0.875rem'       // 14px (medium)
fontWeight: '600'
fontFamily: 'DM Sans'
textTransform: 'uppercase'
letterSpacing: '0.5px'

// Pagination info text
fontSize: '0.875rem'       // 14px
fontWeight: '400'
color: 'var(--color-muted)'
```

---

## 🎬 Animation & Transition System

### Timing Functions
```css
--duration-default: 300ms;  /* All UI transitions */
--easing-default: ease-out; /* Natural deceleration */
```

### Transition Usage

| Interaction | Property | Duration | Easing |
|------------|----------|----------|--------|
| Button hover | box-shadow, transform | 300ms | ease-out |
| Row hover | backgroundColor, transform, boxShadow | 300ms | ease-out |
| Input focus | box-shadow | 300ms | ease-out |
| Tab switch | (no transition) | instant | (N/A) |
| Page change | (scroll + fade) | 300ms | ease-out |

### Specific Transition Patterns

```javascript
// Button hover (extruded to hover)
transition: 'all var(--duration-default) var(--easing-default)',
// Effects:
// - box-shadow: var(--shadow-extruded) → var(--shadow-extruded-hover)
// - transform: translateY(0) → translateY(-1px)

// Row hover
transition: 'all var(--duration-default) var(--easing-default)',
// Effects:
// - backgroundColor: transparent → rgba(255, 255, 255, 0.2)
// - transform: translateY(0) → translateY(-1px)
// - boxShadow: none → var(--shadow-extruded-small)

// Input focus
transition: 'all var(--duration-default) var(--easing-default)',
// Effects:
// - box-shadow: var(--shadow-inset) → var(--shadow-inset-deep) + focus ring

// Smooth scroll on page change
behavior: 'smooth'
```

---

## 📱 Responsive Breakpoints

### Media Query Breakpoints (from globals.css + custom)

```css
/* Mobile First Approach */

/* Mobile (Default) */
/* < 640px */
body {
  font-size: 0.9375rem;  /* 15px */
}
h1 { font-size: 1.875rem; }  /* 30px */
h2 { font-size: 1.5rem; }    /* 24px */
h3 { font-size: 1.25rem; }   /* 20px */

/* Tablet */
@media (min-width: 640px) and (max-width: 1023px) {
  /* Show more columns, larger text */
  table { minWidth: auto; }
  thead th { fontSize: '0.9rem'; }
  tbody td { fontSize: '0.95rem'; }
}

/* Desktop */
@media (min-width: 1024px) {
  /* All columns visible, full layout */
  table { minWidth: auto; }
}
```

### Column Visibility Strategy

```javascript
// For each column, define:
{
  id: 'column_id',
  mobileVisible: true,      // Show on <640px
  tabletVisible: false,     // Hide on 640-1023px
  visible: true             // Show on ≥1024px (default)
}
```

**Common Patterns:**
- **Always visible:** ID, Zone, Status, Actions
- **Hide on mobile (<640px):** Tenant, Duration, Dates
- **Hide on tablet (<1024px):** Tenant, Dates
- **Always visible:** Area, Cost/Rent

---

## 🎯 Visual Hierarchy & Emphasis

### Emphasis Levels

| Level | Background | Shadow | Font Weight | Use Case |
|-------|-----------|--------|-------------|----------|
| Primary | Accent color (#6C63FF) | Extruded | 600 | Active tab, primary CTA |
| Secondary | Background #E0E5EC | Extruded-small | 500 | Regular button, inactive tab |
| Tertiary | Background #E0E5EC | Inset-small | 400 | Status badge, pagination number |
| Minimal | Transparent | None | 400 | Row content, secondary info |

### Focus States (Accessibility)

All interactive elements must have visible focus:

```javascript
// Standard focus ring
outline: '2px solid var(--color-accent)',
outlineOffset: '2px',
borderRadius: '4px'

// Or with box-shadow (for buttons)
boxShadow: 'var(--shadow-extruded), 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-accent)'
```

---

## 🔄 State Patterns

### Button States

```javascript
// Resting
backgroundColor: 'var(--color-background)'
boxShadow: 'var(--shadow-extruded-small)'
transform: 'translateY(0)'

// Hover
backgroundColor: 'var(--color-background)'
boxShadow: 'var(--shadow-extruded)'
transform: 'translateY(-1px)'

// Active/Click
backgroundColor: 'var(--color-background)'
boxShadow: 'var(--shadow-inset-small)'
transform: 'translateY(0.5px)'

// Disabled
opacity: 0.5
cursor: 'not-allowed'
transform: 'none'
boxShadow: 'var(--shadow-extruded-small)'
```

### Active Tab State

```javascript
// Inactive tab
backgroundColor: 'var(--color-background)'
boxShadow: 'var(--shadow-extruded-small)'
color: 'var(--color-foreground)'

// Active tab
backgroundColor: 'var(--color-accent)'
boxShadow: 'var(--shadow-inset)'
color: 'white'
```

### Table Row States

```javascript
// Resting
backgroundColor: 'transparent'
transform: 'translateY(0)'
boxShadow: 'none'
cursor: 'pointer'

// Hover
backgroundColor: 'rgba(255, 255, 255, 0.2)'
transform: 'translateY(-1px)'
boxShadow: 'var(--shadow-extruded-small)'
cursor: 'pointer'

// Bordered bottom
borderBottom: '1px solid rgba(163, 177, 198, 0.2)'
```

---

## ✅ Implementation Checklist

When implementing components, verify:

### Colors
- [ ] All colors use CSS variables
- [ ] No hardcoded hex values except custom status colors (#E74C3C, #95A5A6)
- [ ] Status badges have correct background/text color pairs
- [ ] Contrast ratios meet WCAG AA (4.5:1 for normal, 3:1 for large)

### Shadows
- [ ] Table headers use `--shadow-extruded-small`
- [ ] Buttons use appropriate shadow per state
- [ ] Row hover uses `--shadow-extruded-small`
- [ ] Status badges use `--shadow-inset-small`
- [ ] All shadows use correct CSS variable

### Spacing
- [ ] Table padding: 14-16px vertical, 12px horizontal
- [ ] Badge padding: 6-8px vertical, 12-16px horizontal
- [ ] Button padding: min 8px, min height 32-44px
- [ ] Gaps between sections: 16-24px

### Typography
- [ ] Page titles: Plus Jakarta Sans, 700, 2rem
- [ ] Table headers: DM Sans, 600, 0.9rem
- [ ] Table cells: DM Sans, 400, 0.95rem (desktop)
- [ ] Badges: DM Sans, 600, uppercase, 0.75rem

### Responsive
- [ ] Mobile (<640px): Essential columns only, horizontal scroll
- [ ] Tablet (640-1023px): More columns visible
- [ ] Desktop (≥1024px): All columns visible
- [ ] Touch targets: min 44px height
- [ ] Font sizes scale down on mobile

### Accessibility
- [ ] All buttons have focus rings
- [ ] All inputs have clear focus states
- [ ] Colors not sole means of indicating state
- [ ] Alt text for any images
- [ ] Semantic HTML (`<table>`, `<button>`, etc.)
- [ ] ARIA labels for actions

---

## 🖼️ Quick Reference: Component Styles

### NeuTable Header Cell
```javascript
{
  padding: '16px 12px',
  fontWeight: '600',
  fontSize: '0.9rem',
  boxShadow: 'var(--shadow-extruded-small)',
  color: 'var(--color-foreground)',
  backgroundColor: 'var(--color-background)'
}
```

### NeuTable Data Cell
```javascript
{
  padding: '14px 12px',
  fontSize: '0.95rem',
  color: 'var(--color-foreground)',
  backgroundColor: 'transparent',
  borderBottom: '1px solid rgba(163, 177, 198, 0.2)'
}
```

### StatusBadge
```javascript
{
  padding: '6px 12px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  borderRadius: '6px',
  boxShadow: 'var(--shadow-inset-small)',
  border: '1px solid rgba(..., 0.3)'
}
```

### Action Button
```javascript
{
  padding: '6px 12px',
  minHeight: '32px',
  fontSize: '0.85rem',
  fontWeight: '600',
  borderRadius: 'var(--radius-inner)',
  boxShadow: 'var(--shadow-extruded-small)',
  color: 'var(--color-accent)',
  transition: 'all var(--duration-default) var(--easing-default)'
}
```

### Pagination Button
```javascript
{
  padding: '8px 12px',
  minHeight: '36px',
  minWidth: '36px',
  fontSize: '0.875rem',
  fontWeight: '500',
  borderRadius: 'var(--radius-inner)',
  boxShadow: 'var(--shadow-extruded-small)'
}
```

### Search Input
```javascript
{
  padding: '12px 16px',
  fontSize: '0.95rem',
  borderRadius: 'var(--radius-base)',
  boxShadow: 'var(--shadow-inset)',
  border: 'none'
}
```

---

## 📋 Color Palette Summary

```
Primary Surface:      #E0E5EC (--color-background)
Primary Text:         #3D4852 (--color-foreground)
Secondary Text:       #6B7280 (--color-muted)
Primary Accent:       #6C63FF (--color-accent)
Accent Light:         #8B84FF (--color-accent-light)
Success/Secondary:    #38B2AC (--color-accent-secondary)
Error/Danger:         #E74C3C (Custom red)
Neutral/Inactive:     #95A5A6 (Custom grey)

Light Shadow:         rgba(255, 255, 255, 0.5-0.6)
Dark Shadow:          rgb(163, 177, 198, 0.6-0.7)
```

---

## 🔗 References

- **Neumorphism Design Guide:** `/docs/design-guidelines.md`
- **Global CSS Variables:** `/frontend/src/globals.css`
- **Component Examples:** This implementation guide and phase-05-implementation-guide.md
- **WCAG Accessibility:** https://www.w3.org/WAI/WCAG21/quickref/
