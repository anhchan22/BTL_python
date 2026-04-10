# Phase 3: Views & ViewSets Implementation

**Status:** Pending (Blocked by Phase 1-2)
**Priority:** High
**Estimated Duration:** 1-1.5 days
**Dependencies:** Phase 1 ✓, Phase 2 ✓

---

## Context Links

- Main Plan: `../plan.md`
- Phase 1: `../phase-01-setup-and-models.md`
- Phase 2: `../phase-02-serializers-and-api.md`
- Related: `backend/api/views.py`
- Related: `backend/api/urls.py`

---

## Overview

Phase 3 implements the API views and viewsets for:
1. **ZoneImageViewSet** - Handle image CRUD operations
2. **NotificationViewSet** - Handle notification queries and mark-as-read
3. **Update IndustrialZoneViewSet** - Add image-related actions

This phase translates HTTP requests into business logic.

---

## Key Insights

### Current ViewSet Patterns
- Use `viewsets.ModelViewSet` for full CRUD
- Use `@action` decorator for custom endpoints
- Use permission classes (IsAdmin, IsAuthenticated, IsOwnerOrAdmin)
- Use queryset with select_related/prefetch_related for optimization
- Override get_serializer_class() for create vs list differences

### Design Decisions

**ZoneImageViewSet**
- Nested under zones: `/api/zones/{zone_id}/images/`
- Admin-only for create/delete
- List/retrieve open to all authenticated users
- Use custom router for nesting

**NotificationViewSet**
- Root level: `/api/notifications/`
- Unread-count action: GET `/api/notifications/unread-count/`
- Mark-as-read action: POST `/api/notifications/mark-as-read/` (bulk)
- List filtered to current user
- Read-only (no update/delete from API)

**IndustrialZoneViewSet Updates**
- Add images nested viewset
- Keep existing functionality intact
- No changes to list/retrieve/create/update

---

## Requirements

### Functional Requirements
1. GET /api/zones/{id}/images/ - List all images for a zone
2. POST /api/zones/{id}/images/ - Upload image (admin only)
3. DELETE /api/zones/{id}/images/{img_id}/ - Remove image (admin only)
4. GET /api/notifications/ - List notifications for current user
5. GET /api/notifications/unread-count/ - Return unread count
6. POST /api/notifications/mark-as-read/ - Mark notifications as read (bulk)
7. GET /api/notifications/{id}/ - Get notification details
8. Permission enforcement: Tenants see only their notifications
9. Pagination: Notifications should be paginated
10. Filtering: Notifications by is_read status

### Non-Functional Requirements
1. Efficient queries using select_related/prefetch_related
2. Index usage for large result sets
3. Consistent pagination across endpoints
4. Proper error handling and HTTP status codes
5. Clear error messages for permission violations

---

## Architecture

### ViewSet Structure
```
IndustrialZoneViewSet (Existing)
├── list() - GET /api/zones/
├── retrieve() - GET /api/zones/{id}/
├── create() - POST /api/zones/ (admin only)
├── update() - PUT /api/zones/{id}/ (admin only)
└── destroy() - DELETE /api/zones/{id}/ (admin only)

ZoneImageViewSet (Nested)
├── list() - GET /api/zones/{zone_id}/images/
├── retrieve() - GET /api/zones/{zone_id}/images/{id}/
├── create() - POST /api/zones/{zone_id}/images/ (admin only)
└── destroy() - DELETE /api/zones/{zone_id}/images/{id}/ (admin only)

NotificationViewSet (New Root)
├── list() - GET /api/notifications/ (current user only)
├── retrieve() - GET /api/notifications/{id}/
├── unread_count() - GET /api/notifications/unread-count/
└── mark_as_read() - POST /api/notifications/mark-as-read/
```

---

## Related Code Files

### Files to Create
- No new files

### Files to Modify
1. `backend/api/views.py` - Add ZoneImageViewSet and NotificationViewSet
2. `backend/api/urls.py` - Add nested routing for images and notifications

