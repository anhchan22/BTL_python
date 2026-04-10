# Phase 6: Testing & Validation

**Status:** Pending (Blocked by Phase 1-5)
**Priority:** Critical
**Estimated Duration:** 1-2 days
**Dependencies:** Phase 1 ✓, Phase 2 ✓, Phase 3 ✓, Phase 4 ✓, Phase 5 ✓

---

## Context Links

- Main Plan: `../plan.md`
- Related: `backend/api/tests.py`
- Related: `backend/api/test_contracts.py`

---

## Overview

Phase 6 focuses on comprehensive testing of all new features:
1. **Unit Tests** - Model validation, serializers, signals
2. **Integration Tests** - API endpoints, viewsets, permissions
3. **End-to-End Tests** - Complete workflows

---

## Requirements

### Functional Testing
1. ZoneImage CRUD operations
2. 1-6 image constraint enforcement
3. Notification creation via signals
4. Notification mark-as-read functionality
5. Unread count calculation
6. Permission enforcement on all endpoints

### Non-Functional Testing
1. Query efficiency (no N+1 queries)
2. Bulk operation performance
3. Edge cases (empty results, invalid IDs)
4. Error messages clarity
5. HTTP status codes correctness

---

## Test Categories

### 1. Model Tests
- ZoneImage creation/validation
- Notification creation/filtering
- Signal triggers
- Permission checks

### 2. Serializer Tests
- ZoneImageSerializer validation
- NotificationSerializer output
- File type validation
- Image count validation

### 3. ViewSet Tests
- CRUD operations
- Custom actions
- Permission enforcement
- Pagination
- Filtering

### 4. Signal Tests
- Rental request created → Admin notification
- Request approved → Tenant notification
- Request rejected → Tenant notification
- Contract created → Tenant notification
- Duplicate prevention

### 5. Integration Tests
- Full workflow: Create request → Approve → Notify → View notification
- Role-based access control
- Image upload → Zone includes images in response
- Notification visibility isolation

---

## Implementation Steps

### Step 1: Create Test File Structure
1. Create `backend/api/tests/` directory:
   ```bash
   mkdir -p backend/api/tests
   touch backend/api/tests/__init__.py
   touch backend/api/tests/test_zone_images.py
   touch backend/api/tests/test_notifications.py
   touch backend/api/tests/test_signals.py
   touch backend/api/tests/test_integration.py
   ```

### Step 2: Model Tests
1. Create `test_zone_images.py`:
   ```python
   from django.test import TestCase
   from api.models import ZoneImage, IndustrialZone
   from django.core.exceptions import ValidationError
   
   class ZoneImageModelTest(TestCase):
       def setUp(self):
           self.zone = IndustrialZone.objects.create(
               name="Zone A",
               location="HCMC",
               total_area=10000,
               available_area=5000,
               price_per_sqm=50000,
               description="Test zone"
           )
       
       def test_zone_image_creation(self):
           image = ZoneImage.objects.create(
               zone=self.zone,
               position=1
           )
           self.assertEqual(image.zone_id, self.zone.id)
           self.assertEqual(image.position, 1)
       
       def test_zone_image_ordering(self):
           img1 = ZoneImage.objects.create(zone=self.zone, position=1)
           img2 = ZoneImage.objects.create(zone=self.zone, position=2)
           
           images = ZoneImage.objects.all()
           self.assertEqual(images[0].id, img1.id)
           self.assertEqual(images[1].id, img2.id)
   ```

### Step 3: Notification Tests
1. Create `test_notifications.py`:
   ```python
   from django.test import TestCase
   from django.contrib.auth.models import User
   from api.models import Notification
   
   class NotificationModelTest(TestCase):
       def setUp(self):
           self.tenant = User.objects.create_user('tenant', password='test')
           self.admin = User.objects.create_user('admin', password='test')
       
       def test_notification_creation(self):
           notif = Notification.objects.create(
               recipient=self.tenant,
               actor=self.admin,
               verb='approved',
               rental_request_id=1
           )
           self.assertEqual(notif.recipient_id, self.tenant.id)
           self.assertEqual(notif.verb, 'approved')
           self.assertFalse(notif.is_read)
       
       def test_mark_as_read(self):
           notif = Notification.objects.create(
               recipient=self.tenant,
               actor=self.admin,
               verb='approved',
               rental_request_id=1
           )
           notif.is_read = True
           notif.save()
           
           notif.refresh_from_db()
           self.assertTrue(notif.is_read)
   ```

