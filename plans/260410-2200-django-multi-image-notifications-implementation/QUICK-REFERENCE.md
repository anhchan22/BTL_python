# Quick Reference Card - Keep This Handy!

## 🚀 Phase Checklist - Print This!

### Phase 1: Models & Migrations (1-2 days)
- [ ] Add ZoneImage & Notification models to `api/models.py`
- [ ] Add model validation (constraints, validators)
- [ ] Register models in `api/admin.py`
- [ ] Run `python manage.py makemigrations`
- [ ] Review migration file in `/migrations/`
- [ ] Run `python manage.py migrate`
- [ ] Test models via Django shell
- [ ] **Status:** Complete ✅

### Phase 2: Serializers (1-1.5 days)
- [ ] Add ZoneImageSerializer to `api/serializers.py`
- [ ] Add ZoneImageUploadSerializer (image count validation)
- [ ] Add NotificationSerializer (full detail)
- [ ] Add NotificationListSerializer (lightweight)
- [ ] Update IndustrialZoneSerializer (add images array)
- [ ] Add file type/size validation
- [ ] Test serialization in Django shell
- [ ] **Status:** Complete ✅

### Phase 3: Views & ViewSets (1-1.5 days)
- [ ] Create ZoneImageViewSet in `api/views.py`
- [ ] Create NotificationViewSet in `api/views.py`
- [ ] Implement `unread_count` custom action
- [ ] Implement `mark_as_read` custom action
- [ ] Add permission classes (IsAdmin, IsAuthenticated)
- [ ] Add select_related for query optimization
- [ ] Test all endpoints via Postman/curl
- [ ] **Status:** Complete ✅

### Phase 4: Signals (1 day)
- [ ] Create `api/signals.py` module
- [ ] Implement RentalRequest pre_save (cache old status)
- [ ] Implement RentalRequest post_save (create notifications)
- [ ] Implement Contract post_save (create notification)
- [ ] Register signals in `api/apps.py` ready() method
- [ ] Add error handling & logging
- [ ] Test signals with Django shell
- [ ] **Status:** Complete ✅

### Phase 5: URL Routing (0.5 days)
- [ ] Register NotificationViewSet in router
- [ ] Set up nested routes for ZoneImageViewSet
- [ ] Configure media file serving in urls.py
- [ ] Test all routes with curl
- [ ] Verify zone images nested URLs work
- [ ] **Status:** Complete ✅

### Phase 6: Testing (1-2 days)
- [ ] Create `api/tests/` directory & __init__.py
- [ ] Write model tests (ZoneImage, Notification)
- [ ] Write serializer tests
- [ ] Write viewset tests
- [ ] Write signal tests
- [ ] Write integration tests
- [ ] Run `python manage.py test api.tests`
- [ ] Generate coverage report
- [ ] Verify 80%+ coverage
- [ ] **Status:** Complete ✅

### Phase 7: Documentation (0.5 days)
- [ ] Add API documentation
- [ ] Add model docstrings
- [ ] Add viewset docstrings
- [ ] Create troubleshooting guide
- [ ] Create setup guide
- [ ] Update main README.md
- [ ] Code cleanup & linting
- [ ] **Status:** Complete ✅

---

## 🔥 Critical Commands

### Django Management
```bash
# Create/apply migrations
python manage.py makemigrations
python manage.py migrate

# Reverse migration (if needed)
python manage.py migrate api 0004_contract

# Run tests
python manage.py test api.tests
python manage.py test api.tests -v 2  # Verbose

# Generate coverage
coverage run --source='api' manage.py test api.tests
coverage report

# Django shell
python manage.py shell

# Start dev server
python manage.py runserver
```

### Git Commands
```bash
# Check status
git status

# Create branch
git checkout -b feature/multi-image-notifications

# Commit
git add .
git commit -m "feat: Add zone images and notifications"

# Push
git push origin feature/multi-image-notifications
```

---

## 🎯 Success Criteria - Verify These

### Models Phase
```python
# Test in Django shell
from api.models import ZoneImage, Notification, IndustrialZone

# Create test zone
zone = IndustrialZone.objects.first()

# Create zone image
img = ZoneImage.objects.create(zone=zone, position=1)
print(img)  # Should print zone image

# Try creating 7th image (should fail validation)
img7 = ZoneImage.objects.create(zone=zone, position=7)  # Error expected
```

