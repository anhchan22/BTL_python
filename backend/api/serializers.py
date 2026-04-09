from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile, IndustrialZone, RentalRequest, Contract


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role', 'phone', 'company_name', 'created_at']
        read_only_fields = ['created_at']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    phone = serializers.CharField(max_length=15, required=False, allow_blank=True)
    company_name = serializers.CharField(max_length=200, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm',
                  'first_name', 'last_name', 'phone', 'company_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords don't match"})
        return attrs

    def create(self, validated_data):
        # Remove fields that aren't part of User model
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

        # Update profile (auto-created by signal) - always TENANT role
        user.profile.role = 'TENANT'
        user.profile.phone = phone
        user.profile.company_name = company_name
        user.profile.save()

        return user


class IndustrialZoneSerializer(serializers.ModelSerializer):
    is_fully_rented = serializers.ReadOnlyField()

    class Meta:
        model = IndustrialZone
        fields = [
            'id', 'name', 'location', 'total_area', 'available_area',
            'price_per_sqm', 'description', 'amenities', 'is_available',
            'is_fully_rented', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        # Validate available_area <= total_area
        available = data.get('available_area')
        total = data.get('total_area')

        if available and total and available > total:
            raise serializers.ValidationError({
                'available_area': 'Available area cannot exceed total area'
            })

        return data


class RentalRequestSerializer(serializers.ModelSerializer):
    tenant_info = UserSerializer(source='tenant', read_only=True)
    zone_info = IndustrialZoneSerializer(source='zone', read_only=True)
    estimated_monthly_cost = serializers.ReadOnlyField()
    total_cost = serializers.ReadOnlyField()

    class Meta:
        model = RentalRequest
        fields = [
            'id', 'tenant', 'tenant_info', 'zone', 'zone_info',
            'requested_area', 'rental_duration', 'status', 'admin_note',
            'estimated_monthly_cost', 'total_cost',
            'requested_at', 'reviewed_at', 'reviewed_by'
        ]
        read_only_fields = ['id', 'tenant', 'status', 'admin_note', 'requested_at', 'reviewed_at', 'reviewed_by']

    def validate(self, data):
        zone = data.get('zone')
        requested_area = data.get('requested_area')

        # Check if zone has enough available area
        if zone and requested_area:
            if requested_area > zone.available_area:
                raise serializers.ValidationError({
                    'requested_area': f'Requested area exceeds available area ({zone.available_area} m²)'
                })

            if requested_area <= 0:
                raise serializers.ValidationError({
                    'requested_area': 'Requested area must be greater than 0'
                })

        # Check rental duration
        rental_duration = data.get('rental_duration')
        if rental_duration and rental_duration < 1:
            raise serializers.ValidationError({
                'rental_duration': 'Rental duration must be at least 1 month'
            })

        return data


class RentalRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating rental requests"""

    class Meta:
        model = RentalRequest
        fields = ['zone', 'requested_area', 'rental_duration']

    def validate(self, data):
        zone = data.get('zone')
        requested_area = data.get('requested_area')

        if not zone.is_available:
            raise serializers.ValidationError({'zone': 'This zone is not available for rent'})

        if requested_area > zone.available_area:
            raise serializers.ValidationError({
                'requested_area': f'Only {zone.available_area} m² available'
            })

        if requested_area <= 0:
            raise serializers.ValidationError({
                'requested_area': 'Must be greater than 0'
            })

        return data


class ContractSerializer(serializers.ModelSerializer):
    tenant_info = UserSerializer(source='tenant', read_only=True)
    zone_info = IndustrialZoneSerializer(source='zone', read_only=True)
    rental_request_id = serializers.IntegerField(source='rental_request.id', read_only=True)
    duration_months = serializers.ReadOnlyField()
    total_value = serializers.ReadOnlyField()
    is_active = serializers.ReadOnlyField()
    days_remaining = serializers.ReadOnlyField()

    class Meta:
        model = Contract
        fields = [
            'id', 'contract_number', 'rental_request_id',
            'tenant', 'tenant_info', 'zone', 'zone_info',
            'area', 'monthly_rent', 'start_date', 'end_date',
            'status', 'duration_months', 'total_value',
            'is_active', 'days_remaining', 'created_at'
        ]
        read_only_fields = ['id', 'contract_number', 'created_at']


class RoleChangeSerializer(serializers.Serializer):
    """Serializer for changing user role (admin-only)"""
    role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES, required=True)

    def validate_role(self, value):
        """Validate role is one of allowed choices"""
        valid_roles = [choice[0] for choice in UserProfile.ROLE_CHOICES]
        if value not in valid_roles:
            raise serializers.ValidationError(f"Invalid role. Must be one of: {', '.join(valid_roles)}")
        return value


class ProfileUpdateSerializer(serializers.Serializer):
    """Serializer for user profile updates"""
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=15, required=False, allow_blank=True)
    company_name = serializers.CharField(max_length=200, required=False, allow_blank=True)
    old_password = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=False)

    def validate(self, attrs):
        """Validate password change requirements"""
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')
        old_password = attrs.get('old_password')

        # If password is provided, old_password and confirm must also be provided
        if password:
            if not old_password:
                raise serializers.ValidationError({
                    'old_password': 'Current password required to change password'
                })
            if not password_confirm:
                raise serializers.ValidationError({
                    'password_confirm': 'Password confirmation required'
                })
            if password != password_confirm:
                raise serializers.ValidationError({
                    'password': "Passwords don't match"
                })

        return attrs

