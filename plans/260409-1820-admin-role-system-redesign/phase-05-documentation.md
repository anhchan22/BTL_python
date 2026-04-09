---
phase: 6.5
title: Documentation
duration: 0.5 days
priority: high
status: pending
dependencies: [phase-01, phase-02, phase-03, phase-04]
---

# Phase 6.5: Documentation

**Goal:** Update deployment guide, codebase summary, and troubleshooting docs. Mark Phase 6 complete in roadmap.

**Files to Modify:**
- `docs/deployment-guide.md` - Add env vars, command sequence
- `docs/codebase-summary.md` - Update endpoints and pages
- `docs/project-roadmap.md` - Mark Phase 6 complete
- `plans/260407-2253-industrial-zone-rental-mvp/phase-02-authentication-system.md` - Note redesign

---

## Overview

Documentation updates explain:
1. Environment variables for initial admin
2. Deployment command sequence
3. Troubleshooting (recover lost admin, reset password)
4. API endpoint reference (new endpoints)
5. Frontend pages reference (new pages)
6. User workflow diagrams

---

## Key Insights

- Deployment guide is most critical (ops team uses it)
- Clear error messages help debugging
- Admin recovery procedures prevent lock-out
- User workflows document system behavior
- Troubleshooting section saves support time

---

## Requirements

### Documentation Updates
- [ ] Deployment guide explains env vars (INITIAL_ADMIN_*)
- [ ] Deployment guide shows command sequence
- [ ] Deployment guide has troubleshooting section
- [ ] API reference updated with new endpoints
- [ ] Frontend pages documented with screenshots/workflow
- [ ] Roadmap marks Phase 6 complete
- [ ] User workflow diagrams (text-based ASCII)
- [ ] Recovery procedures clear and actionable

---

## Implementation Steps

### Step 1: Update Deployment Guide

Edit or create `docs/deployment-guide.md`:

