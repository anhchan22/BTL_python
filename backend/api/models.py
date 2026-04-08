from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from datetime import date
from dateutil.relativedelta import relativedelta


class UserProfile(models.Model):
    """Extended user profile with role and additional info"""

    ROLE_CHOICES = [
        ('ADMIN', 'Administrator'),
        ('TENANT', 'Tenant'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='TENANT')
    phone = models.CharField(max_length=15, blank=True)
    company_name = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"

    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'


# Auto-create profile when user is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class IndustrialZone(models.Model):
    """Industrial zone available for rental"""

    name = models.CharField(max_length=200)
    location = models.CharField(max_length=500)
    total_area = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total area in m²")
    available_area = models.DecimalField(max_digits=10, decimal_places=2, help_text="Available area in m²")
    price_per_sqm = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price per m² per month (VND)")
    description = models.TextField()
    amenities = models.TextField(blank=True, help_text="Comma-separated amenities")
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.location}"

    @property
    def is_fully_rented(self):
        return self.available_area <= 0

    def clean(self):
        """Validate model fields"""
        if self.available_area > self.total_area:
            raise ValidationError('Available area cannot exceed total area')
        if self.price_per_sqm < 0:
            raise ValidationError('Price cannot be negative')

    class Meta:
        db_table = 'industrial_zones'
        verbose_name = 'Industrial Zone'
        verbose_name_plural = 'Industrial Zones'
        ordering = ['-created_at']


class RentalRequest(models.Model):
    """Rental request submitted by tenant"""

    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled'),
    ]

    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rental_requests')
    zone = models.ForeignKey(IndustrialZone, on_delete=models.CASCADE, related_name='rental_requests')
    requested_area = models.DecimalField(max_digits=10, decimal_places=2, help_text="Requested area in m²")
    rental_duration = models.IntegerField(help_text="Rental duration in months")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    admin_note = models.TextField(blank=True, help_text="Admin's review note")
    requested_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_requests')

    def __str__(self):
        return f"{self.tenant.username} - {self.zone.name} ({self.status})"

    @property
    def estimated_monthly_cost(self):
        return self.requested_area * self.zone.price_per_sqm

    @property
    def total_cost(self):
        return self.estimated_monthly_cost * self.rental_duration

    def clean(self):
        """Validate model fields"""
        if self.requested_area > self.zone.available_area:
            raise ValidationError('Requested area exceeds available area')
        if self.rental_duration < 1:
            raise ValidationError('Duration must be at least 1 month')

    class Meta:
        db_table = 'rental_requests'
        verbose_name = 'Rental Request'
        verbose_name_plural = 'Rental Requests'
        ordering = ['-requested_at']


class Contract(models.Model):
    """Rental contract auto-generated from approved request"""

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('EXPIRED', 'Expired'),
        ('TERMINATED', 'Terminated'),
    ]

    rental_request = models.OneToOneField(RentalRequest, on_delete=models.CASCADE, related_name='contract')
    contract_number = models.CharField(max_length=50, unique=True)
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contracts')
    zone = models.ForeignKey(IndustrialZone, on_delete=models.CASCADE, related_name='contracts')
    area = models.DecimalField(max_digits=10, decimal_places=2, help_text="Contracted area in m²")
    monthly_rent = models.DecimalField(max_digits=15, decimal_places=2, help_text="Monthly rent in VND")
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.contract_number} - {self.tenant.username}"

    @property
    def duration_months(self):
        return self.rental_request.rental_duration

    @property
    def total_value(self):
        return self.monthly_rent * self.duration_months

    @property
    def is_active(self):
        return self.status == 'ACTIVE' and self.start_date <= date.today() <= self.end_date

    @property
    def days_remaining(self):
        if self.status == 'ACTIVE':
            delta = self.end_date - date.today()
            return max(0, delta.days)
        return 0

    @classmethod
    def generate_contract_number(cls):
        """Generate unique contract number"""
        import random
        import string
        from datetime import datetime

        year = datetime.now().year
        random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return f"CNT-{year}-{random_str}"

    class Meta:
        db_table = 'contracts'
        verbose_name = 'Contract'
        verbose_name_plural = 'Contracts'
        ordering = ['-created_at']

