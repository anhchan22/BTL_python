---
phase: 6.2
title: Backend Security & Seed
duration: 1 day
priority: critical
status: complete
completion_date: 2026-04-08
dependencies: [phase-01]
---

# Phase 6.2: Backend Security & Seed

**Goal:** Create Django management commands for initial admin creation and demo data seeding. Update environment configuration.

**Files to Create:**
- `backend/api/management/commands/create_initial_admin.py`
- `backend/api/management/commands/seed_demo_zones.py` (update existing if present)

**Files to Modify:**
- `.env.example`
- `.env` (local dev only)

---

## Overview

Two Django management commands:

1. **create_initial_admin** - One-time setup script (reads INITIAL_ADMIN_* env vars, creates superuser + admin profile)
2. **seed_demo_zones** - Idempotent seed script (creates demo zones if none exist)

Both are idempotent: safe to run multiple times without duplicating data.

---

## Key Insights

- Commands run via `python manage.py <command>`
- Must handle case where data already exists (idempotent)
- Environment variables provide credentials (CI/CD friendly)
- No migrations needed (just data creation)
- Commands used in deployment pipeline + local development

---

## Requirements

### Functional
- [ ] create_initial_admin reads INITIAL_ADMIN_USER, INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD from .env
- [ ] create_initial_admin creates Django User + UserProfile with ADMIN role
- [ ] create_initial_admin is idempotent (checks if admin exists, skips if present)
- [ ] create_initial_admin outputs clear message ("Admin created" or "Admin already exists")
- [ ] seed_demo_zones creates ~5 demo industrial zones
- [ ] seed_demo_zones is idempotent (checks if zones exist, skips if present)
- [ ] seed_demo_zones outputs clear message with count of zones created
- [ ] Both commands have help text explaining usage
- [ ] Both commands can be called in any order relative to migrations

### Non-Functional
- [ ] Commands follow Django management command conventions
- [ ] Error handling for missing env vars (clear error message)
- [ ] No hardcoded credentials in code
- [ ] Timezone-aware datetime handling
- [ ] Commands are fast (<5 seconds each)

---

## Architecture

### Command Structure

```
backend/api/management/
├── __init__.py
├── commands/
│   ├── __init__.py
│   ├── create_initial_admin.py
│   └── seed_demo_zones.py
```

Both inherit from Django's `BaseCommand` class.

---

## Implementation Steps

### Step 1: Create create_initial_admin.py Command

Create `backend/api/management/commands/create_initial_admin.py`:

```python
import os
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import IntegrityError
from api.models import UserProfile


class Command(BaseCommand):
    """
    Create initial admin user from environment variables.
    Idempotent: safe to run multiple times.
    
    Usage:
        python manage.py create_initial_admin
    
    Required env vars:
        INITIAL_ADMIN_USER (username)
        INITIAL_ADMIN_EMAIL (email address)
        INITIAL_ADMIN_PASSWORD (password)
    """
    
    help = 'Create initial admin user from environment variables'
    
    def handle(self, *args, **options):
        # Read env vars
        username = os.getenv('INITIAL_ADMIN_USER')
        email = os.getenv('INITIAL_ADMIN_EMAIL')
        password = os.getenv('INITIAL_ADMIN_PASSWORD')
        
        # Validate env vars provided
        if not username or not email or not password:
            self.stdout.write(
                self.style.ERROR(
                    '❌ Error: Missing required environment variables\n'
                    '   Set: INITIAL_ADMIN_USER, INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD'
                )
            )
            return
        
        # Check if admin already exists
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(
                    f'⏭️  Admin user "{username}" already exists, skipping creation'
                )
            )
            return
        
        # Create superuser
        try:
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            
            # Create/update profile with ADMIN role
            profile, created = UserProfile.objects.get_or_create(user=user)
            profile.role = 'ADMIN'
            profile.save()
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Admin user created successfully!\n'
                    f'   Username: {username}\n'
                    f'   Email: {email}\n'
                    f'   Role: ADMIN'
                )
            )
        
        except IntegrityError as e:
            self.stdout.write(
                self.style.ERROR(
                    f'❌ Error creating admin: {str(e)}'
                )
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(
                    f'❌ Unexpected error: {str(e)}'
                )
            )
```

**Key Features:**
- ✅ Reads env vars at runtime (not hardcoded)
- ✅ Checks if user already exists before creating
- ✅ Creates Django superuser (for Django admin access)
- ✅ Creates UserProfile with ADMIN role
- ✅ Clear output messages (success/warning/error)
- ✅ Error handling for IntegrityError, missing vars
- ✅ Docstring explains usage

---

### Step 2: Create seed_demo_zones.py Command

Create `backend/api/management/commands/seed_demo_zones.py`:

```python
from django.core.management.base import BaseCommand
from decimal import Decimal
from api.models import IndustrialZone


class Command(BaseCommand):
    """
    Seed database with demo industrial zones.
    Idempotent: only creates if none exist.
    
    Usage:
        python manage.py seed_demo_zones
    """
    
    help = 'Seed database with demo industrial zones (runs only once)'
    
    def handle(self, *args, **options):
        # Check if zones already exist
        if IndustrialZone.objects.exists():
            count = IndustrialZone.objects.count()
            self.stdout.write(
                self.style.WARNING(
                    f'⏭️  Database already contains {count} zones, skipping seed'
                )
            )
            return
        
        # Define demo zones
        demo_zones = [
            {
                'name': 'Khu công nghiệp A - TP. HCM',
                'location': 'Thành phố Hồ Chí Minh - Bình Dương',
                'total_area': Decimal('5000.00'),
                'available_area': Decimal('5000.00'),
                'price_per_sqm': Decimal('50000.00'),
                'description': 'Khu công nghiệp hiện đại với hạ tầng hoàn chỉnh, gần Sài Gòn, tiếp cận thuận lợi',
                'amenities': 'Điện, nước, đường, cáp quang, bảo vệ 24/7, nhà xưởng chuẩn',
                'is_available': True,
            },
            {
                'name': 'Khu công nghiệp B - Long An',
                'location': 'Huyện Cần Đước, Tỉnh Long An',
                'total_area': Decimal('3500.00'),
                'available_area': Decimal('3200.00'),
                'price_per_sqm': Decimal('35000.00'),
                'description': 'Khu công nghiệp phát triển nhanh, chi phí thấp hơn, cách Sài Gòn 40km',
                'amenities': 'Điện, nước, đường, bảo vệ, khu vui chơi nhân viên',
                'is_available': True,
            },
            {
                'name': 'Khu công nghiệp C - Đồng Nai',
                'location': 'Huyện Long Thành, Tỉnh Đồng Nai',
                'total_area': Decimal('7000.00'),
                'available_area': Decimal('6500.00'),
                'price_per_sqm': Decimal('45000.00'),
                'description': 'Khu công nghiệp lớn nhất, cung cấp các lô đất từ 1000-5000m²',
                'amenities': 'Điện, nước, đường, cáp quang, bảo vệ 24/7, sân vận động, canteen',
                'is_available': True,
            },
            {
                'name': 'Khu công nghiệp D - Bình Phước',
                'location': 'Huyện Chơn Thành, Tỉnh Bình Phước',
                'total_area': Decimal('4000.00'),
                'available_area': Decimal('2500.00'),
                'price_per_sqm': Decimal('30000.00'),
                'description': 'Khu công nghiệp mới khai thác, giá rẻ nhất, thích hợp các doanh nghiệp khởi đầu',
                'amenities': 'Điện, nước, đường, bảo vệ',
                'is_available': True,
            },
            {
                'name': 'Khu công nghiệp E - Vũng Tàu',
                'location': 'Thành phố Vũng Tàu, Bà Rịa - Vũng Tàu',
                'total_area': Decimal('2000.00'),
                'available_area': Decimal('1800.00'),
                'price_per_sqm': Decimal('60000.00'),
                'description': 'Khu công nghiệp ven biển, lợi thế xuất nhập khẩu, gần cảng biển',
                'amenities': 'Điện, nước, đường, cáp quang, bảo vệ, kho hàng, bến cảng',
                'is_available': True,
            },
        ]
        
        # Create zones
        try:
            zones = [IndustrialZone(**zone_data) for zone_data in demo_zones]
            IndustrialZone.objects.bulk_create(zones)
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Demo zones created successfully!\n'
                    f'   Total: {len(zones)} zones\n'
                    f'   Total area: {sum(z["total_area"] for z in demo_zones)} m²'
                )
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(
                    f'❌ Error creating zones: {str(e)}'
                )
            )
```

**Key Features:**
- ✅ Checks if zones exist before creating (idempotent)
- ✅ Creates realistic demo data in Vietnamese
- ✅ Uses Decimal for financial data (no float precision issues)
- ✅ Bulk insert for efficiency
- ✅ Clear output with summary
- ✅ Error handling

---

### Step 3: Update .env.example

Edit `.env.example` (add to existing file):

```bash
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret-key-here

# Initial Admin User (created via: python manage.py create_initial_admin)
INITIAL_ADMIN_USER=admin
INITIAL_ADMIN_EMAIL=admin@example.com
INITIAL_ADMIN_PASSWORD=change-me-in-production

# Email Settings (optional, for future)
# EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USE_TLS=True
# EMAIL_HOST_USER=your-email@example.com
# EMAIL_HOST_PASSWORD=your-email-password
```

---

### Step 4: Update .env (Local Development)

Create or update `.env` in `backend/` directory (do NOT commit to git):