### Serializer Phase
```python
from api.serializers import ZoneImageSerializer, NotificationSerializer

# Serialize zone image
img = ZoneImage.objects.first()
data = ZoneImageSerializer(img).data
print(data)  # Should have id, zone, image, position, created_at

# Serialize zone with images
zone = IndustrialZone.objects.first()
data = IndustrialZoneSerializer(zone).data
print(data['images'])  # Should be array of images
```

### ViewSet Phase
```bash
# Test endpoints
curl -H "Authorization: Bearer TOKEN" \
     http://localhost:8000/api/notifications/

curl -H "Authorization: Bearer TOKEN" \
     http://localhost:8000/api/notifications/unread-count/

curl -X POST \
     -H "Authorization: Bearer TOKEN" \
     -d '{"notification_ids": [1,2]}' \
     http://localhost:8000/api/notifications/mark-as-read/
```

### Signal Phase
```python
# Test in Django shell
from api.models import RentalRequest, Notification

# Create rental request
req = RentalRequest.objects.create(...)

# Check notification created
notif = Notification.objects.filter(rental_request_id=req.id).first()
print(notif)  # Should exist
```

### Testing Phase
```bash
# All tests pass
python manage.py test api.tests
# Expected: OK (100+ tests)

# Coverage is 80%+
coverage report
# Expected: 80%+ coverage
```

---

## 🐛 Debugging Tips

### Problem: Notification not created
1. Check signals registered in `api/apps.py`
2. Check `import api.signals` in apps.py
3. Check admin user exists
4. Check signal handler has try-except

### Problem: Image upload fails
1. Check file size (max 5MB)
2. Check file type (JPG/PNG)
3. Check zone exists
4. Check admin permission
5. Check MEDIA_ROOT configured

### Problem: Test fails
1. Read error message carefully
2. Check test has setUp() with test data
3. Check imports are correct
4. Check database is clean
5. Run with `-v 2` flag for verbose output

### Problem: N+1 queries detected
1. Use select_related('actor', 'recipient')
2. Add prefetch_related if needed
3. Use django-debug-toolbar to visualize
4. Check query count in tests

---

## 📋 Code Templates - Copy These!

### Model Template
```python
class MyModel(models.Model):
    """Brief description"""
    
    field1 = models.CharField(max_length=100)
    field2 = models.ForeignKey(OtherModel, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.field1}"
    
    def clean(self):
        """Model-level validation"""
        if not self.is_valid():
            raise ValidationError("Error message")
    
    class Meta:
        db_table = 'my_models'
        verbose_name = 'My Model'
        verbose_name_plural = 'My Models'
        ordering = ['-created_at']
        indexes = [models.Index(fields=['field1'])]
```

### Serializer Template
```python
class MySerializer(serializers.ModelSerializer):
    nested_field = NestedSerializer(read_only=True)
    
    class Meta:
        model = MyModel
        fields = ['id', 'field1', 'field2', 'nested_field']
        read_only_fields = ['id', 'created_at']
    
    def validate_field1(self, value):
        if not value:
            raise serializers.ValidationError("Field required")
        return value
```

### ViewSet Template
```python
class MyViewSet(viewsets.ModelViewSet):
    serializer_class = MySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return MyModel.objects.select_related('related_field')
    
    @action(detail=False, methods=['get'])
    def custom_action(self, request):
        return Response({'data': 'value'})
```

### Test Template
```python
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

class MyTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('user', password='pass')
        self.token = str(RefreshToken.for_user(self.user).access_token)
    
    def test_create(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        response = self.client.post('/api/endpoint/', {'data': 'value'})
        self.assertEqual(response.status_code, 201)
```

### Signal Template
```python
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

@receiver(pre_save, sender=MyModel)
def my_pre_save_handler(sender, instance, **kwargs):
    """Cache old state before save"""
    old_instance = MyModel.objects.filter(pk=instance.pk).first()
    instance._old_state = old_instance

@receiver(post_save, sender=MyModel)
def my_post_save_handler(sender, instance, created, **kwargs):
    """Handle after save"""
    if created:
        # New object created
        pass
    else:
        # Object updated
        old_state = getattr(instance, '_old_state', None)
        if old_state:
            # Compare old vs new
            pass
```

---

## 📊 Metrics to Track

Track these throughout implementation:

```
Phase 1 (Models)
├─ Models created: [ ] 2/2
├─ Migrations applied: [ ] ✓
├─ Admin registered: [ ] ✓
└─ Manual test passed: [ ] ✓

Phase 2 (Serializers)
├─ Serializers created: [ ] 4/4
├─ Validation added: [ ] ✓
├─ Serialization tested: [ ] ✓
└─ Nested serialization: [ ] ✓

Phase 3 (Views)
├─ ViewSets created: [ ] 2/2
├─ Custom actions: [ ] 2/2
├─ Permissions enforced: [ ] ✓
└─ Endpoints tested: [ ] ✓

Phase 4 (Signals)
├─ Signals implemented: [ ] 4/4
├─ Registered in apps.py: [ ] ✓
├─ Error handling: [ ] ✓
└─ Signals tested: [ ] ✓

Phase 5 (Routing)
├─ Routes registered: [ ] ✓
├─ Media serving configured: [ ] ✓
├─ Nested routes working: [ ] ✓
└─ All endpoints accessible: [ ] ✓

Phase 6 (Testing)
├─ Unit tests written: [ ] 100+
├─ Integration tests: [ ] ✓
├─ All tests passing: [ ] ✓
├─ Coverage: [ ] 80%+
└─ No N+1 queries: [ ] ✓

Phase 7 (Documentation)
├─ API docs written: [ ] ✓
├─ Code docstrings: [ ] ✓
├─ Troubleshooting guide: [ ] ✓
└─ Setup guide: [ ] ✓
```

---

## 🎓 Key Concepts to Remember

1. **Signals** - Execute after database operations (post_save, pre_save)
2. **Serializers** - Convert Django objects to/from JSON
3. **ViewSets** - Handle CRUD + custom actions via @action
4. **Permissions** - Checked before view executes
5. **Validation** - Happens in serializer.validate() and model.clean()
6. **Indexes** - Speed up database queries on hot fields
7. **select_related** - Prevents N+1 queries for ForeignKey
8. **Transactions** - atomic() ensures all-or-nothing database updates

---

## 🔗 File Map - Where Things Go

```
backend/
├── api/
│   ├── models.py                  → Add ZoneImage, Notification
│   ├── serializers.py             → Add 2-3 new serializers
│   ├── views.py                   → Add 2 new ViewSets
│   ├── signals.py                 → CREATE (new file)
│   ├── urls.py                    → Update router registration
│   ├── admin.py                   → Register new models
│   ├── apps.py                    → Add ready() method
│   ├── tests/                     → CREATE (new directory)
│   │   ├── __init__.py
│   │   ├── test_zone_images.py
│   │   ├── test_notifications.py
│   │   ├── test_signals.py
│   │   └── test_integration.py
│   └── migrations/
│       └── 000X_zone_images_notifications.py  → AUTO-GENERATED
│
├── config/
│   ├── settings.py                → Add MEDIA_ROOT, MEDIA_URL
│   └── urls.py                    → Add media serving
│
└── media/                         → CREATE (directory)
    └── zone_images/               → Image storage
```

---

## ⏰ Realistic Time Estimates

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | Create 2 models, migrate, test | 4-6h | 🔴 |
| 2 | Create serializers, validate | 4-6h | 🔴 |
| 3 | Create viewsets, endpoints | 6-8h | 🔴 |
| 4 | Create signal handlers | 4-6h | 🔴 |
| 5 | Configure routing | 2-3h | 🔴 |
| 6 | Write comprehensive tests | 8-12h | 🔴 |
| 7 | Write documentation | 3-4h | 🔴 |
| **Total** | | **31-45h** | |

**1 Developer:** 1 week
**2 Developers (parallel):** 3-4 days

---

## ✅ Final Submission Checklist

- [ ] All 7 phases complete
- [ ] 100+ tests written
- [ ] 100% tests passing
- [ ] 80%+ code coverage
- [ ] Zero linting errors
- [ ] Zero security issues
- [ ] Complete API documentation
- [ ] Model/function docstrings complete
- [ ] No debug code left
- [ ] Database migrations tested (including rollback)
- [ ] All endpoints tested via Postman/curl
- [ ] Team trained on new features
- [ ] Ready for production deployment

---

## 🆘 Need Help?

1. Check **phase document** for that phase
2. Check **Risk Assessment** section in phase doc
3. Check **TROUBLESHOOTING.md** in phase-07
4. Check **ARCHITECTURE.md** for design questions
5. Run tests with `-v 2` for verbose output
6. Use Django debugger toolbar for queries
7. Check Django logs for errors

---

**✨ Good luck! You've got this! ✨**
