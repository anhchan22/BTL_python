# Phase 7: Documentation & Cleanup

**Status:** Pending (Blocked by Phase 1-6)
**Priority:** Medium
**Estimated Duration:** 0.5 days
**Dependencies:** Phase 1 ✓, Phase 6 ✓

---

## Context Links

- Main Plan: `../plan.md`
- Related: `backend/api/models.py`
- Related: `backend/api/views.py`
- Related: `backend/api/serializers.py`

---

## Overview

Phase 7 finalizes the implementation with comprehensive documentation, code cleanup, and knowledge transfer. This phase ensures the codebase is maintainable and production-ready.

---

## Requirements

### Documentation
1. API endpoint documentation (request/response examples)
2. Model relationship diagrams
3. Signal flow documentation
4. Setup/deployment guide
5. Code-level docstrings
6. Architecture decision records (ADR)

### Code Quality
1. Consistent formatting and style
2. No linting errors
3. Type hints where applicable
4. Proper error handling
5. Security best practices review

### Knowledge Transfer
1. README for new features
2. Troubleshooting guide
3. Common gotchas documented
4. Examples for frontend developers

---

## Implementation Steps

### Step 1: API Documentation

1. Create `NOTIFICATIONS_API.md`:
   ```markdown
   # Notifications API Documentation

   ## Overview
   The Notifications API provides real-time notification management for the Industrial Zone Rental System.

   ## Endpoints

   ### List Notifications
   ```
   GET /api/notifications/
   ```

   **Authentication:** Required (Bearer token)

   **Query Parameters:**
   - `is_read` (boolean, optional): Filter by read status
   - `page` (integer, optional): Pagination page number
   - `page_size` (integer, optional): Items per page (default: 20)

   **Response:**
   ```json
   {
     "count": 5,
     "next": "http://api.example.com/api/notifications/?page=2",
     "previous": null,
     "results": [
       {
         "id": 1,
         "actor_username": "admin",
         "verb": "approved",
         "verb_display": "Request Approved",
         "is_read": false,
         "created_at": "2026-04-10T14:30:00Z"
       }
     ]
   }
   ```

   ### Get Unread Count
   ```
   GET /api/notifications/unread-count/
   ```

   **Authentication:** Required

   **Response:**
   ```json
   {
     "unread_count": 5
   }
   ```

   ### Mark as Read (Bulk)
   ```
   POST /api/notifications/mark-as-read/
   ```

   **Authentication:** Required

   **Request Body:**
   ```json
   {
     "notification_ids": [1, 2, 3]
   }
   ```

   **Response:**
   ```json
   {
     "status": "success",
     "updated_count": 3
   }
   ```

   ---

   ## Notification Verbs

   | Verb | Display | Description |
   |------|---------|-------------|
   | `created` | Request Created | Tenant submitted a new rental request |
   | `approved` | Request Approved | Admin approved a rental request |
   | `rejected` | Request Rejected | Admin rejected a rental request |
   | `completed` | Contract Completed | Contract was created (auto-generated) |
   ```

2. Create `ZONE_IMAGES_API.md`:
   ```markdown
   # Zone Images API Documentation

   ## Overview
   The Zone Images API allows admins to upload and manage multiple images per industrial zone.

   ## Constraints
   - **Maximum 6 images per zone**
   - **Supported formats:** JPG, PNG
   - **Maximum file size:** 5MB per image
   - **Admin-only operations:** POST, DELETE

   ## Endpoints

   ### List Zone Images
   ```
   GET /api/zones/{zone_id}/images/
   ```

   **Authentication:** Not required

   **Response:**
   ```json
   [
     {
       "id": 1,
       "zone": 1,
       "image": "http://api.example.com/media/zone_images/zone1_img1.jpg",
       "position": 1,
       "created_at": "2026-04-10T12:00:00Z"
     }
   ]
   ```

   ### Upload Zone Image
   ```
   POST /api/zones/{zone_id}/images/
   ```

   **Authentication:** Required (Admin only)

   **Content-Type:** multipart/form-data

   **Request:**
   ```
   zone: 1
   position: 1
   image: (binary file data)
   ```

   **Response:**
   ```json
   {
     "id": 1,
     "zone": 1,
     "image": "http://api.example.com/media/zone_images/zone1_img1.jpg",
     "position": 1,
     "created_at": "2026-04-10T12:00:00Z"
   }
   ```
   ```

### Step 2: Model Documentation

