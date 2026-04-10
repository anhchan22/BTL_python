# Phase 2: Serializers & API Response Structure

**Status:** Pending (Blocked by Phase 1)
**Priority:** High
**Estimated Duration:** 1-1.5 days
**Dependencies:** Phase 1 ✓

---

## Context Links

- Main Plan: `../plan.md`
- Phase 1: `../phase-01-setup-and-models.md`
- Related: `backend/api/serializers.py`
- Related: `backend/api/models.py`

---

## Overview

Phase 2 focuses on creating serializers for the new models and updating existing serializers to include nested image data. This phase bridges the models and views by defining how data is transformed to/from JSON.

---

## Key Insights

### Current Serializer Patterns
- Use `serializers.ModelSerializer` as base class
- Read-only fields for computed properties
- Nested serializers for related objects
- Custom validators for business logic
- Write/read separation (different serializers for create vs list)

### Design Decisions

**ZoneImageSerializer**
- Read-only except for file uploads (POST only)
- Include: id, zone_id, image (file), position, created_at
- Custom validation for file type/size (redundant with model, but provides better error messages)
- Use FileField for image (will handle base64 or multipart uploads)

**IndustrialZoneSerializer (Updated)**
- Add nested `images` array (read-only)
- Use many=True to include all ZoneImages
- Keep existing fields intact
- Consider pagination for zones with many images

**NotificationSerializer**
- All fields read-only (notifications are immutable after creation)
- Include human-readable verb display
- Include recipient/actor user info (nested)
- Include target object info (depends on verb type)
- Computed field: time_since_created

**NotificationListSerializer**
- Lighter version for list views
- Include: id, actor, verb, is_read, created_at
- Exclude sensitive target data (or include type indicator)

---

## Requirements

### Functional Requirements
1. Serialize ZoneImage with file data (can be URL or base64)
2. Include images array in zone serialization
3. Serialize notifications with all contextual data
4. Validate image files during deserialization
5. Return consistent datetime formats (ISO 8601)
6. Support pagination for large image lists

### Non-Functional Requirements
1. Serializer fields match frontend expectations
2. Consistent error messages across all serializers
3. Avoid N+1 query problems (use select_related)
4. Proper separation of create vs list serializers
5. Base64 file encoding support for image uploads

---

## Architecture

### Serializer Hierarchy

```
ZoneImageSerializer (ModelSerializer)
├── ImageField(source='image')
├── PrimaryKeyRelatedField(source='zone')
├── IntegerField(source='position')
└── DateTimeField(source='created_at', read_only=True)

IndustrialZoneSerializer (Updated ModelSerializer)
├── images (ZoneImageSerializer(many=True, read_only=True))
├── ... existing fields ...
└── is_fully_rented (ReadOnlyField)

NotificationSerializer (ModelSerializer)
├── recipient (UserSerializer, read_only=True)
├── actor (UserSerializer, read_only=True)
├── verb (CharField, choices)
├── rental_request_id, contract_id (IntegerField)
├── is_read (BooleanField)
├── created_at (DateTimeField, read_only=True)
└── get_verb_display (SerializerMethodField)

NotificationListSerializer (Lightweight version)
├── id, actor, verb, is_read, created_at
└── (Excludes user details, target IDs)
```

---

## Related Code Files

### Files to Create
- No new files (all added to existing serializers.py)

### Files to Modify
1. `backend/api/serializers.py` - Add all serializers
2. `backend/api/models.py` - Add help_text/verbose_name for better display

### Files NOT to Touch
- `backend/api/views.py` (Phase 3)
- `backend/api/urls.py` (Phase 5)

---

## Implementation Steps

### Step 1: Add ZoneImageSerializer
1. Open `backend/api/serializers.py`
2. Add ZoneImageSerializer class:
   ```python
   class ZoneImageSerializer(serializers.ModelSerializer):
       class Meta:
           model = ZoneImage
           fields = ['id', 'zone', 'image', 'position', 'created_at']
           read_only_fields = ['id', 'created_at']
   
       def validate_image(self, value):
           # Additional validation beyond model
           if value.size > 5 * 1024 * 1024:  # 5MB
               raise serializers.ValidationError("File too large")
           return value
   ```

