# System Architecture Diagram

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Django Backend API                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────┐         ┌──────────────────┐                   │
│  │   REST API      │         │  Authentication  │                   │
│  │  (ViewSets)     │◄───────►│  (JWT Tokens)    │                   │
│  └────────┬────────┘         └──────────────────┘                   │
│           │                                                          │
│           ├──────────────────┬──────────────────┐                   │
│           │                  │                  │                   │
│           ▼                  ▼                  ▼                   │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ ZoneImageView   │  │Notification  │  │  Existing    │            │
│  │   Set (New)     │  │  ViewSet     │  │   ViewSets   │            │
│  │                 │  │  (New)       │  │  (Zone,      │            │
│  │ -list/create    │  │              │  │   Rental,    │            │
│  │ -destroy        │  │ -list        │  │   Contract)  │            │
│  │ -permissions    │  │ -unread_cnt  │  │              │            │
│  │ -admin-only     │  │ -mark_read   │  │              │            │
│  └────────┬────────┘  └──────┬───────┘  └──────┬───────┘            │
│           │                  │                 │                    │
└───────────┼──────────────────┼─────────────────┼────────────────────┘
            │                  │                 │
            ▼                  ▼                 ▼
  ┌──────────────────────────────────────────────────────┐
  │            Django ORM / Models Layer                 │
  ├──────────────────────────────────────────────────────┤
  │                                                      │
  │  ┌──────────────────┐      ┌─────────────────┐      │
  │  │ ZoneImage (NEW)  │      │ Notification    │      │
  │  │                  │      │ (NEW)           │      │
  │  │ - zone (FK)      │      │                 │      │
  │  │ - image (File)   │      │ - recipient(FK) │      │
  │  │ - position       │      │ - actor (FK)    │      │
  │  │ - created_at     │      │ - verb          │      │
  │  │                  │      │ - target_ids    │      │
  │  │ Constraints:     │      │ - is_read       │      │
  │  │ - 1-6 per zone   │      │ - created_at    │      │
  │  │ - JPG/PNG only   │      │                 │      │
  │  │ - Max 5MB        │      │ Indexes:        │      │
  │  │                  │      │ - (rcpt, date)  │      │
  │  │ Signals:         │      │ - (rcpt, read)  │      │
  │  │ - (none)         │      │                 │      │
  │  │                  │      │ Signals:        │      │
  │  │                  │      │ - RentalRequest │      │
  │  │                  │      │   .post_save    │      │
  │  │                  │      │ - Contract      │      │
  │  │                  │      │   .post_save    │      │
  │  └──────────────────┘      └─────────────────┘      │
  │           │                         │                │
  │      (Existing Models)              │                │
  │  - User (Auth)                      │                │
  │  - IndustrialZone                   │                │
  │  - RentalRequest ◄──────────────────┘                │
  │  - Contract                                          │
  │  - UserProfile                                       │
  │                                                      │
  └──────────────────────────────────────────────────────┘
            │
            ▼
  ┌──────────────────────────────────────────────────────┐
  │         Database Layer (SQLite3)                     │
  ├──────────────────────────────────────────────────────┤
  │                                                      │
  │  zone_images (table)       notifications (table)    │
  │  - id (PK)                 - id (PK)                │
  │  - zone_id (FK) *indexed   - recipient_id (FK)      │
  │  - image (file path)       - actor_id (FK)          │
  │  - position                - verb (choices)         │
  │  - created_at              - rental_request_id      │
  │                            - contract_id            │
  │                            - is_read *indexed       │
  │                            - created_at             │
  │                                                      │
  │  (Plus existing tables)                             │
  │  - auth_user               - industrial_zones       │
  │  - user_profiles           - rental_requests        │
  │  - contracts               - etc.                   │
  │                                                      │
  └──────────────────────────────────────────────────────┘
            │
            ▼
  ┌──────────────────────────────────────────────────────┐
  │  File System (Django Media)                          │
  ├──────────────────────────────────────────────────────┤
  │                                                      │
  │  media/                                              │
  │  └── zone_images/                                    │
  │      ├── zone1_img1.jpg                              │
  │      ├── zone1_img2.jpg                              │
  │      ├── zone2_img1.png                              │
  │      └── ...                                         │
  │                                                      │
  └──────────────────────────────────────────────────────┘
