# Phase 1: Neumorphism UI Foundation & Setup

**Project**: Industrial Park Leasing Management System (React CRA)
**Duration**: Days 1-3 (Foundation Week)
**Status**: Ready for Implementation
**Last Updated**: 2026-04-09

---

## Context Links

- **Design Specification**: `./Neumorphism_Design.md` (Complete design tokens, shadows, typography)
- **Current Frontend**: `./frontend/` (React CRA, currently MUI-based)
- **Main Package.json**: `./frontend/package.json`

---

## Overview

### Priority
**CRITICAL** — This phase establishes the entire design system foundation. All subsequent phases depend on successful completion.

### Current Status
- Current UI: Material-UI (MUI) v9
- Target: Tailwind CSS v3 + shadcn/ui
- Current Setup: Create React App (CRA) with routing, state management via AuthContext
- API Integration: Axios (UNTOUCHED)

### Brief Description
Phase 1 is a "rip-and-replace" foundation setup that:
1. **Removes** Material-UI completely (dependencies, CssBaseline, theme)
2. **Installs** Tailwind CSS v3 + shadcn/ui + required fonts
3. **Creates** global design token system (colors, shadows, typography via CSS variables)
4. **Extends** Tailwind config with custom utilities for neumorphic shadows
5. **Verifies** zero breaking changes (app boots, routing works, no console errors)

**JavaScript-only constraint**: NO TypeScript migration. All code remains `.js`.

---

## Key Insights

### Design System Philosophy (Critical Context)
The Neumorphism design is built on **shadow play, not color variety**:
- **Monochromatic cool grey** (`#E0E5EC` background, `#3D4852` text)
- **Dual opposing RGB shadows** with alpha transparency (not hex colors)
- **Same-surface illusion**: All elements feel molded from the same material
- **Deep inset states**: Input wells, icon containers use `insetDeep` shadows

### Why CSS Variables + Tailwind?
- **CSS Variables** in `globals.css`: Perfect for complex shadow definitions (RGBA with multiple values)
- **Tailwind Extensions**: Utility classes for quick component styling, responsive design
- **Hybrid Approach**: Best of both worlds—maintainable tokens + rapid development

### Dependencies to Remove
- `@mui/material` v9.0.0
- `@mui/icons-material` v9.0.0
- `@emotion/react`
- `@emotion/styled`

### New Dependencies
- `tailwindcss` v3
- `postcss` & `autoprefixer`
- `shadcn-ui` (via CLI, components installed on-demand)
- Google Fonts (Plus Jakarta Sans, DM Sans) via `@import` in CSS

### Font Loading Strategy
- **Google Fonts CDN**: Import in `globals.css` with `display=swap`
- **Plus Jakarta Sans**: 500, 600, 700, 800 weights (display headings)
- **DM Sans**: 400, 500, 700 weights (body text, UI elements)

---

## Requirements

### Functional Requirements
1. **Remove MUI**: Uninstall packages, remove `ThemeProvider`, `CssBaseline`, theme definition from App.js
2. **Install Tailwind**: Set up PostCSS config, tailwind.config.js
3. **Create Design Tokens**: CSS variables for all colors, shadows, radii, typography in `globals.css`
4. **Extend Tailwind Config**: Custom shadow utilities for neumorphic effects
5. **Verify Bootup**: App starts, routing works, no console errors, styles load
6. **No Breaking Changes**: AuthContext, Axios API calls, routing remain untouched

### Non-Functional Requirements
- **Performance**: Zero bundle size regression; Tailwind purges unused styles
- **Accessibility**: WCAG AA compliant contrast ratios (colors specified in design)
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge last 2 versions)
- **Responsive**: Mobile-first approach with Tailwind breakpoints
- **Maintainability**: CSS variables are self-documenting; easy future updates

---

## Architecture

### File Structure (Before → After)

```
frontend/
├── src/
│   ├── index.js               [UNCHANGED]
│   ├── index.css              [REPLACED: import globals.css]
│   ├── App.js                 [MODIFIED: remove ThemeProvider, CssBaseline]
│   ├── App.css                [KEEP for now, will refactor in Phase 2]
│   ├── globals.css            [NEW: design tokens, shadows, fonts]
│   ├── components/
│   ├── pages/
│   ├── contexts/              [UNCHANGED: AuthContext]
│   └── services/              [UNCHANGED: Axios API]
├── public/                    [UNCHANGED]
├── .postcssrc.js              [NEW: PostCSS + Tailwind]
├── tailwind.config.js         [NEW: Tailwind config with extensions]
└── package.json               [MODIFIED: remove MUI, add Tailwind]
```