### Files NOT to Touch
- `backend/api/serializers.py` (frozen after Phase 2)
- `backend/api/models.py` (frozen after Phase 1)

---

## Implementation Steps

### Step 1: Import Required Modules
1. Open `backend/api/views.py`
2. Add imports:
   ```python
   from rest_framework.decorators import action
   from rest_framework.response import Response
   from rest_framework import status
   from .models import ZoneImage, Notification
   from .serializers import (ZoneImageSerializer, ZoneImageUploadSerializer,
                              NotificationSerializer, NotificationListSerializer)
   from .permissions import IsAdmin
   ```

### Step 2: Create ZoneImageViewSet
1. Add ZoneImageViewSet class:
   ```python
   class ZoneImageViewSet(viewsets.ModelViewSet):
       serializer_class = ZoneImageSerializer
       permission_classes = [IsAuthenticated]
       
       def get_queryset(self):
           zone_id = self.kwargs.get('zone_pk')
           return ZoneImage.objects.filter(zone_id=zone_id)
       
       def get_serializer_class(self):
           if self.action == 'create':
               return ZoneImageUploadSerializer
           return ZoneImageSerializer
       
       def get_permissions(self):
           if self.action in ['create', 'destroy']:
               return [IsAdmin()]
           return [IsAuthenticated()]
       
       def perform_create(self, serializer):
           # Automatically set zone from URL
           zone_id = self.kwargs.get('zone_pk')
           zone = IndustrialZone.objects.get(pk=zone_id)
           serializer.save(zone=zone)
   ```

### Step 3: Create NotificationViewSet
1. Add NotificationViewSet class:
   ```python
   class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
       serializer_class = NotificationSerializer
       permission_classes = [IsAuthenticated]
       
       def get_queryset(self):
           # Only show notifications for current user
           return Notification.objects.filter(
               recipient=self.request.user
           ).select_related('actor', 'recipient')
       
       def get_serializer_class(self):
           if self.action == 'list':
               return NotificationListSerializer
           return NotificationSerializer
       
       @action(detail=False, methods=['get'])
       def unread_count(self, request):
           count = Notification.objects.filter(
               recipient=request.user,
               is_read=False
           ).count()
           return Response({'unread_count': count})
       
       @action(detail=False, methods=['post'])
       def mark_as_read(self, request):
           notification_ids = request.data.get('notification_ids', [])
           Notification.objects.filter(
               id__in=notification_ids,
               recipient=request.user
           ).update(is_read=True)
           return Response(
               {'status': 'notifications marked as read'},
               status=status.HTTP_200_OK
           )
   ```

### Step 4: Update IndustrialZoneViewSet (If needed)
1. Check existing IndustrialZoneViewSet in views.py
2. Verify it has get_permissions() method:
   ```python
   def get_permissions(self):
       if self.action in ['create', 'update', 'destroy']:
           return [IsAdmin()]
       return [AllowAny()]
   ```
3. No changes needed if images already filtered via serializer

### Step 5: Implement Filtering for Notifications
1. Add optional filtering by is_read status:
   ```python
   from rest_framework import filters
   
   class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
       # ... existing code ...
       
       def get_queryset(self):
           queryset = Notification.objects.filter(
               recipient=self.request.user
           ).select_related('actor', 'recipient')
           
           # Optional filtering
           is_read = self.request.query_params.get('is_read')
           if is_read is not None:
               is_read_bool = is_read.lower() == 'true'
               queryset = queryset.filter(is_read=is_read_bool)
           
           return queryset
   ```

### Step 6: Add Ordering and Pagination
1. Ensure OrderingFilter is used:
   ```python
   from rest_framework import filters
   
   class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
       # ... existing code ...
       filter_backends = [filters.OrderingFilter]
       ordering_fields = ['created_at', 'is_read']
       ordering = ['-created_at']  # Default: newest first
   ```

