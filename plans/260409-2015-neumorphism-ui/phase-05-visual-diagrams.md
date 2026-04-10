# Phase 5 Visual Architecture & Diagrams

---

## 🏗️ Component Hierarchy Diagram

```
RentalRequestListPage / ContractListPage
│
├─ Page Header & Typography
│  ├─ Title (h1, Plus Jakarta Sans, 2rem)
│  └─ Subtitle (body, DM Sans, 0.95rem)
│
├─ Filter Controls
│  ├─ Search Bar (input, --shadow-inset)
│  └─ Tab Buttons (contracts only)
│     ├─ "All Contracts" (inactive: extruded, active: inset)
│     └─ "Active Only" (inactive: extruded, active: inset)
│
├─ NeuTable (reusable wrapper)
│  │
│  ├─ Outer Container
│  │  └─ overflow-x: auto (for mobile scroll)
│  │
│  ├─ HTML <table> Element
│  │  │
│  │  ├─ <thead> (Table Header)
│  │  │  └─ <tr style={{--shadow-extruded-small}}>
│  │  │     ├─ <th>Request ID</th>         ← Visible all
│  │  │     ├─ <th>Tenant</th>             ← Hide mobile/hide if not admin
│  │  │     ├─ <th>Zone</th>               ← Visible all
│  │  │     ├─ <th>Area (m²)</th>          ← Visible all
│  │  │     ├─ <th>Cost/Rent</th>          ← Visible all
│  │  │     ├─ <th>Status</th>             ← Visible all
│  │  │     ├─ <th>Date</th>               ← Hide mobile/tablet
│  │  │     └─ <th>Actions</th>            ← Visible all
│  │  │
│  │  └─ <tbody> (Table Body)
│  │     ├─ <tr onHover={{--shadow-extruded-small, lift}}>
│  │     │  ├─ <td>{row.id}</td>
│  │     │  ├─ <td>{row.tenant}</td>
│  │     │  ├─ <td>{row.zone}</td>
│  │     │  ├─ <td>{row.area}</td>
│  │     │  ├─ <td>{row.cost}</td>
│  │     │  ├─ <td>
│  │     │  │  └─ StatusBadge (--shadow-inset-small, colored)
│  │     │  ├─ <td>{row.date}</td>
│  │     │  └─ <td>
│  │     │     └─ Action Button (--shadow-extruded-small, hovers)
│  │     ├─ <tr>...  (rows 2-10)
│  │     └─ <tr>...  (row 10, last visible)
│  │
│  └─ TablePagination
│     ├─ "← Prev" Button (--shadow-extruded-small, disabled if page 1)
│     ├─ Page Numbers (1, 2, 3, ...)
│     │  ├─ Active page: --shadow-inset, color: accent
│     │  └─ Inactive: --shadow-extruded-small
│     ├─ "Next →" Button (--shadow-extruded-small, disabled if last page)
│     └─ "Page X of Y" Text
│
├─ Loading State
│  └─ Skeleton loaders (5 rows, placeholder animation)
│
└─ Empty State
   └─ "No items found" message
```

---

## 🎨 Shadow & Elevation System

```
Elevation Levels (Visual Stacking Order):

Level 5 (Highest)
┌─────────────────────────────────────┐
│ --shadow-extruded-hover             │  Buttons on hover
│ (larger, more prominent)            │  Lifted appearance
└─────────────────────────────────────┘
                ▲
                │
Level 4
┌─────────────────────────────────────┐
│ --shadow-extruded                   │  Active tab button
│ 9px 9px 16px + -9px -9px 16px       │  Table header (strong)
└─────────────────────────────────────┘
                ▲
                │
Level 3 (Base/Resting)
┌─────────────────────────────────────┐
│ --shadow-extruded-small             │  Regular buttons
│ 5px 5px 10px + -5px -5px 10px       │  Row hover
│                                      │  Pagination buttons
└─────────────────────────────────────┘
                ▲
                │
Level 2 (Inset/Carved)
┌─────────────────────────────────────┐
│ --shadow-inset-small                │  Status badges
│ inset 3px 3px 6px...                │  Active pagination page
│                                      │  (pressed appearance)
└─────────────────────────────────────┘
                ▲
                │
Level 1 (Deep Inset)
┌─────────────────────────────────────┐
│ --shadow-inset-deep                 │  Focused inputs
│ inset 10px 10px 20px...             │  Deep wells
│                                      │  (very pressed)
└─────────────────────────────────────┘
                ▲
                │
Level 0 (Background)
┌─────────────────────────────────────┐
│ --color-background (#E0E5EC)        │  Page surface
│ No shadow                            │  Flat base
└─────────────────────────────────────┘
```

