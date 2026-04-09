"""
Django management command to create initial admin user.
Reads credentials from environment variables for CI/CD automation.

Usage:
    python manage.py create_initial_admin
"""
import os
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile


class Command(BaseCommand):
    help = 'Create initial admin user from environment variables'

    def handle(self, *args, **kwargs):
        # Check if admin already exists
        admin_exists = UserProfile.objects.filter(role='ADMIN').exists()
        if admin_exists:
            self.stdout.write(self.style.WARNING(
                '[SKIP] Admin user already exists, skipping creation'
            ))
            return

        # Read from environment variables
        admin_user = os.getenv('INITIAL_ADMIN_USER')
        admin_email = os.getenv('INITIAL_ADMIN_EMAIL')
        admin_password = os.getenv('INITIAL_ADMIN_PASSWORD')

        # Validate required env vars
        if not all([admin_user, admin_email, admin_password]):
            self.stdout.write(self.style.ERROR(
                '[ERROR] Missing required environment variables:\n'
                '   - INITIAL_ADMIN_USER\n'
                '   - INITIAL_ADMIN_EMAIL\n'
                '   - INITIAL_ADMIN_PASSWORD\n'
                '\n'
                'Please set these in .env file or environment before running this command.'
            ))
            return

        try:
            # Create superuser
            user = User.objects.create_superuser(
                username=admin_user,
                email=admin_email,
                password=admin_password
            )

            # Update profile to ADMIN role
            user.profile.role = 'ADMIN'
            user.profile.save()

            self.stdout.write(self.style.SUCCESS(
                f'[OK] Admin user created successfully!\n'
                f'   Username: {admin_user}\n'
                f'   Email: {admin_email}\n'
                f'   Role: ADMIN'
            ))

        except Exception as e:
            self.stdout.write(self.style.ERROR(
                f'[ERROR] Failed to create admin user: {str(e)}'
            ))