### Step 4: Signal Tests
1. Create `test_signals.py`:
   ```python
   from django.test import TestCase
   from django.contrib.auth.models import User
   from api.models import RentalRequest, IndustrialZone, Notification
   
   class RentalRequestSignalTest(TestCase):
       def setUp(self):
           self.tenant = User.objects.create_user('tenant', password='test')
           self.admin = User.objects.create_user('admin', password='test')
           self.admin.profile.role = 'ADMIN'
           self.admin.profile.save()
           
           self.zone = IndustrialZone.objects.create(
               name="Zone A",
               location="HCMC",
               total_area=10000,
               available_area=5000,
               price_per_sqm=50000,
               description="Test"
           )
       
       def test_rental_request_created_notifies_admin(self):
           # Create rental request
           request = RentalRequest.objects.create(
               tenant=self.tenant,
               zone=self.zone,
               requested_area=100,
               rental_duration=12
           )
           
           # Check notification created
           notif = Notification.objects.filter(
               rental_request_id=request.id,
               verb='created'
           ).first()
           
           self.assertIsNotNone(notif)
           self.assertEqual(notif.recipient_id, self.admin.id)
           self.assertEqual(notif.actor_id, self.tenant.id)
       
       def test_rental_request_approval_notifies_tenant(self):
           request = RentalRequest.objects.create(
               tenant=self.tenant,
               zone=self.zone,
               requested_area=100,
               rental_duration=12,
               status='PENDING'
           )
           
           # Approve request
           request.status = 'APPROVED'
           request.save()
           
           # Check notification created
           notif = Notification.objects.filter(
               rental_request_id=request.id,
               verb='approved'
           ).first()
           
           self.assertIsNotNone(notif)
           self.assertEqual(notif.recipient_id, self.tenant.id)
   ```

### Step 5: ViewSet Tests
1. Create comprehensive API tests:
   ```python
   from django.test import TestCase
   from rest_framework.test import APIClient
   from rest_framework_simplejwt.tokens import RefreshToken
   from django.contrib.auth.models import User
   from api.models import Notification, IndustrialZone
   
   class NotificationViewSetTest(TestCase):
       def setUp(self):
           self.client = APIClient()
           self.tenant = User.objects.create_user('tenant', password='test')
           self.admin = User.objects.create_user('admin', password='test')
           
           # Create tokens
           self.tenant_token = str(RefreshToken.for_user(self.tenant).access_token)
           self.admin_token = str(RefreshToken.for_user(self.admin).access_token)
       
       def test_list_notifications_requires_auth(self):
           response = self.client.get('/api/notifications/')
           self.assertEqual(response.status_code, 401)
       
       def test_list_notifications_shows_only_user_notifications(self):
           # Create notifications for different users
           Notification.objects.create(
               recipient=self.tenant,
               actor=self.admin,
               verb='created',
               rental_request_id=1
           )
           Notification.objects.create(
               recipient=self.admin,
               actor=self.tenant,
               verb='created',
               rental_request_id=2
           )
           
           # List as tenant
           self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.tenant_token}')
           response = self.client.get('/api/notifications/')
           
           self.assertEqual(response.status_code, 200)
           self.assertEqual(len(response.data['results']), 1)
           self.assertEqual(response.data['results'][0]['rental_request_id'], 1)
       
       def test_unread_count_action(self):
           # Create notifications
           Notification.objects.create(
               recipient=self.tenant,
               actor=self.admin,
               verb='created',
               rental_request_id=1,
               is_read=False
           )
           Notification.objects.create(
               recipient=self.tenant,
               actor=self.admin,
               verb='created',
               rental_request_id=2,
               is_read=True
           )
           
           # Check count
           self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.tenant_token}')
           response = self.client.get('/api/notifications/unread-count/')
           
           self.assertEqual(response.status_code, 200)
           self.assertEqual(response.data['unread_count'], 1)
       
       def test_mark_as_read_action(self):
           notif1 = Notification.objects.create(
               recipient=self.tenant,
               actor=self.admin,
               verb='created',
               rental_request_id=1,
               is_read=False
           )
           notif2 = Notification.objects.create(
               recipient=self.tenant,
               actor=self.admin,
               verb='created',
               rental_request_id=2,
               is_read=False
           )
           
           # Mark as read
           self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.tenant_token}')
           response = self.client.post(
               '/api/notifications/mark-as-read/',
               {'notification_ids': [notif1.id, notif2.id]}
           )
           
           self.assertEqual(response.status_code, 200)
           self.assertEqual(response.data['updated_count'], 2)
           
           # Verify marked
           notif1.refresh_from_db()
           notif2.refresh_from_db()
           self.assertTrue(notif1.is_read)
           self.assertTrue(notif2.is_read)
   ```

