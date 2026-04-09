# Phase 4: Visual Design & Component Reference Guide

**Document Date:** April 9, 2026  
**Purpose:** Visual specifications and component examples

---

## 🎨 Neumorphic Design System Reference

### Color Palette

```
Primary Background:  #E0E5EC (Cool Grey)
Foreground Text:     #3D4852 (Dark Blue-Grey)
Muted/Secondary:     #6B7280 (Soft Grey)
Accent Primary:      #6C63FF (Soft Violet)
Accent Light:        #8B84FF (Lighter Violet)
Accent Secondary:    #38B2AC (Teal - for success)

Light Shadow:        rgba(255, 255, 255, 0.5-0.6)
Dark Shadow:         rgb(163, 177, 198, 0.6-0.7)
```

### Typography Scale

```
h1 (Page Title):     3rem (clamp: 1.875rem-3rem)  | Plus Jakarta Sans Bold
h2 (Card Title):     2.25rem                      | Plus Jakarta Sans Bold  
h3:                  1.875rem                     | Plus Jakarta Sans Bold
h4 (Heading):        1.25rem                      | DM Sans Bold
h5:                  1rem                         | DM Sans Semi-bold
h6 (Label):          0.875rem                     | DM Sans Semi-bold

Body Text:           1rem                         | DM Sans Regular
Small Text:          0.875rem                     | DM Sans Regular
```

### Shadow System

```
Extruded (Raised):
  9px 9px 16px rgb(163,177,198,0.6),
  -9px -9px 16px rgba(255,255,255,0.5)

Extruded Hover (Lifted):
  12px 12px 20px rgb(163,177,198,0.7),
  -12px -12px 20px rgba(255,255,255,0.6)

Inset (Pressed/Wells):
  inset 6px 6px 10px rgb(163,177,198,0.6),
  inset -6px -6px 10px rgba(255,255,255,0.5)

Inset Deep (Inputs/Active):
  inset 10px 10px 20px rgb(163,177,198,0.7),
  inset -10px -10px 20px rgba(255,255,255,0.6)
```

### Border Radius

```
Container/Card:  32px   (var(--radius-container))
Base/Button:     16px   (var(--radius-base))
Inner Elements:  12px   (var(--radius-inner))
Pill/Badge:      9999px (border-radius: 50% or 9999px)
```

### Spacing & Motion

```
Transition Duration: 300ms (var(--duration-default))
Easing Function:     ease-out (var(--easing-default))

Hover Transform:     translateY(-1px) to translateY(-4px)
Active Transform:    translateY(0.5px) (pressed effect)
```

---

## 📐 Zone Card Component Anatomy

### Full Card Layout (Desktop View)

```
┌─────────────────────────────────────────┐
│  [IMAGE CONTAINER - 16:9 ASPECT RATIO]  │  ← 200px height
│  ┌───────────────────────────────────┐  │
│  │ [Zone Photo or Gradient Placeholder]  │
│  │ [On Hover: Opacity 0.9]            │
│  └───────────────────────────────────┘  │
├─────────────────────────────────────────┤
│                                         │
│  Zone Name (h4 - bold)           ← Title
│  📍 Location Details             ← Subtitle
│                                  │
│  ┌──────────┬──────────┬─────────┤
│  │  Area    │ Available│  Price  │ ← Specs Grid
│  │ 5,000 m² │ 2,500 m² │ 500/m²  │
│  └──────────┴──────────┴─────────┤
│                                  │
│  [✓ Available] Badge       ← Status Badge
│                                  │
├─────────────────────────────────┤
│  [View Details] [Edit] (admin)  │ ← Actions Footer
└─────────────────────────────────┘

Card Dimensions:
  Width:  280px (min) - auto fill
  Height: ~420px (content-driven)
  Padding: 1.5rem (clamp: 1-1.75rem)
  Gap between sections: 1rem
```

### Mobile View (Single Column)

```
Same structure, full width:
┌───────────────────────────────────────────────────────┐
│       [IMAGE - 16:9 ASPECT RATIO]                     │
│       ┌─────────────────────────────────────────┐     │
│       │   [Zone Photo or Gradient]              │     │
│       └─────────────────────────────────────────┘     │
├───────────────────────────────────────────────────────┤
│                                                       │
│  Zone Name (h4)                                      │
│  📍 Location                                         │
│                                                       │
│  ┌──────────────┬──────────────┬──────────────┐     │
│  │   Area       │  Available   │   Price      │     │
│  │  5,000 m²    │  2,500 m²    │ 500/m²       │     │
│  └──────────────┴──────────────┴──────────────┘     │
│                                                       │
│  [✓ Available]                                       │
│                                                       │
├───────────────────────────────────────────────────────┤
│  [View Details]           [Edit]                      │
└───────────────────────────────────────────────────────┘
```