1. Update model docstrings:
   ```python
   class ZoneImage(models.Model):
       """
       Image model for industrial zones.
       
       Stores images associated with industrial zones. Each zone can have
       a maximum of 6 images. Images are ordered by position field.
       
       Attributes:
           zone (ForeignKey): Reference to IndustrialZone
           image (ImageField): Image file stored in media/zone_images/
           position (PositiveIntegerField): Display order (1-6)
           created_at (DateTimeField): Creation timestamp
       
       Constraints:
           - Maximum 6 images per zone
           - File size <= 5MB
           - Supported formats: JPG, PNG
       
       Example:
           >>> zone = IndustrialZone.objects.first()
           >>> zone.images.all()
           <QuerySet [<ZoneImage: Zone A - Image 1>]>
       """
   ```

2. Update Notification docstring:
   ```python
   class Notification(models.Model):
       """
       Notification model for user notifications.
       
       Stores notifications triggered by system events (rental requests,
       approvals, etc.). Notifications are recipient-specific and include
       information about the triggering event.
       
       Attributes:
           recipient (ForeignKey): User who receives notification
           actor (ForeignKey): User who triggered the event
           verb (CharField): Type of event (created, approved, rejected, completed)
           rental_request_id (IntegerField): Related rental request ID
           contract_id (IntegerField): Related contract ID
           is_read (BooleanField): Read status
           created_at (DateTimeField): Creation timestamp
       
       Signals:
           - RentalRequest.post_save → Notification.created
           - RentalRequest.status_change → Notification.approved/rejected
           - Contract.post_save → Notification.completed
       
       Performance:
           - Indexes on (recipient, created_at) and (recipient, is_read)
           - Use select_related('actor', 'recipient') to avoid N+1 queries
       """
   ```

### Step 3: Create Architecture Decision Record (ADR)

1. Create `ADR-001-NOTIFICATION-SYSTEM.md`:
   ```markdown
   # ADR-001: Notification System Architecture

   ## Status
   Accepted

   ## Context
   The system needs to notify users of important events (rental requests, approvals).
   Options:
   1. Real-time WebSocket notifications
   2. Database-backed polling API
   3. Email notifications
   4. Combination approach

   ## Decision
   Implement database-backed notification model with API endpoints.
   - Simple to implement and test
   - Works with existing Django ORM
   - Can add real-time layer later (WebSocket)
   - Supports future email notifications

   ## Consequences
   - Notifications persisted in database (queryable history)
   - Polling required for real-time updates
   - Can add WebSocket layer later for push notifications
   - Database grows with notification volume (archival needed eventually)

   ## Implementation
   - Notification model with verb choices
   - Django signals for automatic creation
   - API endpoints for query and mark-as-read
   - Indexes for performance

   ---

   # ADR-002: Zone Images Storage

   ## Status
   Accepted

   ## Context
   Zones need 1-6 images for marketing/presentation.
   Options:
   1. Store in database (BLOB)
   2. File system (Django FileField)
   3. Cloud storage (S3, CDN)

   ## Decision
   Use Django FileField with local file system storage.
   - Simple setup, no external dependencies
   - Production-ready with nginx/Apache reverse proxy
   - Can migrate to S3 later without code changes
   - Django handles file deletion on model deletion

   ## Consequences
   - Requires file system write permissions
   - Scaling requires shared storage (NFS, S3 migration)
   - Backup strategy needed for media files
   - CDN setup required for production performance

   ## Implementation
   - ImageField with upload_to='zone_images/'
   - FileExtensionValidator for security
   - Size validation (5MB limit)
   - Position field for ordering
   ```

### Step 4: Create Setup Guide

