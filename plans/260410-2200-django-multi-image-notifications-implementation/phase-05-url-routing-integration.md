# Phase 5: URL Routing & Integration

**Status:** Pending (Blocked by Phase 1-4)
**Priority:** High
**Estimated Duration:** 0.5 days
**Dependencies:** Phase 1 ✓, Phase 2 ✓, Phase 3 ✓

---

## Context Links

- Main Plan: `../plan.md`
- Phase 3: `../phase-03-views-and-viewsets.md`
- Related: `backend/api/urls.py`
- Related: `backend/config/urls.py`

---

## Overview

Phase 5 registers the new viewsets in URL routing and integrates them with the existing Django REST Framework router setup. This makes the API endpoints publicly accessible.

---

## Key Insights

### Current Routing Patterns
- Uses DefaultRouter from DRF for viewset routing
- Nested routes for related resources (implicit via URL structure)
- Both function-based and viewset-based views mixed
- Router automatically creates list/detail/create/update/delete endpoints

### Design Decisions

**Nested Routing for ZoneImages**
- Use router.register with basename for nested resources
- Path: /api/zones/{zone_pk}/images/
- Requires custom nesting setup or SimpleRouter

**NotificationViewSet Registration**
- Root-level endpoint: /api/notifications/
- Custom actions accessible at: /api/notifications/unread-count/, /api/notifications/mark-as-read/

---

## Requirements

### Functional Requirements
1. Register ZoneImageViewSet for nested image routes
2. Register NotificationViewSet for notification routes
3. Maintain existing zone/rental/contract routes
4. Support custom actions (unread-count, mark-as-read)
5. All routes protected by authentication (except zones list)
6. Media serving configured for image files

### Non-Functional Requirements
1. No breaking changes to existing routes
2. Consistent URL naming conventions
3. Proper HTTP method mapping (GET, POST, DELETE)
4. CORS headers for frontend access
5. Media files served correctly in development

---

## Architecture

### URL Structure

```
/api/
├── zones/                           [GET list, POST create]
│   └── {id}/
│       ├── [GET detail, PUT update, DELETE destroy]
│       └── images/
│           ├── [GET list, POST create]
│           └── {image_id}/
│               [GET detail, DELETE destroy]
├── rentals/                         [Existing endpoints]
│   └── ...
├── contracts/                       [Existing endpoints]
│   └── ...
└── notifications/                   [NEW]
    ├── [GET list]
    ├── {id}/ [GET detail]
    ├── unread-count/ [GET]
    └── mark-as-read/ [POST]
```

### Media Configuration

```
/media/
└── zone_images/
    ├── zone1_img1.jpg
    ├── zone1_img2.jpg
    └── ...
```

---

## Related Code Files

### Files to Create
- No new files

### Files to Modify
1. `backend/api/urls.py` - Register new viewsets
2. `backend/config/urls.py` - Add media serving (optional)

---

## Implementation Steps

### Step 1: Update api/urls.py with Notification ViewSet
1. Open `backend/api/urls.py`
2. Add NotificationViewSet import:
   ```python
   from . import views
   # Should already have DefaultRouter imported
   ```
3. Register NotificationViewSet with router:
   ```python
   router.register(r'notifications', views.NotificationViewSet, basename='notification')
   ```

### Step 2: Implement Nested Routing for ZoneImages
1. Add NestedRouter for zone images (requires drf-nested-routers package):
   ```python
   from rest_framework_nested import routers
   
   # Create main router
   router = DefaultRouter()
   router.register(r'zones', views.IndustrialZoneViewSet, basename='zone')
   
   # Create nested router for zone images
   zones_router = routers.NestedDefaultRouter(
       router, 'zones', lookup='zone'
   )
   zones_router.register(
       'images', views.ZoneImageViewSet, basename='zone-image'
   )
   
   urlpatterns = [
       path('', include(router.urls)),
       path('', include(zones_router.urls)),
   ]
   ```

