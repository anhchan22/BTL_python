# Phase 1: Setup & Database Models

**Status:** Pending
**Priority:** Critical (Blocks all other phases)
**Estimated Duration:** 1-2 days

---

## Context Links

- Main Plan: `../plan.md`
- Related: `backend/api/models.py`
- Related: `backend/config/settings.py`

---

## Overview

Phase 1 focuses on defining and creating the data models for:
1. **ZoneImage** - Store multiple images per industrial zone
2. **Notification** - Store notification records with audit trail

These models form the foundation for all subsequent phases.

---

## Key Insights

### Current System Analysis
- **Existing models:** UserProfile, IndustrialZone, RentalRequest, Contract
- **Pattern:** Single responsibility, ForeignKey relationships, auto timestamps
- **Signals:** Already use post_save signals for UserProfile creation
- **Database:** SQLite3 with Django ORM, migrations-based approach

### Design Decisions

**ZoneImage Model**
- ForeignKey to IndustrialZone with CASCADE deletion
- File field for image storage in media/zone_images/
- Position/order field for image arrangement
- Validators for file type and size
- Constraint: 1-6 images per zone enforced at model level

**Notification Model**
- ForeignKey to User (recipient)
- ForeignKey to User (actor - who triggered the notification)
- Verb field (choices: created, approved, rejected, completed)
- Target fields (store relevant IDs: rental_request_id, contract_id, etc.)
- is_read boolean for read/unread status
- Timestamps for audit trail
- Index on recipient + is_read for efficient queries

---

## Requirements

### Functional Requirements
1. ZoneImage must be associated with exactly one zone
2. Each zone can have 1-6 images maximum
3. Images should be ordered (position field)
4. Notification must track: who sent, who received, what happened, what was affected
5. Notifications must be queryable by recipient and read status
6. Image deletion should cascade but preserve notification history

### Non-Functional Requirements
1. Database queries for notifications must be optimized with indexes
2. Images should be stored in separate media directory
3. File validation at upload time (not just DB level)
4. Support for future image sorting/reordering

---

## Architecture

### ZoneImage Model
```python
class ZoneImage(models.Model):
    zone = ForeignKey(IndustrialZone, CASCADE)
    image = FileField(upload_to='zone_images/', validators=[...])
    position = IntegerField(default=0)  # For ordering
    created_at = DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['position', 'created_at']
        unique_together = [('zone', 'position')]  # No duplicate positions
```

### Notification Model
```python
class Notification(models.Model):
    VERB_CHOICES = [
        ('created', 'Request Created'),
        ('approved', 'Request Approved'),
        ('rejected', 'Request Rejected'),
        ('completed', 'Contract Completed'),
    ]
    
    recipient = ForeignKey(User, CASCADE)
    actor = ForeignKey(User, CASCADE, related_name='notifications_sent')
    verb = CharField(max_length=20, choices=VERB_CHOICES)
    
    # Target - polymorphic storage
    rental_request_id = IntegerField(null=True, blank=True)
    contract_id = IntegerField(null=True, blank=True)
    
    is_read = BooleanField(default=False)
    created_at = DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['recipient', '-created_at']),
            models.Index(fields=['recipient', 'is_read']),
        ]
        ordering = ['-created_at']
```

---

## Related Code Files

### Files to Create
1. `backend/api/models.py` - Add ZoneImage and Notification classes
2. `backend/api/migrations/000X_add_zone_images_notification.py` - Auto-generated

### Files to Modify
1. `backend/api/admin.py` - Register new models in Django admin
2. `backend/config/settings.py` - Add MEDIA_ROOT/MEDIA_URL if needed
3. `backend/.gitignore` - Add media directory if not present

### Files NOT to Touch
- `backend/api/serializers.py` (Phase 2)
- `backend/api/views.py` (Phase 3)
- `backend/api/urls.py` (Phase 5)

---

## Implementation Steps

### Step 1: Add Models to models.py
1. Open `backend/api/models.py`
2. Add imports: `from django.core.validators import FileExtensionValidator`
3. Define ZoneImage model with:
   - ForeignKey to IndustrialZone
   - ImageField with upload_to='zone_images/'
   - Position field (PositiveIntegerField)
   - Timestamps
   - Model-level validation for image count constraint
4. Define Notification model with:
   - ForeignKey to User (recipient)
   - ForeignKey to User (actor)
   - Verb choice field
   - Target ID fields (rental_request_id, contract_id)
   - is_read boolean
   - Indexes on common queries

### Step 2: Add Model Validation
1. Add `clean()` method to ZoneImage:
   - Check file size (max 5MB)
   - Check file type (jpg, jpeg, png)
2. Add `clean()` method to check 1-6 constraint:
   - Use count query on save
3. Add `full_clean()` calls in serializers later

### Step 3: Register Models in Admin
1. Open `backend/api/admin.py`
2. Create ZoneImageAdmin:
   - list_display: ['zone', 'position', 'created_at']
   - list_filter: ['zone', 'created_at']
   - readonly_fields: ['created_at']
3. Create NotificationAdmin:
   - list_display: ['recipient', 'actor', 'verb', 'is_read', 'created_at']
   - list_filter: ['is_read', 'verb', 'created_at']
   - search_fields: ['recipient__username', 'actor__username']
   - readonly_fields: ['created_at']