1. Create `IMPLEMENTATION_GUIDE.md`:
   ```markdown
   # Django Multi-Image & Notifications Implementation Guide

   ## Quick Start

   ### Prerequisites
   - Django 5.0.1+
   - Django REST Framework
   - Python 3.8+
   - SQLite3 (or PostgreSQL)

   ### Installation Steps

   1. **Create models**
       ```bash
       python manage.py makemigrations
       python manage.py migrate
       ```

   2. **Create superuser**
       ```bash
       python manage.py createsuperuser
       ```

   3. **Register in admin**
       - Go to Django admin
       - Create Zone Images
       - View Notifications

   4. **Run tests**
       ```bash
       python manage.py test api.tests
       ```

   5. **Start server**
       ```bash
       python manage.py runserver
       ```

   ### API Testing

   **Get Token:**
   ```bash
   curl -X POST http://localhost:8000/api/auth/login/ \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"password"}'
   ```

   **List Notifications:**
   ```bash
   curl -H "Authorization: Bearer TOKEN" \
        http://localhost:8000/api/notifications/
   ```

   **Upload Image:**
   ```bash
   curl -X POST http://localhost:8000/api/zones/1/images/ \
     -H "Authorization: Bearer TOKEN" \
     -F "zone=1" \
     -F "position=1" \
     -F "image=@image.jpg"
   ```

   ## Troubleshooting

   ### Media Files Not Serving
   - Check DEBUG=True in settings.py
   - Verify MEDIA_ROOT and MEDIA_URL configured
   - Check static files middleware installed

   ### Notification Not Created
   - Check signal imports in apps.py ready()
   - Verify admin user exists
   - Check RentalRequest.post_save hook registered

   ### Image Upload Fails
   - Check file size (max 5MB)
   - Check file type (JPG, PNG only)
   - Check zone exists and has space (< 6 images)

   ## Production Deployment

   ### Media File Handling
   1. Use S3 or CDN for image storage
   2. Set up django-storages for S3
   3. Configure CloudFront distribution
   4. Implement image optimization (resize, compress)

   ### Notification Archival
   1. Add management command to archive old notifications
   2. Implement retention policy (e.g., 1 year)
   3. Consider database partitioning for large volumes

   ### Performance Optimization
   1. Add caching for zone images list
   2. Implement WebSocket layer for real-time notifications
   3. Add full-text search for notification query
   4. Use read replicas for notification queries
   ```

### Step 5: Create Troubleshooting Guide

1. Create `TROUBLESHOOTING.md`:
   ```markdown
   # Troubleshooting Guide

   ## Common Issues

   ### Issue: `ModuleNotFoundError: No module named 'api.signals'`
   **Cause:** Signals not registered in apps.py
   **Fix:** 
   ```python
   # In api/apps.py
   def ready(self):
       import api.signals
   ```

   ### Issue: Images return 404 in API
   **Cause:** Media serving not configured
   **Fix:**
   - Add to urls.py: `urlpatterns += static(MEDIA_URL, document_root=MEDIA_ROOT)`
   - Check DEBUG=True
   - Verify media/ directory exists

   ### Issue: Notification created twice
   **Cause:** Signal registered twice or saved twice
   **Fix:**
   - Use get_or_create in signal
   - Check models.py for duplicate imports
   - Verify apps.py doesn't import signals twice

   ### Issue: Permission denied uploading image
   **Cause:** User is not admin
   **Fix:**
   - Check user.profile.role == 'ADMIN'
   - Set role via Django admin
   - Verify IsAdmin permission used

   ### Issue: Unread count returns 0
   **Cause:** Notifications not created or marked read
   **Fix:**
   - Create test notification manually
   - Check is_read flag in database
   - Verify recipient filter matches current user

   ### Issue: Image file too large error
   **Cause:** File exceeds 5MB limit
   **Fix:**
   - Compress image before upload
   - Check file size validation logic
   - Increase limit in ZoneImageSerializer (not recommended)
   ```

### Step 6: Code Cleanup

1. Remove debug code:
   ```python
   # Remove from views.py
   # print(f"DEBUG: {something}")
   # import pdb; pdb.set_trace()
   ```

2. Add missing docstrings:
   ```bash
   # Check coverage
   pylint api/views.py --disable=all --enable=missing-docstring
   ```

3. Format code:
   ```bash
   black api/
   ```

### Step 7: Create Migration Summary

1. Create `MIGRATION_SUMMARY.md`:
   ```markdown
   # Database Migration Summary

   ## New Models
   - `ZoneImage`: Image storage for zones
   - `Notification`: User notifications

   ## Migration File
   - `0005_zone_images_and_notifications.py`

   ## Indexes Added
   - `notification_recipient_created_idx` on (recipient, -created_at)
   - `notification_recipient_is_read_idx` on (recipient, is_read)

   ## Backward Compatibility
   - No changes to existing tables
   - No migration rollback issues
   - Can safely rollback to 0004_contract

   ## Rollback Procedure
   ```bash
   python manage.py migrate api 0004_contract
   ```
   ```

### Step 8: Update Main README

1. Add section to `README.md`:
   ```markdown
   ## Zone Images & Notifications Features

   ### Zone Images
   - Upload up to 6 images per zone
   - Automatic image ordering
   - Admin-only operations

   ### Notifications
   - Automatic notification creation on events
   - Real-time notification API
   - Mark-as-read functionality
   - Unread count tracking

   ### API Endpoints
   - `GET /api/zones/{id}/images/` - List images
   - `POST /api/zones/{id}/images/` - Upload image (admin)
   - `GET /api/notifications/` - List notifications
   - `GET /api/notifications/unread-count/` - Unread count
   - `POST /api/notifications/mark-as-read/` - Mark read

   ### Documentation
   See `NOTIFICATIONS_API.md` and `ZONE_IMAGES_API.md` for detailed API documentation.
   ```