### Step 3: Handle Missing drf-nested-routers (Alternative)
1. If package not available, implement manual routing:
   ```python
   from .views import ZoneImageViewSet
   
   # In urlpatterns, add manual nested route:
   urlpatterns = [
       # ... existing patterns ...
       path('zones/<int:zone_pk>/images/', 
            ZoneImageViewSet.as_view({
                'get': 'list',
                'post': 'create'
            }), name='zone-image-list'),
       path('zones/<int:zone_pk>/images/<int:pk>/', 
            ZoneImageViewSet.as_view({
                'get': 'retrieve',
                'delete': 'destroy'
            }), name='zone-image-detail'),
   ]
   ```

### Step 4: Verify Router Configuration
1. Complete urls.py should look like:
   ```python
   from django.urls import path, include
   from rest_framework.routers import DefaultRouter
   from rest_framework_simplejwt.views import TokenRefreshView
   from . import views
   
   # Create router
   router = DefaultRouter()
   router.register(r'zones', views.IndustrialZoneViewSet, basename='zone')
   router.register(r'rentals', views.RentalRequestViewSet, basename='rental')
   router.register(r'contracts', views.ContractViewSet, basename='contract')
   router.register(r'notifications', views.NotificationViewSet, basename='notification')
   
   urlpatterns = [
       path('', include(router.urls)),
       # ... auth endpoints ...
       # ... user endpoints ...
   ]
   ```

### Step 5: Configure Media Serving (Development)
1. Open `backend/config/urls.py`
2. Add media serving for development:
   ```python
   from django.conf import settings
   from django.conf.urls.static import static
   
   urlpatterns = [
       path('admin/', admin.site.urls),
       path('api/', include('api.urls')),
   ]
   
   # Serve media files in development
   if settings.DEBUG:
       urlpatterns += static(
           settings.MEDIA_URL, 
           document_root=settings.MEDIA_ROOT
       )
   ```

### Step 6: Verify Settings Configuration
1. Check `backend/config/settings.py` has:
   ```python
   MEDIA_URL = '/media/'
   MEDIA_ROOT = BASE_DIR / 'media'
   ```

### Step 7: Test Routing with Django
1. Run development server:
   ```bash
   cd backend
   python manage.py runserver
   ```
2. Test endpoints:
   ```bash
   # Test notification list
   curl -H "Authorization: Bearer {token}" \
        http://localhost:8000/api/notifications/
   
   # Test unread count
   curl -H "Authorization: Bearer {token}" \
        http://localhost:8000/api/notifications/unread-count/
   
   # Test zone images list (nested)
   curl http://localhost:8000/api/zones/1/images/
   ```

### Step 8: Verify Route Names
1. Test with Django shell:
   ```python
   from django.urls import reverse
   
   # Test route names
   print(reverse('notification-list'))  # /api/notifications/
   print(reverse('zone-image-list', kwargs={'zone_pk': 1}))  # /api/zones/1/images/
   ```

### Step 9: Documentation & Comments
1. Add comments to urls.py:
   ```python
   # Router for main resources
   router = DefaultRouter()
   router.register(r'zones', views.IndustrialZoneViewSet, basename='zone')
   router.register(r'rentals', views.RentalRequestViewSet, basename='rental')
   router.register(r'contracts', views.ContractViewSet, basename='contract')
   router.register(r'notifications', views.NotificationViewSet, basename='notification')
   
   # Note: Zone images are nested via viewset get_queryset filtering
   #       No separate router needed, URLs are /api/zones/{zone_pk}/images/
   ```

---

## Todo List

- [ ] Import NotificationViewSet and ZoneImageViewSet
- [ ] Register NotificationViewSet with router
- [ ] Set up nested routing for ZoneImageViewSet
- [ ] Verify MEDIA_URL and MEDIA_ROOT in settings
- [ ] Test media file serving
- [ ] Add static/media serving in urls.py (if DEBUG)
- [ ] Test all endpoint routing
- [ ] Verify permission classes work via router
- [ ] Test custom actions (@action routes)
- [ ] Test nested routes with zone_pk parameter
- [ ] Verify no route conflicts
- [ ] Add URL documentation

---

## Success Criteria