### Step 2: Create NotificationSerializer
1. Add NotificationSerializer class:
   ```python
   class NotificationSerializer(serializers.ModelSerializer):
       recipient = UserSerializer(read_only=True)
       actor = UserSerializer(read_only=True)
       verb_display = serializers.CharField(source='get_verb_display', read_only=True)
       
       class Meta:
           model = Notification
           fields = ['id', 'recipient', 'actor', 'verb', 'verb_display', 
                     'rental_request_id', 'contract_id', 'is_read', 'created_at']
           read_only_fields = ['id', 'created_at', 'recipient', 'actor']
   ```

### Step 3: Create NotificationListSerializer
1. Add lightweight version for list views:
   ```python
   class NotificationListSerializer(serializers.ModelSerializer):
       actor_username = serializers.CharField(source='actor.username', read_only=True)
       verb_display = serializers.CharField(source='get_verb_display', read_only=True)
       
       class Meta:
           model = Notification
           fields = ['id', 'actor_username', 'verb', 'verb_display', 'is_read', 'created_at']
           read_only_fields = ['id', 'created_at']
   ```

### Step 4: Update IndustrialZoneSerializer
1. Modify existing IndustrialZoneSerializer:
   ```python
   class IndustrialZoneSerializer(serializers.ModelSerializer):
       images = ZoneImageSerializer(many=True, read_only=True)
       is_fully_rented = serializers.ReadOnlyField()
       
       class Meta:
           model = IndustrialZone
           fields = [
               'id', 'name', 'location', 'total_area', 'available_area',
               'price_per_sqm', 'description', 'amenities', 'is_available',
               'is_fully_rented', 'images', 'created_at', 'updated_at'
           ]
           read_only_fields = ['id', 'images', 'created_at', 'updated_at']
   ```

### Step 5: Handle Image Upload Serializer
1. Create separate serializer for image uploads:
   ```python
   class ZoneImageUploadSerializer(serializers.ModelSerializer):
       class Meta:
           model = ZoneImage
           fields = ['zone', 'image', 'position']
       
       def validate(self, attrs):
           # Check 1-6 image limit
           zone = attrs['zone']
           existing_count = zone.images.count()
           if existing_count >= 6:
               raise serializers.ValidationError(
                   "Maximum 6 images per zone reached"
               )
           return attrs
   ```

### Step 6: Test Serializer Outputs
1. Create test script or shell:
   ```python
   from api.serializers import ZoneImageSerializer, NotificationSerializer
   from api.models import ZoneImage, Notification
   
   # Test serialization
   zone_img = ZoneImage.objects.first()
   serializer = ZoneImageSerializer(zone_img)
   print(serializer.data)
   ```

### Step 7: Verify Nested Serialization
1. Test zone with images:
   ```python
   from api.serializers import IndustrialZoneSerializer
   from api.models import IndustrialZone
   
   zone = IndustrialZone.objects.first()
   serializer = IndustrialZoneSerializer(zone)
   # Should include 'images' array in output
   ```

---

## Todo List

- [ ] Import ZoneImage and Notification models in serializers.py
- [ ] Create ZoneImageSerializer with validation
- [ ] Create ZoneImageUploadSerializer with image count validation
- [ ] Create NotificationSerializer with full details
- [ ] Create NotificationListSerializer (lightweight)
- [ ] Update IndustrialZoneSerializer to include images
- [ ] Add verb_display field to notification serializers
- [ ] Add UserSerializer imports if needed
- [ ] Add custom validation methods for file types
- [ ] Add docstrings to serializers
- [ ] Test serialization in Django shell
- [ ] Test deserialization (POST requests)
- [ ] Verify nested object serialization
- [ ] Document serializer usage in comments

---

## Success Criteria

### Serialization
- ✅ ZoneImage serializes with correct fields
- ✅ Zone includes images array
- ✅ Notification includes actor/recipient info
- ✅ All datetime fields are ISO 8601 format

### Validation
- ✅ File size validation rejects files > 5MB
- ✅ Image count validation rejects > 6 images
- ✅ Invalid file types rejected
- ✅ Required fields enforced

### API Response
- ✅ Consistent JSON structure
- ✅ Proper read_only_fields enforcement
- ✅ Nested objects serialize correctly
- ✅ Hyperlinks/IDs included where appropriate