### Step 6: Integration Tests
1. Create `test_integration.py`:
   ```python
   from django.test import TestCase
   from rest_framework.test import APIClient
   from rest_framework_simplejwt.tokens import RefreshToken
   from django.contrib.auth.models import User
   from api.models import RentalRequest, IndustrialZone, Notification
   
   class NotificationIntegrationTest(TestCase):
       def setUp(self):
           self.client = APIClient()
           self.tenant = User.objects.create_user('tenant', password='test')
           self.admin = User.objects.create_user('admin', password='test')
           self.admin.profile.role = 'ADMIN'
           self.admin.profile.save()
           
           self.zone = IndustrialZone.objects.create(
               name="Zone A",
               location="HCMC",
               total_area=10000,
               available_area=5000,
               price_per_sqm=50000,
               description="Test"
           )
       
       def test_full_workflow(self):
           """Test: Create request → Approve → Check notifications"""
           tenant_token = str(RefreshToken.for_user(self.tenant).access_token)
           admin_token = str(RefreshToken.for_user(self.admin).access_token)
           
           # 1. Tenant creates rental request
           self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {tenant_token}')
           response = self.client.post('/api/rentals/', {
               'zone': self.zone.id,
               'requested_area': 100,
               'rental_duration': 12
           })
           self.assertEqual(response.status_code, 201)
           rental_id = response.data['id']
           
           # 2. Check admin received notification
           admin_notifs = Notification.objects.filter(recipient=self.admin)
           self.assertEqual(admin_notifs.count(), 1)
           self.assertEqual(admin_notifs[0].verb, 'created')
           
           # 3. Admin approves request
           self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {admin_token}')
           response = self.client.patch(f'/api/rentals/{rental_id}/', {
               'status': 'APPROVED'
           })
           self.assertEqual(response.status_code, 200)
           
           # 4. Check tenant received notification
           tenant_notifs = Notification.objects.filter(recipient=self.tenant)
           self.assertEqual(tenant_notifs.count(), 1)
           self.assertEqual(tenant_notifs[0].verb, 'approved')
   ```

### Step 7: Performance Tests
1. Test query efficiency:
   ```python
   from django.test import TestCase
   from django.test.utils import override_settings
   from django.db import connection
   from django.test.utils import CaptureQueriesContext
   
   class PerformanceTest(TestCase):
       def test_notification_list_no_n_plus_one(self):
           # Create notifications
           for i in range(10):
               Notification.objects.create(...)
           
           # Capture queries
           with CaptureQueriesContext(connection) as context:
               list(Notification.objects.select_related(
                   'actor', 'recipient'
               ))
           
           # Should be < 3 queries (1 notifications + 1 actor + 1 recipient)
           self.assertLess(len(context), 3)
   ```

### Step 8: Run Tests
1. Execute test suite:
   ```bash
   cd backend
   python manage.py test api.tests
   ```

### Step 9: Coverage Report
1. Generate coverage:
   ```bash
   pip install coverage
   coverage run --source='api' manage.py test api.tests
   coverage report
   coverage html  # Generate HTML report
   ```

---

## Todo List

- [ ] Create tests/ directory structure
- [ ] Write ZoneImage model tests
- [ ] Write Notification model tests
- [ ] Write signal trigger tests
- [ ] Write ZoneImageViewSet tests
- [ ] Write NotificationViewSet tests
- [ ] Write permission enforcement tests
- [ ] Write integration tests (full workflow)
- [ ] Write performance/query efficiency tests
- [ ] Test error cases (invalid input, permissions)
- [ ] Test edge cases (empty results, duplicates)
- [ ] Generate coverage report
- [ ] Achieve 80%+ code coverage
- [ ] Document test execution
- [ ] Set up CI/CD test runner

---

## Success Criteria

### Test Coverage
- ✅ 80%+ code coverage for models, views, serializers
- ✅ All signal paths tested
- ✅ All API endpoints tested
- ✅ Permission enforcement tested

### Test Results
- ✅ All tests pass
- ✅ No N+1 queries detected
- ✅ Error messages are clear
- ✅ Edge cases handled

### Validation
- ✅ Constraints enforced (1-6 images)
- ✅ File validation working
- ✅ Signals create correct notifications
- ✅ Permissions prevent unauthorized access

---

## Test Execution Commands

```bash
# Run all tests
python manage.py test api.tests

# Run specific test class
python manage.py test api.tests.test_notifications.NotificationModelTest

# Run with verbose output
python manage.py test api.tests -v 2

# Run with coverage
coverage run --source='api' manage.py test api.tests
coverage report

# Run tests in parallel (if django-test-plus installed)
python manage.py test api.tests --parallel
```

---

## Next Steps

1. ✅ Read Phase 1-6 completely
2. → Implement all test files
3. → Run test suite and verify all pass
4. → Move to Phase 7 (Documentation & Cleanup)

---

## Notes

- Use TestCase not TransactionTestCase (slower)
- Use setUp for common test data
- Use descriptive test names (test_xxx_returns_yyy)
- Test both success and failure paths
- Mock external services if needed
- Use factories (factory_boy) for complex test data