### Component States

**Resting State (Default):**
```
Shadow:   --shadow-extruded (raised)
BGColor:  --color-background (#E0E5EC)
Transform: translateY(0)
Opacity:   1
```

**Hover State:**
```
Shadow:   --shadow-extruded-hover (more lifted)
BGColor:  --color-background (same)
Transform: translateY(-4px) (lift effect)
Opacity:   1
Image:     opacity: 0.9
```

**Active/Click State:**
```
Shadow:   --shadow-inset (pressed)
BGColor:  --color-background (same)
Transform: translateY(0.5px)
Opacity:   1
```

---

## 🔍 Search Bar Component Anatomy

### Layout Variants

**Desktop (Horizontal Flex):**
```
┌─────────────────────────────────────────────────────────────┐
│  [🔍 Search Input (flex: 1)]  [Sort ▼]  [☐ Available Only]  │
└─────────────────────────────────────────────────────────────┘
Gaps: clamp(1rem, 2vw, 1.5rem)
```

**Tablet (Wrapping):**
```
┌──────────────────────────────────────────┐
│  [🔍 Search Input (flex: 1)]             │
│  [Sort ▼]  [☐ Available Only]            │
└──────────────────────────────────────────┘
```

**Mobile (Stacked):**
```
┌──────────────────────────────────────────┐
│  [🔍 Search Input (full width)]          │
├──────────────────────────────────────────┤
│  [Sort ▼]     [☐ Available Only]         │
└──────────────────────────────────────────┘
```

### Search Input States

**Default (Inset):**
```
┌──────────────────────────────────────────┐
│ 🔍 Search by name or location...         │
└──────────────────────────────────────────┘
Shadow:  inset 6px 6px 10px rgba(0,0,0,0.1),
         inset -6px -6px 10px rgba(255,255,255,0.5)
```

**Focus (Deep Inset + Accent Border):**
```
┌──────────────────────────────────────────┐
│ 🔍 Search text here...                   │
└──────────────────────────────────────────┘
Shadow:  inset 10px 10px 20px rgba(0,0,0,0.15),
         inset -10px -10px 20px rgba(255,255,255,0.6),
         0 0 0 2px background,
         0 0 0 4px accent (#6C63FF)
```

**Placeholder Text:**
```
Color:    --color-placeholder (#A0AEC0)
Font:     DM Sans, 1rem
Opacity:  0.6
```

### Sort Dropdown States

**Default:**
```
┌──────────────────────────┐
│ ↔️  Sort by Name       ▼ │
└──────────────────────────┘
Shadow: inset (same as input)
```

**Expanded:**
```
┌──────────────────────────┐
│ ↔️  Sort by Name       ▼ │
├──────────────────────────┤
│ ↔️  Sort by Name        │
│ 💰 Sort by Price       │
│ 📏 Sort by Area        │
└──────────────────────────┘
```

### Filter Checkbox

**Unchecked:**
```
☐ Available Only
Color: --color-muted
```

**Checked:**
```
☑ Available Only
Color: --color-accent
Accent: var(--color-accent)
```

---

## 🎛️ Button Components Reference

### Primary Button (View Details)

```
┌────────────────────┐
│   View Details     │  ← Text color: white
└────────────────────┘  

Default:
  BGColor:  --color-accent (#6C63FF)
  Shadow:   --shadow-extruded
  Height:   44px (min)
  Padding:  12px 24px

Hover:
  BGColor:  --color-accent-light (#8B84FF)
  Shadow:   --shadow-extruded-hover
  Transform: translateY(-1px)

Active:
  BGColor:  --color-accent (darker visual with inset shadow)
  Shadow:   inset 4px 4px 8px rgba(0,0,0,0.2),
            inset -2px -2px 4px rgba(255,255,255,0.3)
  Transform: translateY(0.5px)
```

### Secondary Button (Edit)

```
┌────────────────────┐
│      Edit          │  ← Text color: foreground
└────────────────────┘

Default:
  BGColor:  --color-background (#E0E5EC)
  Shadow:   --shadow-extruded
  Height:   44px (min)
  Padding:  12px 24px

Hover:
  BGColor:  #D5DDE5 (slightly darker)
  Shadow:   --shadow-extruded-hover
  Transform: translateY(-1px)

Active:
  BGColor:  --color-background
  Shadow:   --shadow-inset-small
  Transform: translateY(0.5px)
```