```

---

## Signal Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Signal Trigger Flow                            │
└─────────────────────────────────────────────────────────────────────┘

Scenario 1: Tenant Creates Rental Request
═══════════════════════════════════════════

  Tenant                    Django App                  Database
    │                           │                           │
    │─ POST /rentals ───────────►│                           │
    │                           │                           │
    │                    RentalRequest.save()               │
    │                           │                           │
    │                    @pre_save receiver                 │
    │                    Cache old_status = None            │
    │                           │                           │
    │                    INSERT INTO rental_requests        │
    │                           ├──────────────────────────►│
    │                           │                       [Created]
    │                           │                           │
    │                    @post_save receiver (created=True) │
    │                    ├─ Get admin user                  │
    │                    │                                  │
    │                    ├─ INSERT INTO notifications       │
    │                    │   (recipient=admin, actor=tenant,│
    │                    │    verb='created', rental_id=X)  │
    │                    │───────────────────────────────────►
    │                    │                              [Created]
    │◄─── 201 Created ───┤                                  │
    │


Scenario 2: Admin Approves Rental Request
═════════════════════════════════════════

  Admin                     Django App                  Database
    │                           │                           │
    │─ PATCH /rentals/1 ───────►│                           │
    │  status=APPROVED          │                           │
    │                    RentalRequest.save()               │
    │                           │                           │
    │                    @pre_save receiver                 │
    │                    old_status = 'PENDING' (cached)    │
    │                           │                           │
    │                    UPDATE rental_requests             │
    │                    SET status='APPROVED'              │
    │                           ├──────────────────────────►│
    │                           │                     [Updated]
    │                           │                           │
    │                    @post_save receiver                │
    │                    Check: old_status != new_status    │
    │                    ├─ APPROVED: verb='approved'       │
    │                    │                                  │
    │                    ├─ INSERT INTO notifications       │
    │                    │   (recipient=tenant, actor=admin,│
    │                    │    verb='approved', rental_id=X) │
    │                    │───────────────────────────────────►
    │                    │                              [Created]
    │◄─── 200 OK ────────┤                                  │
    │


Scenario 3: Contract Created from Approved Request
══════════════════════════════════════════════════

  Backend (Auto)            Django App                  Database
    [Approval Flow]              │                           │
         │                       │                           │
         └─ Contract.create()    │                           │
                                 │                           │
                          @post_save receiver (created=True) │
                          ├─ Get admin user                  │
                          │                                  │
                          ├─ INSERT INTO notifications       │
                          │   (recipient=tenant, actor=admin,│
                          │    verb='completed',             │
                          │    contract_id=Y, rental_id=X)   │
                          │───────────────────────────────────►
                          │                              [Created]


Tenant Views Notification
═════════════════════════

  Tenant                    Django App                  Database
    │                           │                           │
    │─ GET /notifications ─────►│                           │
    │                    @queryset filter:                  │
    │                    recipient=current_user             │
    │                           │                           │
    │                    SELECT * FROM notifications        │
    │                    WHERE recipient_id=TENANT_ID       │
    │                    ORDER BY -created_at               │
    │                           ├──────────────────────────►│
    │                           │                       [Found N]
    │◄─── 200 with data ────────┤                           │
    │
    │─ POST /mark-as-read ─────►│                           │
    │  notification_ids=[1]     │                           │
    │                    UPDATE notifications               │
    │                    SET is_read=True                   │
    │                    WHERE recipient_id=TENANT_ID       │
    │                      AND id IN (1)                    │
    │                           ├──────────────────────────►│
    │                           │                    [Updated]
    │◄─── 200 success ──────────┤                           │
    │
```

---

## API Request/Response Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                        API Request Flow                              │
└──────────────────────────────────────────────────────────────────────┘

Upload Zone Image (POST /api/zones/1/images/)
═════════════════════════════════════════════