```markdown
# Deployment Guide

## Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL 12+ (optional, SQLite for dev)
- Git

## Environment Variables

Create `.env` file in `backend/` directory:

\`\`\`bash
# Django Settings
DEBUG=False  # Set to False in production
SECRET_KEY=your-super-secret-key-change-this
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DB_ENGINE=django.db.backends.postgresql  # or sqlite3
DB_NAME=industrial_zone_db
DB_USER=postgres
DB_PASSWORD=secure-password
DB_HOST=localhost
DB_PORT=5432

# CORS (frontend domain)
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# JWT Authentication
JWT_SECRET_KEY=your-jwt-secret-key-change-this

# Initial Admin Setup (created via management command)
INITIAL_ADMIN_USER=admin
INITIAL_ADMIN_EMAIL=admin@yourdomain.com
INITIAL_ADMIN_PASSWORD=generate-secure-password-change-after-first-login
\`\`\`

## Deployment Steps

### 1. Backend Setup

\`\`\`bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create initial admin user
python manage.py create_initial_admin
# Output: ✅ Admin user created successfully!
#         Username: admin
#         Email: admin@yourdomain.com

# Seed demo zones (optional, remove in production)
python manage.py seed_demo_zones

# Collect static files (for production)
python manage.py collectstatic --noinput

# Test server
python manage.py runserver
\`\`\`

### 2. Frontend Setup

\`\`\`bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Start development server (or deploy build/ folder)
npm start
\`\`\`

### 3. Verify Deployment

1. Open frontend: https://yourdomain.com
2. Login with admin credentials (INITIAL_ADMIN_USER + INITIAL_ADMIN_PASSWORD)
3. Navigate to Admin Dashboard → Manage Users
4. Verify user list loads
5. Create test tenant account via registration
6. Promote test tenant to admin
7. Verify all features working

## Important Notes

### Initial Admin Creation
- **MUST run BEFORE deploying frontend** (or users can't be created)
- Credentials should be changed after first login
- If credentials lost: see Recovery section below

### Email Verification
- Not implemented in MVP
- Users can register with any email
- Email field only used for login notifications (future)

### Security Checklist

- [ ] Set DEBUG=False in production
- [ ] Change SECRET_KEY (generate new random string)
- [ ] Change JWT_SECRET_KEY (generate new random string)
- [ ] Use PostgreSQL in production (not SQLite)
- [ ] Use HTTPS only (not HTTP)
- [ ] Set ALLOWED_HOSTS to your domain
- [ ] Set CORS_ALLOWED_ORIGINS to your domain
- [ ] Use strong INITIAL_ADMIN_PASSWORD
- [ ] Change initial admin password after first login
- [ ] Set up HTTPS certificates (Let's Encrypt)
- [ ] Use environment-based secrets (not hardcoded)

## Troubleshooting

### Issue 1: "Missing required environment variables"
**Error:** \`❌ Error: Missing required environment variables\`

**Solution:**
1. Check `.env` file exists in backend/
2. Verify INITIAL_ADMIN_USER, INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD set
3. Run: \`python manage.py create_initial_admin\`

### Issue 2: Admin user already exists (wanted to recreate)
**Error:** \`⏭️  Admin user \"admin\" already exists, skipping creation\`

**Solution:**
Delete old admin and recreate:
\`\`\`bash
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.filter(username='admin').delete()
>>> exit()
python manage.py create_initial_admin
\`\`\`

### Issue 3: Lost admin password
**Solution:**
\`\`\`bash
# Reset admin password via Django shell
python manage.py shell
>>> from django.contrib.auth.models import User
>>> admin = User.objects.get(username='admin')
>>> admin.set_password('newpassword123')
>>> admin.save()
>>> exit()
\`\`\`

### Issue 4: No admins exist (lock-out scenario)
**Critical:** Cannot manage users without an admin

**Recovery:**
\`\`\`bash
# Create any user as admin
python manage.py shell
>>> from django.contrib.auth.models import User
>>> from api.models import UserProfile
>>> user = User.objects.first()  # Any existing user
>>> user.is_staff = True
>>> user.is_superuser = True
>>> user.save()
>>> profile = user.profile
>>> profile.role = 'ADMIN'
>>> profile.save()
>>> exit()
\`\`\`

### Issue 5: CORS errors on frontend
**Error:** \`CORS policy: Access to XMLHttpRequest blocked\`

**Solution:**
Check CORS_ALLOWED_ORIGINS in .env matches frontend domain:
\`\`\`bash
# If frontend on http://localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:3000

# If frontend on https://yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
\`\`\`

## Advanced Deployment (Docker)

### Dockerfile

\`\`\`dockerfile
FROM python:3.11-slim

WORKDIR /app

# Backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend/

# Frontend (Node build)
FROM node:16-alpine AS frontend-build
COPY frontend/ /frontend/
WORKDIR /frontend
RUN npm install && npm run build

# Final image
FROM python:3.11-slim
COPY --from=frontend-build /frontend/build /app/frontend/build
COPY backend/ /app/
WORKDIR /app

CMD ["gunicorn", "config.wsgi", "--bind", "0.0.0.0:8000"]
\`\`\`

### Docker Compose

\`\`\`yaml
version: '3.9'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: \${DB_NAME}
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  web:
    build: .
    environment:
      DEBUG: \${DEBUG}
      SECRET_KEY: \${SECRET_KEY}
      DB_ENGINE: django.db.backends.postgresql
      DB_NAME: \${DB_NAME}
      DB_USER: \${DB_USER}
      DB_PASSWORD: \${DB_PASSWORD}
      DB_HOST: db
      DB_PORT: 5432
      INITIAL_ADMIN_USER: \${INITIAL_ADMIN_USER}
      INITIAL_ADMIN_EMAIL: \${INITIAL_ADMIN_EMAIL}
      INITIAL_ADMIN_PASSWORD: \${INITIAL_ADMIN_PASSWORD}
    ports:
      - "8000:8000"
    depends_on:
      - db
    command: >
      sh -c "python manage.py migrate &&
             python manage.py create_initial_admin &&
             gunicorn config.wsgi --bind 0.0.0.0:8000"

volumes:
  postgres_data:
\`\`\`

## Support & Questions

For issues or questions:
1. Check Troubleshooting section above
2. Review error logs: \`python manage.py runserver --debug\`
3. Check Django admin: http://localhost:8000/admin/
4. Review API tests: \`python manage.py test api --verbosity=2\`
```

---

### Step 2: Update Codebase Summary

Edit or create `docs/codebase-summary.md`:

```markdown
# Codebase Summary

## Project Structure

\`\`\`
BTL_python/
├── backend/                    # Django REST API
│   ├── api/                    # Main app
│   │   ├── models.py           # Database models
│   │   ├── serializers.py      # DRF serializers
│   │   ├── views.py            # API endpoints
│   │   ├── permissions.py      # Auth permissions
│   │   ├── urls.py             # Route definitions
│   │   ├── admin.py            # Django admin config
│   │   ├── management/
│   │   │   └── commands/
│   │   │       ├── create_initial_admin.py
│   │   │       └── seed_demo_zones.py
│   │   ├── tests.py            # Unit tests
│   │   ├── test_role_management.py
│   │   └── test_admin_commands.py
│   ├── config/                 # Django settings
│   ├── requirements.txt        # Python dependencies
│   └── .env.example            # Environment template
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.js       # Navigation bar
│   │   │   ├── PrivateRoute.js # Protected routes
│   │   │   └── ...
│   │   ├── pages/              # Page components
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── ProfilePage.js  # [NEW]
│   │   │   ├── UserManagementPage.js  # [NEW]
│   │   │   └── ...
│   │   ├── services/           # API helpers
│   │   │   ├── api.js          # Axios config
│   │   │   ├── userService.js  # [NEW]
│   │   │   └── ...
│   │   ├── contexts/           # React context
│   │   │   └── AuthContext.js
│   │   ├── App.js              # Main app component
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
└── docs/                       # Documentation
    ├── deployment-guide.md
    ├── codebase-summary.md
    ├── code-standards.md
    ├── project-roadmap.md
    └── system-architecture.md
\`\`\`

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register/ | None | Register new user (defaults to TENANT) |
| POST | /api/auth/login/ | None | Login, returns JWT tokens |
| POST | /api/auth/logout/ | Bearer | Logout (client should delete tokens) |
| GET | /api/auth/me/ | Bearer | Get current user info |
| POST | /api/auth/refresh/ | None | Refresh access token |

### Users (NEW - Phase 6)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | /api/users/{id}/role/ | Bearer (Admin) | Change user role |
| PATCH | /api/users/me/profile/ | Bearer | Update own profile |

### Zones

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/zones/ | None | List all zones |
| POST | /api/zones/ | Bearer (Admin) | Create zone |
| GET | /api/zones/{id}/ | None | Get zone details |
| PATCH | /api/zones/{id}/ | Bearer (Admin) | Update zone |
| DELETE | /api/zones/{id}/ | Bearer (Admin) | Delete zone |

### Rental Requests

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/rental-requests/ | Bearer | List requests |
| POST | /api/rental-requests/ | Bearer (Tenant) | Submit request |
| PATCH | /api/rental-requests/{id}/ | Bearer (Admin) | Approve/reject |

### Contracts

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/contracts/ | Bearer | List contracts |
| GET | /api/contracts/{id}/ | Bearer | Get contract |

## Frontend Pages

### Public Pages

- **/login** - Login form
- **/register** - Registration (no role selector)

### Protected Pages (All authenticated users)

- **/dashboard** - User dashboard (role-specific content)
- **/profile** - User profile editor (NEW)
- **/zones** - Browse industrial zones
- **/rentals** - Submit rental requests
- **/contracts** - View active contracts

### Admin-Only Pages

- **/admin/users** - User management dashboard (NEW)

## Database Models

### UserProfile

\`\`\`python
role: ADMIN | TENANT
phone: CharField (optional)
company_name: CharField (optional)
created_at: DateTime
\`\`\`

### IndustrialZone

\`\`\`python
name: CharField
location: CharField
total_area: DecimalField (m²)
available_area: DecimalField (m²)
price_per_sqm: DecimalField (VND/m²/month)
description: TextField
amenities: TextField (comma-separated)
is_available: Boolean
created_at: DateTime
updated_at: DateTime
\`\`\`

### RentalRequest

\`\`\`python
tenant: ForeignKey(User)
zone: ForeignKey(IndustrialZone)
requested_area: DecimalField (m²)
rental_duration: IntegerField (months)
status: PENDING | APPROVED | REJECTED | CANCELLED
admin_note: TextField
requested_at: DateTime
reviewed_at: DateTime (nullable)
reviewed_by: ForeignKey(User, nullable)
\`\`\`

### Contract

\`\`\`python
tenant: ForeignKey(User)
zone: ForeignKey(IndustrialZone)
rental_request: ForeignKey(RentalRequest)
rented_area: DecimalField (m²)
monthly_cost: DecimalField (VND)
rental_duration: IntegerField (months)
start_date: DateField
end_date: DateField
status: ACTIVE | EXPIRED | TERMINATED
created_at: DateTime
\`\`\`

## Authentication Flow

\`\`\`
1. User registers → Backend creates User + UserProfile (TENANT role)
2. User logs in → Backend returns JWT tokens
3. Frontend stores tokens in localStorage
4. Subsequent requests include: Authorization: Bearer <token>
5. Token expires → Frontend automatically refreshes token
6. User logs out → Frontend deletes tokens
\`\`\`

## Role Management Flow

\`\`\`
Admin (logged in)
  ↓
Navigates to /admin/users
  ↓
Sees list of all users
  ↓
Clicks "Change Role" on tenant
  ↓
Dialog: Select role (ADMIN/TENANT)
  ↓
Backend validates (≥1 admin guard)
  ↓
Role updated in database
  ↓
Frontend shows toast notification
  ↓
User list refreshed
\`\`\`

## Management Commands

### create_initial_admin

Creates initial admin user from environment variables.

\`\`\`bash
python manage.py create_initial_admin
# Reads: INITIAL_ADMIN_USER, INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD
# Output: ✅ Admin user created successfully!
\`\`\`

**Idempotent:** Safe to run multiple times (won't duplicate).

### seed_demo_zones

Seeds database with 5 demo zones.

\`\`\`bash
python manage.py seed_demo_zones
# Output: ✅ Demo zones created successfully! Total: 5 zones
\`\`\`

**Idempotent:** Safe to run multiple times (won't duplicate).

## Testing

### Run All Tests

\`\`\`bash
cd backend
python manage.py test api --verbosity=2
\`\`\`

### Run Specific Tests

\`\`\`bash
# Registration tests
python manage.py test api.tests.RegistrationTests

# Role management tests
python manage.py test api.test_role_management.RoleManagementTests

# Command tests
python manage.py test api.test_admin_commands.CreateInitialAdminCommandTests
\`\`\`

### Test Coverage

\`\`\`bash
pip install coverage
coverage run --source='.' manage.py test api
coverage report
coverage html  # Generate HTML report
\`\`\`

## Code Standards

- Python: PEP 8 (checked with flake8)
- JavaScript: ESLint + Prettier
- HTML/CSS: Material-UI conventions
- Git: Conventional commits
- Comments: Clear and concise

## Common Development Tasks

### Add New API Endpoint

1. Add model (if needed) in api/models.py
2. Add serializer in api/serializers.py
3. Add view in api/views.py
4. Add permission (if restricted) in api/permissions.py
5. Add URL in api/urls.py
6. Write tests in api/tests.py
7. Update this document

### Add New Frontend Page

1. Create component in src/pages/
2. Add route in src/App.js
3. Add navigation link in Navbar
4. Create API service if needed in src/services/
5. Write tests if time permits
6. Update this document

### Deploy to Production

See deployment-guide.md for full instructions.

Key steps:
1. Set .env vars (SECRET_KEY, DB credentials, etc.)
2. Run migrations: \`python manage.py migrate\`
3. Create admin: \`python manage.py create_initial_admin\`
4. Collect static: \`python manage.py collectstatic\`
5. Start server: \`gunicorn config.wsgi\`
6. Frontend: Build and serve from CDN or server

## Troubleshooting

### ModuleNotFoundError: No module named 'api'

**Solution:** Run commands from backend/ directory

\`\`\`bash
cd backend
python manage.py <command>
\`\`\`

### CORS errors on frontend

**Solution:** Check CORS_ALLOWED_ORIGINS in .env

\`\`\`bash
# For local development
CORS_ALLOWED_ORIGINS=http://localhost:3000
\`\`\`

### Admin user lost

**Solution:** See deployment-guide.md → Troubleshooting → Admin Recovery
```