### Status Badges

**Available Badge:**
```
┌─────────────────┐
│  ✓ Available    │
└─────────────────┘
BGColor:  rgba(56, 178, 172, 0.2) (teal with transparency)
TextColor: var(--color-accent-secondary) (#38B2AC)
Padding:  4px 12px
BorderRadius: 9999px
FontSize: 0.875rem
FontWeight: 700
```

**Unavailable Badge:**
```
┌─────────────────────┐
│  ✗ Not Available    │
└─────────────────────┘
BGColor:  rgba(239, 68, 68, 0.2) (red with transparency)
TextColor: #DC2626 (darker red)
Padding:  4px 12px
BorderRadius: 9999px
FontSize: 0.875rem
FontWeight: 700
```

---

## 📊 Grid Responsiveness Reference

### Grid Breakpoints

```
Mobile (< 640px):
  grid-template-columns: 1fr
  gap: clamp(1.5rem, 3vw, 1.5rem)
  Result: 1 column, full width cards

Tablet (640px - 1024px):
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))
  gap: clamp(1.5rem, 3vw, 1.75rem)
  Result: 2 columns (if screen wide enough)

Desktop (1024px - 1440px):
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))
  gap: clamp(1.5rem, 3vw, 2rem)
  Result: 3 columns

Full HD (> 1440px):
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
  gap: clamp(1.5rem, 3vw, 2rem)
  Result: 3-4 columns with wider gaps
```

### Responsive Typography

```
Page Title (h1):
  Mobile:   clamp(1.875rem, 5vw, 2rem)
  Desktop:  clamp(1.875rem, 5vw, 3rem)

Card Title (h4):
  Mobile:   1.25rem (fixed)
  Desktop:  1.25rem (fixed)

Card Padding:
  Mobile:   clamp(1rem, 2vw, 1rem)
  Desktop:  clamp(1.5rem, 3vw, 1.75rem)
```

---

## 🎬 Animation & Transition Guide

### Hover Animation

```javascript
// Card lift on hover
transition: all 300ms ease-out;
transform: translateY(-4px);
box-shadow: var(--shadow-extruded-hover);

// Example timeline:
0ms:     translateY(0px), shadow: normal
150ms:   translateY(-2px), shadow: halfway
300ms:   translateY(-4px), shadow: hover ✓
```

### Button Press Animation

```javascript
// Click/active state
transition: all 300ms ease-out;
transform: translateY(0.5px); // Slight press-down
box-shadow: inset 4px 4px 8px rgba(0,0,0,0.2);

// Example timeline:
0ms:     transform: none (resting)
[click]
100ms:   transform: translateY(0.5px) ✓ (pressed)
[release]
300ms:   back to hover state
```

### Image Opacity Change

```javascript
// Smooth image fade on hover
transition: opacity 300ms ease-out;

// Default
opacity: 1;

// On parent card hover
opacity: 0.9;
```

### Loading State

```javascript
// Skeleton/placeholder fade in
transition: opacity 300ms ease-out;

// Initial
opacity: 0.5;

// When loaded
opacity: 1;
```

---

## 🎨 Color Usage Matrix

| Component | Property | Color | Use Case |
|-----------|----------|-------|----------|
| Card | Background | --color-background | Default surface |
| Card | Shadow | --shadow-extruded | Raised state |
| Card (hover) | Shadow | --shadow-extruded-hover | Lifted effect |
| Text | Color | --color-foreground | Primary text |
| Text | Color | --color-muted | Secondary text |
| Button (Primary) | Background | --color-accent | Action button |
| Button (Primary) | Background | --color-accent-light | Hover state |
| Button (Secondary) | Background | --color-background | Secondary action |
| Badge (Available) | Background | rgba(56, 178, 172, 0.2) | Success indicator |
| Badge (Available) | Text | --color-accent-secondary | Success text |
| Badge (Unavailable) | Background | rgba(239, 68, 68, 0.2) | Error indicator |
| Badge (Unavailable) | Text | #DC2626 | Error text |
| Input | Background | --color-background | Input surface |
| Input | Shadow | --shadow-inset | Default state |
| Input (focus) | Shadow | --shadow-inset-deep | Focus state |

---

## 🖥️ Example Rendered Cards

### Card Example 1: Available Zone