### Step 7: Handle Bulk Mark-as-Read
1. Implement with transaction for atomicity:
   ```python
   from django.db import transaction
   
   @action(detail=False, methods=['post'])
   def mark_as_read(self, request):
       notification_ids = request.data.get('notification_ids', [])
       
       with transaction.atomic():
           updated = Notification.objects.filter(
               id__in=notification_ids,
               recipient=request.user
           ).update(is_read=True)
       
       return Response({
           'status': 'success',
           'updated_count': updated
       }, status=status.HTTP_200_OK)
   ```

### Step 8: Test ViewSet Actions
1. Create test script or use HTTP client:
   ```bash
   # Get notifications for current user
   curl -H "Authorization: Bearer TOKEN" \
        http://localhost:8000/api/notifications/
   
   # Get unread count
   curl -H "Authorization: Bearer TOKEN" \
        http://localhost:8000/api/notifications/unread-count/
   
   # Mark as read
   curl -X POST \
        -H "Authorization: Bearer TOKEN" \
        -d '{"notification_ids": [1, 2, 3]}' \
        http://localhost:8000/api/notifications/mark-as-read/
   ```

### Step 9: Implement Proper Error Handling
1. Add try-except for edge cases:
   ```python
   @action(detail=False, methods=['post'])
   def mark_as_read(self, request):
       try:
           notification_ids = request.data.get('notification_ids', [])
           if not notification_ids:
               return Response(
                   {'error': 'notification_ids required'},
                   status=status.HTTP_400_BAD_REQUEST
               )
           
           # ... update logic ...
       except Exception as e:
           return Response(
               {'error': str(e)},
               status=status.HTTP_500_INTERNAL_SERVER_ERROR
           )
   ```

---

## Todo List

- [ ] Create ZoneImageViewSet with full CRUD
- [ ] Implement get_permissions for image upload (admin only)
- [ ] Create NotificationViewSet as ReadOnlyModelViewSet
- [ ] Implement unread-count custom action
- [ ] Implement mark-as-read custom action with bulk support
- [ ] Add select_related for query optimization
- [ ] Add filtering by is_read status
- [ ] Add proper ordering (newest first)
- [ ] Add pagination support
- [ ] Add error handling for bulk operations
- [ ] Add try-catch for edge cases
- [ ] Test all endpoints with HTTP client
- [ ] Verify permission enforcement
- [ ] Add docstrings to viewsets
- [ ] Test performance with large datasets

---

## Success Criteria

### API Endpoints
- ✅ GET /api/zones/{id}/images/ returns image list
- ✅ POST /api/zones/{id}/images/ uploads image (admin only)
- ✅ DELETE /api/zones/{id}/images/{img_id}/ removes image (admin only)
- ✅ GET /api/notifications/ lists user's notifications
- ✅ GET /api/notifications/unread-count/ returns count
- ✅ POST /api/notifications/mark-as-read/ marks bulk notifications
- ✅ GET /api/notifications/{id}/ retrieves single notification

### Permissions
- ✅ Admins can upload/delete images
- ✅ Tenants cannot upload/delete images
- ✅ Users see only their own notifications
- ✅ Non-authenticated users get 401 Unauthorized

### Performance
- ✅ Notifications list uses select_related (no N+1 queries)
- ✅ Images list is paginated if needed
- ✅ Unread-count query uses index (is_read + recipient)
- ✅ Bulk mark-as-read uses single UPDATE query

### Response Format
- ✅ Consistent JSON structure
- ✅ Proper HTTP status codes (200, 201, 400, 403, 404)
- ✅ Error messages are clear
- ✅ Pagination info included in list responses

---

## Risk Assessment

### Potential Issues

1. **N+1 Query Problems**
   - Risk: Notifications list loads actor for each notification
   - Mitigation: Use select_related('actor', 'recipient') in queryset

2. **Bulk Operation Limits**
   - Risk: Mark-as-read with 10,000 IDs could be slow
   - Mitigation: Implement pagination, limit to max 1000 per request

3. **Permission Bypass**
   - Risk: User sees others' notifications via direct ID access
   - Mitigation: Check recipient in retrieve() and update()