### Routing
- ✅ GET /api/notifications/ returns notifications
- ✅ POST /api/notifications/mark-as-read/ marks read
- ✅ GET /api/notifications/unread-count/ returns count
- ✅ GET /api/zones/{id}/images/ lists images
- ✅ POST /api/zones/{id}/images/ uploads image
- ✅ DELETE /api/zones/{id}/images/{img_id}/ removes image

### Media Files
- ✅ Uploaded images accessible at /media/zone_images/
- ✅ Image URLs returned in API responses
- ✅ Images serve with correct content-type

### Integration
- ✅ No breaking changes to existing routes
- ✅ All custom actions accessible
- ✅ Permission classes enforced via router
- ✅ Authentication works on all protected endpoints

---

## Risk Assessment

### Potential Issues

1. **Missing drf-nested-routers Package**
   - Risk: ImportError if not installed
   - Mitigation: Use manual routing as fallback

2. **Route Name Conflicts**
   - Risk: Duplicate endpoint names
   - Mitigation: Use unique basename in all registrations

3. **Media Files Not Serving**
   - Risk: Images 404 in development
   - Mitigation: Check DEBUG=True, check static serving config

4. **Nested Route Lookup Errors**
   - Risk: /api/zones/invalid/images/ returns 404 or 500
   - Mitigation: Implement proper 404 handling in viewset

---

## Security Considerations

### Authentication
- All notification endpoints require authentication
- Zone image upload restricted to admins
- Zone image list/retrieve open (no files exposed in list)

### Authorization
- Use permission classes in viewsets, not just URLs
- Permission checking happens before view execution
- No bypass possible via direct URL access

### Media Files
- Images stored outside web root (secure)
- Files served through Django, not directly
- No arbitrary file access possible

---

## API Documentation Update

### New Endpoints Summary

| Method | Path | Description | Auth | Admin |
|--------|------|-------------|------|-------|
| GET | /api/notifications/ | List user notifications | ✅ | ✗ |
| GET | /api/notifications/{id}/ | Get notification details | ✅ | ✗ |
| GET | /api/notifications/unread-count/ | Get unread count | ✅ | ✗ |
| POST | /api/notifications/mark-as-read/ | Mark notifications read | ✅ | ✗ |
| GET | /api/zones/{zone_pk}/images/ | List zone images | ✗ | ✗ |
| POST | /api/zones/{zone_pk}/images/ | Upload zone image | ✅ | ✅ |
| GET | /api/zones/{zone_pk}/images/{id}/ | Get image details | ✗ | ✗ |
| DELETE | /api/zones/{zone_pk}/images/{id}/ | Remove image | ✅ | ✅ |

---

## Next Steps

1. ✅ Read Phase 1-5 completely
2. → Update urls.py with new viewsets
3. → Test routing with curl/Postman
4. → Move to Phase 6 (Testing)

---

## Notes

- Use DefaultRouter (includes browsable API view)
- basename parameter is required for viewsets without queryset filtering
- Keep API routes RESTful and conventional
- Document any non-standard routes
- Consider API versioning in future (v1, v2)

---

## Appendix: Complete URLs Configuration

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

# Create router for main resources
router = DefaultRouter()
router.register(r'zones', views.IndustrialZoneViewSet, basename='zone')
router.register(r'rentals', views.RentalRequestViewSet, basename='rental')
router.register(r'contracts', views.ContractViewSet, basename='contract')
router.register(r'notifications', views.NotificationViewSet, basename='notification')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),

    # Test endpoint
    path('hello/', views.hello_world, name='hello-world'),

    # Authentication endpoints
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/me/', views.get_current_user, name='current-user'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # User management endpoints
    path('users/', views.get_all_users, name='get-all-users'),
    path('users/<int:user_id>/role/', views.change_user_role, name='change-user-role'),
    path('users/me/profile/', views.update_user_profile, name='update-profile'),

    # Note: Zone images routes are served via router at /api/zones/{zone_pk}/images/
    # This requires ZoneImageViewSet.get_queryset to filter by zone_pk
]
```
