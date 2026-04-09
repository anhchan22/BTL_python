# React Codebase Structure Exploration

## Summary
**Create React App (CRA)** with **Material-UI (MUI)** styling. No Tailwind or shadcn/ui installed. Standard src/ structure with pages, components, contexts, and services.

---

## Directory Structure

```
frontend/src/
├── App.js (main app with routing & MUI theme)
├── index.js (entry point)
├── index.css (basic reset)
├── App.css
├── components/
│   ├── ErrorBoundary.js
│   ├── Loading.js
│   ├── Navbar.js
│   └── PrivateRoute.js
├── pages/
│   ├── LoginPage.js ⭐ Auth
│   ├── RegisterPage.js ⭐ Auth
│   ├── DashboardPage.js ⭐ Main dashboard
│   ├── ProfilePage.js
│   ├── UserManagementPage.js
│   ├── ZoneListPage.js ⭐ Property listing
│   ├── ZoneDetailPage.js
│   ├── ZoneFormPage.js
│   ├── RentalRequestFormPage.js
│   ├── RentalRequestListPage.js
│   ├── RentalRequestDetailPage.js
│   ├── ContractListPage.js
│   └── ContractDetailPage.js
├── contexts/
│   └── AuthContext.js (authentication state)
├── services/
│   ├── api.js
│   ├── contractService.js
│   ├── rentalService.js
│   ├── userService.js
│   └── zoneService.js
└── utils/
    └── validation.js
```

---

## Key Components Located

| Component | File | Status |
|-----------|------|--------|
| **Auth** | `pages/LoginPage.js`, `pages/RegisterPage.js` | ✅ Exists |
| **Dashboard** | `pages/DashboardPage.js` | ✅ Exists |
| **Property Listing** | `pages/ZoneListPage.js` | ✅ Exists |
| **Authentication Context** | `contexts/AuthContext.js` | ✅ Exists |
| **Router Setup** | `App.js` (BrowserRouter, 11 routes) | ✅ Exists |

---

## Styling Setup

- **Framework**: Material-UI (MUI v9.0.0)
- **Theme**: Custom MUI theme in `App.js` (primary: `#1976d2`, secondary: `#dc004e`)
- **CSS Files**: `index.css` (minimal), `App.css`, component-specific styles
- **Tailwind CSS**: ❌ Not installed
- **shadcn/ui**: ❌ Not installed
- **PostCSS Config**: ❌ Not present

---

## Package Dependencies

```json
{
  "@mui/material": "^9.0.0",
  "@mui/icons-material": "^9.0.0",
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.1",
  "react": "^19.2.4",
  "react-router-dom": "^7.14.0",
  "axios": "^1.14.0"
}
```

---

## Entry Point

- **HTML**: `public/index.html` (root div: `<div id="root">`)
- **JS**: `src/index.js` → `App.js`
- **Build**: React Scripts (CRA standard)

---

## Auth & State Management

- **Auth Context**: `AuthContext.js` provides `useAuth()` hook
- **User State**: Stored in context + localStorage tokens
- **Protected Routes**: `PrivateRoute.js` checks authentication & admin role
- **Methods**: `login()`, `register()`, `logout()`, `isAdmin()`, `isTenant()`

---

## Next Steps for UX/UI Planning

✅ **Ready to modernize styling**: Replace MUI with Tailwind + shadcn/ui components
✅ **Route structure**: 11 routes defined, no conflicts
✅ **No Tailwind conflicts**: Can safely install and configure
✅ **Auth foundation**: Already in place, minimal UI changes needed