4. Register both with @admin.register()

### Step 4: Update Settings
1. Open `backend/config/settings.py`
2. Check/add MEDIA_ROOT and MEDIA_URL (if not present):
   ```python
   MEDIA_ROOT = BASE_DIR / 'media'
   MEDIA_URL = '/media/'
   ```
3. Ensure image file validation dependencies available

### Step 5: Create Migration
1. Run: `python manage.py makemigrations`
2. Review generated migration file (check constraints)
3. Run: `python manage.py migrate`
4. Verify no errors

### Step 6: Test Model Creation
1. Create test script or Django shell session
2. Create sample ZoneImage with valid zone
3. Test validation (try > 6 images, wrong file type)
4. Create sample Notifications
5. Test queries for performance

---

## Todo List

- [ ] Define ZoneImage model with all fields and validators
- [ ] Define Notification model with verb choices and fields
- [ ] Add clean() validation methods to both models
- [ ] Create proper __str__() methods
- [ ] Add Meta classes with proper ordering and indexes
- [ ] Register both models in admin.py
- [ ] Add list_display, list_filter, search_fields to admins
- [ ] Update settings.py for MEDIA_ROOT and MEDIA_URL
- [ ] Generate migration via makemigrations
- [ ] Review migration SQL for correctness
- [ ] Apply migration with migrate command
- [ ] Test model creation via Django shell
- [ ] Test validation constraints
- [ ] Document model relationships in docstrings

---

## Success Criteria

### Database
- ✅ Zone images table created with correct schema
- ✅ Notifications table created with correct schema
- ✅ Indexes created for query optimization
- ✅ Foreign keys properly constraint relationships

### Model Behavior
- ✅ ZoneImage.clean() rejects > 6 images per zone
- ✅ ZoneImage.clean() rejects non-image files
- ✅ ZoneImage.clean() rejects files > 5MB
- ✅ Notification created with required fields
- ✅ __str__ methods return readable text

### Admin Interface
- ✅ ZoneImage admin displays images correctly
- ✅ Notification admin allows filtering by status/verb
- ✅ Can CRUD models via Django admin

### Validation
- ✅ Model clean() methods catch constraint violations
- ✅ Migration reversal works (rollback test)
- ✅ No duplicate indexes or migrations

---

## Risk Assessment

### Potential Issues

1. **Image Storage Path Issues**
   - Risk: Media files not serving correctly
   - Mitigation: Add static/media serving to urls.py in development

2. **Constraint Enforcement**
   - Risk: Database doesn't enforce unique_together
   - Mitigation: Add application-level validation in clean()

3. **Migration Conflicts**
   - Risk: Existing migration state conflicts
   - Mitigation: Review migration history, test in isolated DB

4. **FileField Dependencies**
   - Risk: Pillow not installed
   - Mitigation: Check requirements, install if needed

---

## Security Considerations

### File Upload Security
- Validate file types (whitelist jpg, png only)
- Validate file size (max 5MB per image)
- Use FileExtensionValidator from Django
- Store outside web root (managed by Django FileField)

### Access Control
- Prepare for later phase: only admins can upload images
- Prepare for later phase: notifications only visible to recipient

### Data Privacy
- Notifications store target IDs, not sensitive data
- No personally identifiable info in verb field
- Actor/recipient are User references only

---

## Next Steps

1. ✅ Read this document completely
2. → Implement models according to steps above
3. → Run migrations and test locally
4. → Move to Phase 2 (Serializers)
5. → Parallel: Start Phase 2 serializers while Phase 1 stabilizes

---

## Notes

- Use PositiveIntegerField for position (prevents negative numbers)
- Consider future: pagination for large image lists
- Consider future: soft delete for notifications vs hard delete
- Auto-numbering for position field can be added in signal later
- Test signal integration in Phase 4 (don't add signals in Phase 1)

---

## Appendix: Expected Migration Output

```python
# Expected migration file structure
class Migration(migrations.Migration):
    dependencies = [
        ('api', '0004_contract'),
    ]
    
    operations = [
        migrations.CreateModel(
            name='ZoneImage',
            fields=[
                ('id', models.BigAutoField(...)),
                ('image', models.ImageField(...)),
                ('position', models.PositiveIntegerField(...)),
                ('created_at', models.DateTimeField(...)),
                ('zone', models.ForeignKey(...)),
            ],
            options={'ordering': ['position', 'created_at']},
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(...)),
                ('verb', models.CharField(...)),
                ('rental_request_id', models.IntegerField(...)),
                ('contract_id', models.IntegerField(...)),
                ('is_read', models.BooleanField(...)),
                ('created_at', models.DateTimeField(...)),
                ('recipient', models.ForeignKey(...)),
                ('actor', models.ForeignKey(...)),
            ],
            options={'ordering': ['-created_at']},
        ),
        migrations.AddIndex(
            model_name='notification',
            index=models.Index(fields=['recipient', '-created_at'], name='...'),
        ),
        migrations.AddIndex(
            model_name='notification',
            index=models.Index(fields=['recipient', 'is_read'], name='...'),
        ),
    ]
```
