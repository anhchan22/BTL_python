---
phase: 6.4
title: Testing & Validation
duration: 1 day
priority: critical
status: pending
dependencies: [phase-01, phase-02, phase-03]
---

# Phase 6.4: Testing & Validation

**Goal:** Write and execute comprehensive tests across backend + frontend to validate admin role system redesign.

**Files to Create:**
- `backend/api/test_admin_commands.py` - Management command tests
- `backend/api/test_role_management.py` - Role change endpoint tests

**Files to Modify:**
- `backend/api/tests.py` - Add registration tests (verify TENANT default)

**Test Coverage:**
- Backend: API endpoints, permissions, commands, seed scripts
- Frontend: Components, user workflows, error handling
- Integration: Full workflows (register → login → manage → profile)
- E2E: User journeys

---

## Overview

Testing validates:
1. Registration always creates TENANT (not user-selectable)
2. Role change endpoint requires admin auth + validates ≥1 admin
3. Profile update allows self-edit only
4. Management commands are idempotent
5. Frontend components render + interact correctly
6. Error handling is clear and helpful

---

## Key Insights

- Use Django TestCase for database isolation
- Mock API calls in frontend tests (no real backend needed)
- Idempotency tests critical for commands
- Edge cases: last admin demotion, missing env vars
- Integration tests verify full workflows
- E2E tests validate user-visible behavior

---

## Requirements

### Backend Tests
- [ ] Registration always creates TENANT role
- [ ] Cannot demote last admin (ValidationError)
- [ ] Role change requires admin permission (403 if not admin)
- [ ] Role change updates user profile
- [ ] Profile update validates old password
- [ ] Profile update prevents cross-user edits
- [ ] create_initial_admin is idempotent
- [ ] create_initial_admin reads env vars correctly
- [ ] seed_demo_zones creates zones only once
- [ ] seed_demo_zones is idempotent
- [ ] All commands have proper error handling

### Frontend Tests
- [ ] RegisterPage removes role field
- [ ] UserManagementPage shows users (admin-only)
- [ ] Promote/demote buttons work
- [ ] Last admin demotion prevented (UI + error)
- [ ] ProfilePage allows self-edit
- [ ] Password validation works
- [ ] Toast notifications appear
- [ ] Error messages display

### Integration Tests
- [ ] Register → Login → Update profile workflow
- [ ] Register → Admin promotes user → User is admin
- [ ] Last admin cannot be demoted (full flow)
- [ ] Refresh page → User state persists

### E2E Tests
- [ ] User creates account → Gets TENANT role
- [ ] Admin logs in → Manages users → Changes roles
- [ ] User updates profile → Changes persist
- [ ] Password change workflow

---

## Architecture

### Test Structure

```
backend/
├── api/
│   ├── tests.py                    [EXISTING - add registration tests]
│   ├── test_admin_commands.py      [NEW]
│   └── test_role_management.py     [NEW]

frontend/
├── src/
│   ├── pages/__tests__/
│   │   ├── RegisterPage.test.js    [NEW - if time permits]
│   │   ├── UserManagementPage.test.js [NEW - if time permits]
│   │   └── ProfilePage.test.js     [NEW - if time permits]
│   └── services/__tests__/
│       └── userService.test.js     [NEW - if time permits]
```

---

## Implementation Steps

### Step 1: Backend Tests - Registration

Edit `backend/api/tests.py`:

```python
from django.test import TestCase, Client
from django.contrib.auth.models import User
from api.models import UserProfile
import json


class RegistrationTests(TestCase):
    """Test registration always creates TENANT role"""
    
    def setUp(self):
        self.client = Client()
        self.register_url = '/api/auth/register/'
    
    def test_register_user_gets_tenant_role(self):
        """New user should always get TENANT role (not self-selectable)"""
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'TestPass123!',
            'password_confirm': 'TestPass123!',
            'first_name': 'John',
            'last_name': 'Doe',
            'phone': '0123456789',
            'company_name': 'Test Corp'
        }
        
        response = self.client.post(
            self.register_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        
        # Verify user created
        user = User.objects.get(username='testuser')
        self.assertIsNotNone(user)
        
        # Verify role is TENANT (not user-selectable)
        self.assertEqual(user.profile.role, 'TENANT')
        
        # Verify response includes TENANT role
        response_data = response.json()
        self.assertEqual(response_data['user']['profile']['role'], 'TENANT')
    
    def test_register_ignores_role_field_if_provided(self):
        """Registration should ignore role field if malicious user tries to set it"""
        data = {
            'username': 'baduser',
            'email': 'bad@example.com',
            'password': 'TestPass123!',
            'password_confirm': 'TestPass123!',
            'role': 'ADMIN'  # ❌ Try to self-promote
        }
        
        response = self.client.post(
            self.register_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Should still create user despite role field
        user = User.objects.get(username='baduser')
        self.assertEqual(user.profile.role, 'TENANT')  # ✅ Still TENANT
    
    def test_register_requires_password_confirm(self):
        """Registration should validate password confirmation"""
        data = {
            'username': 'testuser2',
            'email': 'test2@example.com',
            'password': 'TestPass123!',
            'password_confirm': 'DifferentPass!'
        }
        
        response = self.client.post(
            self.register_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('password', response.json())
```

---

### Step 2: Backend Tests - Role Management

Create `backend/api/test_role_management.py`:

```python
from django.test import TestCase, Client
from django.contrib.auth.models import User
from api.models import UserProfile
import json


class RoleManagementTests(TestCase):
    """Test role change endpoint with validation"""
    
    def setUp(self):
        self.client = Client()
        
        # Create admin user
        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123'
        )
        self.admin.profile.role = 'ADMIN'
        self.admin.profile.save()
        
        # Create tenant user
        self.tenant = User.objects.create_user(
            username='tenant',
            email='tenant@example.com',
            password='tenantpass123'
        )
        self.tenant.profile.role = 'TENANT'
        self.tenant.profile.save()
        
        # Admin login
        self.admin_token = self._get_token(self.admin)
        self.tenant_token = self._get_token(self.tenant)
    
    def _get_token(self, user):
        """Get JWT token for user"""
        response = self.client.post(
            '/api/auth/login/',
            data=json.dumps({
                'username': user.username,
                'password': user.username + 'pass123'
            }),
            content_type='application/json'
        )
        return response.json()['tokens']['access']
    
    def test_promote_tenant_to_admin(self):
        """Admin can promote TENANT to ADMIN"""
        response = self.client.patch(
            f'/api/users/{self.tenant.id}/role/',
            data=json.dumps({'role': 'ADMIN'}),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.admin_token}'
        )
        
        self.assertEqual(response.status_code, 200)
        
        # Verify role changed
        self.tenant.refresh_from_db()
        self.assertEqual(self.tenant.profile.role, 'ADMIN')
    
    def test_demote_admin_to_tenant(self):
        """Admin can demote ADMIN to TENANT (if not last)"""
        # Create second admin
        admin2 = User.objects.create_user(
            username='admin2',
            email='admin2@example.com',
            password='admin2pass123'
        )
        admin2.profile.role = 'ADMIN'
        admin2.profile.save()
        
        response = self.client.patch(
            f'/api/users/{admin2.id}/role/',
            data=json.dumps({'role': 'TENANT'}),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.admin_token}'
        )
        
        self.assertEqual(response.status_code, 200)
        
        # Verify role changed
        admin2.refresh_from_db()
        self.assertEqual(admin2.profile.role, 'TENANT')
    
    def test_cannot_demote_last_admin(self):
        """Cannot demote the only admin"""
        # Ensure only one admin exists
        UserProfile.objects.filter(role='ADMIN').exclude(user=self.admin).update(role='TENANT')
        
        response = self.client.patch(
            f'/api/users/{self.admin.id}/role/',
            data=json.dumps({'role': 'TENANT'}),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.admin_token}'
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
        
        # Verify role unchanged
        self.admin.refresh_from_db()
        self.assertEqual(self.admin.profile.role, 'ADMIN')
    
    def test_tenant_cannot_change_roles(self):
        """Non-admin gets 403 when trying to change roles"""
        response = self.client.patch(
            f'/api/users/{self.admin.id}/role/',
            data=json.dumps({'role': 'TENANT'}),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.tenant_token}'
        )
        
        self.assertEqual(response.status_code, 403)
    
    def test_unauthenticated_cannot_change_roles(self):
        """Unauthenticated user gets 401"""
        response = self.client.patch(
            f'/api/users/{self.tenant.id}/role/',
            data=json.dumps({'role': 'ADMIN'}),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 401)


class ProfileUpdateTests(TestCase):
    """Test profile update endpoint"""
    
    def setUp(self):
        self.client = Client()
        
        # Create user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.user.first_name = 'John'
        self.user.last_name = 'Doe'
        self.user.save()
        
        # Get token
        response = self.client.post(
            '/api/auth/login/',
            data=json.dumps({
                'username': 'testuser',
                'password': 'testpass123'
            }),
            content_type='application/json'
        )
        self.token = response.json()['tokens']['access']
    
    def test_update_own_profile(self):
        """User can update own profile"""
        response = self.client.patch(
            '/api/users/me/profile/',
            data=json.dumps({
                'first_name': 'Jane',
                'phone': '0987654321',
                'company_name': 'New Corp'
            }),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.token}'
        )
        
        self.assertEqual(response.status_code, 200)
        
        # Verify changes
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Jane')
        self.assertEqual(self.user.profile.phone, '0987654321')
        self.assertEqual(self.user.profile.company_name, 'New Corp')
    
    def test_change_password_requires_old_password(self):
        """Password change requires old password"""
        response = self.client.patch(
            '/api/users/me/profile/',
            data=json.dumps({
                'password': 'newpass456',
                'password_confirm': 'newpass456'
            }),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.token}'
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('old_password', response.json())
    
    def test_change_password_validates_confirmation(self):
        """Password change validates confirmation"""
        response = self.client.patch(
            '/api/users/me/profile/',
            data=json.dumps({
                'old_password': 'testpass123',
                'password': 'newpass456',
                'password_confirm': 'differentpass'
            }),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.token}'
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('password', response.json())
    
    def test_change_password_validates_old_password(self):
        """Password change validates old password is correct"""
        response = self.client.patch(
            '/api/users/me/profile/',
            data=json.dumps({
                'old_password': 'wrongpassword',
                'password': 'newpass456',
                'password_confirm': 'newpass456'
            }),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.token}'
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('old_password', response.json())
    
    def test_change_password_success(self):
        """User can successfully change password"""
        response = self.client.patch(
            '/api/users/me/profile/',
            data=json.dumps({
                'old_password': 'testpass123',
                'password': 'newpass456',
                'password_confirm': 'newpass456'
            }),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.token}'
        )
        
        self.assertEqual(response.status_code, 200)
        
        # Verify can login with new password
        response = self.client.post(
            '/api/auth/login/',
            data=json.dumps({
                'username': 'testuser',
                'password': 'newpass456'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
```

---

### Step 3: Backend Tests - Management Commands

Create `backend/api/test_admin_commands.py`:

```python
from django.test import TestCase
from django.core.management import call_command
from django.contrib.auth.models import User
from api.models import IndustrialZone, UserProfile
from io import StringIO
import os


class CreateInitialAdminCommandTests(TestCase):
    """Test create_initial_admin management command"""
    
    def setUp(self):
        """Set test env vars"""
        os.environ['INITIAL_ADMIN_USER'] = 'testadmin'
        os.environ['INITIAL_ADMIN_EMAIL'] = 'admin@test.com'
        os.environ['INITIAL_ADMIN_PASSWORD'] = 'adminpass123'
    
    def tearDown(self):
        """Clean env vars"""
        for key in ['INITIAL_ADMIN_USER', 'INITIAL_ADMIN_EMAIL', 'INITIAL_ADMIN_PASSWORD']:
            if key in os.environ:
                del os.environ[key]
    
    def test_create_initial_admin_success(self):
        """Command successfully creates admin"""
        out = StringIO()
        call_command('create_initial_admin', stdout=out)
        
        # Verify admin created
        admin = User.objects.get(username='testadmin')
        self.assertEqual(admin.email, 'admin@test.com')
        self.assertTrue(admin.is_superuser)
        
        # Verify profile role is ADMIN
        self.assertEqual(admin.profile.role, 'ADMIN')
        
        # Verify output
        output = out.getvalue()
        self.assertIn('✅', output)
        self.assertIn('Admin user created', output)
    
    def test_create_initial_admin_idempotent(self):
        """Command is idempotent (doesn't duplicate)"""
        # First run
        call_command('create_initial_admin')
        admin_count = User.objects.filter(username='testadmin').count()
        self.assertEqual(admin_count, 1)
        
        # Second run
        out = StringIO()
        call_command('create_initial_admin', stdout=out)
        admin_count = User.objects.filter(username='testadmin').count()
        self.assertEqual(admin_count, 1)  # Still 1, not 2
        
        # Verify output
        output = out.getvalue()
        self.assertIn('already exists', output)
    
    def test_create_initial_admin_missing_env_vars(self):
        """Command handles missing env vars gracefully"""
        del os.environ['INITIAL_ADMIN_PASSWORD']
        
        out = StringIO()
        call_command('create_initial_admin', stdout=out)
        
        # Should not create user
        self.assertFalse(User.objects.filter(username='testadmin').exists())
        
        # Verify error message
        output = out.getvalue()
        self.assertIn('❌', output)
        self.assertIn('Missing required environment variables', output)


class SeedDemoZonesCommandTests(TestCase):
    """Test seed_demo_zones management command"""
    
    def test_seed_demo_zones_success(self):
        """Command successfully creates demo zones"""
        self.assertEqual(IndustrialZone.objects.count(), 0)
        
        out = StringIO()
        call_command('seed_demo_zones', stdout=out)
        
        # Verify zones created
        self.assertEqual(IndustrialZone.objects.count(), 5)
        
        # Verify zone details
        zone = IndustrialZone.objects.first()
        self.assertIsNotNone(zone.name)
        self.assertIsNotNone(zone.location)
        self.assertGreater(zone.total_area, 0)
        self.assertGreater(zone.price_per_sqm, 0)
        
        # Verify output
        output = out.getvalue()
        self.assertIn('✅', output)
        self.assertIn('5 zones', output)
    
    def test_seed_demo_zones_idempotent(self):
        """Command is idempotent (doesn't duplicate)"""
        # First run
        call_command('seed_demo_zones')
        zone_count = IndustrialZone.objects.count()
        self.assertEqual(zone_count, 5)
        
        # Second run
        out = StringIO()
        call_command('seed_demo_zones', stdout=out)
        zone_count = IndustrialZone.objects.count()
        self.assertEqual(zone_count, 5)  # Still 5, not 10
        
        # Verify output
        output = out.getvalue()
        self.assertIn('already contains', output)
```

---

### Step 4: Run Backend Tests

```bash
cd backend

# Run all tests
python manage.py test api

# Run specific test class
python manage.py test api.test_role_management.RoleManagementTests

# Run specific test method
python manage.py test api.test_role_management.RoleManagementTests.test_promote_tenant_to_admin

# Run with verbose output
python manage.py test api --verbosity=2

# Check test coverage (if coverage installed)
pip install coverage
coverage run --source='.' manage.py test api
coverage report
```