---

## 📱 Responsive Behavior Flow

```
Screen Size Detection
        │
        ├─ < 640px (Mobile)
        │  ├─ Font sizes: smaller (0.85rem, 0.9rem)
        │  ├─ Table columns: HIDE (Tenant, Duration, Dates)
        │  ├─ Table wrapper: overflow-x: auto
        │  ├─ Buttons: larger touch targets (44px)
        │  ├─ Padding: reduced (8px instead of 12px)
        │  └─ Layout: stacked (single column)
        │
        ├─ 640px - 1023px (Tablet)
        │  ├─ Font sizes: normal (0.95rem, 1rem)
        │  ├─ Table columns: Show Tenant, hide Dates
        │  ├─ Table wrapper: overflow-x: auto (if needed)
        │  ├─ Buttons: normal size (36-40px)
        │  ├─ Padding: standard (12-16px)
        │  └─ Layout: 2-column or flexible
        │
        └─ ≥ 1024px (Desktop)
           ├─ Font sizes: normal (0.95rem, 1rem)
           ├─ Table columns: Show ALL
           ├─ Table wrapper: no scroll needed
           ├─ Buttons: normal size (36-40px)
           ├─ Padding: standard (16px)
           └─ Layout: full width
```

---

## 🎯 State Transitions

```
BUTTON STATE MACHINE:

             ┌─────────────────────┐
             │    Normal State     │
             │  --shadow-extruded  │
             │  No highlight       │
             │  cursor: pointer    │
             └─────────────────────┘
                     ▲   │
                     │   │ onMouseEnter
                     │   ▼
    onMouseLeave  ┌─────────────────────┐
    ┌─────────────│   Hover State       │
    │             │  --shadow-extruded  │
    │             │  translateY(-1px)   │
    │             │  Brighter shadow    │
    │             └─────────────────────┘
    │
    │             ┌─────────────────────┐
    │             │   Active/Click      │
    │             │  --shadow-inset     │
    └─────────────│  translateY(0.5px)  │
                  │  Pressed appearance │
                  └─────────────────────┘

                  ┌─────────────────────┐
                  │   Focus State       │
                  │ + Focus ring outline│
                  │ + --color-accent    │
                  │ 2px solid border    │
                  └─────────────────────┘
```

```
TABLE ROW HOVER:

   Normal Row               Hovered Row
┌──────────────────┐     ┌──────────────────┐
│ bg: transparent  │     │ bg: white 20%    │
│ shadow: none     │     │ shadow: small    │
│ transform: none  │     │ translateY(-1px) │
└──────────────────┘     └──────────────────┘
         │                       ▲
         └───────────────────────┘
         onMouseEnter/Leave
```

---

## 🌈 Color Mapping Examples