4. **Nested Route Complexity**
   - Risk: Zone image routes conflict with main routes
   - Mitigation: Use proper router setup with basename

---

## Security Considerations

### Authorization
- Always verify recipient matches current user for notifications
- Always verify admin role for image operations
- Use queryset filtering (not just permission classes)

### Data Isolation
- Notifications filtered in get_queryset, not just in serializer
- Images can be viewed by anyone but modified by admins only
- Bulk operations check user ownership

### Input Validation
- Validate notification_ids is list of integers
- Validate notification_ids is not empty
- Validate zone exists before creating images

---

## API Request/Response Examples

### Get Unread Count
```
GET /api/notifications/unread-count/ HTTP/1.1
Authorization: Bearer {token}

HTTP/1.1 200 OK
{
  "unread_count": 5
}
```

### Mark Notifications as Read
```
POST /api/notifications/mark-as-read/ HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json

{
  "notification_ids": [1, 2, 3]
}

HTTP/1.1 200 OK
{
  "status": "success",
  "updated_count": 3
}
```

### Upload Zone Image
```
POST /api/zones/1/images/ HTTP/1.1
Authorization: Bearer {token}
Content-Type: multipart/form-data

zone=1&position=1&image=@image.jpg

HTTP/1.1 201 CREATED
{
  "id": 1,
  "zone": 1,
  "image": "http://localhost:8000/media/zone_images/...",
  "position": 1,
  "created_at": "2026-04-10T12:00:00Z"
}
```

### List Notifications with Filtering
```
GET /api/notifications/?is_read=false HTTP/1.1
Authorization: Bearer {token}

HTTP/1.1 200 OK
{
  "count": 5,
  "next": "http://localhost:8000/api/notifications/?page=2&is_read=false",
  "previous": null,
  "results": [
    {
      "id": 1,
      "actor_username": "admin",
      "verb": "approved",
      "is_read": false,
      "created_at": "2026-04-10T14:30:00Z"
    }
  ]
}
```

---

## Next Steps

1. ✅ Read Phase 1, 2 & 3 completely
2. → Implement viewsets in views.py
3. → Test all endpoints with curl/Postman
4. → Move to Phase 4 (Signals & Triggers)
5. → Move to Phase 5 (URL Routing)

---

## Notes

- Use `@action(detail=False)` for collection-level endpoints (like unread-count)
- Use `detail=True` for single resource endpoints (like detail view)
- Always use `select_related` for foreign keys to prevent N+1
- Bulk operations should have reasonable size limits (max 1000 items)
- Consider rate limiting for mark-as-read to prevent abuse

---

## Appendix: Complete ViewSet Example

```python
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import ZoneImage, Notification, IndustrialZone
from .serializers import ZoneImageSerializer, NotificationSerializer
from .permissions import IsAdmin

class ZoneImageViewSet(viewsets.ModelViewSet):
    """API for zone images"""
    serializer_class = ZoneImageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        zone_id = self.kwargs.get('zone_pk')
        return ZoneImage.objects.filter(zone_id=zone_id).order_by('position')
    
    def get_permissions(self):
        if self.action in ['create', 'destroy', 'update']:
            return [IsAdmin()]
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        zone_id = self.kwargs.get('zone_pk')
        zone = get_object_or_404(IndustrialZone, pk=zone_id)
        serializer.save(zone=zone)

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """API for notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Notification.objects.filter(
            recipient=self.request.user
        ).select_related('actor', 'recipient')
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = Notification.objects.filter(
            recipient=request.user,
            is_read=False
        ).count()
        return Response({'unread_count': count})
    
    @action(detail=False, methods=['post'])
    def mark_as_read(self, request):
        notification_ids = request.data.get('notification_ids', [])
        
        if not notification_ids:
            return Response(
                {'error': 'notification_ids required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        with transaction.atomic():
            updated = Notification.objects.filter(
                id__in=notification_ids,
                recipient=request.user
            ).update(is_read=True)
        
        return Response({
            'status': 'success',
            'updated_count': updated
        })
```