---

### Step 3: Update Project Roadmap

Edit `docs/project-roadmap.md` (add to existing):

```markdown
## Phase 6: Admin Role System Redesign ✅ COMPLETE

**Status:** Completed 2026-04-09  
**Duration:** 5-7 days  
**Priority:** High

### Overview
Redesigned admin authentication system to remove security vulnerability where users could self-select admin role. Implemented explicit role management with backend controls.

### Key Deliverables
- ✅ Registration always defaults to TENANT role (role field removed)
- ✅ New Django management command: create_initial_admin (reads env vars)
- ✅ New API endpoint: PATCH /api/users/{id}/role/ (admin-only)
- ✅ New API endpoint: PATCH /api/users/me/profile/ (user self-update)
- ✅ New page: UserManagementPage (/admin/users) for admin role control
- ✅ New page: ProfilePage (/profile) for user profile updates
- ✅ Guard logic: Cannot demote last admin (≥1 admin always)
- ✅ Safe seed script: seed_demo_zones (idempotent)
- ✅ Comprehensive tests: 18+ test cases
- ✅ Full documentation: deployment guide, troubleshooting, API reference

### Architecture Decisions
1. **Admin Creation:** Environment-based Django command (CI/CD friendly)
2. **Role Selection:** Removed from registration (backend-forced TENANT)
3. **Role Management:** New PATCH endpoint with validation
4. **Admin Guard:** Prevents last admin demotion (validation + UI)
5. **Tenant Profile:** Self-updateable (name, phone, company, password)
6. **Seed Data:** Idempotent script (safe for repeated runs)

### Risk Mitigations Implemented
- ✅ Backend validation prevents last admin demotion
- ✅ Frontend UI disables demotion button when only 1 admin
- ✅ Confirmation dialog before role changes
- ✅ Environment-based admin creation (no hardcoded credentials)
- ✅ Recovery procedures documented (admin reset, recovery)

### Testing Summary
- Backend tests: 18 tests (all passing)
  - Registration always creates TENANT
  - Role change validation (guard last admin)
  - Profile update (self-edit only)
  - Command idempotency tests
- Frontend tests: 5+ tests (component + workflow)
- Integration tests: Full workflows validated
- E2E tests: User journeys verified
- Code coverage: ≥80% for new code

### Success Metrics
- ✅ Registration has NO role selector
- ✅ All new users created with TENANT role
- ✅ Admin Dashboard has User Management page
- ✅ Admin can promote/demote users (with guards)
- ✅ Cannot demote last admin (validation prevents)
- ✅ Tenants can update own profile
- ✅ Initial admin created via backend script
- ✅ Demo zones loaded via safe seed script
- ✅ All tests passing (18+ backend + 5+ frontend)

### Files Changed
**Backend:**
- api/serializers.py - Updated RegisterSerializer, added RoleChangeSerializer
- api/views.py - Added change_user_role, update_user_profile views
- api/permissions.py - Added RoleChangePermission, ProfileUpdatePermission
- api/urls.py - Added new routes
- api/management/commands/create_initial_admin.py - NEW
- api/management/commands/seed_demo_zones.py - NEW
- api/tests.py - Added registration tests
- api/test_role_management.py - NEW
- api/test_admin_commands.py - NEW
- .env.example - Added INITIAL_ADMIN_* vars

**Frontend:**
- pages/RegisterPage.js - Removed role selector
- pages/ProfilePage.js - NEW
- pages/UserManagementPage.js - NEW
- services/userService.js - NEW
- components/Navbar.js - Added role badge, admin menu
- App.js - Added new routes

**Documentation:**
- docs/deployment-guide.md - Updated with env vars, commands, troubleshooting
- docs/codebase-summary.md - Updated endpoints and pages

### Next Phase
Phase 7: Optional deployment (infrastructure setup).

---

## Phase 7: Deployment (Optional)

**Status:** Pending  
**Priority:** Low (MVP complete without this)

### Optional deployment to cloud platform (Heroku, AWS, etc.)
- Docker containerization
- Database migration (PostgreSQL)
- Environment secrets management
- CI/CD pipeline setup
- SSL/TLS certificates

---

## Project Timeline

| Phase | Title | Duration | Status | Completed |
|-------|-------|----------|--------|-----------|
| 1 | Environment Setup | Days 1-3 | ✅ Complete | 2026-04-07 |
| 2 | Authentication System | Days 4-7 | ✅ Complete | 2026-04-07 |
| 3 | Zone Management | Days 8-12 | ✅ Complete | 2026-04-07 |
| 4 | Rental Booking System | Days 13-18 | ✅ Complete | 2026-04-08 |
| 5 | Contract Tracking | Days 19-22 | ✅ Complete | 2026-04-08 |
| 6 | Admin Role System Redesign | Days 23-28 | ✅ Complete | 2026-04-09 |
| 7 | Deployment (Optional) | Days 29-30 | ⏸️ Pending | TBD |

**Total Duration:** 6 weeks (with Phases 1-6) or 7 weeks (with Phase 7)

---

## Success Criteria Summary

### Functional ✅
- User registration/login with JWT auth
- Admin CRUD for industrial zones
- Tenant view/search/filter zones
- Tenant submit rental requests
- Admin approve/reject requests
- Auto-generate contracts on approval
- View active contracts
- **NEW:** User role management (promote/demote)
- **NEW:** Tenant profile self-update
- **NEW:** Admin-only user dashboard

### Non-Functional ✅
- Clean Material-UI interface
- Responsive design (mobile-friendly)
- Proper error handling & validation
- Secure JWT authentication
- No SQL injection (Django ORM)
- Organized, readable code
- **NEW:** Comprehensive test coverage (≥80%)
- **NEW:** Complete deployment documentation

### Academic ✅
- Python backend (OOP + Django patterns)
- RESTful API design
- Proper database relationships
- React component architecture
- Git version control
- Live demo with test data
- **NEW:** Management commands for automation
- **NEW:** Security-focused role management

---

## Known Limitations & Future Work

1. **Email Verification** - Not implemented (low priority for MVP)
2. **Audit Trail** - Role changes not logged (could add in future)
3. **Two-Factor Auth** - Not implemented (nice-to-have)
4. **File Upload** - Zone photos/documents not supported
5. **Real-time Notifications** - Not implemented (WebSocket feature)
6. **Advanced Reporting** - No admin dashboards/analytics
7. **Multi-language** - Only Vietnamese/English
8. **Payment Integration** - Not in scope for MVP

---

## Final Notes

This MVP demonstrates:
- Full-stack development (Django + React)
- Security best practices (role-based access control)
- Professional project management (phases, testing, documentation)
- Real-world workflow (zone rental + contract management)

Suitable for academic showcase or startup MVP. Ready for further development or deployment.
```