### Design Token Organization (CSS Variables)

**globals.css Structure**:
```
1. @import Google Fonts (Plus Jakarta Sans, DM Sans)
2. CSS Custom Properties:
   - Colors (background, foreground, muted, accent, accent-light, accent-secondary)
   - Shadows (extruded, extruded-hover, extruded-small, inset, inset-deep, inset-small)
   - Radii (container, base, inner)
   - Transitions (default 300ms ease-out)
3. Base styles (*, body, html)
4. Typography scale (@layer utilities)
5. Custom animations (@keyframes float, scroll-behavior)
6. Accessibility features (focus rings, reduced motion)
```

### Tailwind Config Strategy

**Extend, don't override**:
- Use `theme.extend` to add custom shadows without losing Tailwind's defaults
- Add shadow utilities: `shadow-neu-extruded`, `shadow-neu-inset-deep`, etc.
- Configure color palette with CSS custom properties
- Set default sans font family to DM Sans

---

## Related Code Files

### Files to Modify
- `frontend/package.json` — Remove MUI, add Tailwind, shadcn-ui, PostCSS
- `frontend/src/index.js` — Keep as-is; imports index.css
- `frontend/src/index.css` — Replace with import to globals.css + reset
- `frontend/src/App.js` — Remove `ThemeProvider`, `CssBaseline`, MUI theme
- `frontend/src/App.css` — KEEP (temporary; refactor in Phase 2)

### Files to Create
- `frontend/src/globals.css` — Complete design system tokens
- `frontend/.postcssrc.js` — PostCSS configuration (Tailwind, autoprefixer)
- `frontend/tailwind.config.js` — Tailwind + custom utilities

### Files to Delete
- None in Phase 1 (preserve App.css for migration in Phase 2)

### Files to NOT Touch (Preserve Untouched)
- `frontend/src/contexts/AuthContext.js` — Auth state management
- `frontend/src/services/*` — Axios API integration
- `frontend/src/components/` — Will refactor in Phase 2
- `frontend/src/pages/` — Will refactor in Phase 2
- All backend files (`backend/`)

---

## Implementation Steps

### Step 1: Prerequisites Check (5 min)
Run before starting:

```bash
# From project root: D:\AnhTran\Project\BTL_python
cd frontend

# Check Node.js version (should be 16+)
node --version

# Check npm/yarn
npm --version

# Verify current packages
npm list @mui/material @emotion/react
```

**Expected Output**:
- Node.js v16.13.0 or higher
- npm 8.1.0 or higher
- MUI and Emotion packages listed

---

### Step 2: Backup Current Setup (2 min)

```bash
# From frontend/
# Create a backup branch (optional but recommended)
git checkout -b feature/neumorphism-ui-phase1

# Verify status is clean
git status
```

---

### Step 3: Remove Material-UI Dependencies (5 min)

```bash
# From frontend/
npm uninstall @mui/material @mui/icons-material @emotion/react @emotion/styled

# Verify removal
npm list | grep -i mui
# Should return "empty" or no results
```

**What this does**:
- Removes ~50+ transitive dependencies from MUI ecosystem
- Reduces node_modules significantly
- Prevents any MUI imports from working (will catch errors early)

---

### Step 4: Install Tailwind CSS + Dependencies (10 min)

```bash
# From frontend/
npm install --save-dev tailwindcss postcss autoprefixer

# Initialize Tailwind config (generates default config)
npx tailwindcss init -p
```