---

### Step 5: Frontend Tests (if time permits)

Create `frontend/src/pages/__tests__/RegisterPage.test.js`:

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import RegisterPage from '../RegisterPage';

describe('RegisterPage', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  test('removes role selector from form', () => {
    renderComponent();
    
    // ❌ Role selector should NOT exist
    const roleSelect = screen.queryByLabelText(/role/i);
    expect(roleSelect).not.toBeInTheDocument();
  });

  test('displays info about TENANT default', () => {
    renderComponent();
    
    // ✅ Should show info about TENANT default
    const infoText = screen.getByText(/tenant/i);
    expect(infoText).toBeInTheDocument();
  });

  test('has all required fields', () => {
    renderComponent();
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
  });
});
```

---

## Testing Checklist

### Backend Tests
- [ ] `test_register_user_gets_tenant_role` - PASS
- [ ] `test_register_ignores_role_field_if_provided` - PASS
- [ ] `test_register_requires_password_confirm` - PASS
- [ ] `test_promote_tenant_to_admin` - PASS
- [ ] `test_demote_admin_to_tenant` - PASS
- [ ] `test_cannot_demote_last_admin` - PASS
- [ ] `test_tenant_cannot_change_roles` - PASS
- [ ] `test_unauthenticated_cannot_change_roles` - PASS
- [ ] `test_update_own_profile` - PASS
- [ ] `test_change_password_requires_old_password` - PASS
- [ ] `test_change_password_validates_confirmation` - PASS
- [ ] `test_change_password_validates_old_password` - PASS
- [ ] `test_change_password_success` - PASS
- [ ] `test_create_initial_admin_success` - PASS
- [ ] `test_create_initial_admin_idempotent` - PASS
- [ ] `test_create_initial_admin_missing_env_vars` - PASS
- [ ] `test_seed_demo_zones_success` - PASS
- [ ] `test_seed_demo_zones_idempotent` - PASS

### Frontend Tests (if time)
- [ ] RegisterPage has no role selector
- [ ] RegisterPage shows TENANT info
- [ ] UserManagementPage renders (admin-only guard)
- [ ] ProfilePage allows profile updates
- [ ] Navbar shows role badge

### Integration Tests
- [ ] Register → Login → Update profile → Success
- [ ] Admin logs in → Promote user → User is admin
- [ ] Last admin cannot be demoted → Error message
- [ ] Refresh page → User state persists

### Manual E2E Tests
- [ ] User registers → Gets TENANT role
- [ ] Admin manages users → Changes roles
- [ ] User updates profile → Changes persist
- [ ] Seed commands work → No duplicates

---

## Test Execution Order

```
1. Backend unit tests (serializers, permissions)
2. Backend integration tests (endpoints)
3. Backend command tests (idempotency)
4. Frontend component tests (if time)
5. Manual E2E tests (full workflows)
```

---

## Success Criteria

- [ ] All backend tests pass (18+ tests)
- [ ] All frontend tests pass (5+ tests, if time)
- [ ] Code coverage ≥80% for new code
- [ ] No failing tests before proceeding
- [ ] Integration tests validate full workflows
- [ ] E2E tests confirm user-visible behavior
- [ ] All edge cases tested (last admin, missing env, etc.)

---

## Related Files

- `backend/api/tests.py` - Registration tests
- `backend/api/test_role_management.py` - Role + profile tests
- `backend/api/test_admin_commands.py` - Command tests
- `frontend/src/pages/__tests__/RegisterPage.test.js` - RegisterPage tests

---

## Next Phase

Once all tests pass:
- **Proceed to:** [Phase 6.5: Documentation](./phase-05-documentation.md)
- Update deployment guide with env vars and commands
- Document troubleshooting and recovery procedures
