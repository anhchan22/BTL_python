from rest_framework import status, viewsets, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q
from django.utils import timezone
from datetime import date
from dateutil.relativedelta import relativedelta
from .serializers import (RegisterSerializer, UserSerializer, IndustrialZoneSerializer,
                          RentalRequestSerializer, RentalRequestCreateSerializer, ContractSerializer)
from .models import IndustrialZone, RentalRequest, Contract
from .permissions import IsAdmin


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


class IndustrialZoneViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Industrial Zones
    - List/Detail: Any authenticated user
    - Create/Update/Delete: Admin only
    """
    queryset = IndustrialZone.objects.all()
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