```
RENTAL REQUEST STATUS COLORS:

PENDING
┌─────────────────────────────────┐
│ Background: var(--color-muted)  │  #6B7280 Grey
│ Text: white                     │  Good contrast
│ Meaning: Waiting for approval   │
│ Shadow: --shadow-inset-small    │
└─────────────────────────────────┘

APPROVED
┌─────────────────────────────────┐
│ Background: color-accent-2ndry  │  #38B2AC Teal
│ Text: white                     │  Good contrast
│ Meaning: Approved, ready        │
│ Shadow: --shadow-inset-small    │
└─────────────────────────────────┘

REJECTED
┌─────────────────────────────────┐
│ Background: #E74C3C             │  Red (custom)
│ Text: white                     │  Good contrast
│ Meaning: Denied                 │
│ Shadow: --shadow-inset-small    │
└─────────────────────────────────┘

CANCELLED
┌─────────────────────────────────┐
│ Background: #95A5A6             │  Grey (custom)
│ Text: white                     │  Good contrast
│ Meaning: Cancelled              │
│ Shadow: --shadow-inset-small    │
└─────────────────────────────────┘

CONTRACT STATUS COLORS:

ACTIVE
┌─────────────────────────────────┐
│ Background: color-accent-2ndry  │  #38B2AC Teal
│ Text: white                     │  Good contrast
│ Shadow: --shadow-inset-small    │
└─────────────────────────────────┘

EXPIRED
┌─────────────────────────────────┐
│ Background: var(--color-muted)  │  #6B7280 Grey
│ Text: white                     │  Good contrast
│ Shadow: --shadow-inset-small    │
└─────────────────────────────────┘

TERMINATED
┌─────────────────────────────────┐
│ Background: #E74C3C             │  Red (custom)
│ Text: white                     │  Good contrast
│ Shadow: --shadow-inset-small    │
└─────────────────────────────────┘
```

---

## 📊 Pagination UI Flow

```
Pagination States:

Page 1 of 10:
┌──────────────────────────────────────────────────────────┐
│ ← Prev (DISABLED)  [1] 2  3  ... 10  Next →  Page 1 of 10 │
│ Inactive: extruded | Active: inset/accent | Info: muted    │
└──────────────────────────────────────────────────────────┘

Page 5 of 10:
┌──────────────────────────────────────────────────────────┐
│ ← Prev     1  2  3  4  [5] 6  7  ... 10  Next →  Page 5 of 10 │
│           Inactive nums     Active (accent)   Info: muted       │
└──────────────────────────────────────────────────────────┘

Page 10 of 10:
┌──────────────────────────────────────────────────────────┐
│ ← Prev     1  ... 8  9  [10]  Next (DISABLED)  Page 10 of 10 │
│ Inactive buttons    Last page highlighted   Info: muted       │
└──────────────────────────────────────────────────────────┘

Mobile View (Page 3 of 10):
┌──────────────────────────────────────────────────────────┐
│ ← Prev  2  [3] 4  Next →     Page 3 of 10                │
│ Show -1, current, +1 only (context preserved)            │
└──────────────────────────────────────────────────────────┘
```

---

## 📐 Spacing & Sizing Grid

```
Vertical Rhythm (4px base unit):

Tight    (4px)   └─ Icon padding
Small    (8px)   └─ Badge padding, button gap
Medium   (12px)  └─ Table cell padding, input padding
Large    (16px)  └─ Container padding, section spacing
XL       (20px)  └─ Major sections
2XL      (24px)  └─ Page padding, big gaps

Table Cell Sizing:

Header Cell:
┌────────────────────────────────────┐
│  16px vertical / 12px horizontal   │
│  6 = 16px + 12px padding           │
│  Font: 0.9rem, weight 600          │
│  --shadow-extruded-small           │
└────────────────────────────────────┘

Data Cell:
┌────────────────────────────────────┐
│  14px vertical / 12px horizontal   │
│  Font: 0.95rem (desktop), 0.85rem  │
│  (mobile), weight 400              │
│  Border-bottom: 1px subtle         │
└────────────────────────────────────┘

Status Badge:
┌────────────────────────────────────┐
│  6px vert / 12px horiz (small)    │
│  8px vert / 16px horiz (medium)   │
│  Font: 0.75rem, weight 600         │
│  --shadow-inset-small              │
└────────────────────────────────────┘

Button:
┌────────────────────────────────────┐
│  6px vert / 12px horiz (compact)   │
│  Min height: 32-44px (touch)       │
│  Min width: 36-80px (context)      │
│  Font: 0.85-0.95rem, weight 600    │
│  --shadow-extruded-small           │
└────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
API Layer
    │
    ├─ rentalService.getAllRequests()     → [Array of requests]
    ├─ contractService.getAllContracts()  → [Array of contracts]
    ├─ contractService.getAllActiveContracts()
    └─ contractService.getMyActiveContracts()
                    │
                    ▼
    Component State (useState)
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    requests[]   filter      currentPage
                 (search)
                    │
                    ▼
            filteredRequests[]
                    │
                    ▼
            Pagination Logic
            (slice by page)
                    │
                    ▼
            paginatedRows[] (10 items)
                    │
                    ▼
            NeuTable Component
                    │
            ┌───────┼───────┬─────────┐
            │       │       │         │
            ▼       ▼       ▼         ▼
        Header  Rows    Pagination  Empty/Loading
                 │
            ┌────┴────┐
            │          │
            ▼          ▼
        Data      StatusBadge
        Cells     + ActionButton
                  + Navigate
```

