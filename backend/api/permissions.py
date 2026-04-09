from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Allow access only to admin users"""

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            hasattr(request.user, 'profile') and
            request.user.profile.role == 'ADMIN'
        )


class IsTenant(permissions.BasePermission):
    """Allow access only to tenant users"""

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            hasattr(request.user, 'profile') and
            request.user.profile.role == 'TENANT'
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """Allow access to object owner or admin"""

    def has_object_permission(self, request, view, obj):
        # Admins can access everything
        if request.user.profile.role == 'ADMIN':
            return True

        # Users can access their own objects
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'tenant'):
            return obj.tenant == request.user

        return False


class RoleChangePermission(permissions.BasePermission):
    """Allow only admins to change user roles"""

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            hasattr(request.user, 'profile') and
            request.user.profile.role == 'ADMIN'
        )
