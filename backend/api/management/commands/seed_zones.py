from django.core.management.base import BaseCommand
from api.models import IndustrialZone


class Command(BaseCommand):
    help = 'Seed database with sample industrial zones'

    def handle(self, *args, **kwargs):
        zones = [
            {
                'name': 'Khu Cong Nghiep Tan Binh',
                'location': 'Quan Tan Binh, TP.HCM',
                'total_area': 50000.00,
                'available_area': 35000.00,
                'price_per_sqm': 150000,
                'description': 'Khu cong nghiep hien dai voi day du tien ich',
                'amenities': 'Dien 3 pha, Nuoc cong nghiep, Duong rong 20m, An ninh 24/7',
                'is_available': True
            },
            {
                'name': 'Khu Cong Nghiep Binh Duong',
                'location': 'Thu Dau Mot, Binh Duong',
                'total_area': 100000.00,
                'available_area': 80000.00,
                'price_per_sqm': 120000,
                'description': 'Khu cong nghiep quy mo lon, gan cang bien',
                'amenities': 'Dien, Nuoc, Duong 30m, He thong xu ly nuoc thai',
                'is_available': True
            },
            {
                'name': 'Khu Cong Nghiep Dong Nai',
                'location': 'Bien Hoa, Dong Nai',
                'total_area': 75000.00,
                'available_area': 60000.00,
                'price_per_sqm': 100000,
                'description': 'Vi tri dac dia, gan san bay Tan Son Nhat',
                'amenities': 'Ha tang hoan chinh, Gan cao toc, Bao ve chuyen nghiep',
                'is_available': True
            },
        ]

        count = 0
        for zone_data in zones:
            zone, created = IndustrialZone.objects.get_or_create(
                name=zone_data['name'],
                defaults=zone_data
            )
            if created:
                count += 1

        self.stdout.write('Created {} zones'.format(count))