---

## ⚡ Event Flow

```
User Interactions:

1. SEARCH INPUT CHANGE
   ├─ setSearchQuery(e.target.value)
   ├─ setCurrentPage(1) [Reset to page 1]
   ├─ Re-render with filtered rows
   └─ Update table with matching items

2. TAB SWITCH (Contracts Only)
   ├─ setFilterTab(tabIndex)
   ├─ loadContracts() [API call]
   ├─ setCurrentPage(1) [Reset to page 1]
   ├─ setContracts([...filtered])
   └─ Re-render with new data

3. PAGINATION NEXT/PREV
   ├─ handlePageChange(newPage)
   ├─ setCurrentPage(newPage)
   ├─ tableRef.current.scrollIntoView() [Smooth scroll]
   ├─ NeuTable re-calculates slice
   └─ Display new page of rows

4. ROW HOVER
   ├─ onMouseEnter: setHoveredRowId(row.id)
   ├─ Apply hover styles to that row
   ├─ Row lifted with --shadow-extruded-small
   ├─ onMouseLeave: setHoveredRowId(null)
   └─ Row returns to normal state

5. ACTION BUTTON CLICK
   ├─ navigate(`/rentals/${row.id}`)
   ├─ OR navigate(`/contracts/${row.id}`)
   └─ Route to detail page

6. SORT (not implemented, future feature)
   ├─ setSort({column, direction})
   ├─ Sort rows by column
   ├─ setCurrentPage(1)
   └─ Display sorted data
```

---

## 🎬 Animation Sequences

```
BUTTON CLICK ANIMATION (300ms):

Normal ──→ Hover ────→ Click ────→ Release
   │         │          │          │
   └─────────┘          └─────────┘
    Extrude    (optional transition)
    Shadow

Visual Timeline (300ms duration, ease-out):
0ms:   Normal state
       - No shadow
       - Y position: 0
       - Color: normal
       
100ms: Hover state
       - Shadow: extruded
       - Y position: -1px
       - Color: lighter
       
150ms: Peak hover
       - All effects max
       
200ms: Click (button active)
       - Shadow: inset
       - Y position: +0.5px
       
250ms: Click release begins
       - Transitioning back
       
300ms: Full release
       - Back to normal
```

```
ROW HOVER ANIMATION (300ms):

Normal State    →    Hover State
─────────────────────────────────

Background:        Background:
transparent        rgba(255,255,255,0.2)

Transform:         Transform:
Y = 0              Y = -1px

Shadow:            Shadow:
none               var(--shadow-extruded-small)

Transition:
all 300ms ease-out
```

---

## 🏥 Loading State Skeleton

```
NeuTable in Loading State:

┌────────────────────────────────────────────────┐
│ ▬▬▬▬ ▬▬▬▬ ▬▬▬▬ ▬▬▬▬ ▬▬▬▬ ▬▬▬▬ ▬▬▬▬  (Header) │
├────────────────────────────────────────────────┤
│ ▌░░░░░░░▌  ▌░░░░░▌  ▌░░░▌  ...  (Row 1)    │
├────────────────────────────────────────────────┤
│ ▌░░░░░░░▌  ▌░░░░░▌  ▌░░░▌  ...  (Row 2)    │
├────────────────────────────────────────────────┤
│ ▌░░░░░░░▌  ▌░░░░░▌  ▌░░░▌  ...  (Row 3)    │
├────────────────────────────────────────────────┤
│ ▌░░░░░░░▌  ▌░░░░░▌  ▌░░░▌  ...  (Row 4)    │
├────────────────────────────────────────────────┤
│ ▌░░░░░░░▌  ▌░░░░░▌  ▌░░░▌  ...  (Row 5)    │
└────────────────────────────────────────────────┘

Effect: Pulse animation 2s infinite
        (opacity 0.7 → 1.0 → 0.7)
```