**Output**:
- `frontend/tailwind.config.js` (default template)
- `frontend/postcss.config.js` (default template)
- `frontend/src/globals.css` (empty, we'll populate)

---

### Step 5: Install shadcn-ui CLI & Components (8 min)

```bash
# From frontend/
npm install -D shadcn-ui

# Initialize shadcn-ui for React CRA
npx shadcn-ui@latest init -d

# Interactive prompts:
# - Style: Default
# - Base color: Slate
# - Dark mode: No (we use light mode with cool grey)
# - CSS variables: Yes (matches our approach)

# This creates: frontend/lib/utils.js
```

**Note**: We'll customize components in Phase 2. Phase 1 just prepares the CLI.

---

### Step 6: Install Google Fonts (2 min)

```bash
# From frontend/
# Fonts are loaded via @import in CSS (no npm package needed)
# We'll add URLs in globals.css

# No npm install needed—fonts load from CDN
```

---

### Step 7: Create .postcssrc.js (PostCSS Configuration) (3 min)

**File**: `frontend/.postcssrc.js`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**Why**: Tells PostCSS to process CSS through Tailwind and autoprefixer during build.

---

### Step 8: Create tailwind.config.js (Tailwind Configuration) (15 min)

**File**: `frontend/tailwind.config.js`

Replace the generated file with:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}', // Scan all JS/JSX files
  ],
  theme: {
    extend: {
      // Custom color palette using CSS variables
      colors: {
        // Neumorphism cool grey palette
        'neu-bg': 'var(--color-background)',        // #E0E5EC
        'neu-fg': 'var(--color-foreground)',        // #3D4852
        'neu-muted': 'var(--color-muted)',          // #6B7280
        'neu-accent': 'var(--color-accent)',        // #6C63FF
        'neu-accent-light': 'var(--color-accent-light)', // #8B84FF
        'neu-accent-secondary': 'var(--color-accent-secondary)', // #38B2AC
      },
      
      // Custom shadow utilities for neumorphic effects
      boxShadow: {
        // Extruded (raised, default state)
        'neu-extruded': 'var(--shadow-extruded)',
        'neu-extruded-hover': 'var(--shadow-extruded-hover)',
        'neu-extruded-small': 'var(--shadow-extruded-small)',
        
        // Inset (pressed, carved into surface)
        'neu-inset': 'var(--shadow-inset)',
        'neu-inset-deep': 'var(--shadow-inset-deep)',
        'neu-inset-small': 'var(--shadow-inset-small)',
      },
      
      // Border radius utilities
      borderRadius: {
        'neu-container': 'var(--radius-container)',   // 32px
        'neu-base': 'var(--radius-base)',             // 16px
        'neu-inner': 'var(--radius-inner)',           // 12px
      },
      
      // Typography customization
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'sans-serif'],
        'sans': ['DM Sans', 'sans-serif'],
      },
      
      fontSize: {
        // Extend Tailwind's default scale
        '7xl': ['5rem', { lineHeight: '1' }],        // 80px for hero
        '6xl': ['3.75rem', { lineHeight: '1' }],     // 60px
        '5xl': ['3rem', { lineHeight: '1.2' }],      // 48px
        '4xl': ['2.25rem', { lineHeight: '1.2' }],   // 36px
        '3xl': ['1.875rem', { lineHeight: '1.3' }],  // 30px
        '2xl': ['1.5rem', { lineHeight: '1.3' }],    // 24px
        'xl': ['1.25rem', { lineHeight: '1.4' }],    // 20px
        'lg': ['1.125rem', { lineHeight: '1.4' }],   // 18px
        'base': ['1rem', { lineHeight: '1.5' }],     // 16px
        'sm': ['0.875rem', { lineHeight: '1.5' }],   // 14px
      },
      
      // Animation utilities
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      
      // Transition utilities
      transitionDuration: {
        '300': '300ms',
        '500': '500ms',
      },
    },
  },
  
  plugins: [],
};
```

**Key Points**:
- `content` array: Tells Tailwind which files to scan for class names
- `extend` (not `theme`): Adds to Tailwind defaults, doesn't override
- Custom colors reference CSS variables (defined in globals.css)
- Custom shadows use CSS variables for easy updates
- Font family: DM Sans for body, Plus Jakarta Sans for display
- Animation: Custom `float` keyframe for decorative elements

---

### Step 9: Create globals.css (Design Token System) (20 min)

**File**: `frontend/src/globals.css`

This is the **heart of the design system**. Copy the complete file below:

```css
/* =============================================================================
   Neumorphism Design System - Global Styles & Design Tokens
   Based on Neumorphism_Design.md specification
   ============================================================================= */

/* Google Fonts - Display and Body Fonts */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

/* =============================================================================
   CSS Custom Properties (Design Tokens)
   ============================================================================= */

