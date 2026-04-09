from rest_framework import status, viewsets, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from django.utils import timezone
from django.shortcuts import get_object_or_404
from datetime import date
from dateutil.relativedelta import relativedelta
from .serializers import (RegisterSerializer, UserSerializer, IndustrialZoneSerializer,
                          RentalRequestSerializer, RentalRequestCreateSerializer, ContractSerializer,
                          RoleChangeSerializer, ProfileUpdateSerializer, ZoneImageSerializer,
                          NotificationSerializer, NotificationUnreadCountSerializer,
                          MarkNotificationsAsReadSerializer)
from .models import IndustrialZone, RentalRequest, Contract, UserProfile, ZoneImage, Notification
from .permissions import IsAdmin, RoleChangePermission


@api_view(['GET'])
@permission_classes([AllowAny])  # No auth required for test
def hello_world(request):
    return Response({
        'message': 'Hello World from Django REST Framework!',
        'status': 'success'
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register new user with role"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login user and return JWT tokens"""
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({
            'error': 'Username and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)

    return Response({
        'message': 'Login successful',
        'user': UserSerializer(user).data,
        'tokens': {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout user (client should delete tokens)"""
    return Response({
        'message': 'Logout successful'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Get current authenticated user info"""
    return Response({
        'user': UserSerializer(request.user).data
    }, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([RoleChangePermission])
def change_user_role(request, user_id):
    """Change user role (admin-only endpoint)"""
    try:
        target_user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)

    serializer = RoleChangeSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    new_role = serializer.validated_data['role']
    old_role = target_user.profile.role

    # Prevent demoting last admin
    if old_role == 'ADMIN' and new_role == 'TENANT':
        admin_count = UserProfile.objects.filter(role='ADMIN').count()
        if admin_count <= 1:
            return Response({
                'error': 'Cannot demote the last administrator'
            }, status=status.HTTP_400_BAD_REQUEST)

    # Update role
    target_user.profile.role = new_role
    target_user.profile.save()

    action = 'promoted to' if new_role == 'ADMIN' else 'demoted to'
    message = f"User {target_user.username} {action} {new_role}"

    return Response({
        'message': message,
        'user': UserSerializer(target_user).data
    }, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """Update user's own profile (authenticated users)"""
    serializer = ProfileUpdateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = request.user
    validated_data = serializer.validated_data

    # Update basic user fields
    if 'first_name' in validated_data:
        user.first_name = validated_data['first_name']
    if 'last_name' in validated_data:
        user.last_name = validated_data['last_name']

    # Update password if provided
    if 'password' in validated_data:
        old_password = validated_data.get('old_password', '')

        # Verify old password
        if not user.check_password(old_password):
            return Response({
                'error': 'Current password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Set new password
        user.set_password(validated_data['password'])

    user.save()

    # Update profile fields
    if 'phone' in validated_data:
        user.profile.phone = validated_data['phone']
    if 'company_name' in validated_data:
        user.profile.company_name = validated_data['company_name']

    user.profile.save()

    return Response({
        'message': 'Profile updated successfully',
        'user': UserSerializer(user).data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdmin])
def get_all_users(request):
    """Get all users list (admin-only endpoint)"""
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response({
        'users': serializer.data
    }, status=status.HTTP_200_OK)



class IndustrialZoneViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Industrial Zones
    - List/Detail: Any authenticated user (includes images)
    - Create/Update/Delete: Admin only
    """
    queryset = IndustrialZone.objects.all().prefetch_related('images')
    serializer_class = IndustrialZoneSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'location', 'description', 'amenities']
    ordering_fields = ['name', 'price_per_sqm', 'available_area', 'created_at']
    ordering = ['-created_at']

    def get_permissions(self):
        """Admin required for create/update/delete"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return super().get_permissions()

    def get_queryset(self):
        """Filter zones based on query params"""
        queryset = super().get_queryset()

        # Filter by availability
        available_only = self.request.query_params.get('available', None)
        if available_only == 'true':
            queryset = queryset.filter(is_available=True, available_area__gt=0)

        # Filter by min/max price
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)

        if min_price:
            queryset = queryset.filter(price_per_sqm__gte=min_price)
        if max_price:
            queryset = queryset.filter(price_per_sqm__lte=max_price)

        # Filter by min area
        min_area = self.request.query_params.get('min_area', None)
        if min_area:
            queryset = queryset.filter(available_area__gte=min_area)

        return queryset

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get only available zones"""
        zones = self.get_queryset().filter(is_available=True, available_area__gt=0)
        serializer = self.get_serializer(zones, many=True)
        return Response(serializer.data)


class RentalRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Rental Requests
    - Tenants: Create and view own requests
    - Admins: View all, approve/reject
    """
    serializer_class = RentalRequestSerializer

    def get_queryset(self):
        """Filter based on user role"""
        user = self.request.user

        if user.profile.role == 'ADMIN':
            # Admins see all requests
            return RentalRequest.objects.all()
        else:
            # Tenants see only their own requests
            return RentalRequest.objects.filter(tenant=user)

    def get_serializer_class(self):
        """Use different serializer for create"""
        if self.action == 'create':
            return RentalRequestCreateSerializer
        return RentalRequestSerializer

    def perform_create(self, serializer):
        """Set tenant to current user"""
        serializer.save(tenant=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def approve(self, request, pk=None):
        """Approve rental request (admin only)"""
        rental_request = self.get_object()

        if rental_request.status != 'PENDING':
            return Response({
                'error': 'Only pending requests can be approved'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if zone still has enough area
        if rental_request.requested_area > rental_request.zone.available_area:
            return Response({
                'error': 'Zone no longer has enough available area'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Update request status
        rental_request.status = 'APPROVED'
        rental_request.reviewed_by = request.user
        rental_request.reviewed_at = timezone.now()
        rental_request.admin_note = request.data.get('admin_note', '')
        rental_request.save()

        # Update zone available area
        zone = rental_request.zone
        zone.available_area -= rental_request.requested_area
        zone.save()

        # Create contract
        contract_number = Contract.generate_contract_number()
        start_date = date.today()
        end_date = start_date + relativedelta(months=rental_request.rental_duration)

        contract = Contract.objects.create(
            rental_request=rental_request,
            contract_number=contract_number,
            tenant=rental_request.tenant,
            zone=rental_request.zone,
            area=rental_request.requested_area,
            monthly_rent=rental_request.estimated_monthly_cost,
            start_date=start_date,
            end_date=end_date,
            status='ACTIVE'
        )

        return Response({
            'message': 'Request approved successfully',
            'request': RentalRequestSerializer(rental_request).data,
            'contract': ContractSerializer(contract).data
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def reject(self, request, pk=None):
        """Reject rental request (admin only)"""
        rental_request = self.get_object()

        if rental_request.status != 'PENDING':
            return Response({
                'error': 'Only pending requests can be rejected'
            }, status=status.HTTP_400_BAD_REQUEST)

        rental_request.status = 'REJECTED'
        rental_request.reviewed_by = request.user
        rental_request.reviewed_at = timezone.now()
        rental_request.admin_note = request.data.get('admin_note', 'Request rejected')
        rental_request.save()

        return Response({
            'message': 'Request rejected',
            'request': RentalRequestSerializer(rental_request).data
        })

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel own request (tenant only, if pending)"""
        rental_request = self.get_object()

        # Check ownership
        if rental_request.tenant != request.user:
            return Response({
                'error': 'You can only cancel your own requests'
            }, status=status.HTTP_403_FORBIDDEN)

        if rental_request.status != 'PENDING':
            return Response({
                'error': 'Only pending requests can be cancelled'
            }, status=status.HTTP_400_BAD_REQUEST)

        rental_request.status = 'CANCELLED'
        rental_request.save()

        return Response({
            'message': 'Request cancelled',
            'request': RentalRequestSerializer(rental_request).data
        })


class ContractViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Contracts (Read-only)
    - Tenants: View own contracts
    - Admins: View all contracts
    """
    serializer_class = ContractSerializer

    def get_queryset(self):
        """Filter based on user role"""
        user = self.request.user

        if user.profile.role == 'ADMIN':
            # Admins see all contracts
            return Contract.objects.all()
        else:
            # Tenants see only their own contracts
            return Contract.objects.filter(tenant=user)

    @action(detail=False, methods=['get'])
    def my_active(self, request):
        """Get current user's active contracts"""
        contracts = self.get_queryset().filter(status='ACTIVE')
        serializer = self.get_serializer(contracts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active contracts (admin only)"""
        if request.user.profile.role != 'ADMIN':
            return Response({
                'error': 'Admin access required'
            }, status=status.HTTP_403_FORBIDDEN)

        contracts = Contract.objects.filter(status='ACTIVE')
        serializer = self.get_serializer(contracts, many=True)
        return Response(serializer.data)


# ===== ZONE IMAGE VIEWSET =====

class ZoneImageViewSet(viewsets.ModelViewSet):
    """
    API endpoints for managing zone images.
    - GET /api/zones/{zone_id}/images/ - List images
    - POST /api/zones/{zone_id}/images/ - Add image (admin)
    - DELETE /api/zones/{zone_id}/images/{image_id}/ - Delete image (admin)
    """
    serializer_class = ZoneImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter images for specific zone"""
        zone_id = self.kwargs.get('zone_id')
        return ZoneImage.objects.filter(zone_id=zone_id)

    def get_serializer_context(self):
        """Add zone to serializer context"""
        context = super().get_serializer_context()
        zone_id = self.kwargs.get('zone_id')
        if zone_id:
            context['zone'] = get_object_or_404(IndustrialZone, id=zone_id)
        return context

    def create(self, request, zone_id=None):
        """Add a new image to a zone (admin only)"""
        zone = get_object_or_404(IndustrialZone, id=zone_id)

        # Check permissions (admin only)
        if request.user.profile.role != 'ADMIN':
            return Response(
                {'detail': 'Admin access required to add images.'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(zone=zone)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, zone_id=None, pk=None):
        """Delete an image from a zone (admin only)"""
        image = get_object_or_404(ZoneImage, id=pk, zone_id=zone_id)

        # Check permissions (admin only)
        if request.user.profile.role != 'ADMIN':
            return Response(
                {'detail': 'Admin access required to delete images.'},
                status=status.HTTP_403_FORBIDDEN
            )

        image.delete()
        return Response(
            {'detail': 'Image deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


# ===== NOTIFICATION VIEWSET =====

class NotificationViewSet(viewsets.ModelViewSet):
    """
    API endpoints for notifications.
    - GET /api/notifications/ - List user's notifications
    - GET /api/notifications/unread-count/ - Get unread count
    - POST /api/notifications/mark-as-read/ - Mark notifications as read
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering = ['-created_at']

    def get_queryset(self):
        """Only return notifications for the logged-in user"""
        return Notification.objects.filter(recipient=self.request.user)

    @action(detail=False, methods=['get'], url_path='unread-count')
    def unread_count(self, request):
        """
        GET /api/notifications/unread-count/
        Returns unread notification count for the logged-in user.

        Response:
        {
            "unread_count": 3,
            "total_count": 10
        }
        """
        unread = Notification.objects.filter(
            recipient=request.user,
            is_read=False
        ).count()

        total = Notification.objects.filter(recipient=request.user).count()

        serializer = NotificationUnreadCountSerializer({
            'unread_count': unread,
            'total_count': total
        })
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='mark-as-read')
    def mark_as_read(self, request):
        """
        POST /api/notifications/mark-as-read/

        Request body options:
        {
            "notification_ids": [1, 2, 3],  // Mark specific notifications
            "mark_all": false
        }
        OR
        {
            "mark_all": true                // Mark ALL as read
        }

        Response:
        {
            "detail": "3 notifications marked as read",
            "marked_count": 3
        }
        """
        serializer = MarkNotificationsAsReadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        notification_ids = serializer.validated_data.get('notification_ids', [])
        mark_all = serializer.validated_data.get('mark_all', False)

        user_notifications = Notification.objects.filter(recipient=request.user)

        if mark_all:
            # Mark all notifications as read
            count = user_notifications.filter(is_read=False).update(is_read=True)
            return Response({
                'detail': f'{count} notifications marked as read',
                'marked_count': count
            })

        elif notification_ids:
            # Mark specific notifications as read
            count = user_notifications.filter(
                id__in=notification_ids,
                is_read=False
            ).update(is_read=True)
            return Response({
                'detail': f'{count} notifications marked as read',
                'marked_count': count
            })

        else:
            return Response(
                {'detail': 'Provide either notification_ids or mark_all=true'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'], url_path='mark_single')
    def mark_single(self, request, pk=None):
        """Mark a single notification as read"""
        notification = get_object_or_404(
            Notification,
            id=pk,
            recipient=request.user
        )
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data)

