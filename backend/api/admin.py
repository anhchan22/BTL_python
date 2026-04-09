from django.contrib import admin
from .models import UserProfile, IndustrialZone, RentalRequest, Contract, ZoneImage, Notification


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'phone', 'company_name', 'created_at']
    list_filter = ['role', 'created_at']
    search_fields = ['user__username', 'user__email', 'phone', 'company_name']
    readonly_fields = ['created_at']


@admin.register(IndustrialZone)
class IndustrialZoneAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'total_area', 'available_area',
                    'price_per_sqm', 'is_available', 'created_at']
    list_filter = ['is_available', 'created_at']
    search_fields = ['name', 'location', 'description']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'location', 'description')
        }),
        ('Area & Pricing', {
            'fields': ('total_area', 'available_area', 'price_per_sqm')
        }),
        ('Additional Info', {
            'fields': ('amenities', 'is_available')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(RentalRequest)
class RentalRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'tenant', 'zone', 'requested_area', 'rental_duration',
                    'status', 'requested_at', 'reviewed_by']
    list_filter = ['status', 'requested_at', 'reviewed_at']
    search_fields = ['tenant__username', 'zone__name']
    readonly_fields = ['requested_at', 'reviewed_at']


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ['contract_number', 'tenant', 'zone', 'area', 'monthly_rent',
                    'start_date', 'end_date', 'status', 'created_at']
    list_filter = ['status', 'start_date', 'end_date', 'created_at']
    search_fields = ['contract_number', 'tenant__username', 'zone__name']
    readonly_fields = ['contract_number', 'created_at']


@admin.register(ZoneImage)
class ZoneImageAdmin(admin.ModelAdmin):
    list_display = ['zone', 'display_order', 'image', 'alt_text', 'created_at']
    list_filter = ['zone', 'created_at']
    search_fields = ['zone__name', 'alt_text']
    readonly_fields = ['created_at']
    ordering = ['zone', 'display_order']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['recipient', 'actor', 'verb', 'target_id', 'content_type', 'is_read', 'created_at']
    list_filter = ['verb', 'content_type', 'is_read', 'created_at']
    search_fields = ['recipient__username', 'actor__username']
    readonly_fields = ['created_at']
    ordering = ['-created_at']

    fieldsets = (
        ('Notification Info', {
            'fields': ('recipient', 'actor', 'verb', 'summary')
        }),
        ('Target Information', {
            'fields': ('target_id', 'content_type')
        }),
        ('Status', {
            'fields': ('is_read',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