:root {
  /* --------- Colors --------- */
  
  /* Background: Cool grey - the base surface everything is molded from */
  --color-background: #E0E5EC;
  
  /* Foreground: Dark blue-grey for primary text - excellent contrast (7.5:1) */
  --color-foreground: #3D4852;
  
  /* Muted: Cool grey for secondary text - WCAG AA compliant (4.6:1) */
  --color-muted: #6B7280;
  
  /* Accent: Soft violet for interactive highlights */
  --color-accent: #6C63FF;
  
  /* Accent Light: Lighter violet for gradients and hover states */
  --color-accent-light: #8B84FF;
  
  /* Accent Secondary: Teal for success states, checkmarks, positive indicators */
  --color-accent-secondary: #38B2AC;
  
  /* Placeholder: Neutral grey for placeholder text */
  --color-placeholder: #A0AEC0;
  
  /* --------- Shadow Colors (RGBA for smoothness) --------- */
  
  /* Light shadow: Pure white with transparency (top-left light source) */
  --shadow-light: rgba(255, 255, 255, 0.5);
  --shadow-light-hover: rgba(255, 255, 255, 0.6);
  --shadow-light-deep: rgba(255, 255, 255, 0.6);
  
  /* Dark shadow: Cool blue-grey (bottom-right shadow) */
  --shadow-dark: rgb(163, 177, 198, 0.6);
  --shadow-dark-hover: rgb(163, 177, 198, 0.7);
  --shadow-dark-deep: rgb(163, 177, 198, 0.7);
  
  /* --------- Shadows (Neumorphic) --------- */
  
  /* Extruded (Raised) - Default resting state */
  --shadow-extruded: 9px 9px 16px rgb(163, 177, 198, 0.6),
                     -9px -9px 16px rgba(255, 255, 255, 0.5);
  
  /* Extruded Hover (Lifted) - Slight lift on hover */
  --shadow-extruded-hover: 12px 12px 20px rgb(163, 177, 198, 0.7),
                           -12px -12px 20px rgba(255, 255, 255, 0.6);
  
  /* Extruded Small - For smaller elements like icon buttons */
  --shadow-extruded-small: 5px 5px 10px rgb(163, 177, 198, 0.6),
                           -5px -5px 10px rgba(255, 255, 255, 0.5);
  
  /* Inset (Pressed) - Standard pressed states, shallow wells */
  --shadow-inset: inset 6px 6px 10px rgb(163, 177, 198, 0.6),
                  inset -6px -6px 10px rgba(255, 255, 255, 0.5);
  
  /* Inset Deep - For inputs, active wells, deep "carved" elements */
  --shadow-inset-deep: inset 10px 10px 20px rgb(163, 177, 198, 0.7),
                       inset -10px -10px 20px rgba(255, 255, 255, 0.6);
  
  /* Inset Small - For subtle tracks or pills */
  --shadow-inset-small: inset 3px 3px 6px rgb(163, 177, 198, 0.6),
                        inset -3px -3px 6px rgba(255, 255, 255, 0.5);
  
  /* --------- Border Radius --------- */
  
  /* Container / Card - Very soft, friendly corners */
  --radius-container: 32px;
  
  /* Base / Button - Standard rounding */
  --radius-base: 16px;
  
  /* Inner Elements - Smaller rounding */
  --radius-inner: 12px;
  
  /* --------- Transitions --------- */
  
  /* Default transition duration for UI elements */
  --duration-default: 300ms;
  
  /* Easing function - natural deceleration */
  --easing-default: ease-out;
}

/* Reduced motion: Respect user preference */
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-default: 0ms;
  }
}

/* =============================================================================
   Global Base Styles
   ============================================================================= */

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  /* Neumorphism background: cool grey surface */
  background-color: var(--color-background);
  color: var(--color-foreground);
  
  /* Typography */
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  
  /* Font rendering optimization */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  /* Prevent zoom on input focus (iOS) */
  font-size: 16px;
}

/* Code block typography */
code {
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

/* =============================================================================
   Typography Utilities
   ============================================================================= */

/* Display headings: Plus Jakarta Sans, extrabold */
.font-display {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  letter-spacing: -0.02em;
}

/* Heading large: Plus Jakarta Sans, bold */
h1,
.heading-1 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  font-size: 3rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-foreground);
  margin-bottom: 1rem;
}

h2,
.heading-2 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  font-size: 2.25rem;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--color-foreground);
  margin-bottom: 0.875rem;
}

h3,
.heading-3 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  font-size: 1.875rem;
  line-height: 1.3;
  letter-spacing: 0;
  color: var(--color-foreground);
  margin-bottom: 0.75rem;
}

h4,
.heading-4 {
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.4;
  color: var(--color-foreground);
  margin-bottom: 0.5rem;
}

h5,
.heading-5 {
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--color-foreground);
  margin-bottom: 0.5rem;
}

h6,
.heading-6 {
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-muted);
  margin-bottom: 0.25rem;
}

/* Body text */
p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: var(--color-foreground);
}

/* Muted secondary text */
.text-muted {
  color: var(--color-muted);
}

/* =============================================================================
   Link Styles
   ============================================================================= */