```bash
DEBUG=True
SECRET_KEY=dev-secret-key-12345
ALLOWED_HOSTS=localhost,127.0.0.1

DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

JWT_SECRET_KEY=dev-jwt-secret-12345

INITIAL_ADMIN_USER=admin
INITIAL_ADMIN_EMAIL=admin@example.com
INITIAL_ADMIN_PASSWORD=admin123
```

**⚠️ Important:** Add `.env` to `.gitignore` (should already be there):

```bash
# backend/.gitignore
.env
.env.local
```

---

### Step 5: Create Directory Structure

Ensure directories exist:

```bash
mkdir -p backend/api/management/commands
touch backend/api/management/__init__.py
touch backend/api/management/commands/__init__.py
```

---

### Step 6: Test Commands Locally

```bash
# Navigate to backend
cd backend

# Make migrations (if not already done)
python manage.py makemigrations

# Run migrations
python manage.py migrate

# Create initial admin
python manage.py create_initial_admin
# Output: ✅ Admin user created successfully!

# Seed demo zones
python manage.py seed_demo_zones
# Output: ✅ Demo zones created successfully! Total: 5 zones

# Verify in Django admin
python manage.py runserver
# Open http://localhost:8000/admin/
# Login with admin / admin123
# Check Users and Industrial Zones sections
```

---

### Step 7: Test Idempotency

Run commands again to verify they're idempotent:

```bash
# Run create_initial_admin again
python manage.py create_initial_admin
# Output: ⏭️  Admin user "admin" already exists, skipping creation

# Run seed_demo_zones again
python manage.py seed_demo_zones
# Output: ⏭️  Database already contains 5 zones, skipping seed

# ✅ No duplicates created!
```

---

### Step 8: Add to requirements.txt

Verify these are in `backend/requirements.txt`:

```
Django==5.x
djangorestframework==3.x
djangorestframework-simplejwt==5.x
python-decouple==3.x  # For reading .env vars
```

If using `python-decouple` for env vars, update commands:

```python
from decouple import config

username = config('INITIAL_ADMIN_USER', default='')
email = config('INITIAL_ADMIN_EMAIL', default='')
password = config('INITIAL_ADMIN_PASSWORD', default='')
```

Otherwise, use `os.getenv()` (shown in example above).

---

## Deployment Flow

### Local Development
```bash
1. python manage.py makemigrations
2. python manage.py migrate
3. python manage.py create_initial_admin        # Creates admin from .env
4. python manage.py seed_demo_zones             # Creates demo zones
5. python manage.py runserver
6. Frontend on http://localhost:3000
```

### Production / CI/CD
```bash
1. Set env vars via platform (GitHub Secrets, Docker env, etc.):
   - INITIAL_ADMIN_USER=prod_admin
   - INITIAL_ADMIN_EMAIL=admin@production.com
   - INITIAL_ADMIN_PASSWORD=<generated-secure-password>

2. Run in deployment pipeline:
   python manage.py migrate
   python manage.py create_initial_admin
   # Optionally: python manage.py seed_demo_zones (skip in prod if using real data)

3. Restart app server
4. Verify admin login works
```

---

## Success Criteria

- [ ] create_initial_admin.py exists and works
- [ ] Command reads INITIAL_ADMIN_* env vars
- [ ] Command creates Django superuser + UserProfile with ADMIN role
- [ ] Command is idempotent (doesn't duplicate on re-run)
- [ ] Command has clear success/warning/error messages
- [ ] seed_demo_zones.py exists and works
- [ ] Seed creates 5 demo zones with realistic data
- [ ] Seed is idempotent (checks if zones exist first)
- [ ] .env.example updated with all required vars
- [ ] Local .env has test credentials
- [ ] Both commands run in <5 seconds
- [ ] Django admin shows created users and zones
- [ ] No hardcoded credentials in code (only env vars)

---

## Troubleshooting

### Issue 1: "ModuleNotFoundError: No module named 'api'"
**Solution:** Ensure you're running from `backend/` directory with `python manage.py`

### Issue 2: "Missing required environment variables"
**Solution:** Check `.env` file exists in `backend/` with INITIAL_ADMIN_* vars set

### Issue 3: "User already exists, skipping"
**Solution:** This is expected behavior. Command is idempotent.

### Issue 4: "Database doesn't have a default auto-created primary key field"
**Solution:** Run `python manage.py migrate` first

---

## Related Files

- `backend/api/management/commands/create_initial_admin.py` - Admin creation command
- `backend/api/management/commands/seed_demo_zones.py` - Zone seeding command
- `backend/.env.example` - Environment variables template
- `backend/.env` - Local development secrets (not committed)
- `.gitignore` - Should include `.env`

---

## Next Phase

Once tested:
- **Proceed to:** [Phase 6.3: Frontend UI Pages](./phase-03-frontend-ui-pages.md)
- Build React pages for user management and profile updates