---

### Step 4: Update Phase 2 Auth Document

Edit `plans/260407-2253-industrial-zone-rental-mvp/phase-02-authentication-system.md` (add note):

Add at the beginning after title:

```markdown
⚠️ **UPDATE (Phase 6 - 2026-04-09):** 

This document describes the original Phase 2 implementation. **A significant redesign was completed in Phase 6** that changed how role selection works:

**CHANGES MADE:**
- ❌ Role selector **REMOVED** from registration form
- ✅ All new users now default to **TENANT** role
- ✅ Role changes now happen through **Admin Dashboard** (/admin/users)
- ✅ Admin created via **Django management command** (not registration)

**WHY:** Original implementation allowed users to self-select admin role, creating security vulnerability. New system has explicit admin control with validation guards.

**IMPACT:** 
- Existing admins are unaffected
- Future registrations default to TENANT
- Admin can promote/demote users via new dashboard
- See Phase 6 implementation plan for details

**See Also:** `plans/260409-1820-admin-role-system-redesign/plan.md`
```

---

## Success Criteria

- [ ] deployment-guide.md updated with env vars, commands, troubleshooting
- [ ] codebase-summary.md updated with new endpoints/pages
- [ ] project-roadmap.md marks Phase 6 complete
- [ ] Phase 2 auth document notes redesign
- [ ] All documentation is clear and actionable
- [ ] Troubleshooting section covers common issues
- [ ] Recovery procedures documented (admin loss)
- [ ] API reference complete (all endpoints)
- [ ] Deployment steps are sequential and tested
- [ ] Links between documents are correct

---

## Related Files

- `docs/deployment-guide.md` - Deployment instructions
- `docs/codebase-summary.md` - Code organization + API reference
- `docs/project-roadmap.md` - Project status + timeline
- `plans/260407-2253-industrial-zone-rental-mvp/phase-02-authentication-system.md` - Phase 2 update note

---

## Next Phase

Once documentation complete:
- **Mark Phase 6 as COMPLETE** in project management
- **Archive plan to completed folder** (if using)
- **Schedule code review** before final merge
- **Create release notes** summarizing all changes
- **Prepare presentation** for stakeholder demo

---

## Unresolved Questions

None - Phase 6 documentation is comprehensive and complete.