```
┌─────────────────────────────────┐
│  [Industrial Zone Photo]        │  ← 16:9 aspect
│  Gradient: Blue-Purple          │
└─────────────────────────────────┘
│                                 │
│  Hai Phong Industrial Zone       │ ← h4, bold
│  📍 Hai Phong, Vietnam           │ ← muted
│                                 │
│ ┌─────────┬─────────┬─────────┐ │
│ │  Area   │Available│  Price  │ │
│ │10000 m² │ 5000 m² │150K/m² │ │
│ └─────────┴─────────┴─────────┘ │
│                                 │
│  ✓ Available                    │ ← teal badge
│                                 │
├─────────────────────────────────┤
│  [View Details]     [Edit]      │
└─────────────────────────────────┘

Shadow: 9px 9px 16px rgb(163,177,198,0.6),
        -9px -9px 16px rgba(255,255,255,0.5)
```

### Card Example 2: Unavailable Zone

```
┌─────────────────────────────────┐
│  [Gradient: Pink-Red]           │
│  No Photo Available             │
└─────────────────────────────────┘
│                                 │
│  Da Nang Industrial Zone         │ ← h4, bold
│  📍 Da Nang, Vietnam             │ ← muted
│                                 │
│ ┌─────────┬─────────┬─────────┐ │
│ │  Area   │Available│  Price  │ │
│ │ 8000 m² │  0 m²   │120K/m² │ │
│ └─────────┴─────────┴─────────┘ │
│                                 │
│  ✗ Not Available                │ ← red badge
│                                 │
├─────────────────────────────────┤
│  [View Details]     [Edit]      │
└─────────────────────────────────┘

Shadow: Same extruded shadow
```

### Card Example 3: Hover State

```
┌─────────────────────────────────┐
│  [Photo opacity: 0.9]           │  ← Slightly faded
│  Lifted 4px up                  │
└─────────────────────────────────┘
│                                 │
│  Ho Chi Minh Industrial Zone     │
│  📍 Ho Chi Minh City, Vietnam    │
│                                 │
│ ┌─────────┬─────────┬─────────┐ │
│ │  Area   │Available│  Price  │ │
│ │15000 m² │ 7500 m² │200K/m² │ │
│ └─────────┴─────────┴─────────┘ │
│                                 │
│  ✓ Available                    │
│                                 │
├─────────────────────────────────┤
│  [View Details]     [Edit]      │
└─────────────────────────────────┘

Transform: translateY(-4px)
Shadow: 12px 12px 20px rgb(163,177,198,0.7),
        -12px -12px 20px rgba(255,255,255,0.6)
```

---

## 📱 Responsive Behavior Examples

### Mobile View (< 640px)

```
[ Zone 1 - Full Width ]
[ Zone 2 - Full Width ]
[ Zone 3 - Full Width ]

All cards: width 100%, stack vertically
Gap between: clamp(1.5rem, 3vw, 1.5rem) ≈ 1.5rem
```

### Tablet View (640px - 1024px)

```
[ Zone 1 ]  [ Zone 2 ]
[ Zone 3 ]  [ Zone 4 ]
[ Zone 5 ]

2 columns, gap clamp(1.5rem, 3vw, 1.75rem) ≈ 1.65rem
```

### Desktop View (> 1024px)

```
[ Zone 1 ]  [ Zone 2 ]  [ Zone 3 ]
[ Zone 4 ]  [ Zone 5 ]  [ Zone 6 ]
[ Zone 7 ]

3 columns, gap clamp(1.5rem, 3vw, 2rem) ≈ 1.8-2rem
```

---

## 🔧 Image Placeholder Examples

### Gradient Option 1 (Blue-Purple)
```
linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

### Gradient Option 2 (Pink-Red)
```
linear-gradient(135deg, #f093fb 0%, #f5576c 100%)
```

### Gradient Option 3 (Cyan-Blue)
```
linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)
```

### Gradient Option 4 (Green-Cyan)
```
linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)
```

### Gradient Option 5 (Pink-Yellow)
```
linear-gradient(135deg, #fa709a 0%, #fee140 100%)
```

### Gradient Option 6 (Cyan-Purple)
```
linear-gradient(135deg, #30cfd0 0%, #330867 100%)
```

Each zone gets a different gradient based on `zoneId % 6`.

---

## ✨ Visual Accessibility Checklist

- ✅ Text contrast: 7.5:1 (foreground on background)
- ✅ Button height: 44px (touch-friendly)
- ✅ Focus outline: 2px solid accent color
- ✅ Status indicators: Color + icon (not color alone)
- ✅ Font sizes: No smaller than 0.875rem for body
- ✅ Spacing: Minimum 0.75rem between interactive elements
- ✅ Animations: 300ms duration (not too fast)
- ✅ Loading states: Clear visual feedback

