---
title: Admin Role System Redesign - Phase 6
created: 2026-04-09
updated: 2026-04-09
status: in-progress
phase: 6
timeline: 5-7 days (Phases 1-3 COMPLETE, Phases 4-5 in progress)
priority: high
dependencies: [phase-02, phase-03, phase-04, phase-05]
scope: Redesign admin system with single super admin, remove role selector from registration, build user management UI
progress: 60% (3/5 phases complete)
---

# Admin Role System Redesign - Phase 6

**Project:** Industrial Zone Rental Management System (Django 5.x + React)  
**Current Status:** Phases 1-5 complete (Auth, Zones, Rentals, Contracts)  
**Goal:** Implement admin-only system with explicit role management and tenant profile updates  
**Timeline:** 5-7 days (estimate based on scope)

## Executive Summary

Redesign user registration/authentication to remove security vulnerability where users self-select admin role. Implement:

1. **Idempotent admin creation** via Django management command (reads INITIAL_ADMIN_* env vars)
2. **Remove role selector** from frontend registration (always default TENANT)
3. **Admin User Management page** (/admin/users) with promote/demote guards
4. **Tenant Profile page** (/profile) for self-update (name, phone, password)
5. **New API endpoints** for role changes + profile updates
6. **Safe seed script** for demo data (one-time, idempotent)

## Phases Overview