a {
  color: var(--color-accent);
  text-decoration: none;
  transition: color var(--duration-default) var(--easing-default);
}

a:hover {
  color: var(--color-accent-light);
}

a:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}

/* =============================================================================
   Form Elements Base Styles
   ============================================================================= */

input,
textarea,
select,
button {
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
}

input,
textarea,
select {
  background-color: var(--color-background);
  color: var(--color-foreground);
  border: none;
  border-radius: var(--radius-base);
  padding: 0.75rem 1rem;
  box-shadow: var(--shadow-inset);
  transition: box-shadow var(--duration-default) var(--easing-default);
}

input::placeholder,
textarea::placeholder {
  color: var(--color-placeholder);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  box-shadow: var(--shadow-inset-deep),
              0 0 0 2px var(--color-background),
              0 0 0 4px var(--color-accent);
}

/* =============================================================================
   Button Base Styles
   ============================================================================= */

button {
  background-color: var(--color-background);
  color: var(--color-foreground);
  border: none;
  border-radius: var(--radius-base);
  padding: 0.75rem 1.5rem;
  box-shadow: var(--shadow-extruded);
  cursor: pointer;
  font-weight: 500;
  transition: all var(--duration-default) var(--easing-default);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-extruded-hover);
}

button:active {
  transform: translateY(0.5px);
  box-shadow: var(--shadow-inset-small);
}

button:focus {
  outline: none;
  box-shadow: var(--shadow-extruded),
              0 0 0 2px var(--color-background),
              0 0 0 4px var(--color-accent);
}

/* Primary button variant */
button.btn-primary {
  background-color: var(--color-accent);
  color: white;
  box-shadow: var(--shadow-extruded);
}

button.btn-primary:hover {
  background-color: var(--color-accent-light);
  box-shadow: var(--shadow-extruded-hover);
}

button.btn-primary:active {
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.2),
              inset -2px -2px 4px rgba(255, 255, 255, 0.3);
}

/* Secondary button variant */
button.btn-secondary {
  background-color: var(--color-background);
  color: var(--color-foreground);
}

button.btn-secondary:hover {
  background-color: #D5DDE5;
}

/* Disabled state */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* =============================================================================
   Focus Visible for Accessibility
   ============================================================================= */

*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

button:focus-visible {
  outline: none;
  box-shadow: var(--shadow-extruded),
              0 0 0 2px var(--color-background),
              0 0 0 4px var(--color-accent);
}

/* =============================================================================
   Custom Animations
   ============================================================================= */

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Utility class for floating elements */
.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* =============================================================================
   Utility Classes (Tailwind supplement)
   ============================================================================= */

/* Neumorphic component utilities */
.neu-elevated {
  background-color: var(--color-background);
  box-shadow: var(--shadow-extruded);
  border-radius: var(--radius-base);
  transition: all var(--duration-default) var(--easing-default);
}

.neu-elevated:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-extruded-hover);
}

.neu-pressed {
  background-color: var(--color-background);
  box-shadow: var(--shadow-inset);
  border-radius: var(--radius-base);
}

.neu-card {
  background-color: var(--color-background);
  box-shadow: var(--shadow-extruded);
  border-radius: var(--radius-container);
  padding: 2rem;
}

.neu-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-extruded-hover);
}

.neu-input {
  background-color: var(--color-background);
  border: none;
  border-radius: var(--radius-base);
  padding: 0.75rem 1rem;
  box-shadow: var(--shadow-inset-deep);
  color: var(--color-foreground);
  font-family: 'DM Sans', sans-serif;
}

.neu-input:focus {
  outline: none;
  box-shadow: var(--shadow-inset-deep),
              0 0 0 2px var(--color-background),
              0 0 0 4px var(--color-accent);
}

/* Icon well: deep inset for icons */
.neu-icon-well {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-base);
  box-shadow: var(--shadow-inset-deep);
  color: var(--color-accent);
}

/* Spacing utilities */
.container-max {
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
}

/* =============================================================================
   Responsive Utilities (Mobile First)
   ============================================================================= */

@media (max-width: 640px) {
  body {
    font-size: 0.9375rem;
  }
  
  h1, .heading-1 {
    font-size: 1.875rem;
  }
  
  h2, .heading-2 {
    font-size: 1.5rem;
  }
  
  h3, .heading-3 {
    font-size: 1.25rem;
  }
  
  .neu-card {
    padding: 1rem;
  }
}

@media (min-width: 768px) {
  .neu-card {
    padding: 1.5rem;
  }
}