Client (Admin)                  DRF Router              ViewSet
    │                               │                     │
    │─ POST /api/zones/1/images/───►│                     │
    │  - zone: 1                    │                     │
    │  - image: <binary>            │─ route params ────►│
    │  - position: 1                │                     │
    │  - Auth: Bearer TOKEN         │                     │
    │                               │ ┌──────────────────┐│
    │                               │ │ get_permissions()││
    │                               │ │ → IsAdmin()      ││
    │                               │ └──────────────────┘│
    │                               │                  ✓ Check
    │                               │ ┌──────────────────┐│
    │                               │ │ get_serializer() ││
    │                               │ │ → ZoneImageUpload││
    │                               │ └──────────────────┘│
    │                               │                  ✓ Validate
    │                               │ ┌──────────────────┐│
    │                               │ │ perform_create() ││
    │                               │ │ → ORM save()     ││
    │                               │ └──────────────────┘│
    │                               │                  ✓ Save
    │                               │                     │
    │◄─── 201 Created ──────────────┤◄────────────────────│
    │  - id: 1                                             │
    │  - zone: 1                                           │
    │  - image: /media/zone_images/...                    │
    │  - position: 1                                       │
    │  - created_at: "2026-04-10T12:00Z"                  │


List Notifications (GET /api/notifications/)
═════════════════════════════════════════════

Client (Tenant)                 DRF Router              ViewSet
    │                               │                     │
    │─ GET /api/notifications/ ────►│                     │
    │  - Auth: Bearer TOKEN         │─ route params ────►│
    │  - query_string: is_read=false│                     │
    │                               │ ┌──────────────────┐│
    │                               │ │ get_permissions()││
    │                               │ │ → IsAuthenticated││
    │                               │ └──────────────────┘│
    │                               │                  ✓ Check
    │                               │ ┌──────────────────┐│
    │                               │ │ get_queryset()   ││
    │                               │ │ Filter by user   ││
    │                               │ │ Apply is_read    ││
    │                               │ │ select_related() ││
    │                               │ └──────────────────┘│
    │                               │                  ✓ Query DB
    │                               │ ┌──────────────────┐│
    │                               │ │ get_serializer() ││
    │                               │ │ → NotificationList││
    │                               │ │ Paginate results ││
    │                               │ └──────────────────┘│
    │                               │                  ✓ Serialize
    │◄─── 200 OK ────────────────────┤◄────────────────────│
    │  - count: 5                                          │
    │  - next: null                                        │
    │  - previous: null                                    │
    │  - results: [...]                                    │


Mark As Read (POST /api/notifications/mark-as-read/)
════════════════════════════════════════════════════

Client (Tenant)                 DRF Router              ViewSet
    │                               │                     │
    │─ POST /mark-as-read/ ─────────►│                     │
    │  - notification_ids: [1,2,3]  │─ route action ────►│
    │  - Auth: Bearer TOKEN         │                     │
    │                               │ ┌──────────────────┐│
    │                               │ │ @action POST     ││
    │                               │ │ mark_as_read()   ││
    │                               │ │                  ││
    │                               │ │ UPDATE with      ││
    │                               │ │ transaction()    ││
    │                               │ └──────────────────┘│
    │                               │                  ✓ Update DB
    │                               │                     │
    │◄─── 200 OK ────────────────────┤◄────────────────────│
    │  - status: "success"                                 │
    │  - updated_count: 3                                  │


Unread Count (GET /api/notifications/unread-count/)
════════════════════════════════════════════════════

Client (Tenant)                 DRF Router              ViewSet
    │                               │                     │
    │─ GET /unread-count/ ──────────►│                     │
    │  - Auth: Bearer TOKEN         │─ route action ────►│
    │                               │                     │
    │                               │ ┌──────────────────┐│
    │                               │ │ @action GET      ││
    │                               │ │ unread_count()   ││
    │                               │ │                  ││
    │                               │ │ SELECT COUNT(*) ││
    │                               │ │ FROM notifns     ││
    │                               │ │ WHERE is_read=F  ││
    │                               │ └──────────────────┘│
    │                               │                  ✓ Count DB
    │◄─── 200 OK ────────────────────┤◄────────────────────│
    │  - unread_count: 5                                   │