### Performance
- ✅ No N+1 queries (use select_related in views)
- ✅ List serializers are lightweight
- ✅ Image URLs are valid and accessible

---

## Risk Assessment

### Potential Issues

1. **Circular Serialization**
   - Risk: Zone → Images → Zone infinite loop
   - Mitigation: Use read_only=True on nested relationships

2. **Large Image Lists**
   - Risk: Serializing 6 full images per zone is slow
   - Mitigation: Paginate images or use simplified serializer

3. **Base64 Encoding Size**
   - Risk: Base64 images are 33% larger
   - Mitigation: Use multipart/form-data, return URLs not data

4. **Missing Dependencies**
   - Risk: Pillow not installed for ImageField
   - Mitigation: Check pip install, validate in tests

---

## Security Considerations

### File Upload Validation
- Always validate file type (not just extension)
- Always validate file size before processing
- Store files outside web root (Django handles this)
- Never trust MIME type from client

### Data Exposure
- Notification serializer may expose user info
- Limit what user data is visible (username, not email)
- Use read_only_fields to prevent modification

### API Rate Limiting
- Prepare for: image upload endpoints should be rate-limited
- Prepare for: notification queries should be paginated

---

## API Response Examples

### Zone with Images
```json
{
  "id": 1,
  "name": "Zone A",
  "location": "Ho Chi Minh",
  "total_area": 10000,
  "available_area": 5000,
  "price_per_sqm": 50000,
  "description": "...",
  "amenities": "...",
  "is_available": true,
  "is_fully_rented": false,
  "images": [
    {
      "id": 1,
      "zone": 1,
      "image": "http://localhost:8000/media/zone_images/zone1_img1.jpg",
      "position": 1,
      "created_at": "2026-04-10T12:00:00Z"
    },
    {
      "id": 2,
      "zone": 1,
      "image": "http://localhost:8000/media/zone_images/zone1_img2.jpg",
      "position": 2,
      "created_at": "2026-04-10T12:05:00Z"
    }
  ],
  "created_at": "2026-04-01T00:00:00Z",
  "updated_at": "2026-04-10T12:05:00Z"
}
```

### Notification
```json
{
  "id": 1,
  "recipient": {
    "id": 2,
    "username": "tenant1",
    "email": "tenant@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "actor": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "first_name": "Admin",
    "last_name": "User"
  },
  "verb": "approved",
  "verb_display": "Request Approved",
  "rental_request_id": 5,
  "contract_id": null,
  "is_read": false,
  "created_at": "2026-04-10T14:30:00Z"
}
```

### Notification List (Lightweight)
```json
{
  "id": 1,
  "actor_username": "admin",
  "verb": "approved",
  "verb_display": "Request Approved",
  "is_read": false,
  "created_at": "2026-04-10T14:30:00Z"
}
```

---

## Next Steps

1. ✅ Read Phase 1 & 2 completely
2. → Implement serializers in models.py/serializers.py
3. → Test serialization in Django shell
4. → Move to Phase 3 (Views & ViewSets)
5. → Review serializer output before view implementation

---

## Notes

- Use `source` parameter for computed fields (e.g., `source='get_verb_display'`)
- Read-only nested serializers don't need writable=True
- Image URLs should be absolute (set REST_FRAMEWORK['ABSOLUTE_URL_NAMES'] if needed)
- Consider creating separate serializers for POST vs GET
- For file uploads, test both multipart and base64 encoding

---

## Appendix: Serializer Validation Example

```python
class ZoneImageUploadSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(
        max_length=None,
        allow_empty_file=False,
        use_url=True
    )
    
    class Meta:
        model = ZoneImage
        fields = ['zone', 'image', 'position']
    
    def validate_image(self, value):
        # File type validation
        allowed_types = ['image/jpeg', 'image/png']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Only JPEG and PNG images are allowed"
            )
        
        # File size validation
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError(
                "File size must not exceed 5MB"
            )
        
        return value
    
    def validate(self, attrs):
        zone = attrs.get('zone')
        if zone and zone.images.count() >= 6:
            raise serializers.ValidationError(
                "Maximum 6 images per zone reached"
            )
        return attrs
```