/* =============================================================================
   Utility: Skip to Main Content (Accessibility)
   ============================================================================= */

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-accent);
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: var(--radius-base);
}

.skip-link:focus {
  top: 0;
}

/* =============================================================================
   Print Styles
   ============================================================================= */

@media print {
  body {
    background-color: white;
  }
  
  .neu-elevated,
  .neu-card,
  .neu-pressed {
    box-shadow: none;
    border: 1px solid #ccc;
  }
}
```

**Critical Notes**:
- All colors and shadows use CSS variables—easy to update globally
- Shadow definitions use `rgb()` with alpha, NOT hex codes
- Google Fonts imported with `display=swap` for better performance
- Accessibility focus rings included throughout
- Mobile-first responsive utilities in media queries
- Custom utility classes (`.neu-elevated`, `.neu-card`, etc.) for rapid styling

---

### Step 10: Update index.css (Minimal Reset) (2 min)

**File**: `frontend/src/index.css`

Replace with:

```css
/* Minimal reset - import globals for all design tokens */
@import './globals.css';

/* Remove default body styles */
body {
  margin: 0;
  padding: 0;
}

/* Remove default link underline (optional, adjust to preference) */
a {
  text-decoration: none;
}
```

**Why**: Clean slate, import globals once at root level.

---

### Step 11: Update App.js (Remove MUI) (5 min)

**File**: `frontend/src/App.js`

**Changes**:
1. Remove MUI imports
2. Remove `ThemeProvider`, `CssBaseline`, theme definition
3. Keep routing, AuthProvider, and all pages intact
4. Import `./App.css` (unchanged for now)

**Before** (current):
```javascript
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  // ... more MUI config
});

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Routes */}
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
```

**After** (simplified):
```javascript
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import UserManagementPage from './pages/UserManagementPage';
import RentalRequestFormPage from './pages/RentalRequestFormPage';
import RentalRequestListPage from './pages/RentalRequestListPage';
import RentalRequestDetailPage from './pages/RentalRequestDetailPage';
import ContractListPage from './pages/ContractListPage';
import ContractDetailPage from './pages/ContractDetailPage';

// Import CSS (no more MUI theme provider)
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          {/* No ThemeProvider, CssBaseline, or MUI theme */}
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute component={DashboardPage} />}
            />
            <Route
              path="/profile"
              element={<PrivateRoute component={ProfilePage} />}
            />
            <Route
              path="/admin/users"
              element={<PrivateRoute component={UserManagementPage} />}
            />
            <Route
              path="/rental-requests"
              element={<PrivateRoute component={RentalRequestListPage} />}
            />
            <Route
              path="/rental-requests/new"
              element={<PrivateRoute component={RentalRequestFormPage} />}
            />
            <Route
              path="/rental-requests/:id"
              element={<PrivateRoute component={RentalRequestDetailPage} />}
            />
            <Route
              path="/contracts"
              element={<PrivateRoute component={ContractListPage} />}
            />
            <Route
              path="/contracts/:id"
              element={<PrivateRoute component={ContractDetailPage} />}
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
```

**Key Points**:
- All MUI imports removed
- `ThemeProvider`, `CssBaseline`, and theme creation deleted
- Routes, AuthProvider, ErrorBoundary preserved
- All page imports kept as-is
- CSS imported at top (globals.css loaded via index.css)

---

### Step 12: Verify Installation & Build (10 min)

```bash
# From frontend/
# Clear npm cache (recommended after major changes)
npm cache clean --force

# Clean install node_modules
rm -rf node_modules package-lock.json
npm install

# Verify no errors
npm list | grep -E "(error|warn)"

# Should output clean package tree
```

---

### Step 13: Test App Startup (5 min)

```bash
# From frontend/
npm start
```

**Expected Behavior**:
- App starts on http://localhost:3000
- No console errors
- Page background is cool grey (#E0E5EC)
- Routing works (click navbar links)
- AuthContext available (login/logout works)
- All text is visible and properly styled

**Troubleshooting If Fails**:
- **"Cannot find module @mui/..."**: Verify MUI uninstall completed
- **"Tailwind not found"**: Verify npm install completed
- **"globals.css not found"**: Verify file created in src/
- **Styles not loading**: Check that index.css imports globals.css

---

### Step 14: Verify No Breaking Changes (10 min)

**Manual Testing Checklist** (see next section).

---

## Validation Tests (Manual Checklist)

Run these tests after startup to confirm zero breaking changes:

### Visual Tests
- [ ] Page background is cool grey (`#E0E5EC`)
- [ ] All text is dark blue-grey (`#3D4852`)
- [ ] No MUI blue/red colors visible
- [ ] Links are violet accent color (`#6C63FF`)
- [ ] No console errors (open DevTools → Console)
- [ ] No console warnings about MUI or Emotion