```

---

## Database Schema Diagram

```
┌───────────────────────────────────┐         ┌──────────────────────┐
│      auth_user                    │         │   user_profiles      │
├───────────────────────────────────┤         ├──────────────────────┤
│ id (PK)                           │         │ id (PK)              │
│ username (UNIQUE)                 │◄────────│ user_id (FK)         │
│ email                             │         │ role (ADMIN/TENANT)  │
│ first_name                        │         │ phone                │
│ last_name                         │         │ company_name         │
│ password                          │         │ created_at           │
│ is_staff                          │         └──────────────────────┘
│ is_active                         │
│ date_joined                       │
└───────────────────────────────────┘
        ▲       │
        │       │
        │       ├──────────┐
        │       │          │
        │       ▼          ▼
        │   ┌────────────────────────────┐     ┌──────────────────────┐
        │   │  rental_requests           │     │  industrial_zones    │
        │   ├────────────────────────────┤     ├──────────────────────┤
        │   │ id (PK)                    │     │ id (PK)              │
        │   │ tenant_id (FK)─────────┐   │     │ name                 │
        │   │ zone_id (FK)───────┐   │   │     │ location             │
        │   │ requested_area     │   │   │     │ total_area           │
        │   │ rental_duration    │   │   │     │ available_area       │
        │   │ status             │   │   │     │ price_per_sqm        │
        │   │ admin_note         │   │   │     │ description          │
        │   │ requested_at       │   │   │     │ amenities            │
        │   │ reviewed_at        │   │   │     │ is_available         │
        │   │ reviewed_by_id (FK)├───┼───┤     │ created_at           │
        │   └────────────────────────────┘     │ updated_at           │
        │           │                          └──────────────────────┘
        │           │
        │           ├──────────────────┐
        │           │                  │
        │           ▼                  ▼
        │    ┌──────────────────┐  ┌─────────────────────┐
        │    │ contracts        │  │ zone_images (NEW)   │
        │    ├──────────────────┤  ├─────────────────────┤
        │    │ id (PK)          │  │ id (PK)             │
        │    │ rental_request_id├──┤ zone_id (FK)────────┤
        │    │ contract_number  │  │ image (FileField)   │
        │    │ tenant_id (FK)   │  │ position            │
        │    │ zone_id (FK)     │  │ created_at          │
        │    │ area             │  │                     │
        │    │ monthly_rent     │  │ Indexes:            │
        │    │ start_date       │  │ - zone_id, position │
        │    │ end_date         │  └─────────────────────┘
        │    │ status           │
        │    │ created_at       │
        │    └──────────────────┘
        │
        └─────────────────────────┐
                                  │
        ┌─────────────────────────┘
        │
        ▼
    ┌──────────────────────────────┐
    │ notifications (NEW)          │
    ├──────────────────────────────┤
    │ id (PK)                      │
    │ recipient_id (FK)────────────┤─► auth_user
    │ actor_id (FK)────────────────┤─► auth_user
    │ verb (choices)               │
    │ rental_request_id (INT)      │
    │ contract_id (INT)            │
    │ is_read (BOOLEAN, default=F) │
    │ created_at (TIMESTAMP)       │
    │                              │
    │ Indexes:                     │
    │ - (recipient_id, created_at) │
    │ - (recipient_id, is_read)    │
    └──────────────────────────────┘

Key: FK = Foreign Key, INT = Integer (for polymorphic lookup)
```

---

## Data Flow Diagram

```
User Actions                    Backend Processing              Database Impact
═════════════════════════════════════════════════════════════════════════════

1. TENANT CREATES REQUEST
─────────────────────────
POST /rentals/
  ↓
Serializer.validate()
  ├─ Check area available
  ├─ Check duration > 0
  └─ Save to DB
      ↓
      INSERT rental_requests
      ↓
      Signal: post_save (created=True)
        ├─ Get admin user
        └─ INSERT notification (verb='created')


2. ADMIN APPROVES REQUEST
──────────────────────────
PATCH /rentals/{id}/
  ├─ Old status: PENDING
  │
  └─ Update status: APPROVED
      ↓
      Signal: pre_save
        └─ Cache old_status
      │
      Signal: post_save
        ├─ Compare old vs new status
        ├─ Status changed → APPROVED
        │
        ├─ INSERT notification (verb='approved')
        │
        └─ Contract generation (business logic)
            ├─ Calculate dates
            ├─ INSERT contract
            │
            └─ Signal: post_save (contract created=True)
                ├─ Get admin & tenant
                └─ INSERT notification (verb='completed')


3. TENANT VIEWS NOTIFICATIONS
───────────────────────────────
GET /notifications/
  ├─ get_queryset()
  │  └─ SELECT * FROM notifications
  │     WHERE recipient_id = TENANT_ID
  │
  ├─ select_related('actor', 'recipient')
  │  └─ JOIN to avoid N+1 queries
  │
  └─ Paginate + serialize
     └─ LIMIT 20


