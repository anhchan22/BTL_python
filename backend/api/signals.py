"""
Signal handlers for automatic notification creation.
Triggers notifications when:
1. Tenant creates a rental request → Admin notified
2. Admin approves a request → Tenant notified
3. Admin rejects a request → Tenant notified
4. Admin creates a contract → Tenant notified
"""

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import RentalRequest, Contract, Notification, UserProfile


@receiver(post_save, sender=RentalRequest)
def notify_admin_on_request_created(sender, instance, created, **kwargs):
    """
    When a Tenant creates a Rental Request,
    notify all Admins.
    """
    if created:
        # Get all admin users
        admins = User.objects.filter(profile__role='ADMIN')

        for admin in admins:
            Notification.objects.create(
                recipient=admin,
                actor=instance.tenant,
                verb='request_created',
                target_id=instance.id,
                content_type='rental_request',
                is_read=False
            )


@receiver(pre_save, sender=RentalRequest)
def notify_tenant_on_request_decision(sender, instance, **kwargs):
    """
    When Admin Approves/Rejects a Rental Request,
    notify the Tenant.
    Triggered BEFORE save to detect status change.
    """
    try:
        # Get the previous instance from database
        previous_instance = RentalRequest.objects.get(pk=instance.pk)
        previous_status = previous_instance.status
    except RentalRequest.DoesNotExist:
        # Instance is new, no notification needed
        return

    current_status = instance.status

    # Only notify if status changed AND reviewed_by is set (admin action)
    if previous_status != current_status and instance.reviewed_by:
        tenant = instance.tenant

        if current_status == 'APPROVED':
            verb = 'request_approved'
        elif current_status == 'REJECTED':
            verb = 'request_rejected'
        else:
            # No notification for other status changes
            return

        # Check if notification already exists (prevent duplicates)
        existing = Notification.objects.filter(
            recipient=tenant,
            verb=verb,
            target_id=instance.id,
            content_type='rental_request'
        ).exists()

        if not existing:
            Notification.objects.create(
                recipient=tenant,
                actor=instance.reviewed_by,
                verb=verb,
                target_id=instance.id,
                content_type='rental_request',
                is_read=False
            )


@receiver(post_save, sender=Contract)
def notify_tenant_on_contract_created(sender, instance, created, **kwargs):
    """
    When Admin creates a Contract,
    notify the Tenant.
    """
    if created:
        Notification.objects.create(
            recipient=instance.tenant,
            actor=instance.rental_request.reviewed_by,  # Admin who approved request
            verb='contract_created',
            target_id=instance.id,
            content_type='contract',
            is_read=False
        )