### Routing Tests
- [ ] Click "Dashboard" in navbar → navigates to dashboard
- [ ] Click "Profile" in navbar → navigates to profile
- [ ] Click "Login" button → navigates to login page
- [ ] Back/forward browser buttons work
- [ ] URL changes match page content

### Auth Tests (if logged in)
- [ ] AuthContext available globally
- [ ] User info displays in profile (axios API call works)
- [ ] Logout button works (clears auth token)
- [ ] Protected routes redirect to login when unauthenticated

### CSS Tests
- [ ] Tailwind utility classes work (e.g., `<div className="p-4 bg-neu-bg">`)
- [ ] CSS variables work in DevTools (inspect element, check computed styles)
- [ ] No "404 .css" errors in Network tab
- [ ] PostCSS processed CSS (shadow values visible in DevTools)

### Browser Tests
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browser (phone/tablet simulator)

### Performance Tests
- [ ] Page loads in < 2 seconds
- [ ] No bundle size increase from before (should decrease from MUI removal)
- [ ] DevTools Lighthouse score for Performance > 80

---

## Troubleshooting Common Issues

### Issue 1: "Cannot find module '@mui/material'"
**Cause**: MUI still imported in a component.
**Solution**:
```bash
# Search for remaining MUI imports
grep -r "@mui" frontend/src/

# Search for remaining Emotion imports
grep -r "@emotion" frontend/src/
```
Remove any found imports.

---

### Issue 2: "Tailwind CSS not processing"
**Cause**: PostCSS config missing or incorrect.
**Solution**:
1. Verify `frontend/.postcssrc.js` exists
2. Verify `frontend/tailwind.config.js` exists
3. Restart dev server: `npm start`

---

### Issue 3: "Colors not applying (grey background missing)"
**Cause**: globals.css not imported, or CSS variables not working.
**Solution**:
1. Verify `frontend/src/globals.css` exists
2. Verify `frontend/src/index.css` imports globals: `@import './globals.css';`
3. Open DevTools → Styles, search for `--color-background`
4. If found, CSS variables working; if not, CSS import failed
5. Restart dev server

---

### Issue 4: "Fonts not loading (text looks generic)"
**Cause**: Google Fonts CDN not loading.
**Solution**:
1. Open DevTools → Network tab
2. Search for "fonts.googleapis.com"
3. If not found, check internet connection
4. If found but fonts don't apply, add explicit font-family to body:
```css
body {
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

### Issue 5: "Shadows not visible / look flat"
**Cause**: Shadow CSS variables not applied correctly.
**Solution**:
1. Open DevTools, inspect a button element
2. Check computed styles for `box-shadow`
3. If empty, CSS variables not resolving
4. Verify `:root` block in globals.css exists
5. Verify shadow variables defined with exact names: `--shadow-extruded`, etc.

---

### Issue 6: "npm install hangs or times out"
**Cause**: Network issue or npm registry slow.
**Solution**:
```bash
# Increase npm timeout
npm config set fetch-timeout 60000

# Try again
npm install

# If still failing, clear cache and use yarn
npm cache clean --force
yarn install  # if yarn installed
```

---

### Issue 7: "PostCSS errors about unknown at-rules"
**Cause**: PostCSS plugins not loading.
**Solution**:
1. Delete `frontend/postcss.config.js` (auto-generated)
2. Create fresh `.postcssrc.js` from Step 7 above
3. Restart dev server

---

## Setup Instructions for shadcn/ui Components

Once Phase 1 foundation is complete, we're ready for shadcn/ui in Phase 2.

### For Phase 2 (Do NOT run in Phase 1):

```bash
# From frontend/
# Install shadcn/ui components as needed in Phase 2
# Example: npx shadcn-ui@latest add button

# Each command installs a component into frontend/lib/components/ui/
# For Neumorphism, we'll customize shadcn components with globals.css variables
```

### Custom Component Strategy (Phase 2):

Each shadcn component installed will be customized via:
- **globals.css**: Add component-specific CSS (shadows, colors, radii)
- **tailwind.config.js**: Extend utilities for variant states
- **Component files**: Minimal className overrides, rely on CSS

Example (Phase 2):
```javascript
// shadcn Button component customized
<button className="neu-elevated rounded-neu-base text-neu-fg">
  Click me
