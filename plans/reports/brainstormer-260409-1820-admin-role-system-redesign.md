# Brainstorm Report: Admin Role System Redesign
**Date:** 2026-04-09, 18:20  
**Project:** Industrial Zone Rental Management System - MVP  
**Scope:** Implement admin-only system with single super admin and improved role management

---

## Problem Statement

Current system allows users to select their own role (ADMIN/TENANT) during registration, which creates security risks and unclear authorization hierarchy. Required changes:

1. **Single Admin Control:** Only 1 super admin exists; all other users default to TENANT
2. **Explicit Role Escalation:** Admin promotes TENANT → ADMIN via Admin Dashboard UI (not self-service)
3. **Tenant-Only Features:** TENANT limited to viewing/renting zones + managing own requests & contracts
4. **Zero-Touch Admin Creation:** Admin account created via backend script (never exposed to frontend)

---

## Current State Analysis

### Existing Implementation
```
✅ Phase 1-5 Complete: Auth, Zone CRUD, Rental Requests, Contracts
✅ UserProfile model with ROLE_CHOICES (ADMIN/TENANT)
✅ JWT auth with protected endpoints
✅ Role-based permission classes (IsAdmin, IsTenant, IsOwnerOrAdmin)
✅ Frontend with AuthContext managing user state
❌ Registration allows role selection (security issue)
❌ No User Management page for role escalation
❌ No admin-first seed logic
```

### Security Gaps
- **Frontend allows role selection:** Registration form has role dropdown → users can self-promote
- **No safeguards:** Multiple admins possible if exploit exists
- **No audit trail:** No tracking of who promoted whom or when

---

## Recommended Solution

### 1. Backend Changes

#### A. Seed Admin Script (`backend/api/management/commands/create_initial_admin.py`)

```python
# Create via Django management command pattern
python manage.py create_initial_admin
# Reads: INITIAL_ADMIN_USER, INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD from .env
# Creates superuser + UserProfile with ADMIN role
# Idempotent: checks if admin exists, skips if present
# Output: "Admin created" or "Admin already exists"
```

**Rationale:**
- ✅ Environment-driven (CI/CD friendly for automation)
- ✅ Never exposed to frontend API
- ✅ Idempotent (safe for repeated runs)
- ✅ Can be called before/after migrations
- ✅ Clear deployment documentation

#### B. Registration Endpoint (`/api/auth/register/`)

**Before:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "...",
  "role": "TENANT"  // ❌ User selects role
}
```

**After:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "..."
  // ❌ No role field - always defaults to TENANT in backend
}
```

**Implementation:**
- Remove `role` field from `RegisterSerializer`
- Force `role = 'TENANT'` when creating UserProfile in `create()` method
- Response: `{ "user": {...}, "tokens": {...} }` (no role selection UI path)

#### C. Role Management Endpoint (NEW)

```
PATCH /api/users/{user_id}/role/
Headers: Authorization: Bearer <admin_token>
Body: { "role": "ADMIN" | "TENANT" }

Rules:
- ✅ Only admins can call this
- ✅ Cannot demote if only 1 admin remains (validation error)
- ✅ Auto-audit: logs who changed what role when
- ✅ Response includes validation message
```

**Edge Case Handling:**
```python
class RoleChangePermission(BasePermission):
    def has_permission(self, request, view):
        return request.user.profile.role == 'ADMIN'
    
    def validate_demotion(user_being_demoted, requesting_admin):
        """Prevent last admin from being demoted"""
        if user_being_demoted.profile.role == 'ADMIN':
            admin_count = UserProfile.objects.filter(role='ADMIN').count()
            if admin_count <= 1:
                raise ValidationError("Cannot demote last admin")
```

#### D. Tenant Profile Update Endpoint (NEW/IMPROVED)

```
PATCH /api/users/me/profile/
Body: {
  "first_name": "John",
  "last_name": "Doe",
  "phone": "0123456789",
  "company_name": "ABC Corp",
  "password": "newpassword"  // optional, requires old_password validation
}

Rules:
- ✅ TENANT can update own profile only
- ✅ Email update: requires verification (send OTP link via email)
- ✅ Password update: requires old_password + new_password_confirm
- ✅ Cannot change role via this endpoint
```

### 2. Frontend Changes

#### A. Register Page (`/register`)

**Before:**
```jsx
<FormControl>
  <InputLabel>Role</InputLabel>
  <Select name="role" value={formData.role}>
    <MenuItem value="TENANT">Tenant</MenuItem>
    <MenuItem value="ADMIN">Administrator</MenuItem>
  </Select>
</FormControl>
```