### Step 9: Create Feature Checklist

1. Create `FEATURE_CHECKLIST.md`:
   ```markdown
   # Zone Images & Notifications Feature Checklist

   ## Models ✅
   - [x] ZoneImage model created
   - [x] Notification model created
   - [x] Database migrations applied
   - [x] Admin registration complete
   - [x] Model validation working

   ## Serializers ✅
   - [x] ZoneImageSerializer created
   - [x] NotificationSerializer created
   - [x] File validation implemented
   - [x] Nested serialization tested

   ## Views ✅
   - [x] ZoneImageViewSet created
   - [x] NotificationViewSet created
   - [x] Custom actions implemented
   - [x] Permission classes enforced

   ## Signals ✅
   - [x] Rental request → admin notification signal
   - [x] Approval → tenant notification signal
   - [x] Rejection → tenant notification signal
   - [x] Contract creation → notification signal
   - [x] Duplicate prevention implemented

   ## URLs ✅
   - [x] Notification endpoints registered
   - [x] Zone image endpoints registered
   - [x] Media file serving configured
   - [x] All routes tested

   ## Tests ✅
   - [x] Model tests written
   - [x] Serializer tests written
   - [x] Signal tests written
   - [x] ViewSet tests written
   - [x] Integration tests written
   - [x] Coverage > 80%

   ## Documentation ✅
   - [x] API documentation written
   - [x] Architecture decision records created
   - [x] Setup guide written
   - [x] Troubleshooting guide created
   - [x] Code comments added
   - [x] README updated
   ```

### Step 10: Final Code Review

1. Check code quality:
   ```bash
   # Lint check
   pylint api/models.py
   pylint api/views.py
   pylint api/serializers.py
   
   # Format check
   black --check api/
   
   # Type checking
   mypy api/views.py --ignore-missing-imports
   ```

2. Security review checklist:
   ```markdown
   ## Security Review

   - [ ] SQL injection: Protected (ORM used)
   - [ ] XSS: Protected (DRF auto-escapes)
   - [ ] CSRF: Protected (middleware enabled)
   - [ ] Authorization: Verified (permission classes)
   - [ ] Authentication: Verified (JWT tokens)
   - [ ] File upload: Validated (type, size checks)
   - [ ] Sensitive data: Not logged (no passwords in logs)
   - [ ] Dependency versions: Current (no known vulnerabilities)
   ```

---

## Todo List

- [ ] Write API documentation (notifications)
- [ ] Write API documentation (zone images)
- [ ] Add docstrings to all models
- [ ] Add docstrings to all viewsets
- [ ] Create architecture decision records
- [ ] Create implementation guide
- [ ] Create troubleshooting guide
- [ ] Create migration summary
- [ ] Update main README
- [ ] Create feature checklist
- [ ] Run code quality checks
- [ ] Security review
- [ ] Knowledge transfer session
- [ ] Archive old documentation

---

## Success Criteria

### Documentation
- ✅ API endpoints fully documented
- ✅ Examples for all common use cases
- ✅ Deployment guide complete
- ✅ Troubleshooting guide covers main issues
- ✅ Architecture decisions documented

### Code Quality
- ✅ All functions have docstrings
- ✅ No linting errors
- ✅ Consistent code style
- ✅ Comments for complex logic

### Knowledge Transfer
- ✅ Team can maintain code
- ✅ Common gotchas documented
- ✅ Troubleshooting guide covers 80% of issues
- ✅ Examples for integration

---

## Next Steps

1. ✅ Read Phase 1-7 completely
2. → Implement all documentation
3. → Review and cleanup code
4. → Create knowledge transfer session
5. → Archive plan and mark complete

---

## Notes

- Keep documentation up-to-date with code
- Use versioning for API documentation
- Create video tutorials for complex features
- Set up internal wiki/knowledge base
- Consider Swagger/OpenAPI for auto-generated docs
- Plan quarterly documentation review

---

## Appendix: Documentation Template

### Feature Documentation Template
```markdown
# Feature Name

## Overview
One paragraph description.

## Use Cases
- Use case 1
- Use case 2

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|

## Database Schema
Entity-relationship diagram or table schema.

## Architecture
How does this feature work? Data flow diagram.

## Integration Points
What other systems does this integrate with?

## Configuration
Any settings/environment variables needed?

## Testing
How to test this feature?

## Troubleshooting
Common issues and solutions.

## Future Enhancements
- Enhancement 1
- Enhancement 2
```
