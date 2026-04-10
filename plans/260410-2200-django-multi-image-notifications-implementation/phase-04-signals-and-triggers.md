# Phase 4: Signals & Notification Triggers

**Status:** Pending (Blocked by Phase 1-3)
**Priority:** High
**Estimated Duration:** 1 day
**Dependencies:** Phase 1 ✓, Phase 3 ✓

---

## Context Links

- Main Plan: `../plan.md`
- Phase 1: `../phase-01-setup-and-models.md`
- Related: `backend/api/models.py`
- Related: `backend/api/signals.py` (to create)

---

## Overview

Phase 4 implements Django signals to automatically create notifications when:
1. **Tenant creates rental request** → Notify admin
2. **Admin approves request** → Notify tenant
3. **Admin rejects request** → Notify tenant
4. **Contract is created** → Notify tenant (confirmation)

This phase eliminates manual notification creation and implements business logic.

---

## Key Insights

### Current Signal Usage
- Project already uses post_save signal for UserProfile
- Signals are defined in models.py with @receiver decorator
- Django dispatch.receiver pattern is established

### Design Decisions

**Signal Architecture**
- Create separate signals.py module for clarity
- Register signals in apps.py ready() method
- Use post_save and m2m_changed signals
- Handle idempotency (don't create duplicate notifications)

**Notification Deduplication**
- Check before creating: don't duplicate same notification
- Use get_or_create to prevent duplicates
- Consider timing: avoid notifying same user multiple times

**Signal Triggers**
1. RentalRequest created → Notify admin (verb='created')
2. RentalRequest status → approved → Notify tenant (verb='approved')
3. RentalRequest status → rejected → Notify tenant (verb='rejected')
4. Contract created → Notify tenant (verb='completed')

---

## Requirements

### Functional Requirements
1. Auto-create notification when tenant submits rental request
2. Auto-create notification when admin approves/rejects request
3. Auto-create notification when contract is created
4. Prevent duplicate notifications for same event
5. Capture both rental_request_id and contract_id where applicable
6. Notification body includes contextual info

### Non-Functional Requirements
1. No database errors if notification already exists
2. Signals don't break existing functionality
3. Proper error handling and logging
4. Signals complete quickly (don't block HTTP response)
5. Idempotent: running signal multiple times is safe

---

## Architecture

### Signal Flow

```
RentalRequest.post_save
├─ IF created=True
│  └─ Create Notification(recipient=admin, actor=tenant, verb='created')
└─ IF status changed from PENDING to APPROVED
   └─ Create Notification(recipient=tenant, actor=admin, verb='approved')
   
RentalRequest.post_save (status→REJECTED)
└─ Create Notification(recipient=tenant, actor=admin, verb='rejected')

Contract.post_save (created=True)
└─ Create Notification(recipient=tenant, actor=admin, verb='completed')
```

### Notification Verb Mapping
- `created`: Tenant creates rental request
- `approved`: Admin approves rental request
- `rejected`: Admin rejects rental request
- `completed`: Contract created/confirmed

---

## Related Code Files

### Files to Create
1. `backend/api/signals.py` - Signal handlers

### Files to Modify
1. `backend/api/models.py` - Import and register signals
2. `backend/api/apps.py` - Register signals in ready()
3. `backend/api/__init__.py` - Import app config

### Files NOT to Touch
- `backend/api/views.py` (frozen)
- `backend/api/serializers.py` (frozen)

---

## Implementation Steps

### Step 1: Create signals.py Module
1. Create new file `backend/api/signals.py`
2. Add header with documentation:
   ```python
   """
   Django signals for automatic notification creation.
   
   This module handles automatic notification creation when:
   - Tenants submit rental requests
   - Admins approve/reject requests
   - Contracts are created
   """
   ```

### Step 2: Import Signal Modules
1. Add imports:
   ```python
   from django.db.models.signals import post_save, post_delete
   from django.dispatch import receiver
   from django.contrib.auth.models import User
   from django.utils import timezone
   from .models import RentalRequest, Contract, Notification
   ```

### Step 3: Implement RentalRequest Signal
1. Create post_save receiver:
   ```python
   @receiver(post_save, sender=RentalRequest)
   def notify_on_rental_request(sender, instance, created, **kwargs):
       """
       Notify admin when tenant creates rental request.
       Notify tenant when request is approved/rejected.
       """
       if created:
           # New rental request: notify admin
           from django.contrib.auth.models import User
           try:
               admin = User.objects.get(profile__role='ADMIN')
               Notification.objects.get_or_create(
                   recipient=admin,
                   actor=instance.tenant,
                   verb='created',
                   rental_request_id=instance.id,
                   defaults={
                       'contract_id': None,
                       'is_read': False,
                   }
               )
           except User.DoesNotExist:
               pass  # No admin user yet
       else:
           # Request status changed
           old_instance = RentalRequest.objects.filter(pk=instance.pk).values(
               'status'
           ).first()
           
           if old_instance and old_instance['status'] != instance.status:
               # Status changed: notify tenant
               verb = 'approved' if instance.status == 'APPROVED' else 'rejected'
               if instance.status in ['APPROVED', 'REJECTED']:
                   try:
                       admin = User.objects.get(profile__role='ADMIN')
                       Notification.objects.get_or_create(
                           recipient=instance.tenant,
                           actor=admin,
                           verb=verb,
                           rental_request_id=instance.id,
                           defaults={
                               'contract_id': None,
                               'is_read': False,
                           }
                       )
                   except User.DoesNotExist:
                       pass
   ```

### Step 4: Implement Contract Signal
1. Create post_save receiver:
   ```python
   @receiver(post_save, sender=Contract)
   def notify_on_contract_created(sender, instance, created, **kwargs):
       """
       Notify tenant when contract is created (auto-generated from approved request).
       """
       if created:
           try:
               # Get admin user for actor
               admin = User.objects.first()  # Or use request.user if available
               
               Notification.objects.get_or_create(
                   recipient=instance.tenant,
                   actor=admin,
                   verb='completed',
                   contract_id=instance.id,
                   rental_request_id=instance.rental_request_id,
                   defaults={
                       'is_read': False,
                   }
               )
           except Exception as e:
               # Log but don't fail the transaction
               import logging
               logger = logging.getLogger(__name__)
               logger.error(f"Failed to create contract notification: {str(e)}")
   ```

### Step 5: Handle Status Change Detection
1. Issue: post_save doesn't easily track old vs new values
2. Solution: Use pre_save to capture old state:
   ```python
   from django.db.models.signals import pre_save
   
   @receiver(pre_save, sender=RentalRequest)
   def track_rental_status_change(sender, instance, **kwargs):
       """Track old status for comparison in post_save"""
       try:
           old_instance = RentalRequest.objects.get(pk=instance.pk)
           instance._old_status = old_instance.status
       except RentalRequest.DoesNotExist:
           instance._old_status = None
   
   @receiver(post_save, sender=RentalRequest)
   def notify_on_rental_status_change(sender, instance, created, **kwargs):
       """Notify tenant when status changes"""
       if not created:
           old_status = getattr(instance, '_old_status', None)
           if old_status and old_status != instance.status:
               if instance.status == 'APPROVED':
                   verb = 'approved'
               elif instance.status == 'REJECTED':
                   verb = 'rejected'
               else:
                   return
               
               # Create notification
               try:
                   admin = User.objects.filter(
                       profile__role='ADMIN'
                   ).first()
                   if admin:
                       Notification.objects.create(
                           recipient=instance.tenant,
                           actor=admin,
                           verb=verb,
                           rental_request_id=instance.id,
                       )
               except Exception as e:
                   logger.error(f"Failed to create notification: {e}")
   ```

### Step 6: Register Signals in apps.py
1. Open `backend/api/apps.py`
2. Add ready() method:
   ```python
   from django.apps import AppConfig
   
   class ApiConfig(AppConfig):
       default_auto_field = 'django.db.models.BigAutoField'
       name = 'api'
       
       def ready(self):
           """Register signal handlers"""
           import api.signals  # Import signals when app is ready
   ```

### Step 7: Test Signal Creation
1. Create Django shell script:
   ```python
   from django.contrib.auth.models import User
   from api.models import RentalRequest, IndustrialZone, Notification
   
   # Create test admin
   admin, _ = User.objects.get_or_create(
       username='admin',
       defaults={'is_staff': True}
   )
   admin.profile.role = 'ADMIN'
   admin.profile.save()
   
   # Create test tenant
   tenant = User.objects.create_user('tenant', password='test')
   
   # Create zone
   zone = IndustrialZone.objects.first()
   
   # Create rental request (should trigger signal)
   request = RentalRequest.objects.create(
       tenant=tenant,
       zone=zone,
       requested_area=100,
       rental_duration=12,
   )
   
   # Check if notification was created
   notif = Notification.objects.filter(
       rental_request_id=request.id
   ).first()
   print(f"Notification created: {notif}")
   ```

### Step 8: Implement Idempotency Check
1. Add helper function:
   ```python
   def get_or_create_notification(recipient, actor, verb, **target_ids):
       """
       Create notification, avoiding duplicates.
       Returns (notification, created) tuple.
       """
       filters = {
           'recipient': recipient,
           'actor': actor,
           'verb': verb,
           'created_at__gte': timezone.now() - timezone.timedelta(minutes=5)
       }
       filters.update(target_ids)
       
       existing = Notification.objects.filter(**filters).first()
       if existing:
           return existing, False
       
       return Notification.objects.create(
           recipient=recipient,
           actor=actor,
           verb=verb,
           **target_ids
       ), True
   ```

### Step 9: Add Logging
1. Add logging configuration:
   ```python
   import logging
   
   logger = logging.getLogger(__name__)
   
   @receiver(post_save, sender=RentalRequest)
   def notify_on_rental_request(sender, instance, created, **kwargs):
       try:
           if created:
               logger.info(f"Rental request created: {instance.id}")
               # ... create notification ...
       except Exception as e:
           logger.error(f"Signal error: {e}", exc_info=True)
   ```

### Step 10: Test Edge Cases
1. Test duplicate notification prevention
2. Test with no admin user (should not error)
3. Test status changes (PENDING → APPROVED → REJECTED)
4. Test contract creation trigger
5. Test signal doesn't block request

---

## Todo List

- [ ] Create signals.py module
- [ ] Implement RentalRequest post_save signal for creation
- [ ] Implement RentalRequest pre_save for status tracking
- [ ] Implement RentalRequest post_save for status changes
- [ ] Implement Contract post_save signal
- [ ] Add get_or_create logic to prevent duplicates
- [ ] Add error handling and logging
- [ ] Register signals in apps.py ready()
- [ ] Add __init__.py import if needed
- [ ] Test signal creation with Django shell
- [ ] Test status change detection
- [ ] Test contract creation trigger
- [ ] Test edge cases (no admin, duplicates)
- [ ] Verify signals don't block requests
- [ ] Add docstrings to signal handlers

---

## Success Criteria

### Signal Functionality
- ✅ Notification created when tenant submits request
- ✅ Notification created when admin approves request
- ✅ Notification created when admin rejects request
- ✅ Notification created when contract is created
- ✅ Duplicate notifications prevented
- ✅ Signals complete without errors

### Error Handling
- ✅ Missing admin user doesn't crash
- ✅ Invalid user reference handled gracefully
- ✅ Database errors logged, not thrown
- ✅ Signals continue even if notification fails

### Performance
- ✅ Signals complete in < 100ms
- ✅ Don't block HTTP request handling
- ✅ Query optimization (use first() not get())
- ✅ No N+1 queries in signal handlers

### Testing
- ✅ Create rental request → 1 notification created
- ✅ Approve request → 1 notification created
- ✅ Reject request → 1 notification created
- ✅ Create contract → 1 notification created
- ✅ Duplicate notifications not created

---

## Risk Assessment

### Potential Issues

1. **Old Status Detection**
   - Risk: pre_save + post_save pattern is fragile
   - Mitigation: Use pre_save to cache old_status on instance

2. **Missing Admin User**
   - Risk: Signal crashes if no admin exists
   - Mitigation: Use try-except, log warning

3. **Duplicate Notifications**
   - Risk: Signal runs twice for same event
   - Mitigation: Use get_or_create with time window

4. **Transaction Rollback**
   - Risk: Notification created but request rolled back
   - Mitigation: OK in this case (keep notification), add logging

5. **Signal Import Errors**
   - Risk: Typo in apps.py ready() breaks startup
   - Mitigation: Test startserver after deployment

---

## Security Considerations

### Data Integrity
- Signals run after transaction commit (use post_save)
- Notification data is non-sensitive (just verb + IDs)
- Actor/recipient are User ForeignKeys (validated)

### Access Control
- Signals create notifications visible only to recipient
- No special permissions needed (signals use ORM)

### Error Logging
- Log all signal exceptions (don't swallow errors)
- Don't log sensitive data in error messages
- Use appropriate log levels (WARNING, ERROR)

---

## API Impact

### Changes to Existing Endpoints
- No changes to /api/rentals/ or /api/contracts/
- New notifications auto-appear in /api/notifications/
- No breaking changes to existing API

### New Behavior
- Admin sees notification when tenant requests zone
- Tenant sees notification when request is approved/rejected
- Notifications appear in real-time (not polled)

---

## Next Steps

1. ✅ Read Phase 1-4 completely
2. → Implement signals.py
3. → Register signals in apps.py
4. → Test signal creation via Django shell
5. → Move to Phase 5 (URL Routing)

---

## Notes

- Keep signals lightweight and fast
- Avoid complex business logic in signals (use services)
- Always use try-except in signals to prevent failures
- Log important events for debugging
- Consider: Future async tasks via Celery for heavy operations
- Consider: Future webhook/email notifications triggered by these signals

---

## Appendix: Complete Signal Handler Example

```python
"""
Signal handlers for automatic notification creation.
"""
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.utils import timezone
import logging

from .models import RentalRequest, Contract, Notification

logger = logging.getLogger(__name__)

# ==================== Rental Request Signals ====================

@receiver(pre_save, sender=RentalRequest)
def track_rental_status_change(sender, instance, **kwargs):
    """Cache old status for comparison in post_save"""
    try:
        if instance.pk:
            old_instance = RentalRequest.objects.get(pk=instance.pk)
            instance._old_status = old_instance.status
        else:
            instance._old_status = None
    except RentalRequest.DoesNotExist:
        instance._old_status = None


@receiver(post_save, sender=RentalRequest)
def notify_on_rental_request(sender, instance, created, **kwargs):
    """
    Create notifications when rental request is created or status changes.
    
    - New request: Notify all admins
    - Status→APPROVED: Notify tenant
    - Status→REJECTED: Notify tenant
    """
    try:
        if created:
            # New rental request: notify all admins
            admins = User.objects.filter(profile__role='ADMIN')
            for admin in admins:
                Notification.objects.create(
                    recipient=admin,
                    actor=instance.tenant,
                    verb='created',
                    rental_request_id=instance.id,
                )
            logger.info(f"Notified admins about new rental request {instance.id}")
        
        else:
            # Status changed: notify tenant
            old_status = getattr(instance, '_old_status', None)
            if old_status and old_status != instance.status:
                if instance.status == 'APPROVED':
                    verb = 'approved'
                elif instance.status == 'REJECTED':
                    verb = 'rejected'
                else:
                    return
                
                admin = User.objects.filter(
                    profile__role='ADMIN'
                ).first()
                
                if admin:
                    Notification.objects.create(
                        recipient=instance.tenant,
                        actor=admin,
                        verb=verb,
                        rental_request_id=instance.id,
                    )
                    logger.info(f"Notified tenant about request {instance.id} {verb}")
    
    except Exception as e:
        logger.error(f"Error in notify_on_rental_request: {e}", exc_info=True)


# ==================== Contract Signals ====================

@receiver(post_save, sender=Contract)
def notify_on_contract_created(sender, instance, created, **kwargs):
    """
    Notify tenant when contract is created.
    """
    if created:
        try:
            admin = User.objects.filter(profile__role='ADMIN').first()
            
            if admin:
                Notification.objects.create(
                    recipient=instance.tenant,
                    actor=admin,
                    verb='completed',
                    contract_id=instance.id,
                    rental_request_id=instance.rental_request_id,
                )
                logger.info(f"Notified tenant about contract {instance.id}")
        
        except Exception as e:
            logger.error(f"Error in notify_on_contract_created: {e}", exc_info=True)
```