**After:**
```jsx
// ❌ Remove role selector entirely
// Add static text instead:
<Typography variant="body2" color="text.secondary">
  New accounts are created as Tenant. Contact admin to become Administrator.
</Typography>
```

**Updated Flow:**
```
User Register → Default TENANT → Success → Login → Dashboard
```

#### B. User Management Page (NEW) - `/admin/users`

**Admin Dashboard → Manage Users**

```jsx
<DataGrid
  columns={[
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 100,
      renderCell: (params) => (
        <Select value={params.row.profile.role}>
          <MenuItem value="TENANT">Tenant</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </Select>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <>
          {params.row.profile.role === 'TENANT' && (
            <Button onClick={() => promoteToAdmin(params.row.id)}>
              Promote
            </Button>
          )}
          {params.row.profile.role === 'ADMIN' && adminCount > 1 && (
            <Button onClick={() => demoteToTenant(params.row.id)}>
              Demote
            </Button>
          )}
        </>
      )
    }
  ]}
  rows={users}
/>
```

**Logic:**
- ✅ Only visible to admins (PrivateRoute requireAdmin=true)
- ✅ "Promote" button only for TENANT rows
- ✅ "Demote" button only for ADMIN rows AND if admin_count > 1
- ✅ Optimistic updates with error handling
- ✅ Toast notifications for success/failure

#### C. Tenant Profile Page (NEW) - `/profile`

```jsx
<Paper>
  <TextField label="First Name" value={user.first_name} onChange={...} />
  <TextField label="Last Name" value={user.last_name} onChange={...} />
  <TextField label="Phone" value={user.profile.phone} onChange={...} />
  <TextField label="Company Name" value={user.profile.company_name} onChange={...} />
  <Divider sx={{ my: 2 }} />
  <Typography variant="h6">Change Password</Typography>
  <TextField label="Current Password" type="password" onChange={...} />
  <TextField label="New Password" type="password" onChange={...} />
  <TextField label="Confirm Password" type="password" onChange={...} />
  <Button onClick={handleSaveProfile}>Save Changes</Button>
</Paper>
```

#### D. Update Navbar/Dashboard

```jsx
// Show role badge in navbar
<Chip label={user.profile.role} color={user.profile.role === 'ADMIN' ? 'primary' : 'default'} />

// Admin Dashboard shows User Management link
{isAdmin() && (
  <ListItem component={Link} to="/admin/users">
    <ListItemIcon><PeopleIcon /></ListItemIcon>
    <ListItemText>Manage Users</ListItemText>
  </ListItem>
)}
```

### 3. Database & Migrations

#### New Migration (Phase 06+)

```python
# backend/api/migrations/000X_remove_role_from_registration.py

def remove_role_field(apps, schema_editor):
    # Already removed from serializer, no DB changes needed
    # UserProfile.role exists but not user-selectable during registration
    pass

# No schema changes needed - role column exists, we just control it server-side
```

### 4. Seed Data Script

#### `backend/api/management/commands/seed_demo_zones.py`

```python
from django.core.management.base import BaseCommand
from api.models import IndustrialZone

class Command(BaseCommand):
    help = 'Seed database with demo zones (runs only once)'
    
    def handle(self, *args, **options):
        if IndustrialZone.objects.exists():
            self.stdout.write("⏭️  Zones already exist, skipping seed")
            return
        
        zones = [
            IndustrialZone(
                name="Khu công nghiệp A",
                location="TP. HCM - Bình Dương",
                total_area=5000.00,
                available_area=5000.00,
                price_per_sqm=50000.00,
                description="...",
                is_available=True
            ),
            # ... more zones
        ]
        
        IndustrialZone.objects.bulk_create(zones)
        self.stdout.write("✅ Demo zones created successfully")
```

**Rationale:**
- ✅ Safe idempotent: checks if data exists first
- ✅ One-time seed: doesn't nuke data on every migration
- ✅ Manual trigger: developer runs `python manage.py seed_demo_zones`
- ✅ Clear intent: name clearly says "demo"

---

## Architecture Decisions Summary

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Admin Creation** | Env-var script + Django command | CI/CD automation + security |
| **Role Selection** | Removed from registration | Prevents self-promotion |
| **Role Management** | New PATCH endpoint + React page | Admin controls explicit escalation |
| **Admin Count Guard** | Validate ≥1 admin always | Prevents lock-out |
| **Tenant Profile** | Update-able (name, phone, password) | User autonomy within bounds |
| **Seed Data** | Safe idempotent script | Prevents data loss on migrations |

