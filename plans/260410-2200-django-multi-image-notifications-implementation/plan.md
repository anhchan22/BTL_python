# Django Multi-Image & Notification Features Implementation Plan

**Project:** Industrial Zone Rental Management System Backend
**Date Created:** 2026-04-10
**Status:** Planning
**Priority:** High

---

## Overview

This plan details the implementation of two major backend features:
1. **Multi-image support** for Industrial Zones (1-6 images per zone)
2. **Notification system** with automatic triggers for rental/contract events

Total estimated effort: **8-10 business days** for full implementation + testing.

---

## Phases & Progress

| Phase | Title | Status | Progress |
|-------|-------|--------|----------|
| 1 | [Setup & Database Foundation](./phase-01-setup-and-models.md) | Pending | 0% |
| 2 | [Serializers & API Structure](./phase-02-serializers-and-api.md) | Pending | 0% |
| 3 | [Views & ViewSets](./phase-03-views-and-viewsets.md) | Pending | 0% |
| 4 | [Signals & Notifications](./phase-04-signals-and-triggers.md) | Pending | 0% |
| 5 | [URL Routing & Integration](./phase-05-url-routing-integration.md) | Pending | 0% |
| 6 | [Testing & Validation](./phase-06-testing-validation.md) | Pending | 0% |
| 7 | [Documentation & Cleanup](./phase-07-documentation-cleanup.md) | Pending | 0% |

---

## Key Dependencies

- **Django 5.0.1** (existing)
- **Django REST Framework** (existing)
- **Pillow** (image handling)
- **python-dateutil** (existing)
- **SQLite3** (existing)

---

## Architecture Overview

### Data Models
```
ZoneImage: (id, zone_fk, image_file, position, created_at)
Notification: (id, recipient_fk, actor_fk, verb, target_id, is_read, created_at)
```

### Signal Triggers
- `RentalRequest.post_save` → Admin notification
- `RentalRequest.status_change` → Tenant notification
- `Contract.post_save` → Tenant confirmation

### API Endpoints
- `GET /api/zones/{id}/images/` - List zone images
- `POST /api/zones/{id}/images/` - Upload images (admin only)
- `DELETE /api/zones/{id}/images/{img_id}/` - Remove image (admin only)
- `GET /api/notifications/` - List notifications
- `GET /api/notifications/unread-count/` - Unread count
- `POST /api/notifications/mark-as-read/` - Mark read

---

## Key Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Image upload size/format issues | Medium | Validate file types, implement size limits |
| Signal conflicts with existing logic | High | Test signals thoroughly, check existing post_save hooks |
| Database migration conflicts | High | Review existing migrations, test migrations locally first |
| Notification spam | Medium | Implement deduplication, rate limiting logic |
| File system storage issues | Low | Use Django's FileField, handle gracefully |

---

## Success Criteria

### Functional
- ✅ Create/read/update/delete ZoneImage models via API
- ✅ Enforce 1-6 images per zone constraint at model level
- ✅ Automatically create notifications on rental events
- ✅ Mark notifications as read without UI dependencies
- ✅ Query unread notification count efficiently
- ✅ Nested serialization: Zone includes images array

### Non-Functional
- ✅ All tests passing (unit + integration)
- ✅ Database indexed for performance queries
- ✅ No breaking changes to existing APIs
- ✅ Backward compatible migrations
- ✅ Code follows existing patterns & standards

---

## Related Files & Documentation

- **Models:** `backend/api/models.py`
- **Serializers:** `backend/api/serializers.py`
- **Views:** `backend/api/views.py`
- **URLs:** `backend/api/urls.py`
- **Admin:** `backend/api/admin.py`
- **Permissions:** `backend/api/permissions.py`
- **Settings:** `backend/config/settings.py`

---

## Next Steps

1. Read Phase 1 for model design details
2. Delegate to planner for detailed task breakdown
3. Initiate parallel implementation teams for serializers + models
4. Begin with database schema validation

---

## Notes

- Image storage: Will use Django FileField with media/ directory
- Notification verb options: 'created', 'approved', 'rejected', 'completed'
- Target polymorphism: Use target_id + target_type or just store related object IDs