| Phase | Title | Status | Duration | Key Deliverables |
|-------|-------|--------|----------|------------------|
| [Phase 1](#phase-1-backend-api-endpoints) | Backend API Endpoints | ✅ COMPLETE | 1.5 days | 3 new endpoints (role change, profile update, admin init) |
| [Phase 2](#phase-2-backend-security-and-seed) | Backend Security & Seed | ✅ COMPLETE | 1 day | Django command, env vars, seed script |
| [Phase 3](#phase-3-frontend-ui-pages) | Frontend UI Pages | ✅ COMPLETE | 2 days | UserMgmt page, Profile page, navbar updates |
| [Phase 4](#phase-4-testing-and-validation) | Testing & Validation | 🔄 IN-PROGRESS | 1 day | Unit + integration tests, E2E workflows |
| [Phase 5](#phase-5-documentation) | Documentation | ⏳ NEXT | 0.5 days | Updated deployment guide, troubleshooting |

---

## Key Architecture Decisions

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Admin Creation** | Env-var script + Django command | CI/CD friendly, never exposed to frontend, idempotent |
| **Role Selection** | Removed from registration | Prevents self-promotion security issue |
| **Role Management** | New PATCH endpoint + React page | Explicit admin control, clear audit trail |
| **Admin Count Guard** | ≥1 admin always (validation) | Prevents accidental lock-out |
| **Tenant Profile** | Self-updateable (name, phone, password) | User autonomy within bounds |
| **Seed Data** | Safe idempotent script | Prevents data loss, can run repeatedly |

---

## Phase 1: Backend API Endpoints

### Overview
Create 3 new API endpoints + modify 1 existing (register).

**Status:** Pending  
**Duration:** 1.5 days  
**Files to Create/Modify:**
- `backend/api/serializers.py` - Update RegisterSerializer, create RoleChangeSerializer, ProfileUpdateSerializer
- `backend/api/views.py` - Add role change + profile update endpoints, modify register
- `backend/api/permissions.py` - Add RoleChangePermission

### Implementation Details

**1. Update RegisterSerializer** (remove role field)
```python
# BEFORE: role = serializers.ChoiceField(choices=...)
# AFTER: no role field - always defaults to TENANT in create()
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    # ❌ Remove: role = serializers.ChoiceField(...)
    
    def create(self, validated_data):
        # Force role='TENANT' on backend
        user = User.objects.create_user(...)
        user.profile.role = 'TENANT'  # ✅ Always default
        user.profile.save()
        return user
```

**2. New RoleChangePermission** (validate admin-only)
```python
class RoleChangePermission(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.profile.role == 'ADMIN'

def validate_demotion(user_id):
    """Prevent last admin from being demoted"""
    user = User.objects.get(id=user_id)
    if user.profile.role == 'ADMIN':
        admin_count = UserProfile.objects.filter(role='ADMIN').count()
        if admin_count <= 1:
            raise ValidationError("Cannot demote last admin")
```

**3. New Endpoint: PATCH /api/users/{id}/role/**
```
Admin-only endpoint to promote/demote users
Headers: Authorization: Bearer <admin_token>
Body: { "role": "ADMIN" | "TENANT" }
Response: { "user": {...}, "message": "..." }
```

**4. New Endpoint: PATCH /api/users/me/profile/**
```
User profile update endpoint (TENANT can update own)
Body: {
  "first_name": "...",
  "last_name": "...",
  "phone": "...",
  "company_name": "...",
  "password": "..." (optional, requires old_password)
}
Response: { "user": {...} }
```

### Related Docs
- [Phase 1: Backend API Endpoints](./phase-01-backend-api-endpoints.md) - Detailed implementation steps

---

## Phase 2: Backend Security & Seed

### Overview
Create Django management command for initial admin + seed script for demo data.

**Status:** Pending  
**Duration:** 1 day  
**Files to Create/Modify:**
- `backend/api/management/commands/create_initial_admin.py` - NEW
- `backend/api/management/commands/seed_demo_zones.py` - NEW (or update existing)
- `.env.example` - Update with INITIAL_ADMIN_* variables
- `.env` - Add values for local dev

### Implementation Details

**1. Django Command: create_initial_admin.py**
```bash
python manage.py create_initial_admin
# Reads: INITIAL_ADMIN_USER, INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD from .env
# Creates superuser + UserProfile with ADMIN role
# Idempotent: checks if admin exists, skips if present
```

**2. Django Command: seed_demo_zones.py**
```bash
python manage.py seed_demo_zones
# Seed database with demo zones (runs only once)
# Checks if zones exist, skips if already present
```

**3. .env.example Update**
```
INITIAL_ADMIN_USER=admin
INITIAL_ADMIN_EMAIL=admin@example.com
INITIAL_ADMIN_PASSWORD=change-me-in-production
```

### Related Docs
- [Phase 2: Backend Security & Seed](./phase-02-backend-security-and-seed.md) - Detailed implementation

---

## Phase 3: Frontend UI Pages

### Overview
Create User Management page + Tenant Profile page. Update registration form.

**Status:** Pending  
**Duration:** 2 days  
**Files to Create/Modify:**
- `frontend/src/pages/UserManagementPage.js` - NEW (admin-only)
- `frontend/src/pages/ProfilePage.js` - NEW (user self-update)
- `frontend/src/pages/RegisterPage.js` - MODIFY (remove role selector)
- `frontend/src/components/Navbar.js` - UPDATE (add role badge, admin menu)
- `frontend/src/services/userService.js` - NEW (API helper functions)

### Page Structure

**A. RegisterPage** (remove role selector)
```jsx
// Remove role selector entirely
// Add static text: "New accounts created as Tenant. Contact admin for promotion."
```

**B. UserManagementPage** (/admin/users - admin-only)
```jsx
<DataGrid
  columns={[
    { field: 'username', ... },
    { field: 'email', ... },
    { field: 'role', renderCell: role dropdown (disabled for self) },
    { field: 'actions', renderCell: promote/demote buttons }
  ]}
/>
```
- Only visible to admins (PrivateRoute requireAdmin=true)
- Promote button only for TENANT rows
- Demote button only for ADMIN rows with admin_count > 1
- Optimistic updates + error handling
- Toast notifications

**C. ProfilePage** (/profile - all authenticated users)
```jsx
<TextField label="First Name" ... />
<TextField label="Last Name" ... />
<TextField label="Phone" ... />
<TextField label="Company Name" ... />
<Divider sx={{ my: 2 }} />
<Typography>Change Password</Typography>
<TextField label="Current Password" type="password" ... />
<TextField label="New Password" type="password" ... />
```

**D. Navbar Updates**
- Show role badge (ADMIN = blue, TENANT = gray)
- Add "Manage Users" link (visible to admins only)
- Logout functionality

### Related Docs
- [Phase 3: Frontend UI Pages](./phase-03-frontend-ui-pages.md) - Detailed implementation

---

## Phase 4: Testing & Validation

### Overview
Unit tests, integration tests, E2E workflows.

**Status:** Pending  
**Duration:** 1 day  
**Files to Create/Modify:**
- `backend/api/tests.py` - Update with role management tests
- `backend/api/test_admin_commands.py` - NEW (command tests)
- Frontend component tests (if time permits)

### Test Checklist

**Backend:**
- [ ] Registration always creates TENANT role
- [ ] Cannot demote last admin (validation)
- [ ] Role change endpoint requires admin auth
- [ ] Profile update only allows self-edit
- [ ] create_initial_admin is idempotent
- [ ] Seed script doesn't duplicate data

**Frontend:**
- [ ] Register page has NO role selector
- [ ] UserManagementPage loads all users (admin-only)
- [ ] Promote button creates toast + updates UI
- [ ] Demote button disabled if only 1 admin
- [ ] ProfilePage updates user fields
- [ ] Password change validates confirm + old password

**E2E:**
- [ ] Create admin via command → Login → Manage users → Promote tenant
- [ ] Register user → Default TENANT → Can update profile
- [ ] Last admin cannot be demoted (button disabled + error handling)

### Related Docs
- [Phase 4: Testing & Validation](./phase-04-testing-and-validation.md) - Detailed test specs

---

## Phase 5: Documentation

### Overview
Update deployment guide, troubleshooting, phase-02 auth docs.

**Status:** Pending  
**Duration:** 0.5 days  
**Files to Update:**
- `docs/deployment-guide.md` - Add env vars, commands, manual admin creation
- `docs/codebase-summary.md` - Update with new endpoints/pages
- `plans/260407-2253-industrial-zone-rental-mvp/phase-02-authentication-system.md` - Note redesign

### Documentation Checklist

- [ ] Deployment guide explains INITIAL_ADMIN_* env vars
- [ ] Sequence of commands: migrate → seed zones → create admin
- [ ] Troubleshooting: "How to recover if no admins exist"
- [ ] API reference updated (new endpoints documented)
- [ ] User workflow diagram (register → tenant → promote → admin)

### Related Docs
- [Phase 5: Documentation](./phase-05-documentation.md) - Detailed updates

---

## Risk Assessment & Mitigation

### Risk 1: Last Admin Gets Demoted ⚠️
**Severity:** HIGH | **Probability:** MEDIUM

**Mitigation:**
- ✅ Backend validation: prevent demotion of last admin (ValidationError)
- ✅ Frontend: disable demote button if admin_count === 1
- ✅ Confirmation dialog before demotion action
- ✅ Error message clearly explains why

### Risk 2: Admin Credentials Lost During Deploy ⚠️
**Severity:** HIGH | **Probability:** LOW

**Mitigation:**
- ✅ `.env.example` documents required vars clearly
- ✅ Deployment guide emphasizes: "Set INITIAL_ADMIN_* BEFORE running command"
- ✅ Command output: clear "Admin created with username: X"
- ✅ Recovery option: provide reset_admin_password.py command if lost

### Risk 3: Multiple Admins Via Race Condition 🟡
**Severity:** MEDIUM | **Probability:** LOW

**Mitigation:**
- ✅ Command is idempotent (checks if exists before creating)
- ✅ Database design: UserProfile.role field is always set
- ✅ Document: "Only run create_initial_admin once per environment"

### Risk 4: Email Verification Not Implemented ⚠️
**Severity:** LOW | **Probability:** HIGH

**Mitigation:**
- ✅ Out of scope for Phase 6 (MVP)
- ✅ Frontend note: "Email verification coming in future"
- ✅ Users can still update phone/company without verification

### Risk 5: Breaking Change to Phase 2 Registration 🟡
**Severity:** MEDIUM | **Probability:** MEDIUM

**Mitigation:**
- ✅ Clear migration guide: "Existing admins unaffected, future registrations default TENANT"
- ✅ Database: no schema changes needed (role column exists, just backend-controlled now)
- ✅ Update frontend RegisterPage with deprecation note

---

## Success Criteria

### Functional ✅
- [ ] Registration form has NO role selector
- [ ] All new users created with TENANT role
- [ ] Admin Dashboard has User Management page (/admin/users)
- [ ] Admin can promote TENANT → ADMIN via UI
- [ ] Admin cannot demote last admin (validation + UI guards)
- [ ] TENANT can update own profile (name, phone, password)
- [ ] Initial admin created via backend script (zero-trust)
- [ ] Demo zones loaded via safe seed script
- [ ] Existing Phase 1-5 functionality still works

### Non-Functional ✅
- [ ] All tests pass (unit + integration + E2E)
- [ ] Code coverage ≥80% for new code
- [ ] No breaking changes to existing APIs
- [ ] Deployment guide clear and complete
- [ ] Error messages helpful (not cryptic)

### Academic ✅
- [ ] Clean, readable Python + JavaScript code
- [ ] Follows Django/DRF + React best practices
- [ ] Proper separation of concerns (serializers, permissions, views)
- [ ] Security: no XSS, CSRF, injection vulnerabilities
- [ ] Performance: queries optimized (no N+1)

---

## Dependencies & Prerequisites

**Must Be Complete Before Starting:**
- Phase 1: Environment Setup ✅
- Phase 2: Authentication System ✅ (will be modified)
- Phase 3: Zone Management ✅
- Phase 4: Rental Requests ✅
- Phase 5: Contract Tracking ✅

**External Dependencies:**
- Django 5.x ✅
- Django REST Framework ✅
- djangorestframework-simplejwt ✅
- React ✅
- Material-UI ✅

---

## Implementation Timeline

```
Day 1-1.5:  Phase 1 - Backend API endpoints
            - Update RegisterSerializer
            - Add RoleChangePermission
            - Create role change endpoint
            - Create profile update endpoint

Day 2-2.5:  Phase 2 - Backend security & seed
            - Create create_initial_admin.py command
            - Create seed_demo_zones.py command
            - Update .env.example
            - Test commands locally

Day 3-4.5:  Phase 3 - Frontend UI pages
            - Update RegisterPage (remove role)
            - Create UserManagementPage
            - Create ProfilePage
            - Update Navbar
            - Create userService helpers

Day 5-5.5:  Phase 4 - Testing
            - Unit tests: role validation
            - Integration tests: register → role → profile
            - E2E tests: workflows
            - Fix any failures

Day 6:      Phase 5 - Documentation
            - Update deployment guide
            - Update codebase summary
            - Troubleshooting guide
            - Final review

Day 6.5-7:  Code review + polish
            - Request review from code-reviewer agent
            - Fix any issues
            - Final test run
```

---

## File Organization

```
backend/
├── api/
│   ├── management/
│   │   └── commands/
│   │       ├── create_initial_admin.py        [NEW]
│   │       └── seed_demo_zones.py             [MODIFIED]
│   ├── serializers.py                         [MODIFIED]
│   ├── views.py                               [MODIFIED]
│   ├── permissions.py                         [MODIFIED]
│   ├── tests.py                               [MODIFIED]
│   └── test_admin_commands.py                 [NEW]
├── .env.example                               [MODIFIED]
└── requirements.txt                           [CHECK]

frontend/
├── src/
│   ├── pages/
│   │   ├── RegisterPage.js                    [MODIFIED]
│   │   ├── UserManagementPage.js              [NEW]
│   │   └── ProfilePage.js                     [NEW]
│   ├── components/
│   │   └── Navbar.js                          [MODIFIED]
│   ├── services/
│   │   └── userService.js                     [NEW]
│   └── App.js                                 [MODIFIED]

docs/
├── deployment-guide.md                        [MODIFIED]
├── codebase-summary.md                        [MODIFIED]
└── project-roadmap.md                         [MODIFIED - mark Phase 6 as in-progress]
```

---

## Next Steps

1. **Review this plan** - Confirm scope, timeline, architecture decisions
2. **Start Phase 1** - Implement backend API endpoints
3. **Parallel work** - Researchers investigate latest Django/React patterns if needed
4. **Daily checkins** - Track progress, adjust timeline as needed
5. **Final review** - Code review + testing before merge

---

## Related Documents

- **Brainstorm Report:** `plans/reports/brainstormer-260409-1820-admin-role-system-redesign.md`
- **Phase 2 Auth:** `plans/260407-2253-industrial-zone-rental-mvp/phase-02-authentication-system.md`
- **Code Standards:** `docs/code-standards.md`
- **Development Rules:** `.claude/rules/development-rules.md`

---

## Unresolved Questions

None at this time - design is solid and ready for implementation.