</button>
```

---

## Next Steps & Phase 2 Dependencies

### What Phase 1 Enables
- ✅ Clean slate for component refactoring
- ✅ Design token system ready for all components
- ✅ Tailwind + shadcn-ui foundation installed
- ✅ Zero breaking changes confirmed

### What Phase 2 Will Do
- Refactor individual components (Navbar, buttons, forms, cards)
- Install shadcn/ui components as needed
- Apply neumorphic shadows and colors
- Verify responsive design on mobile
- Test accessibility (WCAG AA)

### What Phase 3 Will Do
- Refactor all pages (Dashboard, Login, Profile, etc.)
- Implement micro-interactions (hover, active states)
- Polish animations (floating, transitions)
- Final visual QA

### What Phase 4 Will Do
- End-to-end testing (routing, auth, API)
- Performance optimization
- Browser compatibility
- Deploy to staging/production

---

## Success Criteria

Phase 1 is **COMPLETE** when:

- [ ] ✅ MUI packages completely removed (npm list shows no @mui or @emotion)
- [ ] ✅ Tailwind CSS installed and configured (tailwind.config.js, .postcssrc.js exist)
- [ ] ✅ globals.css created with all design tokens (colors, shadows, typography)
- [ ] ✅ App starts without errors (npm start succeeds)
- [ ] ✅ Page background is cool grey (#E0E5EC)
- [ ] ✅ All text readable with correct colors
- [ ] ✅ Routing works (navbar links navigate)
- [ ] ✅ AuthContext functions (login/logout available)
- [ ] ✅ No console errors or warnings
- [ ] ✅ Axios API calls work (verify in DevTools Network)
- [ ] ✅ CSS variables visible in DevTools computed styles
- [ ] ✅ Shadows visible on interactive elements (buttons)
- [ ] ✅ Google Fonts loaded (verify in Network tab)
- [ ] ✅ responsive design working (test on mobile viewport)

---

## Risk Assessment

### Low Risk
- **Dependency removal**: MUI packages uninstalled cleanly
- **CSS variables**: Standard CSS feature, widely supported

### Medium Risk
- **Shadow complex RGBA**: Some older browsers may have transparency issues
  - **Mitigation**: Use RGB with comma syntax (not slash syntax)
- **Font loading**: Depends on CDN availability
  - **Mitigation**: Add system font fallbacks in globals.css

### Mitigated
- **Breaking changes**: All auth, routing, API preserved as-is
- **Bundle size**: Tailwind purges unused styles; should reduce from MUI removal

---

## Security Considerations

### None in Phase 1
Phase 1 is purely UI foundation setup.
- No new API endpoints
- No authentication logic changes
- No sensitive data handled
- CSS variables safe (no secrets in styles)

### Note for Phase 2+
When adding shadcn components, ensure:
- Input components sanitize values (Phase 2)
- Form submissions use CSRF tokens (existing, Phase 2)
- No sensitive data in CSS or HTML comments

---

## Conclusion

Phase 1 sets up the **complete design token system** and **Tailwind CSS foundation** without touching any application logic. This is a self-contained, low-risk setup that creates the clean slate needed for Phases 2-4.

**Key Deliverables**:
1. `frontend/src/globals.css` — Complete design system tokens
2. `frontend/tailwind.config.js` — Tailwind configuration with custom utilities
3. `frontend/.postcssrc.js` — PostCSS setup
4. Updated `frontend/package.json` — Tailwind + shadcn-ui installed
5. Updated `frontend/src/App.js` — MUI removed
6. Updated `frontend/src/index.css` — Clean reset, imports globals

**Estimated Time**: 2-3 hours for an experienced developer following these exact steps.

---

**Questions or Blockers?** See next section.

## Unresolved Questions / Blockers

- **Q1**: Should we commit Phase 1 changes to `feature/neumorphism-ui-phase1` branch before starting Phase 2?
  - **Answer**: Yes, after all success criteria pass. Creates checkpoint for rollback if needed.

- **Q2**: Do we need dark mode support?
  - **Current Answer**: No. Specification is light mode only. Dark mode can be added in Phase 4+ if needed.

- **Q3**: Should we update favicon/branding in Phase 1?
  - **Current Answer**: No. Keep in Phase 2 when refactoring components.

- **Q4**: Do we need to install any VSCode extensions for Tailwind?
  - **Recommended**: `Tailwind CSS IntelliSense` extension (optional but helpful for future development).

---

**End of Phase 1: Foundation & Setup Plan**
