# Backend API Quick Reference

## Authentication
```bash
# All endpoints require Bearer token
Authorization: Bearer {access_token}

# Get token from login
POST /api/auth/login/
  username: "user"
  password: "pass"
  
Response:
{
  "tokens": {
    "access": "eyJ0eXAi...",
    "refresh": "eyJ0eXAi..."
  }
}
```

---

## Zone Endpoints

### List Zones
```bash
GET /api/zones/
  ?search=name
  ?available=true
  ?min_price=10
  ?max_price=100
  ?min_area=1000
  ?ordering=-created_at

Response: 200 with paginated results
```

### Get Zone with Images
```bash
GET /api/zones/{id}/

Response: 200
{
  "id": 1,
  "name": "Zone A",
  "images": [
    {
      "id": 1,
      "image_url": "https://...",
      "alt_text": "View",
      "display_order": 0
    }
  ],
  "image_count": 1,
  ...
}
```

---

## Image Management

### Add Image (Admin Only)
```bash
POST /api/zones/{zone_id}/images/
Authorization: Bearer {admin_token}

Request:
{
  "image_url": "https://example.com/zone.jpg",
  "alt_text": "Front entrance",
  "display_order": 0
}

Response: 201 Created
```

### Delete Image (Admin Only)
```bash
DELETE /api/zones/{zone_id}/images/{image_id}/
Authorization: Bearer {admin_token}

Response: 204 No Content
```

---

## Notifications

### List User Notifications
```bash
GET /api/notifications/?page=1&page_size=20
Authorization: Bearer {token}

Response: 200 with paginated list
```

### Get Unread Count
```bash
GET /api/notifications/unread-count/
Authorization: Bearer {token}

Response: 200
{
  "unread_count": 3,
  "total_count": 10
}
```

### Mark Notifications as Read

#### Mark All
```bash
POST /api/notifications/mark-as-read/
Authorization: Bearer {token}

Request:
{
  "mark_all": true
}

Response: 200
{
  "detail": "10 notifications marked as read",
  "marked_count": 10
}
```

#### Mark Specific
```bash
POST /api/notifications/mark-as-read/
Authorization: Bearer {token}

Request:
{
  "notification_ids": [1, 3, 5]
}

Response: 200
{
  "detail": "3 notifications marked as read",
  "marked_count": 3
}
```

### Mark Single Notification
```bash
POST /api/notifications/{id}/mark_single/
Authorization: Bearer {token}

Response: 200 with updated notification
```

---

## Notification Verb Types

| Verb | Triggered | Actor | Recipient |
|------|-----------|-------|-----------|
| `request_created` | Tenant submits request | Tenant | All Admins |
| `request_approved` | Admin approves request | Admin | Tenant |
| `request_rejected` | Admin rejects request | Admin | Tenant |
| `contract_created` | Contract auto-created | Admin | Tenant |

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |

---

## Common Workflows

### Get Zone Images for Gallery
```
1. GET /api/zones/{zone_id}/
2. Extract zone.images[] array
3. Render in ImageGallery
```

### Check Notifications
```
1. GET /api/notifications/unread-count/ (on page load)
2. Display badge with unread_count
3. Poll every 30 seconds to update count
4. On dropdown click: GET /api/notifications/?page=1
```

### Mark Notifications
```
POST /api/notifications/mark-as-read/
{
  "notification_ids": [1, 2, 3]
}
→ UI updates to remove unread styling
```

---

## Testing with curl

```bash
# Save token
TOKEN="eyJ0eXAi..."

# Get zones with images
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/zones/1/

# Add image
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"image_url":"https://...", "alt_text":"..."}' \
  http://localhost:8000/api/zones/1/images/

# Get notifications
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/notifications/

# Get unread count
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/notifications/unread-count/

# Mark as read
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mark_all":true}' \
  http://localhost:8000/api/notifications/mark-as-read/
```

---

## Browsable API

Visit `http://localhost:8000/api/` to explore endpoints interactively

---

**Status:** Ready for use ✅  
**Last Updated:** 2026-04-10