---

## 📍 Accessibility Focus States

```
BUTTON FOCUS RING:

╔════════════════════════════╗
║ ┌──────────────────────┐   ║
║ │                      │   ║
║ │  [ Button Text ]     │   ║
║ │                      │   ║
║ └──────────────────────┘   ║  ← 2px gap
║                            ║
║  ← 2px solid --color-accent║
╚════════════════════════════╝

Double ring:
Inner: --color-background (2px)
Outer: --color-accent (4px)
Result: Clear focus visibility


INPUT FOCUS STATE:

Normal:  --shadow-inset
Focused: --shadow-inset-deep
         + 0 0 0 2px --color-background
         + 0 0 0 4px --color-accent

Creates concentric rings for high visibility
```

---

## 🔀 Branching Logic

```
IS ADMIN? (useAuth)
       │
       ├─ YES (isAdmin())
       │  ├─ Show "Tenant" column
       │  ├─ Show admin-only filters
       │  ├─ Title: "All Rental Requests"
       │  └─ Load: getAllRequests()
       │
       └─ NO (!isAdmin())
          ├─ Hide "Tenant" column
          ├─ Hide admin-only features
          ├─ Title: "My Rental Requests"
          └─ Load: getMyRequests()

FOR CONTRACTS:
       │
       ├─ Tab 0: All Contracts
       │  └─ Load: getAllContracts()
       │
       └─ Tab 1: Active Only
          ├─ isAdmin()
          │  └─ Load: getAllActiveContracts()
          │
          └─ !isAdmin()
             └─ Load: getMyActiveContracts()
```

---

## 🧮 Pagination Calculation

```
Total Items: 150 rows
Page Size: 10 items/page

Formula:
─────────────────────
totalPages = Math.ceil(150 / 10) = 15 pages

Current Page: 5
────────────────────────────────
startIdx = (5 - 1) * 10 = 40
endIdx = 40 + 10 = 50
displayRows = allRows.slice(40, 50)  ← Rows 41-50

Page Info: "Page 5 of 15 (150 total)"


Page Number Display Logic:
─────────────────────────────
Total Pages: 10

Desktop (show 5):        Mobile (show 3):
1 2 3 4 [5] 6 7 8 9 10  2 [3] 4

Desktop (show 7):       Mobile (show 3):
1 ... 4 5 [6] 7 8 ... 10  5 [6] 7

Always show: 1, last page
Context: ±2 pages from current
Gaps shown as "..."
```

---

## 🎨 Design Tokens Reference Card

```
COLORS
├─ Background: #E0E5EC (--color-background)
├─ Foreground: #3D4852 (--color-foreground)
├─ Muted: #6B7280 (--color-muted)
├─ Accent: #6C63FF (--color-accent)
├─ Accent-Light: #8B84FF (--color-accent-light)
├─ Accent-Secondary: #38B2AC (--color-accent-secondary)
├─ Error: #E74C3C (Custom)
└─ Neutral: #95A5A6 (Custom)

SHADOWS
├─ Extruded: 9px 9px 16px + -9px -9px 16px
├─ Extruded-Hover: 12px 12px 20px + -12px -12px 20px
├─ Extruded-Small: 5px 5px 10px + -5px -5px 10px
├─ Inset: inset 6px 6px 10px + inset -6px -6px 10px
├─ Inset-Deep: inset 10px 10px 20px + inset -10px -10px 20px
└─ Inset-Small: inset 3px 3px 6px + inset -3px -3px 6px

RADIUS
├─ Container: 32px (--radius-container)
├─ Base: 16px (--radius-base)
└─ Inner: 12px (--radius-inner)

TIMING
├─ Duration: 300ms (--duration-default)
└─ Easing: ease-out (--easing-default)
```

---

**Visual diagrams created:** 2026-04-09  
**Comprehensive visual reference for Phase 5 implementation**
