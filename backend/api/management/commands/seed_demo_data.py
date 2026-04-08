from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile, IndustrialZone


class Command(BaseCommand):
    help = 'Seed database with demo data for presentation'

    def handle(self, *args, **kwargs):
        # Create admin user
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            admin.profile.role = 'ADMIN'
            admin.profile.save()
            self.stdout.write(self.style.SUCCESS('Created admin user'))
        else:
            self.stdout.write('Admin user already exists')

        # Create tenant users
        for i in range(1, 4):
            tenant, created = User.objects.get_or_create(
                username=f'tenant{i}',
                defaults={
                    'email': f'tenant{i}@example.com',
                    'first_name': f'Tenant',
                    'last_name': f'{i}'
                }
            )
            if created:
                tenant.set_password('tenant123')
                tenant.save()
                tenant.profile.role = 'TENANT'
                tenant.profile.company_name = f'Company {i}'
                tenant.profile.phone = f'0900000{i}00'
                tenant.profile.save()
                self.stdout.write(self.style.SUCCESS(f'Created tenant{i}'))
            else:
                self.stdout.write(f'tenant{i} already exists')

        # Create zones (safe for Windows console - no Vietnamese chars in output)
        zones_data = [
            {
                'name': 'Industrial Zone A',
                'location': 'District 1, HCMC',
                'total_area': 50000.00,
                'available_area': 35000.00,
                'price_per_sqm': 150000,
                'description': 'Modern industrial zone with complete facilities',
                'amenities': '3-phase power, Industrial water, 20m road, 24/7 security',
            },
            {
                'name': 'Industrial Zone B',
                'location': 'Binh Duong Province',
                'total_area': 100000.00,
                'available_area': 80000.00,
                'price_per_sqm': 120000,
                'description': 'Large-scale industrial zone near seaport',
                'amenities': 'Power, Water, 30m road, Wastewater treatment',
            },
        ]

        for zone_data in zones_data:
            zone, created = IndustrialZone.objects.get_or_create(
                name=zone_data['name'],
                defaults=zone_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created zone: {zone_data["name"]}'))
            else:
                self.stdout.write(f'Zone {zone_data["name"]} already exists')

        self.stdout.write(self.style.SUCCESS('\nDemo data seeded successfully!'))
        self.stdout.write('Admin: admin / admin123')
        self.stdout.write('Tenants: tenant1, tenant2, tenant3 / tenant123')