---

## Implementation Checklist

### Backend Changes
- [ ] Remove `role` field from `RegisterSerializer`
- [ ] Update `register()` view to default role='TENANT'
- [ ] Create `create_initial_admin.py` Django command
- [ ] Create `seed_demo_zones.py` Django command
- [ ] Add PATCH `/api/users/{id}/role/` endpoint (admin-only)
- [ ] Add PATCH `/api/users/me/profile/` endpoint (user profile update)
- [ ] Add validation: prevent last admin demotion
- [ ] Update `UserSerializer` to include profile in response
- [ ] Add to `requirements.txt`: python-decouple (for env var reading)
- [ ] Create `.env.example` with INITIAL_ADMIN_* vars
- [ ] Write unit tests for role change validation

### Frontend Changes
- [ ] Remove role selector from RegisterPage
- [ ] Add `UserManagementPage.js` (admin-only)
- [ ] Add `ProfilePage.js` (tenant self-update)
- [ ] Add route `/admin/users` → UserManagementPage (requireAdmin)
- [ ] Add route `/profile` → ProfilePage (requireAuth)
- [ ] Update Navbar to show role badge + User Management link
- [ ] Create `userService.js` with update profile & role change APIs
- [ ] Add error handling for "last admin" error
- [ ] Add password confirmation validation
- [ ] Add email verification flow (optional, for future)

### Documentation
- [ ] Update deployment guide: explain env vars + commands
- [ ] Document role management workflow
- [ ] Update phase-02-authentication.md with new flow
- [ ] Add troubleshooting: "How to recover if no admins exist"

### Testing
- [ ] Unit tests: role validation logic
- [ ] Integration tests: register → always TENANT
- [ ] Integration tests: role change with guard validation
- [ ] E2E tests: admin promote/demote workflow
- [ ] Security tests: non-admin cannot call role endpoint

---

## Risk Assessment

### Risk 1: Last Admin Gets Demoted Accidentally ⚠️
**Severity:** HIGH | **Probability:** MEDIUM

**Mitigation:**
- ✅ Backend validation prevents demotion of last admin
- ✅ Frontend disables demote button if admin_count === 1
- ✅ Error message: "Cannot demote last administrator"
- ✅ Confirmation dialog before demotion

### Risk 2: Admin Credentials Lost During Initial Deploy ⚠️
**Severity:** HIGH | **Probability:** LOW

**Mitigation:**
- ✅ `.env.example` documents required vars clearly
- ✅ Deployment docs emphasize: "Set these env vars BEFORE running create_initial_admin"
- ✅ Script output: clear "Admin created with username: X"
- ✅ Recovery: provide `reset_admin_password.py` command if lost

### Risk 3: Multiple Admins Created via Race Condition 🟡
**Severity:** MEDIUM | **Probability:** LOW

**Mitigation:**
- ✅ `create_initial_admin` command is idempotent (checks if exists)
- ✅ Database constraint: at deployment, only run once
- ✅ If needed later, demote via UserManagementPage (explicit)

### Risk 4: Email Verification Not Implemented ⚠️
**Severity:** LOW | **Probability:** HIGH

**Mitigation:**
- ✅ Out of scope for MVP (Phase 06+)
- ✅ Frontend note: "Email verification coming soon"
- ✅ User can still update phone/company without verification

---

## Success Metrics

✅ Registration form has NO role selector  
✅ All new users created with TENANT role  
✅ Admin Dashboard has User Management page  
✅ Admin can promote TENANT → ADMIN via UI  
✅ Admin cannot demote last admin (validation prevents)  
✅ TENANT can update own profile (name, phone, password)  
✅ Initial admin created via backend script (zero-trust)  
✅ Demo zones loaded via safe seed script  
✅ All new tests pass (coverage ≥80%)  

---

## Next Steps

1. **Approval:** Confirm this design aligns with your vision
2. **Planning:** Create detailed Phase 06 implementation plan
3. **Implementation:** Backend → Frontend → Tests → Review
4. **Deployment:** Add `.env.example` + deployment docs

---

## Open Questions

None at this point - all requirements and decisions clarified via discussion above.

---

## Glossary

- **Idempotent:** Can run multiple times safely without duplication
- **Safe Seed:** Only creates data if doesn't exist (one-time)
- **Fresh Seed:** Recreates data every time (risky for production)
- **Guard/Validation:** Backend rule that prevents invalid state (e.g., 0 admins)