4. TENANT MARKS READ
─────────────────────
POST /mark-as-read/
  ├─ Validate notification IDs
  ├─ Verify recipient matches user
  │
  └─ UPDATE notifications
     SET is_read = True
     WHERE recipient_id = TENANT_ID
       AND id IN (1, 2, 3)


5. ADMIN UPLOADS IMAGE
───────────────────────
POST /zones/{id}/images/
  ├─ Verify admin (permission check)
  ├─ Validate file
  │  ├─ Check type (JPG, PNG)
  │  ├─ Check size (< 5MB)
  │  └─ Check count (< 6 per zone)
  │
  ├─ Save file to media/zone_images/
  │
  └─ INSERT zone_images
     ├─ zone_id = {id}
     ├─ image = file_path
     └─ position = {auto}


6. TENANT VIEWS ZONE
─────────────────────
GET /zones/{id}/
  ├─ SELECT zone_id = {id}
  │
  └─ Nested: images array
     ├─ SELECT * FROM zone_images
     │  WHERE zone_id = {id}
     │  ORDER BY position
     │
     └─ Serialize with image URLs
        └─ Convert file paths to HTTP URLs
```

---

## Query Optimization Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│              Query Optimization Checkpoints                         │
└─────────────────────────────────────────────────────────────────────┘

❌ BAD: N+1 Problem
───────────────────
for notification in Notification.objects.all():  # Query 1
    print(notification.actor.username)           # Query 2-N
    # Result: 1 + N queries


✅ GOOD: select_related()
──────────────────────────
notifications = Notification.objects.select_related(
    'actor', 'recipient'
).all()
for notification in notifications:               # Query 1 (with JOIN)
    print(notification.actor.username)           # No additional query


Notification List (Typical: 20 items)
─────────────────────────────────────

❌ BAD: 21 queries
  - 1 query: notifications
  - 20 queries: for each notification.actor.username

✅ GOOD: 1 query with JOIN
  SELECT notifications.*, actor.username, recipient.username
  FROM notifications
  JOIN auth_user AS actor ON actor.id = notifications.actor_id
  JOIN auth_user AS recipient ON recipient.id = notifications.recipient_id
  WHERE notifications.recipient_id = {user_id}
  ORDER BY notifications.created_at DESC


Index Strategy
──────────────

Frequent Queries:
  1. notifications WHERE recipient = X AND is_read = False
     → Index: (recipient_id, is_read)

  2. notifications WHERE recipient = X ORDER BY -created_at
     → Index: (recipient_id, -created_at)

  3. zone_images WHERE zone = X ORDER BY position
     → Index: (zone_id, position)


Performance Benchmarks
──────────────────────

Unread Count Query:
  SELECT COUNT(*) FROM notifications 
  WHERE recipient_id = 1 AND is_read = False
  → With index: < 1ms
  → Without index: 50-100ms (full table scan)

List Notifications (20 items):
  With select_related + index:
  → 1 query: ~5-10ms
  → Pagination: ~2-5ms per page

List Zone Images (6 items):
  SELECT * FROM zone_images WHERE zone_id = 1
  → With index: < 1ms
  → No N+1 risk (small result set)
```

---

## Notes on Architecture

### Design Principles Applied
1. **DRY (Don't Repeat Yourself)** - Signals prevent manual notification creation
2. **SOLID Principles** - Separate models, serializers, views
3. **Performance First** - Indexes on hot queries, select_related optimization
4. **Security** - Permission classes at viewset level, not just URLs
5. **Testability** - Isolated components, mockable dependencies

### Extensibility Points
1. **Notification Types** - Add new verbs without code changes
2. **Image Variants** - Add image resizing (thumbs, preview)
3. **Real-time Updates** - WebSocket layer can be added later
4. **Email/SMS** - Signals can trigger async tasks
5. **Storage Backends** - Switch to S3 via django-storages

### Scalability Considerations
1. **Database** - Notification table will grow; plan archival
2. **File Storage** - Move to S3 for production
3. **Caching** - Add Redis for zone images, notification counts
4. **Async** - Use Celery for image processing (resize, compress)
5. **Sharding** - Consider partitioning notifications by date
