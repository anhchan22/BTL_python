---
phase: 6.1
title: Backend API Endpoints
duration: 1.5 days
priority: critical
status: complete
completion_date: 2026-04-08
dependencies: [phase-05]
---

# Phase 6.1: Backend API Endpoints

**Goal:** Implement 3 new API endpoints + modify registration endpoint to enable admin role management system.

**Files to Modify:**
- `backend/api/serializers.py`
- `backend/api/views.py`
- `backend/api/permissions.py`

**Files to Create:**
- None (all work in existing files)

---

## Overview

Current system allows users to select role during registration. New system:
1. **Remove role field** from registration (backend forces TENANT)
2. **Add RoleChangePermission** (admin-only validation)
3. **Add PATCH /api/users/{id}/role/** endpoint (admin promotes/demotes)
4. **Add PATCH /api/users/me/profile/** endpoint (user self-updates profile)

---

## Key Insights

- `RegisterSerializer` currently accepts `role` field - must remove
- New endpoints must validate: ≥1 admin always exists
- Password updates require old password validation
- All endpoints return updated UserSerializer response
- No database schema changes needed (role column exists)

---

## Requirements

### Functional
- [ ] RegisterSerializer removes role field, defaults TENANT on backend
- [ ] RoleChangePermission validates admin-only access
- [ ] PATCH /api/users/{id}/role/ validates ≥1 admin, returns user + message
- [ ] PATCH /api/users/me/profile/ allows self-update only
- [ ] Password changes require old_password + confirmation
- [ ] Email updates possible (no verification required for MVP)
- [ ] Phone and company_name updateable
- [ ] Error messages clear and informative

### Non-Functional
- [ ] Proper HTTP status codes (200, 400, 403, 404)
- [ ] Serializer validation comprehensive
- [ ] Permission classes reusable for future endpoints
- [ ] No N+1 queries in list endpoints
- [ ] Type hints in Python code

---

## Architecture

### API Contract

**1. PATCH /api/users/{id}/role/** (Admin-only)
```
Request:
  Headers: Authorization: Bearer <admin_token>
  Body: { "role": "ADMIN" | "TENANT" }

Response (200):
  {
    "user": {
      "id": 1,
      "username": "john",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "profile": {
        "role": "ADMIN",
        "phone": "0123456789",
        "company_name": "ABC Corp"
      }
    },
    "message": "User promoted to ADMIN"
  }

Response (400):
  { "error": "Cannot demote last admin" }

Response (403):
  { "detail": "Permission denied" }

Response (404):
  { "detail": "User not found" }
```

**2. PATCH /api/users/me/profile/** (Authenticated users)
```
Request:
  Headers: Authorization: Bearer <user_token>
  Body: {
    "first_name": "John",
    "last_name": "Doe",
    "phone": "0123456789",
    "company_name": "ABC Corp",
    "old_password": "current_password" (required if changing password),
    "password": "new_password" (optional),
    "password_confirm": "new_password"
  }

Response (200):
  {
    "user": { ... },
    "message": "Profile updated successfully"
  }

Response (400):
  { "error": "Old password incorrect" | "Passwords don't match" }
```

**3. Update Register Endpoint Response**
```
POST /api/auth/register/
Request:
  Body: {
    "username": "newuser",
    "email": "user@example.com",
    "password": "...",
    "password_confirm": "...",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "0123456789",
    "company_name": "ABC Corp"
    // ❌ NO role field
  }

Response (201):
  {
    "message": "User registered successfully",
    "user": {
      "id": 1,
      "username": "newuser",
      "email": "user@example.com",
      "profile": {
        "role": "TENANT",  // ✅ Always TENANT
        "phone": "0123456789",
        "company_name": "ABC Corp"
      }
    },
    "tokens": { ... }
  }
```

---

## Implementation Steps

### Step 1: Update RegisterSerializer

Edit `backend/api/serializers.py`:

```python
class RegisterSerializer(serializers.ModelSerializer):
    """User registration - no role selection (defaults to TENANT)"""
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, required=True)
    phone = serializers.CharField(max_length=15, required=False, allow_blank=True)
    company_name = serializers.CharField(max_length=200, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'phone', 'company_name'
        ]
        # ❌ REMOVED: 'role' field
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {"password": "Passwords don't match"}
            )
        return attrs
    
    def create(self, validated_data):
        """Create user with TENANT role (forced on backend)"""
        password_confirm = validated_data.pop('password_confirm')
        phone = validated_data.pop('phone', '')
        company_name = validated_data.pop('company_name', '')
        
        # Create user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        # Update profile with TENANT role (forced, not user-selectable)
        user.profile.role = 'TENANT'  # ✅ Always TENANT
        user.profile.phone = phone
        user.profile.company_name = company_name
        user.profile.save()
        
        return user
```

**Changes:**
- ❌ Remove `role` field from fields list
- ❌ Remove `role = serializers.ChoiceField(...)`
- ✅ Add forced `role = 'TENANT'` in create() method
- ✅ Add `phone` and `company_name` fields to support full profile creation

---

### Step 2: Create RoleChangePermission

Edit `backend/api/permissions.py`:

```python
class RoleChangePermission(BasePermission):
    """Allow access only to admin users for role management"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            hasattr(request.user, 'profile') and
            request.user.profile.role == 'ADMIN'
        )


class ProfileUpdatePermission(BasePermission):
    """Allow users to update their own profile, admins can update any"""
    
    def has_object_permission(self, request, view, obj):
        # Users can update their own profile
        if request.user.id == obj.id:
            return True
        # Admins can update any profile
        if request.user.profile.role == 'ADMIN':
            return True
        return False
```

---

### Step 3: Create RoleChangeSerializer & ProfileUpdateSerializer

Edit `backend/api/serializers.py` (add these new serializers):

```python
class RoleChangeSerializer(serializers.Serializer):
    """Serializer for changing user role (admin-only)"""
    role = serializers.ChoiceField(
        choices=UserProfile.ROLE_CHOICES,
        required=True
    )
    
    def validate_role(self, value):
        """Validate role is valid choice"""
        if value not in ['ADMIN', 'TENANT']:
            raise serializers.ValidationError("Invalid role")
        return value


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for user to update own profile"""
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True
    )
    old_password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True
    )
    phone = serializers.CharField(max_length=15, required=False)
    company_name = serializers.CharField(max_length=200, required=False)
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email',
            'old_password', 'password', 'password_confirm'
        ]
    
    def validate(self, attrs):
        """Validate password change requirements"""
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')
        old_password = attrs.get('old_password')
        
        # If password provided, old_password and confirm required
        if password:
            if not old_password:
                raise serializers.ValidationError(
                    {"old_password": "Current password required"}
                )
            if password != password_confirm:
                raise serializers.ValidationError(
                    {"password": "Passwords don't match"}
                )
            
            # Verify old password
            user = self.instance
            if not user.check_password(old_password):
                raise serializers.ValidationError(
                    {"old_password": "Current password incorrect"}
                )
        
        return attrs
    
    def update(self, instance, validated_data):
        """Update user profile and password if provided"""
        # Update basic fields
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        
        # Update password if provided
        password = validated_data.get('password')
        if password:
            instance.set_password(password)
        
        instance.save()
        
        # Update profile fields
        profile = instance.profile
        profile.phone = validated_data.get('phone', profile.phone)
        profile.company_name = validated_data.get('company_name', profile.company_name)
        profile.save()
        
        return instance
```

---

### Step 4: Create Role Change View

Edit `backend/api/views.py` (add these new endpoints):

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import RoleChangeSerializer, ProfileUpdateSerializer
from .permissions import RoleChangePermission, ProfileUpdatePermission
from api.models import UserProfile

@api_view(['PATCH'])
@permission_classes([IsAuthenticated, RoleChangePermission])
def change_user_role(request, user_id):
    """
    Change user role (admin-only)
    
    PATCH /api/users/{user_id}/role/
    Body: { "role": "ADMIN" | "TENANT" }
    """
    user = get_object_or_404(User, id=user_id)
    
    serializer = RoleChangeSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    new_role = serializer.validated_data['role']
    old_role = user.profile.role
    
    # Validate: cannot demote last admin
    if old_role == 'ADMIN' and new_role == 'TENANT':
        admin_count = UserProfile.objects.filter(role='ADMIN').count()
        if admin_count <= 1:
            return Response(
                {"error": "Cannot demote last admin"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Update role
    user.profile.role = new_role
    user.profile.save()
    
    # Determine message
    if old_role != new_role:
        message = f"User promoted to {new_role}" if new_role == 'ADMIN' else f"User demoted to {new_role}"
    else:
        message = f"User is already {new_role}"
    
    return Response({
        'user': UserSerializer(user).data,
        'message': message
    }, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """
    Update current user's profile (name, phone, company, password)
    
    PATCH /api/users/me/profile/
    Body: {
      "first_name": "...",
      "last_name": "...",
      "phone": "...",
      "company_name": "...",
      "old_password": "...",
      "password": "...",
      "password_confirm": "..."
    }
    """
    user = request.user
    
    serializer = ProfileUpdateSerializer(
        user,
        data=request.data,
        partial=True
    )
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    user = serializer.save()
    
    return Response({
        'user': UserSerializer(user).data,
        'message': 'Profile updated successfully'
    }, status=status.HTTP_200_OK)
```

---

### Step 5: Update URL Configuration

Edit `backend/api/urls.py`:

```python
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Existing endpoints...
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/me/', views.get_current_user, name='current-user'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
    # NEW: Role management
    path('users/<int:user_id>/role/', views.change_user_role, name='change-user-role'),
    
    # NEW: Profile update
    path('users/me/profile/', views.update_user_profile, name='update-profile'),
]
```

---

### Step 6: Test Backend Endpoints

Commands to test locally:

```bash
# Start Django server
cd backend
python manage.py runserver

# In another terminal, test endpoints with curl or Postman

# 1. Register new user (should get TENANT role)
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPassword123!",
    "password_confirm": "TestPassword123!",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "0123456789",
    "company_name": "Test Corp"
  }'

# Response should show role: "TENANT" (not user-selectable)

# 2. Login as admin
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin_password"}'

# Save tokens from response

# 3. Change user role (admin-only)
curl -X PATCH http://localhost:8000/api/users/2/role/ \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"role": "ADMIN"}'

# 4. Update own profile
curl -X PATCH http://localhost:8000/api/users/me/profile/ \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "phone": "9876543210",
    "old_password": "TestPassword123!",
    "password": "NewPassword456!",
    "password_confirm": "NewPassword456!"
  }'
```

---

## Success Criteria

- [ ] RegisterSerializer removes role field
- [ ] Registration always creates TENANT role (verified in test)
- [ ] RoleChangePermission validates admin-only access
- [ ] PATCH /api/users/{id}/role/ works correctly
  - [ ] Can promote TENANT → ADMIN
  - [ ] Can demote ADMIN → TENANT (if not last)
  - [ ] Cannot demote last admin (400 error)
  - [ ] Non-admin gets 403 error
- [ ] PATCH /api/users/me/profile/ works correctly
  - [ ] Can update name, phone, company_name
  - [ ] Can change password (with old password validation)
  - [ ] Cannot change without old password if new password provided
  - [ ] Password confirm validation works
- [ ] All endpoints return proper HTTP status codes
- [ ] Serializer validation comprehensive
- [ ] No breaking changes to existing endpoints

---

## Related Files

- `backend/api/serializers.py` - RegisterSerializer, RoleChangeSerializer, ProfileUpdateSerializer
- `backend/api/views.py` - change_user_role, update_user_profile views
- `backend/api/permissions.py` - RoleChangePermission, ProfileUpdatePermission
- `backend/api/urls.py` - URL routing

---

## Next Phase

Once this phase is complete and tested:
- **Proceed to:** [Phase 6.2: Backend Security & Seed](./phase-02-backend-security-and-seed.md)
- Continue with Django management commands for initial admin creation
